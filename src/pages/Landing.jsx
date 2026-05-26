import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Shield, User, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

export default function Landing() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect already-logged-in users to their dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/user', { replace: true })
      }
    }
  }, [user, loading, navigate])

  if (loading) return null  // avoid flash before redirect

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo">
          <Heart className="logo-icon" />
          <span>HerCare</span>
        </div>
        <p className="tagline">Women's Sanitary Napkin Vending Machine — Care When You Need It</p>
      </header>

      <main className="landing-main">

        <div className="login-cards">
          <Link to="/user/login" className="login-card user-card">
            <User className="card-icon" />
            <h2>User</h2>
            <p>Request napkins, track your health, get AI wellness support</p>
            <span className="card-cta">Login as User →</span>
          </Link>

          <Link to="/admin/login" className="login-card admin-card">
            <Settings className="card-icon" />
            <h2>Admin</h2>
            <p>Manage machines, stock, dispenses & alerts</p>
            <span className="card-cta">Login as Admin →</span>
          </Link>
        </div>

        <div className="landing-features">
          <div className="feature">
            <Shield className="feature-icon" />
            <span>Secure & Hygienic</span>
          </div>
          <div className="feature">
            <Heart className="feature-icon" />
            <span>Health-First Design</span>
          </div>
          <p className="sectors">Available in colleges, offices, hospitals & public spaces</p>
        </div>
      </main>
    </div>
  )
}
