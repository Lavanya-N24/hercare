import { Link } from 'react-router-dom'
import { Cpu, Package, History, Bell } from 'lucide-react'
import './AdminDashboard.css'

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Overview of vending machine network and inventory</p>
      </header>

      {/* Quick Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Cpu size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Machines</h3>
            <p className="stat-value">8</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Stock</h3>
            <p className="stat-value">100</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <History size={24} />
          </div>
          <div className="stat-info">
            <h3>Dispensed Today</h3>
            <p className="stat-value">40</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <Bell size={10} />
          </div>
          <div className="stat-info">
            <h3>Active Alerts</h3>
            <p className="stat-value" style={{ color: '#ef4444' }}>3</p>
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
            <div className="pie-chart"></div>
            <div className="pie-hole">
              <span className="pie-total">100%</span>
              <span className="pie-label">Status</span>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="dot" style={{ background: 'var(--primary)' }}></div>
                <span>Healthy</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#ef4444' }}></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text)' }}>Quick Actions</h2>
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
          <p>3 machines require attention</p>
        </Link>
      </div>
    </div>
  )
}
