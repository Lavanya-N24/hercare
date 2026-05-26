import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Package, History, Bell } from 'lucide-react'
import { machines as defaultMachines } from '../../data/machines'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [machinesList] = useState(() => {
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

  const totalMachines = machinesList.length
  const totalStock = machinesList.reduce((s, m) => s + m.stock, 0)
  const activeAlerts = machinesList.filter((m) => m.stock < 10).length
  const dispensedToday = 42 // Simulated dispense activity for the current day

  // Get stock status percentages for Stock Health chart
  const healthyCount = machinesList.filter(m => m.stock >= 10).length
  const lowCount = machinesList.filter(m => m.stock > 0 && m.stock < 10).length
  const emptyCount = machinesList.filter(m => m.stock === 0).length
  
  // Guard against divide-by-zero if there are no machines
  const healthyPct = totalMachines > 0 ? Math.round((healthyCount / totalMachines) * 100) : 0
  const lowPct = totalMachines > 0 ? Math.round((lowCount / totalMachines) * 100) : 0
  const emptyPct = totalMachines > 0 ? Math.round((emptyCount / totalMachines) * 100) : 0

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Overview of vending machine network and inventory health</p>
      </header>

      {/* Quick Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Cpu size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Machines</h3>
            <p className="stat-value">{totalMachines}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 191, 165, 0.1)', color: 'var(--accent)' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Stock</h3>
            <p className="stat-value">{totalStock}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(124, 77, 255, 0.1)', color: 'var(--secondary)' }}>
            <History size={24} />
          </div>
          <div className="stat-info">
            <h3>Dispensed Today</h3>
            <p className="stat-value">{dispensedToday}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <Bell size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Alerts</h3>
            <p className="stat-value" style={{ color: '#ef4444' }}>{activeAlerts}</p>
          </div>
        </div>
      </div>

      {/* Analytics Visuals */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Dispense Activity</h3>
          </div>
          <div className="bar-chart">
            {/* Simulated Data Bars */}
            {[45, 60, 35, 80, 55, 90, 70].map((height, i) => (
              <div key={i} className="bar-wrapper">
                <div className="bar" style={{ height: `${height}%` }}></div>
                <span className="bar-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Stock Health</h3>
          </div>
          <div className="pie-chart-container">
            <div 
              className="pie-chart" 
              style={{ 
                background: `conic-gradient(var(--primary) 0% ${healthyPct}%, #ff9800 ${healthyPct}% ${healthyPct + lowPct}%, #ef4444 ${healthyPct + lowPct}% 100%)` 
              }}
            ></div>
            <div className="pie-hole">
              <span className="pie-total">{healthyPct}%</span>
              <span className="pie-label">Healthy</span>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="dot" style={{ background: 'var(--primary)' }}></div>
                <span>Healthy ({healthyCount})</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#ff9800' }}></div>
                <span>Low ({lowCount})</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#ef4444' }}></div>
                <span>Empty ({emptyCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text)', fontFamily: "'Fraunces', Georgia, serif" }}>Quick Actions</h2>
      </header>

      <div className="admin-cards">
        <Link to="/admin/machines" className="admin-card">
          <Cpu className="card-icon" />
          <h3>Manage Machines</h3>
          <p>Add, remove or update vending units</p>
        </Link>
        <Link to="/admin/stock" className="admin-card">
          <Package className="card-icon" />
          <h3>Stock Management</h3>
          <p>Update inventory levels across units</p>
        </Link>
        <Link to="/admin/dispenses" className="admin-card">
          <History className="card-icon" />
          <h3>Dispense History</h3>
          <p>View transaction logs and usage</p>
        </Link>
        <Link to="/admin/alerts" className="admin-card alerts-card">
          <Bell className="card-icon" />
          <h3>System Alerts</h3>
          <p>{activeAlerts > 0 ? `${activeAlerts} machines require attention` : 'All systems operating normally'}</p>
        </Link>
      </div>
    </div>
  )
}
