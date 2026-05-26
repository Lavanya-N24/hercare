import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Settings, LayoutDashboard, Cpu, Package, History, Bell, LogOut, ChevronUp, User } from 'lucide-react'
import './AdminLayout.css'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/machines', icon: Cpu, label: 'Machines' },
  { to: '/admin/stock', icon: Package, label: 'Stock' },
  { to: '/admin/dispenses', icon: History, label: 'Dispenses' },
  { to: '/admin/alerts', icon: Bell, label: 'Alerts' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayName = user?.name || user?.displayName || 'Admin'
  const displayEmail = user?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {/* Header */}
        <div className="admin-sidebar-header">
          <Settings className="admin-logo" />
          <span>HerCare Admin</span>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="admin-avatar">
              {user?.photoURL ? <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{displayName}</span>
              <span className="admin-profile-email">{displayEmail}</span>
            </div>
            <ChevronUp
              size={16}
              className="admin-profile-chevron"
              style={{ transform: profileOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="admin-profile-dropdown">
              <div className="admin-profile-dropdown-header">
                <div className="admin-avatar admin-avatar-lg">
                  {user?.photoURL ? <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
                </div>
                <div>
                  <p className="dropdown-name">{displayName}</p>
                  <p className="dropdown-email">{displayEmail}</p>
                </div>
              </div>

              <div className="admin-profile-dropdown-divider" />

              <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/admin/profile') }}>
                <User size={15} />
                Profile Settings
              </button>

              <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
