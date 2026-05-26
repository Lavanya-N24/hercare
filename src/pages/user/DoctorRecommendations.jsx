import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stethoscope, AlertCircle, Search, Star, MapPin,
  Clock, Phone, Video, ChevronRight, Filter, CheckCircle, X,
  CalendarDays, User, MessageSquare, Loader2
} from 'lucide-react'
import './DoctorRecommendations.css'

const SPECIALTIES = ['All', 'Gynaecologist', 'Obstetrician', 'Endocrinologist', 'General Physician', 'Fertility Specialist']

const DOCTORS = [
  // ── Bengaluru (8 doctors) ──────────────────────────────────
  {
    id: 1,
    name: 'Dr. Sunita Rao',
    specialty: 'Obstetrician',
    experience: 18,
    rating: 4.9,
    reviews: 512,
    location: 'Bengaluru, Karnataka',
    hospital: 'Fortis La Femme, Bannerghatta Rd',
    phone: '+918022441122',
    displayPhone: '+91 80 2244 1122',
    available: 'Today, 10:00 AM',
    slots: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Pregnancy', 'High-Risk OB', 'Normal Delivery'],
    fee: '₹800',
    initials: 'SR',
    color: '#7c4dff',
  },
  {
    id: 2,
    name: 'Dr. Deepa Krishnaswamy',
    specialty: 'Gynaecologist',
    experience: 20,
    rating: 5.0,
    reviews: 634,
    location: 'Bengaluru, Karnataka',
    hospital: 'Manipal Hospital, Old Airport Rd',
    phone: '+918025023000',
    displayPhone: '+91 80 2502 3000',
    available: 'Today, 3:30 PM',
    slots: ['3:30 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
    modes: ['in-person'],
    tags: ['Endometriosis', 'Fibroids', 'PCOS'],
    fee: '₹900',
    initials: 'DK',
    color: '#e91e63',
  },
  {
    id: 3,
    name: 'Dr. Varsha Bhat',
    specialty: 'Fertility Specialist',
    experience: 13,
    rating: 4.8,
    reviews: 298,
    location: 'Bengaluru, Karnataka',
    hospital: 'Nova IVF Fertility, Koramangala',
    phone: '+918049530000',
    displayPhone: '+91 80 4953 0000',
    available: 'Today, 2:00 PM',
    slots: ['2:00 PM', '3:00 PM', '4:30 PM'],
    modes: ['in-person', 'video'],
    tags: ['IVF', 'IUI', 'Egg Freezing', 'PCOS'],
    fee: '₹1000',
    initials: 'VB',
    color: '#00bfa5',
  },
  {
    id: 4,
    name: 'Dr. Nandita Prabhu',
    specialty: 'Endocrinologist',
    experience: 15,
    rating: 4.8,
    reviews: 341,
    location: 'Bengaluru, Karnataka',
    hospital: 'Narayana Health City, Bommasandra',
    phone: '+918071222222',
    displayPhone: '+91 80 7122 2222',
    available: 'Tomorrow, 9:00 AM',
    slots: ['9:00 AM', '10:00 AM', '11:30 AM', '12:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['PCOS', 'Thyroid', 'Hormonal Imbalance'],
    fee: '₹750',
    initials: 'NP',
    color: '#ff9800',
  },
  {
    id: 5,
    name: 'Dr. Lavanya Suresh',
    specialty: 'Gynaecologist',
    experience: 10,
    rating: 4.7,
    reviews: 219,
    location: 'Bengaluru, Karnataka',
    hospital: 'Cloudnine Hospital, Jayanagar',
    phone: '+918049521500',
    displayPhone: '+91 80 4952 1500',
    available: 'Today, 5:00 PM',
    slots: ['5:00 PM', '5:30 PM', '6:30 PM', '7:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Menstrual Disorders', 'PCOS', 'Adolescent Health'],
    fee: '₹600',
    initials: 'LS',
    color: '#7c4dff',
  },
  {
    id: 6,
    name: 'Dr. Geetha Iyengar',
    specialty: 'Obstetrician',
    experience: 25,
    rating: 4.9,
    reviews: 780,
    location: 'Bengaluru, Karnataka',
    hospital: 'St. Johns Medical College Hospital',
    phone: '+918049465555',
    displayPhone: '+91 80 4946 5555',
    available: 'Tomorrow, 11:00 AM',
    slots: ['11:00 AM', '12:00 PM', '2:30 PM', '3:00 PM'],
    modes: ['in-person'],
    tags: ['High-Risk Pregnancy', 'C-Section', 'Prenatal Care'],
    fee: '₹1000',
    initials: 'GI',
    color: '#e91e63',
  },
  {
    id: 7,
    name: 'Dr. Smitha Reddy',
    specialty: 'General Physician',
    experience: 8,
    rating: 4.6,
    reviews: 387,
    location: 'Bengaluru, Karnataka',
    hospital: 'Apollo Clinic, Indiranagar',
    phone: '+918041455678',
    displayPhone: '+91 80 4145 5678',
    available: 'Today, 1:00 PM',
    slots: ['1:00 PM', '2:00 PM', '3:30 PM', '5:00 PM', '6:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Period Pain', 'UTI', 'General Health'],
    fee: '₹400',
    initials: 'SR',
    color: '#00bfa5',
  },
  {
    id: 8,
    name: 'Dr. Padmini Venkatesh',
    specialty: 'Gynaecologist',
    experience: 17,
    rating: 4.8,
    reviews: 456,
    location: 'Bengaluru, Karnataka',
    hospital: 'Sakra World Hospital, Marathahalli',
    phone: '+918049694969',
    displayPhone: '+91 80 4969 4969',
    available: 'Today, 4:00 PM',
    slots: ['4:00 PM', '4:30 PM', '5:30 PM', '6:30 PM'],
    modes: ['in-person', 'video'],
    tags: ['Menopause', 'Fibroids', 'Laparoscopy', 'PCOD'],
    fee: '₹850',
    initials: 'PV',
    color: '#ff9800',
  },

  // ── Chennai (2 doctors) ────────────────────────────────────
  {
    id: 9,
    name: 'Dr. Priya Menon',
    specialty: 'Gynaecologist',
    experience: 14,
    rating: 4.9,
    reviews: 312,
    location: 'Chennai, Tamil Nadu',
    hospital: 'Apollo Womens Clinic, Greams Rd',
    phone: '+914422334455',
    displayPhone: '+91 44 2233 4455',
    available: 'Today, 3:00 PM',
    slots: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['PCOS', 'Menstrual Disorders', 'Endometriosis'],
    fee: '₹600',
    initials: 'PM',
    color: '#e91e63',
  },
  {
    id: 10,
    name: 'Dr. Saranya Rajan',
    specialty: 'Fertility Specialist',
    experience: 12,
    rating: 4.7,
    reviews: 178,
    location: 'Chennai, Tamil Nadu',
    hospital: 'CIMAR Fertility, Anna Nagar',
    phone: '+914426260000',
    displayPhone: '+91 44 2626 0000',
    available: 'Tomorrow, 10:00 AM',
    slots: ['10:00 AM', '11:00 AM', '2:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['IVF', 'IUI', 'PCOS', 'Infertility'],
    fee: '₹900',
    initials: 'SJ',
    color: '#7c4dff',
  },

  // ── Hyderabad (2 doctors) ──────────────────────────────────
  {
    id: 11,
    name: 'Dr. Anitha Krishnan',
    specialty: 'Fertility Specialist',
    experience: 16,
    rating: 4.9,
    reviews: 203,
    location: 'Hyderabad, Telangana',
    hospital: 'CARE Hospitals, Banjara Hills',
    phone: '+914027889900',
    displayPhone: '+91 40 2788 9900',
    available: 'Tomorrow, 9:00 AM',
    slots: ['9:00 AM', '10:00 AM', '11:30 AM'],
    modes: ['in-person', 'video'],
    tags: ['IVF', 'PCOS', 'Infertility'],
    fee: '₹1000',
    initials: 'AK',
    color: '#e91e63',
  },
  {
    id: 12,
    name: 'Dr. Bhavana Murthy',
    specialty: 'Gynaecologist',
    experience: 11,
    rating: 4.6,
    reviews: 261,
    location: 'Hyderabad, Telangana',
    hospital: 'Yashoda Hospitals, Secunderabad',
    phone: '+914027720020',
    displayPhone: '+91 40 2772 0020',
    available: 'Today, 5:00 PM',
    slots: ['5:00 PM', '6:00 PM', '7:00 PM'],
    modes: ['in-person'],
    tags: ['PCOD', 'Menstrual Health', 'Laparoscopy'],
    fee: '₹650',
    initials: 'BM',
    color: '#00bfa5',
  },

  // ── Mumbai (2 doctors) ─────────────────────────────────────
  {
    id: 13,
    name: 'Dr. Meera Sharma',
    specialty: 'General Physician',
    experience: 9,
    rating: 4.6,
    reviews: 415,
    location: 'Mumbai, Maharashtra',
    hospital: 'Hinduja Hospital, Mahim',
    phone: '+912224466688',
    displayPhone: '+91 22 2446 6688',
    available: 'Today, 2:00 PM',
    slots: ['2:00 PM', '3:00 PM', '4:30 PM', '5:00 PM'],
    modes: ['video'],
    tags: ['Period Pain', 'UTI', 'General Health'],
    fee: '₹400',
    initials: 'MS',
    color: '#ff9800',
  },
  {
    id: 14,
    name: 'Dr. Jyoti Nair',
    specialty: 'Gynaecologist',
    experience: 19,
    rating: 4.8,
    reviews: 502,
    location: 'Mumbai, Maharashtra',
    hospital: 'Lilavati Hospital, Bandra',
    phone: '+912226455000',
    displayPhone: '+91 22 2645 5000',
    available: 'Tomorrow, 10:30 AM',
    slots: ['10:30 AM', '11:00 AM', '12:30 PM', '3:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Fibroids', 'Menopause', 'Endometriosis'],
    fee: '₹1100',
    initials: 'JN',
    color: '#e91e63',
  },

  // ── Delhi / NCR (2 doctors) ────────────────────────────────
  {
    id: 15,
    name: 'Dr. Rekha Pillai',
    specialty: 'Gynaecologist',
    experience: 22,
    rating: 5.0,
    reviews: 528,
    location: 'Delhi, NCR',
    hospital: 'Max Super Specialty, Saket',
    phone: '+911142778899',
    displayPhone: '+91 11 4277 8899',
    available: 'Today, 6:00 PM',
    slots: ['6:00 PM', '6:30 PM', '7:00 PM'],
    modes: ['in-person'],
    tags: ['Fibroids', 'Endometriosis', 'Menopause'],
    fee: '₹900',
    initials: 'RP',
    color: '#7c4dff',
  },
  {
    id: 16,
    name: 'Dr. Sonia Kapoor',
    specialty: 'Endocrinologist',
    experience: 14,
    rating: 4.7,
    reviews: 233,
    location: 'Delhi, NCR',
    hospital: 'AIIMS, New Delhi',
    phone: '+911126588500',
    displayPhone: '+91 11 2658 8500',
    available: 'Tomorrow, 8:00 AM',
    slots: ['8:00 AM', '9:00 AM', '10:30 AM'],
    modes: ['in-person'],
    tags: ['PCOS', 'Thyroid Disorders', 'Hormonal Health'],
    fee: '₹500',
    initials: 'SK',
    color: '#00bfa5',
  },

  // ── Kochi (1 doctor) ──────────────────────────────────────
  {
    id: 17,
    name: 'Dr. Kavitha Nair',
    specialty: 'Endocrinologist',
    experience: 11,
    rating: 4.7,
    reviews: 189,
    location: 'Kochi, Kerala',
    hospital: 'Amrita Institute of Medical Sciences',
    phone: '+914842556677',
    displayPhone: '+91 484 255 6677',
    available: 'Today, 5:30 PM',
    slots: ['5:30 PM', '6:00 PM', '6:30 PM'],
    modes: ['in-person', 'video'],
    tags: ['PCOS', 'Thyroid', 'Hormonal Imbalance'],
    fee: '₹700',
    initials: 'KN',
    color: '#e91e63',
  },

  // ── Pune (1 doctor) ───────────────────────────────────────
  {
    id: 18,
    name: 'Dr. Rupali Deshmukh',
    specialty: 'Obstetrician',
    experience: 16,
    rating: 4.8,
    reviews: 321,
    location: 'Pune, Maharashtra',
    hospital: 'Ruby Hall Clinic, Pune',
    phone: '+912066455000',
    displayPhone: '+91 20 6645 5000',
    available: 'Today, 4:00 PM',
    slots: ['4:00 PM', '5:00 PM', '6:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Pregnancy', 'Antenatal Care', 'Normal Delivery'],
    fee: '₹750',
    initials: 'RD',
    color: '#7c4dff',
  },

  // ── Coimbatore (1 doctor) ─────────────────────────────────
  {
    id: 19,
    name: 'Dr. Usha Palani',
    specialty: 'Gynaecologist',
    experience: 13,
    rating: 4.7,
    reviews: 204,
    location: 'Coimbatore, Tamil Nadu',
    hospital: 'PSG Hospitals, Peelamedu',
    phone: '+914222570000',
    displayPhone: '+91 422 257 0000',
    available: 'Tomorrow, 9:30 AM',
    slots: ['9:30 AM', '10:30 AM', '11:30 AM', '2:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['PCOD', 'Infertility', 'Menstrual Health'],
    fee: '₹500',
    initials: 'UP',
    color: '#ff9800',
  },

  // ── Kolkata (1 doctor) ────────────────────────────────────
  {
    id: 20,
    name: 'Dr. Ratna Chatterjee',
    specialty: 'General Physician',
    experience: 10,
    rating: 4.6,
    reviews: 178,
    location: 'Kolkata, West Bengal',
    hospital: 'Fortis Hospital, Anandapur',
    phone: '+913366284444',
    displayPhone: '+91 33 6628 4444',
    available: 'Today, 3:00 PM',
    slots: ['3:00 PM', '4:00 PM', '5:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['Period Pain', 'UTI', 'Anaemia'],
    fee: '₹450',
    initials: 'RC',
    color: '#00bfa5',
  },

  // ── Ahmedabad (1 doctor) ──────────────────────────────────
  {
    id: 21,
    name: 'Dr. Miral Shah',
    specialty: 'Fertility Specialist',
    experience: 14,
    rating: 4.8,
    reviews: 256,
    location: 'Ahmedabad, Gujarat',
    hospital: 'Akanksha Hospital, Anand',
    phone: '+912692260333',
    displayPhone: '+91 2692 260333',
    available: 'Tomorrow, 10:00 AM',
    slots: ['10:00 AM', '11:00 AM', '12:00 PM'],
    modes: ['in-person', 'video'],
    tags: ['IVF', 'Surrogacy', 'Infertility', 'PCOS'],
    fee: '₹950',
    initials: 'MS',
    color: '#e91e63',
  },

  // ── Mysuru (1 doctor) ─────────────────────────────────────
  {
    id: 22,
    name: 'Dr. Shanthi Narayan',
    specialty: 'Gynaecologist',
    experience: 18,
    rating: 4.9,
    reviews: 314,
    location: 'Mysuru, Karnataka',
    hospital: 'Columbia Asia, Mysuru',
    phone: '+918212562222',
    displayPhone: '+91 821 256 2222',
    available: 'Today, 2:30 PM',
    slots: ['2:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'],
    modes: ['in-person'],
    tags: ['Menstrual Disorders', 'PCOS', 'Menopause'],
    fee: '₹600',
    initials: 'SN',
    color: '#7c4dff',
  },
]

const URGENCY = [
  {
    level: 'emergency',
    label: '🚨 Emergency — Go Now',
    color: '#ef4444',
    bg: '#fff5f5',
    border: '#fecaca',
    items: [
      'Heavy bleeding soaking a pad every hour for 2+ hours with dizziness',
      'Sudden severe pelvic pain',
      'Heavy bleeding with fever (possible infection)',
      'Fainting or extreme weakness due to blood loss',
    ],
  },
  {
    level: 'soon',
    label: '⚠️ See a Doctor Soon (within 1–2 days)',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    items: [
      'Period pain not relieved by ibuprofen or heat',
      'Unusual discharge with odour or itching',
      'Bleeding between periods',
      'Missed 2+ periods (not pregnant)',
    ],
  },
  {
    level: 'routine',
    label: '📅 Book a Routine Appointment',
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    items: [
      'Cycles consistently shorter than 21 days or longer than 35 days',
      'Suspected PCOS or endometriosis symptoms',
      'Fertility planning or contraception advice',
      'Regular gynaecology check-up (yearly)',
    ],
  },
]

function getDateOptions() {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      value: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    })
  }
  return dates
}

function StarRating({ rating }) {
  return (
    <span className="star-row">
      <Star size={13} fill="#f59e0b" color="#f59e0b" />
      <span className="rating-num">{rating.toFixed(1)}</span>
    </span>
  )
}

function BookingModal({ doctor, onClose }) {
  const dates = getDateOptions()
  const [step, setStep]         = useState(1)
  const [selectedDate, setDate] = useState(dates[0].value)
  const [selectedSlot, setSlot] = useState('')
  const [mode, setMode]         = useState(doctor.modes[0])
  const [name, setName]         = useState('')
  const [reason, setReason]     = useState('')
  const [loading, setLoading]   = useState(false)

  const canNext1 = selectedDate && selectedSlot
  const canNext2 = name.trim().length >= 2

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 1800)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-doc-info">
            <div className="modal-doc-avatar" style={{ background: `linear-gradient(135deg, ${doctor.color}cc, ${doctor.color})` }}>
              {doctor.initials}
            </div>
            <div>
              <p className="modal-doc-name">{doctor.name}</p>
              <p className="modal-doc-spec">{doctor.specialty} · {doctor.fee}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {step < 3 && (
          <div className="modal-steps">
            {['Slot', 'Details', 'Confirm'].map((s, i) => (
              <div key={s} className={`modal-step ${step === i + 1 ? 'step-active' : step > i + 1 ? 'step-done' : ''}`}>
                <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
                <span className="step-label">{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-body">
          {step === 1 && (
            <>
              <p className="modal-section-label"><CalendarDays size={14} /> Select Date</p>
              <div className="date-chips">
                {dates.map(d => (
                  <button key={d.value} className={`date-chip ${selectedDate === d.value ? 'date-chip-active' : ''}`}
                    onClick={() => { setDate(d.value); setSlot('') }}>{d.label}</button>
                ))}
              </div>
              <p className="modal-section-label"><Clock size={14} /> Available Slots</p>
              <div className="slot-grid">
                {doctor.slots.map(s => (
                  <button key={s} className={`slot-btn ${selectedSlot === s ? 'slot-active' : ''}`}
                    onClick={() => setSlot(s)}>{s}</button>
                ))}
              </div>
              {doctor.modes.length > 1 && (
                <>
                  <p className="modal-section-label"><Video size={14} /> Consultation Mode</p>
                  <div className="mode-toggle">
                    {doctor.modes.map(m => (
                      <button key={m} className={`mode-toggle-btn ${mode === m ? 'mode-toggle-active' : ''}`}
                        onClick={() => setMode(m)}>
                        {m === 'video' ? '📹 Video Call' : '🏥 In-person'}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button className="modal-next-btn" disabled={!canNext1} onClick={() => setStep(2)}>Continue →</button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="modal-section-label"><User size={14} /> Your Name</p>
              <input className="modal-input" type="text" placeholder="Enter your full name"
                value={name} onChange={e => setName(e.target.value)} autoFocus />
              <p className="modal-section-label"><MessageSquare size={14} /> Reason for Visit <span className="optional">(optional)</span></p>
              <textarea className="modal-input modal-textarea" rows={3}
                placeholder="e.g. irregular periods, PCOS follow-up, cramp relief..."
                value={reason} onChange={e => setReason(e.target.value)} />
              <div className="booking-summary">
                <div className="summary-row"><span>Doctor</span><span>{doctor.name}</span></div>
                <div className="summary-row"><span>Date</span><span>{dates.find(d => d.value === selectedDate)?.label}</span></div>
                <div className="summary-row"><span>Time</span><span>{selectedSlot}</span></div>
                <div className="summary-row"><span>Mode</span><span>{mode === 'video' ? '📹 Video Call' : '🏥 In-person'}</span></div>
                <div className="summary-row summary-fee"><span>Consultation Fee</span><span>{doctor.fee}</span></div>
              </div>
              <div className="modal-btn-row">
                <button className="modal-back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="modal-next-btn" disabled={!canNext2 || loading} onClick={handleConfirm}>
                  {loading ? <><Loader2 size={15} className="spin" /> Booking...</> : 'Confirm Booking ✓'}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="booking-success">
              <div className="success-icon">✅</div>
              <h3 className="success-title">Appointment Confirmed!</h3>
              <p className="success-sub">Your appointment with <strong>{doctor.name}</strong> has been booked.</p>
              <div className="success-details">
                <div className="summary-row"><span>📅 Date</span><span>{dates.find(d => d.value === selectedDate)?.label}</span></div>
                <div className="summary-row"><span>🕐 Time</span><span>{selectedSlot}</span></div>
                <div className="summary-row"><span>🏥 Hospital</span><span>{doctor.hospital}</span></div>
                <div className="summary-row"><span>📞 Contact</span><span>{doctor.displayPhone}</span></div>
                <div className="summary-row"><span>{mode === 'video' ? '📹' : '🏥'} Mode</span><span>{mode === 'video' ? 'Video Call' : 'In-person'}</span></div>
              </div>
              <p className="success-note">Please arrive 10 minutes early. For any changes, call the hospital directly.</p>
              <button className="modal-next-btn" onClick={onClose}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DoctorRecommendations() {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [specialty, setSpecialty]   = useState('All')
  const [modeFilter, setModeFilter] = useState('all')
  const [showUrgency, setShowUrgency] = useState(false)
  const [bookingDoc, setBookingDoc] = useState(null)

  const filtered = useMemo(() => {
    return DOCTORS.filter(d => {
      const matchSpec   = specialty === 'All' || d.specialty === specialty
      const matchMode   = modeFilter === 'all' || d.modes.includes(modeFilter)
      const matchSearch = !search.trim() ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase()) ||
        d.hospital.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchSpec && matchMode && matchSearch
    })
  }, [search, specialty, modeFilter])

  return (
    <div className="dr-wrap">
      <div className="dr-hero">
        <div>
          <h1 className="dr-title">Doctor Recommendations</h1>
          <p className="dr-sub">Find trusted women's health specialists near you</p>
        </div>
        <button className="urgency-toggle-btn" onClick={() => setShowUrgency(v => !v)}>
          <AlertCircle size={15} />
          When to See a Doctor
          <ChevronRight size={14} className={showUrgency ? 'chev-open' : ''} />
        </button>
      </div>

      {showUrgency && (
        <div className="urgency-panel">
          <div className="urgency-panel-header">
            <AlertCircle size={16} color="#ef4444" />
            <span>Urgency Guide</span>
            <button className="urgency-close" onClick={() => setShowUrgency(false)}><X size={15} /></button>
          </div>
          {URGENCY.map(u => (
            <div key={u.level} className="urgency-card" style={{ background: u.bg, borderColor: u.border }}>
              <p className="urgency-level" style={{ color: u.color }}>{u.label}</p>
              <ul className="urgency-list">
                {u.items.map((item, i) => (
                  <li key={i}>
                    <CheckCircle size={13} color={u.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="dr-filters">
        <div className="dr-search-wrap">
          <Search size={16} className="dr-search-icon" />
          <input className="dr-search" type="text" placeholder="Search by name, city, specialty, condition..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="dr-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <div className="filter-row">
          <div className="spec-chips">
            {SPECIALTIES.map(s => (
              <button key={s} className={`spec-chip ${specialty === s ? 'spec-chip-active' : ''}`}
                onClick={() => setSpecialty(s)}>{s}</button>
            ))}
          </div>
          <div className="mode-chips">
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
            {[['all', 'All modes'], ['video', '📹 Video'], ['in-person', '🏥 In-person']].map(([val, label]) => (
              <button key={val} className={`mode-chip ${modeFilter === val ? 'mode-chip-active' : ''}`}
                onClick={() => setModeFilter(val)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <p className="results-count">
        {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
        {specialty !== 'All' && (
          <span className="filter-tag">{specialty}
            <button onClick={() => setSpecialty('All')}><X size={11} /></button>
          </span>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="dr-empty">
          <Stethoscope size={40} color="var(--border)" />
          <p>No doctors match your search.</p>
          <button className="dr-empty-reset" onClick={() => { setSearch(''); setSpecialty('All'); setModeFilter('all') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="dr-grid">
          {filtered.map(doc => (
            <div key={doc.id} className="dr-card">
              <div className="dr-card-top">
                <div className="dr-avatar" style={{ background: `linear-gradient(135deg, ${doc.color}cc, ${doc.color})` }}>
                  {doc.initials}
                </div>
                <div className="dr-info">
                  <h3 className="dr-name">{doc.name}</h3>
                  <span className="dr-specialty">{doc.specialty}</span>
                  <div className="dr-meta-row">
                    <StarRating rating={doc.rating} />
                    <span className="dr-reviews">({doc.reviews} reviews)</span>
                    <span className="dr-exp">{doc.experience} yrs exp</span>
                  </div>
                </div>
                <span className="dr-fee">{doc.fee}</span>
              </div>
              <div className="dr-location">
                <MapPin size={13} />
                <span>{doc.hospital} · {doc.location}</span>
              </div>
              <div className="dr-tags">
                {doc.tags.map(t => <span key={t} className="dr-tag">{t}</span>)}
              </div>
              <div className="dr-avail-row">
                <span className="dr-avail"><Clock size={12} />{doc.available}</span>
                <div className="dr-modes">
                  {doc.modes.includes('video') && <span className="mode-badge video-badge"><Video size={11} /> Video</span>}
                  {doc.modes.includes('in-person') && <span className="mode-badge inperson-badge"><Stethoscope size={11} /> In-person</span>}
                </div>
              </div>
              <div className="dr-cta-row">
                <a href={`tel:${doc.phone}`} className="dr-btn-secondary" title={`Call ${doc.displayPhone}`}>
                  <Phone size={14} /> Call
                </a>
                <button className="dr-btn-primary" onClick={() => setBookingDoc(doc)}>
                  <CalendarDays size={15} /> Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dr-ai-cta">
        <div className="dr-ai-cta-text">
          <p className="dr-ai-cta-title">Not sure which specialist you need?</p>
          <p className="dr-ai-cta-sub">Ask our AI assistant — describe your symptoms and get a recommendation.</p>
        </div>
        <button className="dr-ai-cta-btn" onClick={() => navigate('/user/ai-assistant')}>
          Ask AI Assistant →
        </button>
      </div>

      {bookingDoc && <BookingModal doctor={bookingDoc} onClose={() => setBookingDoc(null)} />}
    </div>
  )
}
