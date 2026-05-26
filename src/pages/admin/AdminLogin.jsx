import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Settings, ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react'
import '../../styles/Auth.css'

const DEMO_EMAIL = 'admin@hercare.com'
const DEMO_PASSWORD = 'admin@123'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const { login, googleSignIn, user, loading, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && user.role === 'admin') navigate('/admin', { replace: true })
  }, [user, loading, navigate])

  const doLogin = async (loginEmail, loginPassword) => {
    setError('')
    try {
      await login('admin', { email: loginEmail.trim(), password: loginPassword })
      navigate('/admin', { replace: true })
    } catch (err) {
      let msg = 'Failed to sign in.'
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password. Please try again.'
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a moment and try again.'
      } else if (err.message === 'Unauthorized: Access restricted to admins.') {
        msg = 'This account does not have admin access.'
      } else {
        msg = err.message
      }
      setError(msg)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Please enter your email.')
    if (!password) return setError('Please enter your password.')
    setIsLoggingIn(true)
    await doLogin(email, password)
    setIsLoggingIn(false)
  }

  const handleDemoLogin = async () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setIsDemoLoading(true)
    await doLogin(DEMO_EMAIL, DEMO_PASSWORD)
    setIsDemoLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      setIsGoogleLoading(true)
      await googleSignIn('admin')
      navigate('/admin', { replace: true })
    } catch (err) {
      let msg = 'Failed to sign in with Google.'
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in cancelled.'
      else if (err.code === 'auth/popup-blocked') msg = 'Popup blocked. Please allow popups for this site.'
      else msg = err.message
      setError(msg)
    } finally {
      setIsGoogleLoading(false)
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
            <h3 style={{ marginBottom: '1rem', color: '#d32f2f' }}>Access Denied</h3>
            <p style={{ marginBottom: '1rem', color: '#555' }}>
              You're signed in as <strong>{user.email}</strong> (User account).<br />
              Admin access requires an admin account.
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

  const busy = isLoggingIn || isGoogleLoading || isDemoLoading

  return (
    <div className="auth-page admin-auth">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="auth-card">
        <div className="auth-logo">
          <Settings className="auth-logo-icon" />
          <h1>HerCare Admin</h1>
          <p>Sign in to admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          {error && <p className="auth-error">⚠ {error}</p>}

          <button type="submit" className="btn-primary btn-admin" disabled={busy}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-divider"><span>OR</span></div>

          {/* Quick Demo Login */}
          <button
            type="button"
            className="btn-demo"
            onClick={handleDemoLogin}
            disabled={busy}
          >
            <Zap size={16} />
            {isDemoLoading ? 'Logging in...' : 'Try Demo Admin Login'}
          </button>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleSignIn}
            disabled={busy}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <p className="auth-footer">
            Don't have an admin account? <Link to="/admin/register">Create one</Link>
          </p>

          {/* Demo credentials reference */}
          <div className="demo-credentials">
            <p>🔑 <strong>Demo Admin Credentials</strong></p>
            <p>Email: <span>admin@hercare.com</span></p>
            <p>Password: <span>admin@123</span></p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.7 }}>
              Click "Try Demo Admin Login" to auto sign in
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
