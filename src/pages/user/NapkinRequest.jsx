import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { machines as napkinMachines } from '../../data/machines'
import { Country, State, City } from 'country-state-city'
import {
  QrCode, MapPin, Navigation, RefreshCw, Loader2,
  CheckCircle2, Info, ExternalLink, ChevronDown
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './NapkinRequest.css'

// ── Haversine distance (km) ───────────────────────────────────────────────────
function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Build a readable name from OSM tags ───────────────────────────────────────
function buildNameFromTags(tags = {}) {
  if (!tags) return null

  // 1. Official name
  if (tags.name && tags.name.trim()) return tags.name.trim()

  // 2. Operator (e.g. "BBMP Restroom", "Railway Station Restroom")
  if (tags.operator && tags.operator.toLowerCase() !== 'public') {
    return `${tags.operator} – Restroom`
  }

  // 3. Street address
  const hno    = tags['addr:housenumber'] || ''
  const street = tags['addr:street'] || tags['addr:road'] || ''
  if (street) return `Public Restroom${hno ? `, ${hno}` : ''}, ${street}`

  // 4. Description
  if (tags.description) return tags.description.slice(0, 60)

  // 5. Neighbourhood / suburb
  const area =
    tags['addr:suburb'] ||
    tags['addr:neighbourhood'] ||
    tags['addr:quarter'] ||
    tags['addr:city_district'] ||
    tags['is_in:suburb'] ||
    null
  if (area) return `Public Restroom, ${area}`

  return null // will be reverse-geocoded
}

// ── Nominatim reverse-geocode for a single (lat, lng) ────────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    if (!res.ok) return null
    const data = await res.json()
    const addr = data.address || {}

    // nearby landmark / amenity
    const landmark = addr.amenity || addr.building || addr.leisure || addr.shop || addr.tourism
    const road     = addr.road || addr.pedestrian || addr.footway || addr.path
    const area     = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.city

    if (landmark && road)  return `${landmark}, ${road}`
    if (landmark && area)  return `${landmark}, ${area}`
    if (road && area)      return `Restroom on ${road}, ${area}`
    if (road)              return `Restroom on ${road}`
    if (area)              return `Public Restroom, ${area}`

    // last fallback: first 2 parts of display_name
    return data.display_name?.split(',').slice(0, 2).join(',').trim() || null
  } catch {
    return null
  }
}

// ── Open Google Maps directions in a new tab ──────────────────────────────────
function openDirections(userLoc, destLat, destLng) {
  const dest = `${destLat},${destLng}`
  let url
  if (userLoc) {
    const origin = `${userLoc[0]},${userLoc[1]}`
    url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${dest}`
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

// ── Custom map marker icons ───────────────────────────────────────────────────
const makePinIcon = (bg, emoji) =>
  L.divIcon({
    html: `<div class="hc-pin" style="--bg:${bg}">${emoji}</div>`,
    className: '',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -48],
  })

const BLUE_ICON = makePinIcon('#1565c0', '🚻')
const RED_ICON  = makePinIcon('#c62828', '📦')
const USER_ICON = L.divIcon({
  html: `<div class="hc-user-dot"><div class="hc-user-pulse"></div></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
})

// ── Fly map to new center ─────────────────────────────────────────────────────
function FlyTo({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? 14, { animate: true, duration: 1.2 })
  }, [center, zoom, map])
  return null
}

const DEFAULT_CENTER = [12.9716, 77.5946] // Bengaluru

