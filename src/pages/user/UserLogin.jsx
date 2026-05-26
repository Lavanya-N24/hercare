import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import '../../styles/Auth.css'

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { login, googleSignIn, user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate('/user', { replace: true })
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) return setError('Please enter your email.')
    if (!password) return setError('Please enter your password.')

    try {
      setIsLoggingIn(true)
      await login('user', { email: email.trim(), password })
      navigate('/user', { replace: true })
    } catch (err) {
      let msg = 'Failed to sign in.'
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password. Please try again.'
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a moment and try again.'
      } else if (err.code === 'auth/user-disabled') {
        msg = 'This account has been disabled.'
      } else {
        msg = err.message
      }
      setError(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      setIsGoogleLoading(true)
      await googleSignIn()
      navigate('/user', { replace: true })
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

  return (
    <div className="auth-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="auth-card">
        <div className="auth-logo">
          <Heart className="auth-logo-icon" />
          <h1>HerCare</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
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

          <button type="submit" className="btn-primary" disabled={isLoggingIn || isGoogleLoading}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-divider"><span>OR</span></div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn || isGoogleLoading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/user/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
