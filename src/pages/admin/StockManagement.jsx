import { useState } from 'react'
import { machines as defaultMachines } from '../../data/machines'
import './StockManagement.css'

export default function StockManagement() {
  // Load machines from localStorage or fall back to default
  const [machinesList, setMachinesList] = useState(() => {
    const saved = localStorage.getItem('hercare_machines')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return defaultMachines
  })

  const totalStock = machinesList.reduce((s, m) => s + m.stock, 0)
  const lowStock = machinesList.filter((m) => m.stock < 10).length
  const empty = machinesList.filter((m) => m.stock === 0).length

  // Dynamically handle restock actions
  const handleRestock = (id) => {
    const amountStr = prompt('Enter quantity to restock (e.g., 50):', '50')
    if (amountStr === null) return // User cancelled
    
    const amount = parseInt(amountStr, 10)
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid positive number.')
      return
    }

    const updatedList = machinesList.map((m) => {
      if (m.id === id) {
        return { ...m, stock: m.stock + amount }
      }
      return m
    })

    setMachinesList(updatedList)
    localStorage.setItem('hercare_machines', JSON.stringify(updatedList))
  }

  return (
    <div className="stock-management">
      <header>
        <h1>Stock Management</h1>
        <p>Handle inventory levels and restock operations across all vending units</p>
      </header>

      <div className="stock-summary">
        <div className="summary-card">
          <span className="summary-value">{totalStock}</span>
          <span className="summary-label">Total Stock</span>
        </div>
        <div className="summary-card warning">
          <span className="summary-value">{lowStock}</span>
          <span className="summary-label">Low Stock</span>
        </div>
        <div className="summary-card danger">
          <span className="summary-value">{empty}</span>
          <span className="summary-label">Empty</span>
        </div>
      </div>

      <div className="stock-list">
        <h2>By Machine</h2>
        {machinesList.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No machines registered in the network yet.
          </p>
        ) : (
          machinesList.map((m) => (
            <div key={m.id} className={`stock-item ${m.stock < 10 ? 'low' : ''}`}>
              <div>
                <strong>{m.name}</strong>
                <p>{m.location} • {m.city} • {m.sector}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="stock-count">{m.stock} units</span>
                <button className="restock-btn" onClick={() => handleRestock(m.id)}>Restock</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
