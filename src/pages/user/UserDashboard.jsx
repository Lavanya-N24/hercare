import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, QrCode, Calendar, Zap, FileText,
  Bot, Stethoscope, Heart, MapPin,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './UserDashboard.css'

// ── Quick action cards ────────────────────────────────────────────────────────
const quickActions = [
  {
    to: '/user/napkin', icon: MapPin, label: 'Find Machine',
    desc: 'Locate nearest dispenser', grad: ['#e91e63', '#f06292'],
  },
  {
    to: '/user/scan', icon: QrCode, label: 'Scan QR',
    desc: 'Instant machine dispense', grad: ['#8e24aa', '#ce93d8'],
  },
  {
    to: '/user/period-tracker', icon: Calendar, label: 'Period Tracker',
    desc: 'Track your cycle', grad: ['#d32f2f', '#ef9a9a'],
  },
  {
    to: '/user/cramp-relief', icon: Zap, label: 'Cramp Relief',
    desc: 'Tips & remedies', grad: ['#e65100', '#ffcc02'],
  },
  {
    to: '/user/health-articles', icon: FileText, label: 'Health Articles',
    desc: 'Wellness & awareness', grad: ['#00796b', '#80cbc4'],
  },
  {
    to: '/user/ai-assistant', icon: Bot, label: 'AI Assistant',
    desc: 'Health guidance', grad: ['#283593', '#90caf9'],
  },
  {
    to: '/user/doctor-recommendations', icon: Stethoscope, label: 'See a Doctor',
    desc: 'When to seek help', grad: ['#2e7d32', '#a5d6a7'],
  },
]

// ── Wellness tips (auto-rotate) ───────────────────────────────────────────────
const tips = [
  { icon: '💧', text: 'Stay hydrated — drink at least 8 glasses of water today.' },
  { icon: '🧘', text: 'Try 5 minutes of deep breathing to ease cramps and stress.' },
  { icon: '🌿', text: 'Iron-rich foods like spinach support your body during menstruation.' },
  { icon: '😴', text: 'Your body needs extra rest during your period — be kind to yourself.' },
  { icon: '🌸', text: 'Gentle yoga and stretching can reduce period pain significantly.' },
  { icon: '🍫', text: 'Dark chocolate has magnesium that soothes PMS symptoms.' },
  { icon: '☕', text: 'Limit caffeine during your period to reduce bloating.' },
  { icon: '🌡️', text: 'A warm heating pad on your lower abdomen relieves cramps naturally.' },
]

// ── Moods ─────────────────────────────────────────────────────────────────────
const moods = [
  { emoji: '😊', label: 'Happy',   msg: '✨ Love that energy! Keep shining today 💫' },
  { emoji: '😌', label: 'Calm',    msg: '🌿 Peace is a superpower. Stay balanced 🧘' },
  { emoji: '😴', label: 'Tired',   msg: '💤 Rest is productive too. Take it easy 🌙' },
  { emoji: '😔', label: 'Low',     msg: "💜 It's okay to have low days. You're not alone 🤗" },
  { emoji: '🤒', label: 'Unwell',  msg: '🩺 Take care of yourself. Consider seeing a doctor 👩‍⚕️' },
]

// ── Greeting by time ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', icon: '🌅' }
  if (h < 17) return { text: 'Good afternoon', icon: '☀️' }
  return { text: 'Good evening', icon: '🌙' }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { user }      = useAuth()
  const name          = user?.name || user?.displayName || 'Beautiful'
  const firstName     = name.split(' ')[0]
  const greeting      = getGreeting()

  const [tipIdx, setTipIdx]         = useState(0)
  const [tipFade, setTipFade]       = useState(true)
  const [selectedMood, setMood]     = useState(null)

  // Auto-rotate tip every 5 s
  useEffect(() => {
    const id = setInterval(() => {
      setTipFade(false)
      setTimeout(() => {
        setTipIdx((i) => (i + 1) % tips.length)
        setTipFade(true)
      }, 350)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const tip = tips[tipIdx]

  return (
    <div className="user-dashboard">

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="db-hero">
        {/* Floating orbs */}
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />

        <div className="hero-body">
          {/* Badge */}
          <div className="hero-badge">
            <Heart size={12} style={{ fill: '#fff', color: '#fff' }} />
            HerCare
          </div>

          {/* Greeting */}
          <h1 className="hero-greeting">
            {greeting.icon} {greeting.text},
            <br />
            <span className="hero-name">{firstName}!</span>
          </h1>
          <p className="hero-sub">Your personal women's wellness companion 💕</p>

          {/* CTA pills */}
          <div className="hero-pills">
            <Link to="/user/period-tracker" className="pill pill-solid">🌸 Track Cycle</Link>
            <Link to="/user/napkin"         className="pill pill-ghost">📦 Find Machine</Link>
          </div>
        </div>

        {/* Big flower decoration */}
        <div className="hero-flower" aria-hidden>🌺</div>
      </section>

      {/* ═══════════════════════════════ MOOD ═══════════════════════════════ */}
      <section className="db-card db-mood">
        <h2 className="card-heading">How are you feeling today? <span className="heading-dot" /></h2>
        <div className="mood-row">
          {moods.map((m, i) => (
            <button
              key={m.label}
              className={`mood-btn ${selectedMood === i ? 'mood-on' : ''}`}
              onClick={() => setMood(i)}
              title={m.label}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>
        {selectedMood !== null && (
          <p className="mood-msg" key={selectedMood}>{moods[selectedMood].msg}</p>
        )}
      </section>

      {/* ══════════════════════════ QUICK ACTIONS ════════════════════════════ */}
      <section className="db-actions">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="action-grid">
          {quickActions.map(({ to, icon: Icon, label, desc, grad }, i) => (
            <Link
              key={to}
              to={to}
              className="action-card"
              style={{ '--i': i }}
            >
              <div
                className="action-icon-box"
                style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
              >
                <Icon size={20} color="white" />
              </div>
              <div className="action-text">
                <h3>{label}</h3>
                <p>{desc}</p>
              </div>
              <span className="action-chev">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═════════════════════════ WELLNESS TIP ══════════════════════════════ */}
      <section className="db-tip-wrap">
        <div className="tip-chip">💡 Daily Wellness Tip</div>
        <div className={`tip-body ${tipFade ? 'tip-in' : 'tip-out'}`}>
          <span className="tip-icon">{tip.icon}</span>
          <p>{tip.text}</p>
        </div>
        <div className="tip-dots">
          {tips.map((_, i) => (
            <button
              key={i}
              className={`tip-dot ${i === tipIdx ? 'dot-on' : ''}`}
              onClick={() => { setTipIdx(i); setTipFade(true) }}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════ QUOTE ════════════════════════════════════ */}
      <section className="db-quote">
        <div className="quote-petal">🌸</div>
        <blockquote className="quote-text">
          "She is clothed with strength and dignity,<br />
          and she laughs without fear of the future."
        </blockquote>
        <p className="quote-src">— Proverbs 31:25</p>
      </section>

    </div>
  )
}
