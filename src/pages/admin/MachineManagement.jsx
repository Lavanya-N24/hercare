import { useState, useMemo } from 'react'
import { Plus, Trash2, MapPin, X, Layers, ShieldCheck, Wrench } from 'lucide-react'
import { machines as defaultMachines } from '../../data/machines'
import './MachineManagement.css'

export default function MachineManagement() {
  // Load machines from localStorage or fall back to default list
  const [machinesList, setMachinesList] = useState(() => {
    const saved = localStorage.getItem('hercare_machines')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing saved machines:', e)
      }
    }
    // Set default if not set
    localStorage.setItem('hercare_machines', JSON.stringify(defaultMachines))
    return defaultMachines
  })

  // State for Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [sector, setSector] = useState('public')
  const [stock, setStock] = useState(50)
  const [city, setCity] = useState('Bengaluru')
  const [error, setError] = useState('')

  // Toggle modal
  const openModal = () => {
    setIsModalOpen(true)
    setError('')
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setName('')
    setLocation('')
    setSector('public')
    setStock(50)
    setCity('Bengaluru')
  }

  // Handle adding a machine
  const handleAddMachine = (e) => {
    e.preventDefault()
    
    if (!name.trim() || !location.trim() || !city.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (stock < 0) {
      setError('Stock cannot be negative.')
      return
    }

    // Generate unique ID
    const maxNum = machinesList.reduce((max, m) => {
      const num = parseInt(m.id.replace(/[^\d]/g, ''), 10)
      return isNaN(num) ? max : Math.max(max, num)
    }, 0)
    const newId = `M${String(maxNum + 1).padStart(3, '0')}`

    // Assign mock coordinates close to selected city centers
    let lat = 12.9716
    let lng = 77.5946
    if (city.toLowerCase() === 'mysuru') {
      lat = 12.2958
      lng = 76.6394
    } else if (city.toLowerCase() === 'mumbai') {
      lat = 19.0760
      lng = 72.8777
    } else if (city.toLowerCase() === 'new delhi') {
      lat = 28.6139
      lng = 77.2090
    }
    
    // Add small random noise to coordinates so machines don't overlap exactly on map
    lat += (Math.random() - 0.5) * 0.04
    lng += (Math.random() - 0.5) * 0.04

    const newMachine = {
      id: newId,
      name: name.trim(),
      location: location.trim(),
      sector,
      stock: parseInt(stock, 10),
      lat,
      lng,
      city: city.trim(),
      state: city.toLowerCase() === 'bengaluru' || city.toLowerCase() === 'mysuru' ? 'Karnataka' : city.toLowerCase() === 'mumbai' ? 'Maharashtra' : 'Delhi',
      country: 'India'
    }

    const updatedList = [newMachine, ...machinesList]
    setMachinesList(updatedList)
    localStorage.setItem('hercare_machines', JSON.stringify(updatedList))
    closeModal()
  }

  // Handle deleting a machine
  const handleDeleteMachine = (id) => {
    if (window.confirm(`Are you sure you want to remove machine ${id}?`)) {
      const updatedList = machinesList.filter((m) => m.id !== id)
      setMachinesList(updatedList)
      localStorage.setItem('hercare_machines', JSON.stringify(updatedList))
    }
  }

  return (
    <div className="machine-management">
      <header className="page-header">
        <div>
          <h1>Machine Management</h1>
          <p>Add, monitor, and manage napkin vending machines in your network</p>
        </div>
        <button className="add-machine-btn" onClick={openModal}>
          <Plus size={18} />
          <span>Add New Machine</span>
        </button>
      </header>

      {/* Main Table */}
      <div className="machine-table-wrap">
        <table className="machine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>City</th>
              <th>Sector</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machinesList.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-state">
                  No machines added yet. Click "Add New Machine" to start your network.
                </td>
              </tr>
            ) : (
              machinesList.map((m) => (
                <tr key={m.id} className={m.stock < 10 ? 'low-stock' : ''}>
                  <td className="machine-id">{m.id}</td>
                  <td className="machine-name-cell">
                    <strong>{m.name}</strong>
                  </td>
                  <td>{m.location}</td>
                  <td>
                    <span className="city-tag">
                      <MapPin size={12} className="city-icon" />
                      {m.city}
                    </span>
                  </td>
                  <td>
                    <span className={`sector-tag ${m.sector}`}>
                      {m.sector}
                    </span>
                  </td>
                  <td className="stock-cell">
                    <strong>{m.stock}</strong> <span className="units-lbl">pcs</span>
                  </td>
                  <td>
                    <span className={`status-badge ${m.stock === 0 ? 'empty' : m.stock < 10 ? 'low' : 'ok'}`}>
                      {m.stock === 0 ? 'Empty' : m.stock < 10 ? 'Low' : 'Active'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="delete-action-btn"
                      onClick={() => handleDeleteMachine(m.id)}
                      title="Remove Machine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Machine Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title">
                <Wrench className="modal-title-icon" />
                <h3>Register Vending Machine</h3>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="modal-form">
              {error && <div className="form-error-msg">{error}</div>}

              <div className="form-group">
                <label htmlFor="m-name">Machine Display Name *</label>
                <input 
                  type="text" 
                  id="m-name" 
                  placeholder="e.g. Block C Lounge Vending" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="m-location">Exact Location / Placement *</label>
                <input 
                  type="text" 
                  id="m-location" 
                  placeholder="e.g. 1st Floor Girls Washroom" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="m-city">City *</label>
                  <select 
                    id="m-city" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="New Delhi">New Delhi</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label htmlFor="m-sector">Establishment Sector *</label>
                  <select 
                    id="m-sector" 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="college">College</option>
                    <option value="office">Office</option>
                    <option value="hospital">Hospital</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="m-stock">Initial Sanitary Napkin Stock *</label>
                <input 
                  type="number" 
                  id="m-stock" 
                  min="0"
                  max="500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-modal btn-modal-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal btn-modal-submit">
                  <Plus size={16} />
                  <span>Register Machine</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
