import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import '../../styles/Auth.css'

export default function UserRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { register, googleSignIn, user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate('/user', { replace: true })
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
      await register(email.trim(), password, name.trim(), 'user')
      navigate('/user', { replace: true })
    } catch (err) {
      let msg = 'Failed to create account.'
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

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      setIsGoogleLoading(true)
      await googleSignIn()
      navigate('/user', { replace: true })
    } catch (err) {
      let msg = 'Failed to sign up with Google.'
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
      <Link to="/user/login" className="back-link">
        <ArrowLeft size={18} /> Back to Sign In
      </Link>

      <div className="auth-card">
        <div className="auth-logo">
          <Heart className="auth-logo-icon" />
          <h1>HerCare</h1>
          <p>Create your account</p>
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

          <button type="submit" className="btn-primary" disabled={isRegistering || isGoogleLoading}>
            {isRegistering ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-divider"><span>OR</span></div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleSignIn}
            disabled={isRegistering || isGoogleLoading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/user/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