// ── Main Component ────────────────────────────────────────────────────────────
export default function NapkinRequest() {
  // Location
  const [userLoc, setUserLoc]       = useState(null)
  const [mapCenter, setMapCenter]   = useState(DEFAULT_CENTER)
  const [locStatus, setLocStatus]   = useState('idle')
  const [locMode, setLocMode]       = useState('gps') // 'gps' | 'manual'

  // Manual dropdowns
  const [countryIso, setCountryIso] = useState('IN')
  const [stateIso, setStateIso]     = useState('KA')
  const [cityName, setCityName]     = useState('Bengaluru')

  // Map data
  const [isLoadingMap, setIsLoadingMap]     = useState(false)
  const [isGeocodingNames, setIsGeocodingNames] = useState(false)
  const [blueSpots, setBlueSpots]           = useState([])
  const [redSpots, setRedSpots]             = useState([])
  const [geocodedNames, setGeocodedNames]   = useState({}) // id → name

  // UI state
  const [selected, setSelected]     = useState(null)
  const [dispensing, setDispensing] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [activeTab, setActiveTab]   = useState('machines')

  const geocodeAbortRef = useRef(false)

  // Load machines dynamically from localStorage
  const [machinesList, setMachinesList] = useState(() => {
    const saved = localStorage.getItem('hercare_machines')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return napkinMachines
  })

  // ── Country/State/City options ─────────────────────────────────────────────
  const allCountries    = useMemo(() => Country.getAllCountries(), [])
  const allStates       = useMemo(() => State.getStatesOfCountry(countryIso), [countryIso])
  const allCities       = useMemo(() => City.getCitiesOfState(countryIso, stateIso), [countryIso, stateIso])

  // ── GPS detection ──────────────────────────────────────────────────────────
  const detectLocation = useCallback(() => {
    setLocStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setUserLoc(loc)
        setMapCenter(loc)
        setLocStatus('ok')
        setLocMode('gps')
      },
      () => {
        setLocStatus('denied')
        setMapCenter(DEFAULT_CENTER)
      },
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }, [])

  useEffect(() => { detectLocation() }, [detectLocation])

  // ── Manual city selection → update map center ──────────────────────────────
  const handleCountryChange = (e) => {
    const iso = e.target.value
    setCountryIso(iso)
    const states = State.getStatesOfCountry(iso)
    if (states.length > 0) {
      const firstState = states[0].isoCode
      setStateIso(firstState)
      const cities = City.getCitiesOfState(iso, firstState)
      if (cities.length > 0) {
        setCityName(cities[0].name)
        const c = cities[0]
        if (c.latitude && c.longitude)
          setMapCenter([parseFloat(c.latitude), parseFloat(c.longitude)])
      }
    }
    setSelected(null)
  }

  const handleStateChange = (e) => {
    const iso = e.target.value
    setStateIso(iso)
    const cities = City.getCitiesOfState(countryIso, iso)
    if (cities.length > 0) {
      setCityName(cities[0].name)
      const c = cities[0]
      if (c.latitude && c.longitude)
        setMapCenter([parseFloat(c.latitude), parseFloat(c.longitude)])
    }
    setSelected(null)
  }

  const handleCityChange = (e) => {
    const name = e.target.value
    setCityName(name)
    const c = allCities.find((x) => x.name === name)
    if (c?.latitude && c?.longitude)
      setMapCenter([parseFloat(c.latitude), parseFloat(c.longitude)])
    setSelected(null)
  }

  // ── Fetch real Overpass data when mapCenter changes ────────────────────────
  useEffect(() => {
    const [lat, lng] = mapCenter
    if (!lat || !lng) return

    geocodeAbortRef.current = true // cancel any ongoing geocoding

    const fetchMapData = async () => {
      setIsLoadingMap(true)
      setBlueSpots([])
      setRedSpots([])
      setGeocodedNames({})
      setSelected(null)

      try {
        const RADIUS = 5000
        const query = `
          [out:json][timeout:30];
          (
            node["amenity"="toilets"](around:${RADIUS},${lat},${lng});
            way["amenity"="toilets"](around:${RADIUS},${lat},${lng});
            node["vending"="feminine_hygiene"](around:${RADIUS},${lat},${lng});
          );
          out center tags;
        `
        const res  = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
        })
        const data = await res.json()

        const parsed = data.elements
          .map((el) => {
            const elLat = el.lat ?? el.center?.lat
            const elLng = el.lon ?? el.center?.lon
            const tags  = el.tags || {}
            return {
              id:           `osm-${el.id}`,
              lat:          elLat,
              lng:          elLng,
              tags,
              displayName:  buildNameFromTags(tags),
              isFemHygiene: tags.vending === 'feminine_hygiene',
              fee:          tags.fee === 'yes' ? 'Paid' : tags.fee === 'no' ? 'Free' : 'Unknown',
              accessible:   tags.wheelchair === 'yes',
              openingHours: tags.opening_hours || null,
              distFromUser: distKm(lat, lng, elLat, elLng).toFixed(1),
            }
          })
          .filter((e) => e.lat && e.lng)

        // machines.js entries within 15 km
        const nearbyDbMachines = machinesList.filter(
          (m) => distKm(lat, lng, m.lat, m.lng) <= 15
        )

        // Cross-reference: OSM restroom gets red if within 200 m of a machines.js entry
        const enriched = parsed.map((loc) => {
          const matched = nearbyDbMachines.find(
            (m) => distKm(loc.lat, loc.lng, m.lat, m.lng) < 0.2
          )
          return {
            ...loc,
            hasMachine:     loc.isFemHygiene || !!matched,
            matchedMachine: matched || null,
          }
        })

        // Standalone machines.js spots not near any OSM element
        const standalone = nearbyDbMachines
          .filter((m) =>
            !enriched.some((r) => distKm(r.lat, r.lng, m.lat, m.lng) < 0.2)
          )
          .map((m) => ({
            id:                  `db-${m.id}`,
            lat:                 m.lat,
            lng:                 m.lng,
            displayName:         m.name,
            location:            m.location,
            stock:               m.stock,
            sector:              m.sector,
            hasMachine:          true,
            isStandaloneMachine: true,
            distFromUser:        distKm(lat, lng, m.lat, m.lng).toFixed(1),
          }))

        const blues = enriched.filter((r) => !r.hasMachine)
        const reds  = [...enriched.filter((r) => r.hasMachine), ...standalone]

        setBlueSpots(blues)
        setRedSpots(reds)

        // ── Background reverse-geocoding for unnamed spots ─────────────────
        const unnamed = [
          ...blues.filter((l) => !l.displayName),
          ...reds.filter((l) => !l.displayName),
        ].slice(0, 10) // max 10 Nominatim calls

        if (unnamed.length > 0) {
          geocodeAbortRef.current = false
          setIsGeocodingNames(true)
          ;(async () => {
            for (const loc of unnamed) {
              if (geocodeAbortRef.current) break
              const name = await reverseGeocode(loc.lat, loc.lng)
              if (name) {
                setGeocodedNames((prev) => ({ ...prev, [loc.id]: name }))
              }
              await new Promise((r) => setTimeout(r, 1200)) // respect Nominatim rate limit
            }
            setIsGeocodingNames(false)
          })()
        }
      } catch (err) {
        console.error('Overpass fetch error:', err)
      } finally {
        setIsLoadingMap(false)
      }
    }

    fetchMapData()
  }, [mapCenter])

  // ── Helper: resolve final display name ─────────────────────────────────────
  const getName = (loc, fallback = 'Public Restroom') =>
    geocodedNames[loc.id] || loc.displayName || fallback

  // ── Dispense ───────────────────────────────────────────────────────────────
  const handleDispense = async () => {
    if (!selected) return
    setDispensing(true)
    await new Promise((r) => setTimeout(r, 1500))
    
    // Determine the machine ID (remove db- prefix if standalone)
    const machineId = selected.matchedMachine?.id || (selected.id.startsWith('db-') ? selected.id.replace('db-', '') : null)
    
    if (machineId) {
      const saved = localStorage.getItem('hercare_machines')
      if (saved) {
        try {
          const list = JSON.parse(saved)
          const updated = list.map((m) => {
            if (m.id === machineId) {
              return { ...m, stock: Math.max(0, m.stock - 1) }
            }
            return m
          })
          localStorage.setItem('hercare_machines', JSON.stringify(updated))
          setMachinesList(updated) // local state sync
          
          // Instantly sync the currently selected spot's stock in UI
          if (selected.matchedMachine) {
            selected.matchedMachine.stock = Math.max(0, selected.matchedMachine.stock - 1)
          } else if (selected.stock != null) {
            selected.stock = Math.max(0, selected.stock - 1)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    
    setDispensing(false)
    setSuccess(true)
  }

  const totalFound = blueSpots.length + redSpots.length

  return (
    <div className="napkin-request">
      {/* ── Header ── */}
      <header className="nr-header">
        <h1><MapPin size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Restrooms &amp; Napkin Machines
        </h1>
        <p>Real-time map · Blue = restroom · Red = has napkin machine</p>
      </header>

      {/* ── Scan shortcut ── */}
      <div className="napkin-options">
        <Link to="/user/scan" className="option-card scan-option">
          <QrCode className="option-icon" />
          <div>
            <h3>Scan QR Code</h3>
            <p>Scan the QR on a machine to dispense instantly</p>
          </div>
        </Link>
      </div>

      {/* ── Location mode toggle ── */}
      <div className="loc-mode-row">
        <button
          className={`mode-btn ${locMode === 'gps' ? 'mode-active' : ''}`}
          onClick={() => { setLocMode('gps'); detectLocation() }}
        >
          <Navigation size={14} /> Use My GPS
        </button>
        <button
          className={`mode-btn ${locMode === 'manual' ? 'mode-active' : ''}`}
          onClick={() => setLocMode('manual')}
        >
          <ChevronDown size={14} /> Browse by City
        </button>
      </div>

      {/* ── GPS status bar ── */}
      {locMode === 'gps' && (
        <div className="loc-bar">
          <div className={`loc-badge loc-${locStatus}`}>
            {locStatus === 'loading' && <><Loader2 size={13} className="spin-icon" /> Detecting location…</>}
            {locStatus === 'ok'      && <><Navigation size={13} /> Live GPS active</>}
            {locStatus === 'denied'  && <><MapPin size={13} /> GPS unavailable – showing Bengaluru</>}
            {locStatus === 'idle'    && <><Loader2 size={13} className="spin-icon" /> Initialising…</>}
          </div>
          <button className="loc-retry-btn" onClick={detectLocation}>
            <RefreshCw size={13} /> Retry GPS
          </button>
        </div>
      )}

      {/* ── Manual dropdowns ── */}
      {locMode === 'manual' && (
        <div className="region-selector">
          <div className="select-group">
            <label>Country</label>
            <select value={countryIso} onChange={handleCountryChange}>
              {allCountries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <label>State / Region</label>
            <select value={stateIso} onChange={handleStateChange} disabled={allStates.length === 0}>
              {allStates.length === 0
                ? <option value="">No states available</option>
                : allStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)
              }
            </select>
          </div>
          <div className="select-group">
            <label>City</label>
            <select value={cityName} onChange={handleCityChange} disabled={allCities.length === 0}>
              {allCities.length === 0
                ? <option value="">No cities available</option>
                : allCities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)
              }
            </select>
          </div>
        </div>
      )}

      {/* ── Map ── */}
      <section className="map-section">
        <div className="map-wrapper">
          {isLoadingMap && (
            <div className="map-loading-overlay">
              <Loader2 size={26} className="spin-icon" />
              <span>Scanning area for restrooms &amp; machines…</span>
            </div>
          )}

          <MapContainer
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={true}
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo center={mapCenter} zoom={14} />

            {/* User location */}
            {userLoc && (
              <Marker position={userLoc} icon={USER_ICON}>
                <Popup>
                  <div className="map-popup">
                    <strong>📍 You are here</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* BLUE markers – restrooms without napkin machine */}
            {blueSpots.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={BLUE_ICON}
                eventHandlers={{ click: () => setSelected(loc) }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>{getName(loc)}</strong>
                    <span className="popup-badge blue-badge">🚻 Public Restroom</span>
                    <p>Entry: <strong>{loc.fee}</strong></p>
                    {loc.accessible && <p>♿ Wheelchair accessible</p>}
                    {loc.openingHours && <p>⏰ {loc.openingHours}</p>}
                    <p>{loc.distFromUser} km away</p>
                    <p className="no-machine-note">❌ No napkin machine here</p>
                    <button
                      className="popup-directions-btn"
                      onClick={() => openDirections(userLoc, loc.lat, loc.lng)}
                    >
                      <ExternalLink size={12} /> Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* RED markers – locations WITH napkin machine */}
            {redSpots.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={RED_ICON}
                eventHandlers={{ click: () => setSelected(loc) }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>{getName(loc, 'Napkin Machine')}</strong>
                    <span className="popup-badge red-badge">📦 Napkin Machine Available</span>
                    {loc.location && <p>📍 {loc.location}</p>}
                    {loc.stock != null && (
                      <p>
                        Stock:{' '}
                        <strong style={{ color: loc.stock > 10 ? '#2e7d32' : '#c62828' }}>
                          {loc.stock} units
                        </strong>
                      </p>
                    )}
                    {loc.matchedMachine && (
                      <p>
                        Stock:{' '}
                        <strong style={{ color: loc.matchedMachine.stock > 10 ? '#2e7d32' : '#c62828' }}>
                          {loc.matchedMachine.stock} units
                        </strong>
                      </p>
                    )}
                    {!loc.isStandaloneMachine && <p>Entry: {loc.fee}</p>}
                    <p>{loc.distFromUser} km away</p>
                    <div className="popup-btn-row">
                      <button
                        className="popup-directions-btn"
                        onClick={() => openDirections(userLoc, loc.lat, loc.lng)}
                      >
                        <ExternalLink size={12} /> Get Directions
                      </button>
                      <button
                        className="popup-dispense-btn"
                        onClick={() => setSelected(loc)}
                      >
                        Request Napkin
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="map-legend">
            <div className="legend-row"><span className="leg-dot blue-dot" /><span>Public Restroom</span></div>
            <div className="legend-row"><span className="leg-dot red-dot"  /><span>Napkin Machine</span></div>
            <div className="legend-row"><span className="leg-dot user-dot" /><span>You</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className="map-stats">
          <div className="stat-chip total-chip">
            <span className="chip-n">{totalFound}</span>
            <span>Total Found</span>
          </div>
          <div className="stat-chip blue-chip">
            <span className="chip-n">{blueSpots.length}</span>
            <span>🚻 Restrooms</span>
          </div>
          <div className="stat-chip red-chip">
            <span className="chip-n">{redSpots.length}</span>
            <span>📦 Machines</span>
          </div>
        </div>

        {isGeocodingNames && (
          <p className="geocode-status">
            <Loader2 size={12} className="spin-icon" /> Fetching place names…
          </p>
        )}
      </section>

      {/* ── Location list ── */}
      <section className="machine-select">
        <div className="list-tabs">
          <button
            className={`tab-btn ${activeTab === 'machines' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('machines')}
          >
            📦 Napkin Machines ({redSpots.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'restrooms' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('restrooms')}
          >
            🚻 Restrooms ({blueSpots.length})
          </button>
        </div>

        <div className="info-note">
          <Info size={13} />
          <span>
            {activeTab === 'machines'
              ? 'Tap a card to request a napkin or get walking directions'
              : 'These restrooms have no napkin machine — click for directions'}
          </span>
        </div>

        <div className="machine-list">
          {/* ── Machines tab ── */}
          {activeTab === 'machines' && (
            redSpots.length === 0 && !isLoadingMap ? (
              <p className="no-machines-msg">
                No napkin machines found within 5 km.<br />
                <small>Try switching to a different city or refreshing GPS.</small>
              </p>
            ) : (
              redSpots.map((loc) => {
                const stock = loc.stock ?? loc.matchedMachine?.stock
                const name  = getName(loc, 'Napkin Machine')
                const addr  = loc.location || loc.matchedMachine?.location
                return (
                  <div key={`list-${loc.id}`} className={`machine-card-wrap ${selected?.id === loc.id ? 'selected-wrap' : ''}`}>
                    <button
                      className={`machine-card ${selected?.id === loc.id ? 'selected' : ''}`}
                      onClick={() => setSelected(loc)}
                    >
                      <div className="machine-info">
                        <div className="mc-top">
                          <h4>{name}</h4>
                          <span className="tag-red">📦 Machine</span>
                        </div>
                        {addr && (
                          <p className="mc-addr">
                            <MapPin size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                            {addr}
                          </p>
                        )}
                        <div className="mc-bottom">
                          {stock != null && (
                            <span
                              className="stock-badge"
                              style={{
                                background: stock > 20 ? 'rgba(46,125,50,0.12)' : stock > 0 ? 'rgba(245,124,0,0.12)' : 'rgba(198,40,40,0.12)',
                                color:      stock > 20 ? '#2e7d32'              : stock > 0 ? '#e65100'               : '#c62828',
                              }}
                            >
                              {stock > 20 ? '✅' : stock > 0 ? '⚠️' : '❌'} {stock} units
                            </span>
                          )}
                          <span className="dist-badge">{loc.distFromUser} km</span>
                        </div>
                      </div>
                    </button>
                    <button
                      className="card-directions-btn"
                      title="Get walking directions"
                      onClick={() => openDirections(userLoc, loc.lat, loc.lng)}
                    >
                      <ExternalLink size={14} />
                      Directions
                    </button>
                  </div>
                )
              })
            )
          )}

          {/* ── Restrooms tab ── */}
          {activeTab === 'restrooms' && (
            blueSpots.length === 0 && !isLoadingMap ? (
              <p className="no-machines-msg">No restrooms found in this area.</p>
            ) : (
              blueSpots.map((loc) => (
                <div key={`list-${loc.id}`} className="machine-card-wrap">
                  <button className="machine-card" style={{ cursor: 'default' }}>
                    <div className="machine-info">
                      <div className="mc-top">
                        <h4>
                          {getName(loc)}
                          {!geocodedNames[loc.id] && !loc.displayName && (
                            <Loader2 size={11} className="spin-icon" style={{ marginLeft: 6, opacity: 0.5 }} />
                          )}
                        </h4>
                        <span className="tag-blue">🚻 Restroom</span>
                      </div>
                      <div className="mc-bottom">
                        <p className="mc-addr">Entry: {loc.fee}{loc.accessible ? ' · ♿' : ''}</p>
                        <span className="dist-badge">{loc.distFromUser} km</span>
                      </div>
                      <span className="stock-badge" style={{ background: 'rgba(198,40,40,0.1)', color: '#c62828' }}>
                        ❌ No napkin machine
                      </span>
                    </div>
                  </button>
                  <button
                    className="card-directions-btn"
                    title="Get walking directions"
                    onClick={() => openDirections(userLoc, loc.lat, loc.lng)}
                  >
                    <ExternalLink size={14} />
                    Directions
                  </button>
                </div>
              ))
            )
          )}
        </div>
      </section>

      {/* ── Dispense panel ── */}
      {selected && selected.hasMachine && (
        <div className="dispense-area">
          <p>Selected: <strong>{getName(selected, 'Napkin Machine')}</strong></p>
          {(selected.stock ?? selected.matchedMachine?.stock) != null && (
            <p className="stock-info">
              Stock: <strong>{selected.stock ?? selected.matchedMachine?.stock} units</strong>
            </p>
          )}
          <div className="dispense-row">
            <button
              className="dispense-btn"
              onClick={handleDispense}
              disabled={
                dispensing ||
                selected.stock === 0 ||
                selected.matchedMachine?.stock === 0
              }
            >
              {dispensing ? 'Dispensing…' : '📦 Dispense Napkin'}
            </button>
            <button
              className="directions-alt-btn"
              onClick={() => openDirections(userLoc, selected.lat, selected.lng)}
            >
              <ExternalLink size={15} /> Open in Google Maps
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <CheckCircle2 size={30} />
          <p>Napkin dispensed successfully! Please collect from the machine.</p>
        </div>
      )}
    </div>
  )
}
