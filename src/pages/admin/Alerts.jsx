import { Bell } from 'lucide-react'
import { machines } from '../../data/machines'
import './Alerts.css'

// Hardware sends automatic signals when stock is low/empty
const lowStockMachines = machines.filter((m) => m.stock < 10)

export default function Alerts() {
  return (
    <div className="alerts-page">
      <header>
        <h1>Alerts</h1>
        <p>Automatic hardware signals when stock becomes low or empty</p>
      </header>

      <div className="alerts-list">
        {lowStockMachines.length === 0 ? (
          <div className="no-alerts">
            <Bell size={48} />
            <p>No active alerts. All machines have sufficient stock.</p>
          </div>
        ) : (
          lowStockMachines.map((m) => (
            <div
              key={m.id}
              className={`alert-card ${m.stock === 0 ? 'critical' : 'warning'}`}
            >
              <Bell className="alert-icon" />
              <div>
                <h3>{m.name}</h3>
                <p>{m.location} • {m.sector}</p>
                <span className="alert-msg">
                  {m.stock === 0 ? 'Stock empty! Please restock immediately.' : `Low stock: ${m.stock} units left.`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
