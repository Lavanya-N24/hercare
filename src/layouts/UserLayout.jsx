import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart, Package, QrCode, Calendar, Zap, FileText, Bot, Stethoscope, LogOut, ChevronUp, User } from 'lucide-react'
import './UserLayout.css'

const navItems = [
  { to: '/user', icon: Heart, label: 'Dashboard' },
  { to: '/user/napkin', icon: Package, label: 'Get Napkin' },
  { to: '/user/scan', icon: QrCode, label: 'Scan QR' },
  { to: '/user/period-tracker', icon: Calendar, label: 'Period Tracker' },
  { to: '/user/cramp-relief', icon: Zap, label: 'Cramp Relief' },
  { to: '/user/health-articles', icon: FileText, label: 'Health Articles' },
  { to: '/user/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/user/doctor-recommendations', icon: Stethoscope, label: 'Doctor' },
]

export default function UserLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayName = user?.name || user?.displayName || 'User'
  const displayEmail = user?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="user-layout">
      <aside className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <Heart className="sidebar-logo" />
          <span>HerCare</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/user'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="sidebar-footer">
          <button
            className="user-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="user-avatar">
              {user?.photoURL ? <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
            </div>
            <div className="user-profile-info">
              <span className="user-profile-name">{displayName}</span>
              <span className="user-profile-email">{displayEmail}</span>
            </div>
            <ChevronUp
              size={16}
              className="user-profile-chevron"
              style={{ transform: profileOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="user-profile-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar user-avatar-lg">
                  {user?.photoURL ? <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
                </div>
                <div>
                  <p className="udropdown-name">{displayName}</p>
                  <p className="udropdown-email">{displayEmail}</p>
                </div>
              </div>

              <div className="user-dropdown-divider" />

              <button className="udropdown-item" onClick={() => { setProfileOpen(false); navigate('/user/profile') }}>
                <User size={15} />
                Profile Settings
              </button>

              <button className="udropdown-item udropdown-item-danger" onClick={handleLogout}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="user-main">
        <Outlet />
      </main>
    </div>
  )
}
