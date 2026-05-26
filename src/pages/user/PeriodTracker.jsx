import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  format, addMonths, subMonths, isToday,
  startOfMonth, endOfMonth, getDay, parseISO, differenceInDays
} from 'date-fns'
import { ChevronLeft, ChevronRight, Save, Trash2, X } from 'lucide-react'
import './PeriodTracker.css'

// ── Storage ───────────────────────────────────────────────────────────────────
const KEY     = 'hercare_period_v2'
const load    = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
const persist = (d) => localStorage.setItem(KEY, JSON.stringify(d))

const SYMPTOMS = [
  { key: 'cramps',   label: 'Cramps'      },
  { key: 'headache', label: 'Headache'    },
  { key: 'bloating', label: 'Bloating'    },
  { key: 'mood',     label: 'Mood Swings' },
  { key: 'fatigue',  label: 'Fatigue'     },
  { key: 'backpain', label: 'Back Pain'   },
  { key: 'nausea',   label: 'Nausea'      },
  { key: 'insomnia', label: 'Insomnia'    },
]
const FLOWS = ['Spotting', 'Light', 'Medium', 'Heavy']

// ── Analytics ─────────────────────────────────────────────────────────────────
function analyzeData(allData) {
  const periodDates = Object.entries(allData)
    .filter(([, v]) => v.isPeriod)
    .map(([k]) => k)
    .sort()

  if (!periodDates.length)
    return { cycleLength: null, periodDuration: null, lastStart: null, predictedDates: [], nextStart: null }

  const runs = []
  let run = [periodDates[0]]
  for (let i = 1; i < periodDates.length; i++) {
    const diff = differenceInDays(parseISO(periodDates[i]), parseISO(periodDates[i - 1]))
    diff <= 2 ? run.push(periodDates[i]) : (runs.push(run), (run = [periodDates[i]]))
  }
  runs.push(run)

  const avgDuration = Math.round(runs.reduce((s, r) => s + r.length, 0) / runs.length) || 5
  let avgCycle = 28
  if (runs.length >= 2) {
    const gaps = []
    for (let i = 1; i < runs.length; i++)
      gaps.push(differenceInDays(parseISO(runs[i][0]), parseISO(runs[i - 1][0])))
    avgCycle = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
  }

  const lastStart = runs[runs.length - 1][0]
  const nextDate  = new Date(parseISO(lastStart))
  nextDate.setDate(nextDate.getDate() + avgCycle)

  const predictedDates = []
  for (let c = 1; c <= 3; c++) {
    const start = new Date(parseISO(lastStart))
    start.setDate(start.getDate() + avgCycle * c)
    for (let d = 0; d < avgDuration; d++) {
      const dd = new Date(start)
      dd.setDate(dd.getDate() + d)
      predictedDates.push(format(dd, 'yyyy-MM-dd'))
    }
  }

  return { cycleLength: avgCycle, periodDuration: avgDuration, lastStart, nextStart: nextDate, predictedDates }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PeriodTracker() {
  const [viewDate, setViewDate] = useState(new Date())
  const [allData,  setAllData]  = useState(load)
  const [selected, setSelected] = useState(null)
  const [popover,  setPopover]  = useState(null) // { top, left, arrowLeft }

  // Form fields inside popover
  const [fFlow,     setFFlow]     = useState('')
  const [fSymptoms, setFSymptoms] = useState([])
  const [fNotes,    setFNotes]    = useState('')
  const [saved,     setSaved]     = useState(false)

  const stats = useMemo(() => analyzeData(allData), [allData])

  // Close popover on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closePopover() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closePopover = () => { setSelected(null); setPopover(null) }

  // Calendar
  const monthStart = startOfMonth(viewDate)
  const monthEnd   = endOfMonth(viewDate)
  const padStart   = getDay(monthStart)
  const days       = []
  for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1))
    days.push(new Date(d))

  // ── Click a day ────────────────────────────────────────────────────────────
  const handleDayClick = (day, e) => {
    const ds = format(day, 'yyyy-MM-dd')

    // Same date → close
    if (selected === ds) { closePopover(); return }

    // Toggle period immediately & save
    const existing    = allData[ds] || {}
    const newIsPeriod = !existing.isPeriod
    const updated     = { ...allData, [ds]: { ...existing, isPeriod: newIsPeriod, ts: Date.now() } }
    setAllData(updated)
    persist(updated)

    // Pre-fill form
    setFFlow(existing.flow || '')
    setFSymptoms(existing.symptoms || [])
    setFNotes(existing.notes || '')
    setSaved(false)
    setSelected(ds)

    // Compute popover position relative to clicked cell
    const rect = e.currentTarget.getBoundingClientRect()
    const vw   = window.innerWidth
    const vh   = window.innerHeight

    const POPOVER_W = Math.min(310, vw - 24)
    const POPOVER_H = 420 // approximate

    // Center the popover below the cell; clamp horizontally
    let left      = rect.left + rect.width / 2 - POPOVER_W / 2
    const arrowL  = rect.left + rect.width / 2 - Math.max(12, left) // arrow relative to popover
    left          = Math.max(12, Math.min(vw - POPOVER_W - 12, left))

    // Below or above?
    const spaceBelow = vh - rect.bottom - 10
    const top        = spaceBelow >= POPOVER_H
      ? rect.bottom + window.scrollY + 8
      : rect.top + window.scrollY - POPOVER_H - 8

    setPopover({ top, left, arrowLeft: Math.min(arrowL, POPOVER_W - 20), openUp: spaceBelow < POPOVER_H })
  }

  // ── Panel period toggle ────────────────────────────────────────────────────
  const handleTogglePeriod = () => {
    if (!selected) return
    const existing    = allData[selected] || {}
    const newIsPeriod = !existing.isPeriod
    const updated     = { ...allData, [selected]: { ...existing, isPeriod: newIsPeriod, ts: Date.now() } }
    setAllData(updated)
    persist(updated)
  }

  // ── Save details ───────────────────────────────────────────────────────────
  const saveDetails = () => {
    if (!selected) return
    const existing = allData[selected] || {}
    const updated  = { ...allData, [selected]: { ...existing, flow: fFlow, symptoms: fSymptoms, notes: fNotes, ts: Date.now() } }
    setAllData(updated)
    persist(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ── Delete entry ───────────────────────────────────────────────────────────
  const deleteEntry = () => {
    if (!selected) return
    const updated = { ...allData }
    delete updated[selected]
    setAllData(updated)
    persist(updated)
    closePopover()
  }

  const toggleSym = (k) =>
    setFSymptoms((p) => p.includes(k) ? p.filter((s) => s !== k) : [...p, k])

  // Stats
  const daysUntilNext = stats.nextStart
    ? Math.ceil((stats.nextStart - new Date()) / 86400000) : null
  const cycleDay = stats.lastStart
    ? differenceInDays(new Date(), parseISO(stats.lastStart)) + 1 : null

  const recentEntries = Object.entries(allData)
    .filter(([, v]) => v.ts)
    .sort(([, a], [, b]) => b.ts - a.ts)
    .slice(0, 5)

  const currentEntry = selected ? (allData[selected] || {}) : null

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="pt-wrap">

      <div className="pt-header">
        <h1 className="pt-title">Menstrual Cycle Tracker</h1>
        <p className="pt-sub">Tap a date to mark it as a period day — a detail popup will appear</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{cycleDay != null && cycleDay > 0 ? `Day ${cycleDay}` : '—'}</span>
          <span className="stat-label">Current Cycle Day</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            {daysUntilNext != null
              ? (daysUntilNext <= 0 ? 'Due now' : `${daysUntilNext}d`)
              : '—'}
          </span>
          <span className="stat-label">Until Next Period</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.cycleLength ? `${stats.cycleLength}d` : '—'}</span>
          <span className="stat-label">Avg Cycle Length</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.periodDuration ? `${stats.periodDuration}d` : '—'}</span>
          <span className="stat-label">Avg Period Length</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="cal-card">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => setViewDate(subMonths(viewDate, 1))}>
            <ChevronLeft size={18} />
          </button>
          <h2 className="cal-month">{format(viewDate, 'MMMM yyyy')}</h2>
          <button className="cal-nav-btn" onClick={() => setViewDate(addMonths(viewDate, 1))}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="cal-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="cal-grid">
          {Array(padStart).fill(null).map((_, i) => <div key={`p-${i}`} className="dc empty" />)}
          {days.map((day) => {
            const ds          = format(day, 'yyyy-MM-dd')
            const entry       = allData[ds] || {}
            const isPeriod    = !!entry.isPeriod
            const isPredicted = stats.predictedDates.includes(ds) && !isPeriod
            const isSelected  = selected === ds
            const hasDot      = !!entry.ts && !!(entry.flow || entry.symptoms?.length || entry.notes)

            let cls = 'dc'
            if (isPeriod)    cls += ' dc-period'
            if (isPredicted) cls += ' dc-predicted'
            if (isToday(day)) cls += ' dc-today'
            if (isSelected)   cls += ' dc-selected'

            return (
              <button
                key={ds}
                className={cls}
                onClick={(e) => handleDayClick(day, e)}
                title={isPeriod ? 'Period day — click to edit' : 'Click to mark as period day'}
              >
                <span className="dc-num">{format(day, 'd')}</span>
                {hasDot && <span className="dc-dot" />}
              </button>
            )
          })}
        </div>

        <div className="cal-legend">
          <span className="leg"><span className="leg-swatch sw-period"    />Period</span>
          <span className="leg"><span className="leg-swatch sw-predicted" />Predicted</span>
          <span className="leg"><span className="leg-swatch sw-today"     />Today</span>
        </div>
      </div>

      {/* ── Floating Popover ── */}
      {selected && popover && currentEntry && (
        <>
          {/* Backdrop — click to close */}
          <div className="pop-backdrop" onClick={closePopover} />

          <div
            className={`date-popover ${popover.openUp ? 'pop-up' : 'pop-down'}`}
            style={{ top: popover.top, left: popover.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <span className="pop-arrow" style={{ left: popover.arrowLeft }} />

            {/* Header */}
            <div className="pop-header">
              <div className="pop-header-left">
                <span className={`pop-dot ${currentEntry.isPeriod ? 'dot-period' : 'dot-grey'}`} />
                <div>
                  <div className="pop-date">{format(parseISO(selected), 'MMM d, yyyy')}</div>
                  <div className="pop-day">{format(parseISO(selected), 'EEEE')}</div>
                </div>
              </div>
              <div className="pop-header-right">
                {currentEntry.ts && (
                  <button className="pop-del-btn" onClick={deleteEntry} title="Delete">
                    <Trash2 size={13} />
                  </button>
                )}
                <button className="pop-close-btn" onClick={closePopover}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="pop-body">
              {/* Period toggle */}
              <div className="pop-row">
                <span className="pop-label">Period Day</span>
                <button
                  className={`toggle ${currentEntry.isPeriod ? 'tog-on' : ''}`}
                  onClick={handleTogglePeriod}
                >
                  <span className="tog-knob" />
                </button>
              </div>

              {/* Flow */}
              {currentEntry.isPeriod && (
                <div className="pop-group">
                  <span className="pop-label">Flow Intensity</span>
                  <div className="flow-options">
                    {FLOWS.map((f) => (
                      <button
                        key={f}
                        className={`flow-opt ${fFlow === f ? 'flow-active' : ''}`}
                        onClick={() => setFFlow((p) => (p === f ? '' : f))}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Symptoms */}
              <div className="pop-group">
                <span className="pop-label">Symptoms</span>
                <div className="sym-grid">
                  {SYMPTOMS.map((s) => (
                    <button
                      key={s.key}
                      className={`sym-tag ${fSymptoms.includes(s.key) ? 'sym-active' : ''}`}
                      onClick={() => toggleSym(s.key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="pop-group">
                <span className="pop-label">Notes</span>
                <textarea
                  className="notes-ta"
                  placeholder="Add any observations or notes…"
                  value={fNotes}
                  onChange={(e) => setFNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pop-footer">
              <button className={`btn-save ${saved ? 'btn-saved' : ''}`} onClick={saveDetails}>
                <Save size={13} />
                {saved ? '✓ Saved' : 'Save Details'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Recent log */}
      {recentEntries.length > 0 && (
        <div className="recent-card">
          <h3 className="rc-title">Recent Log</h3>
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Flow</th>
                <th>Symptoms</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map(([ds, entry]) => (
                <tr key={ds} className="log-row"
                  onClick={() => {
                    setViewDate(parseISO(ds))
                    setSelected(null)
                    setPopover(null)
                  }}
                >
                  <td className="log-date">{format(parseISO(ds), 'MMM d, yyyy')}</td>
                  <td><span className={`type-badge ${entry.isPeriod ? 'tb-period' : 'tb-note'}`}>{entry.isPeriod ? 'Period' : 'Log'}</span></td>
                  <td className="log-muted">{entry.flow || '—'}</td>
                  <td className="log-muted">{entry.symptoms?.slice(0, 2).join(', ') || '—'}</td>
                  <td className="log-note">{entry.notes ? `${entry.notes.slice(0, 35)}…` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(allData).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🗓️</div>
          <h3>Start tracking your cycle</h3>
          <p>Tap any date to mark it as a period day. A popup will open for details.<br />Predictions appear automatically after logging 2+ cycles.</p>
        </div>
      )}

    </div>
  )
}
