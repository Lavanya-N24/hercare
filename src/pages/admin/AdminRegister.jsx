import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Settings, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import '../../styles/Auth.css'

export default function AdminRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const { register, user, loading, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && user.role === 'admin') navigate('/admin', { replace: true })
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Please enter your full name.')
    if (!email.trim()) return setError('Please enter your email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    try {
      setIsRegistering(true)
      await register(email.trim(), password, name.trim(), 'admin')
      navigate('/admin', { replace: true })
    } catch (err) {
      let msg = 'Failed to create admin account.'
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use a stronger password.'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.'
      } else {
        msg = err.message
      }
      setError(msg)
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) return null

  // Already logged in as a non-admin user
  if (user && user.role !== 'admin') {
    return (
      <div className="auth-page admin-auth">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <div className="auth-card">
          <div className="auth-logo">
            <Settings className="auth-logo-icon" />
            <h1>HerCare Admin</h1>
          </div>
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#d32f2f' }}>Account Conflict</h3>
            <p style={{ marginBottom: '1rem', color: '#555' }}>
              You're signed in as <strong>{user.email}</strong> (User account).<br />
              Please sign out to create an admin account.
            </p>
            <button onClick={() => logout()} className="btn-primary btn-admin" style={{ marginBottom: '0.75rem' }}>
              Sign Out & Continue
            </button>
            <Link to="/user" style={{ display: 'block', textAlign: 'center', color: '#e91e8c', marginTop: '0.5rem' }}>
              Go to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page admin-auth">
      <Link to="/admin/login" className="back-link">
        <ArrowLeft size={18} /> Back to Sign In
      </Link>

      <div className="auth-card">
        <div className="auth-logo">
          <Settings className="auth-logo-icon" />
          <h1>HerCare Admin</h1>
          <p>Create admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">⚠ {error}</p>}

          <button type="submit" className="btn-primary btn-admin" disabled={isRegistering}>
            {isRegistering ? 'Creating Account...' : 'Create Admin Account'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/admin/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
