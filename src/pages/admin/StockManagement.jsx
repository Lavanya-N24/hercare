import { machines } from '../../data/machines'
import './StockManagement.css'

export default function StockManagement() {
  const totalStock = machines.reduce((s, m) => s + m.stock, 0)
  const lowStock = machines.filter((m) => m.stock < 10).length
  const empty = machines.filter((m) => m.stock === 0).length

  return (
    <div className="stock-management">
      <header>
        <h1>Stock Management</h1>
        <p>Handle all dispensed napkins & inventory</p>
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
        {machines.map((m) => (
          <div key={m.id} className={`stock-item ${m.stock < 10 ? 'low' : ''}`}>
            <div>
              <strong>{m.name}</strong>
              <p>{m.location} • {m.sector}</p>
            </div>
            <span className="stock-count">{m.stock} units</span>
            <button className="restock-btn">Restock</button>
          </div>
        ))}
      </div>
    </div>
  )
}
