import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Heart, Shield, User, Settings, QrCode, 
  Sparkles, Calendar, Stethoscope, ArrowRight, CheckCircle2 
} from 'lucide-react'
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
    <div className="landing-page">
      {/* Decorative gradient blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header className="landing-nav">
        <div className="logo-container">
          <Heart className="logo-pulse-icon" />
          <span className="brand-name">HerCare</span>
        </div>
        <div className="nav-actions">
          <Link to="/admin/login" className="admin-nav-btn">
            <Settings className="nav-btn-icon" />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      <main className="landing-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="badge">🌸 Empowering Women's Health</div>
          <h1 className="hero-title">
            Care When You Need It.<br />
            <span>Health Where You Control It.</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to HerCare—India's smart, unified women's wellness ecosystem. Instantly dispense sanitary napkins via QR, track your cycles, consult handpicked specialists, and talk to our smart AI assistant.
          </p>

          <div className="hero-ctas">
            <Link to="/user/login" className="btn btn-primary">
              <span>Get Started as User</span>
              <ArrowRight className="btn-icon" />
            </Link>
          </div>

          <div className="vending-hero-container">
            <img src="/vending-hero.png" alt="Smart Vending Machine" className="hero-img" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="features-section">
          <div className="section-header">
            <h2>A Unified Wellness Ecosystem</h2>
            <p>Designed around your health, comfort, and convenience.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card-premium">
              <div className="icon-wrapper qr">
                <QrCode className="feat-icon" />
              </div>
              <h3>QR Vending</h3>
              <p>Scan and dispense high-quality sanitary napkins instantly from nearby IoT vending machines.</p>
            </div>

            <div className="feature-card-premium">
              <div className="icon-wrapper ai">
                <Sparkles className="feat-icon" />
              </div>
              <h3>AI Health Assistant</h3>
              <p>Get instant health answers, symptom checkers, and menstrual advice in 12+ languages, 24/7.</p>
            </div>

            <div className="feature-card-premium">
              <div className="icon-wrapper tracker">
                <Calendar className="feat-icon" />
              </div>
              <h3>Cycle Analytics</h3>
              <p>Log details, track symptoms, predict periods, and estimate fertile windows with smart reminders.</p>
            </div>

            <div className="feature-card-premium">
              <div className="icon-wrapper doctor">
                <Stethoscope className="feat-icon" />
              </div>
              <h3>Top Recommendations</h3>
              <p>Direct booking and medical references for verified doctors in Bengaluru and across India.</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Dispensing health & support in three simple steps</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Locate & Scan</h4>
              <p>Find a HerCare IoT dispenser nearby in your college, office, or public space and scan the QR code.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Authenticate</h4>
              <p>Log in securely on your phone to quickly authorise and select your napkin preference.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Dispense & Track</h4>
              <p>Collect your napkin instantly and use the app to log your cycle, use the AI chat, or find doctors.</p>
            </div>
          </div>
        </section>

        {/* Trust Badge / Safety */}
        <section className="trust-banner">
          <div className="trust-content">
            <Shield className="trust-icon" />
            <div>
              <h4>Hygienic, Secure & Always Available</h4>
              <p>Our network of machines is regularly restocked and sanitised, ensuring zero compromise on quality and safety.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Heart className="footer-logo" />
            <span>HerCare</span>
          </div>
          <p className="footer-tagline">Making menstrual hygiene accessible and care absolute.</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HerCare Ecosystem. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/user/login">User Login</Link>
            <span className="dot">•</span>
            <Link to="/admin/login">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
