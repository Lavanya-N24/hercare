import { useState } from 'react'
import { Flame, Footprints, Droplets, Pill, Wind, Zap, ChevronDown, X } from 'lucide-react'
import './CrampRelief.css'

const tips = [
  {
    icon: Flame,
    title: 'Heat Therapy',
    short: 'Apply warmth to ease muscle tension and improve blood flow.',
    color: '#ff6b35',
    bg: '#fff3ee',
    youtube: 'https://www.youtube.com/results?search_query=heat+therapy+for+period+cramps',
    details: [
      '🌡️ Use a heating pad set to medium heat on your lower abdomen',
      '⏱️ Apply for 15–20 minutes at a time, up to 3 times a day',
      '🛁 A warm bath or shower also works great',
      '🧴 Heat patches (like Thermacare) are discreet for on-the-go relief',
      '⚠️ Never apply heat directly to bare skin — use a cloth barrier',
    ],
    modal: {
      heading: '🔥 All About Heat Therapy',
      sections: [
        {
          title: 'How It Works',
          text: 'Heat relaxes the uterine muscles that contract during menstruation. It also boosts blood circulation to the area, reducing the intensity of cramps. Studies show heat is as effective as ibuprofen for mild to moderate cramps.',
        },
        {
          title: 'Best Methods',
          items: [
            'Electric heating pad — most controllable and consistent',
            'Warm water bottle — cheap and reusable',
            'Heat patches (Thermacare, etc.) — great for outdoors',
            'Warm bath with Epsom salts — full-body relief',
            'Microwaveable rice/wheat bag — natural option',
          ],
        },
        {
          title: 'Tips for Best Results',
          items: [
            'Apply at the first sign of cramps — don\'t wait',
            'Use for 15–20 minutes with 30-minute breaks',
            'Combine with gentle stretching for extra relief',
            'Drink warm liquids alongside for added comfort',
          ],
        },
      ],
    },
  },
  {
    icon: Footprints,
    title: 'Gentle Exercise',
    short: 'Light movement boosts endorphins and eases cramping.',
    color: '#4caf50',
    bg: '#f1f8f1',
    youtube: 'https://www.youtube.com/results?search_query=yoga+stretches+for+period+cramps',
    details: [
      '🚶 A 10–15 min brisk walk helps stimulate circulation',
      '🧘 Try child\'s pose, cat-cow, or butterfly stretch for targeted relief',
      '🚴 Light cycling or swimming is also very effective',
      '💪 Avoid intense workouts if cramping is severe',
      '🕐 Even 5 minutes of gentle stretching can reduce pain noticeably',
    ],
    modal: {
      heading: '🧘 Exercise & Movement for Cramps',
      sections: [
        {
          title: 'Why Exercise Helps',
          text: 'Exercise releases endorphins — your body\'s natural painkillers. It also increases blood flow to the pelvic region and reduces the levels of prostaglandins (hormones that cause cramping). Even light activity significantly reduces cramp intensity.',
        },
        {
          title: 'Best Exercises',
          items: [
            'Child\'s Pose — opens the lower back and hips',
            'Cat-Cow Stretch — massages the abdominal area',
            'Butterfly Pose — relieves inner thigh and pelvic tension',
            'Brisk walking — increases circulation and endorphins',
            'Light swimming — full-body relief with low impact',
          ],
        },
        {
          title: 'What to Avoid',
          items: [
            'Heavy weightlifting — increases abdominal pressure',
            'High-intensity cardio — may worsen cramps initially',
            'Inverted poses (headstands) — avoid during heavy flow days',
          ],
        },
      ],
    },
  },
  {
    icon: Droplets,
    title: 'Stay Hydrated',
    short: 'Water and herbal teas reduce bloating and muscle cramps.',
    color: '#2196f3',
    bg: '#e8f4fd',
    youtube: 'https://www.youtube.com/results?search_query=herbal+tea+for+menstrual+cramps',
    details: [
      '💧 Aim for 8–10 glasses of water daily during your period',
      '🫖 Ginger tea reduces prostaglandins that cause cramping',
      '🌿 Peppermint tea soothes the digestive system and eases bloating',
      '🍋 Warm lemon water with honey is anti-inflammatory',
      '🚫 Avoid caffeine and alcohol — they worsen dehydration and cramps',
    ],
    modal: {
      heading: '💧 Hydration & Herbal Teas',
      sections: [
        {
          title: 'Why Hydration Matters',
          text: 'Dehydration causes muscles to cramp more easily, including the uterine muscles. Staying well-hydrated also reduces bloating and water retention that often worsens during menstruation.',
        },
        {
          title: 'Best Herbal Teas for Cramps',
          items: [
            '🫖 Ginger Tea — reduces prostaglandins; brew fresh ginger for 10 mins',
            '🌿 Peppermint Tea — antispasmodic; soothes stomach cramps',
            '🌼 Chamomile Tea — anti-inflammatory and calming',
            '🌺 Raspberry Leaf Tea — tones uterine muscles',
            '🍋 Lemon Balm Tea — reduces anxiety-related cramping',
          ],
        },
        {
          title: 'What to Avoid',
          items: [
            'Coffee and energy drinks — worsen inflammation',
            'Alcohol — causes dehydration and increases pain sensitivity',
            'Sugary sodas — increase bloating and inflammation',
          ],
        },
      ],
    },
  },
  {
    icon: Pill,
    title: 'Pain Relief Medication',
    short: 'NSAIDs like ibuprofen are highly effective for cramps.',
    color: '#9c27b0',
    bg: '#f5eeff',
    youtube: 'https://www.youtube.com/results?search_query=ibuprofen+period+pain+relief+tips',
    details: [
      '💊 Ibuprofen (Advil) 400mg every 6–8 hrs works best',
      '💊 Naproxen sodium (Aleve) lasts longer — every 8–12 hrs',
      '⏰ Start taking it 1–2 days before your period for best results',
      '🍽️ Always take with food to protect your stomach',
      '⚠️ Do not exceed recommended doses — consult a doctor if unsure',
    ],
    modal: {
      heading: '💊 Medication Guide',
      sections: [
        {
          title: 'How NSAIDs Work',
          text: 'Non-steroidal anti-inflammatory drugs (NSAIDs) block the production of prostaglandins — the chemicals responsible for uterine contractions and cramps. They are most effective when taken at the first sign of cramps or even just before your period starts.',
        },
        {
          title: 'Common Options',
          items: [
            'Ibuprofen (Advil, Brufen) — 400mg every 6–8 hrs',
            'Naproxen Sodium (Aleve) — 500mg every 8–12 hrs',
            'Mefenamic Acid (Ponstan) — prescription, very effective',
            'Aspirin — mild option, less effective than ibuprofen',
            'Paracetamol — for those who can\'t take NSAIDs',
          ],
        },
        {
          title: 'Important Safety Tips',
          items: [
            'Always take with food or milk to protect your stomach',
            'Do not take on an empty stomach',
            'Don\'t exceed the maximum daily dose on the label',
            'Avoid if you have kidney, liver, or stomach ulcer issues',
            'Consult your doctor if cramps require medication every cycle',
          ],
        },
      ],
    },
  },
  {
    icon: Wind,
    title: 'Relaxation Techniques',
    short: 'Breathing and mindfulness reduce perceived pain levels.',
    color: '#e91e8c',
    bg: '#fce4f0',
    youtube: 'https://www.youtube.com/results?search_query=breathing+exercises+period+cramp+relief',
    details: [
      '🫁 Box breathing: inhale 4s → hold 4s → exhale 4s → hold 4s',
      '🧘 Progressive muscle relaxation targets tension in abdomen',
      '🎵 Calming music or nature sounds reduce stress hormones',
      '📱 Try apps like Calm or Headspace for guided meditation',
      '😴 Prioritize 7–9 hours of sleep — rest is essential for healing',
    ],
    modal: {
      heading: '🌬️ Relaxation & Mind-Body Relief',
      sections: [
        {
          title: 'How Stress Affects Cramps',
          text: 'Stress increases cortisol levels, which amplifies pain perception and worsens muscle tension. Relaxation techniques activate the parasympathetic nervous system (rest mode), reducing muscle spasms and lowering pain intensity.',
        },
        {
          title: 'Effective Techniques',
          items: [
            '🫁 Box Breathing — inhale 4s, hold 4s, exhale 4s, hold 4s',
            '💆 Progressive Muscle Relaxation — tense and release each muscle group',
            '🧘 Body Scan Meditation — focus awareness on pain area without resistance',
            '🎵 Music Therapy — 60 bpm calming music lowers heart rate',
            '🛀 Warm Bath with Lavender — combines heat + aromatherapy',
          ],
        },
        {
          title: 'Sleep Tips During Your Period',
          items: [
            'Sleep on your side in fetal position — reduces abdominal pressure',
            'Use a pillow between your knees for hip alignment',
            'Avoid screens 1 hour before bed',
            'Keep room cool (18–20°C) for better sleep quality',
          ],
        },
      ],
    },
  },
  {
    icon: Zap,
    title: 'Dietary Changes',
    short: 'Eat anti-inflammatory foods to reduce prostaglandins.',
    color: '#ff9800',
    bg: '#fff8e1',
    youtube: 'https://www.youtube.com/results?search_query=best+foods+to+eat+during+period+cramps',
    details: [
      '🍫 Dark chocolate (70%+) is rich in magnesium — a natural muscle relaxant',
      '🍌 Bananas provide potassium that reduces muscle cramps',
      '🐟 Omega-3 fatty acids in salmon reduce inflammation',
      '🥦 Leafy greens (spinach, kale) are high in calcium and magnesium',
      '🚫 Avoid salty foods, processed snacks, and red meat during your period',
    ],
    modal: {
      heading: '🥗 Diet & Nutrition for Cramps',
      sections: [
        {
          title: 'The Anti-Inflammatory Diet',
          text: 'Certain foods reduce the production of prostaglandins and inflammation in the body, directly reducing cramp intensity. Eating well in the week before your period can make a significant difference.',
        },
        {
          title: 'Best Foods to Eat',
          items: [
            '🍫 Dark Chocolate (70%+) — high in magnesium, reduces cramps',
            '🍌 Bananas — potassium prevents muscle cramping',
            '🐟 Salmon & Fish — omega-3s reduce inflammation',
            '🥦 Broccoli & Spinach — calcium + magnesium rich',
            '🫐 Blueberries — powerful antioxidants, reduce inflammation',
            '🌰 Walnuts & Seeds — omega-3 and zinc sources',
          ],
        },
        {
          title: 'Foods to Avoid',
          items: [
            'Salty/processed foods — worsen bloating and water retention',
            'Red meat — increases prostaglandin production',
            'Dairy (in excess) — can increase inflammation for some',
            'Refined sugar and white flour — spike inflammation',
            'Alcohol and caffeine — worsen dehydration and cramps',
          ],
        },
      ],
    },
  },
]

export default function CrampRelief() {
  const [openIndex, setOpenIndex] = useState(null)
  const [modalIndex, setModalIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)
  const openModal = (e, i) => { e.stopPropagation(); setModalIndex(i) }
  const closeModal = () => setModalIndex(null)

  const activeModal = modalIndex !== null ? tips[modalIndex] : null

  return (
    <div className="cr-wrap">
      <div className="cr-header">
        <h1 className="cr-title">🌸 Cramp Relief</h1>
        <p className="cr-sub">Click any card to explore tips &amp; remedies</p>
      </div>

      {/* Warning Banner */}
      <div className="cr-alert">
        <span className="cr-alert-icon">⚠️</span>
        <span><strong>When to see a doctor:</strong> If cramps are severe, last more than 3 days, or come with heavy bleeding, fever, or unusual symptoms — consult a healthcare provider immediately.</span>
      </div>

      {/* Clickable Cards */}
      <div className="cr-cards">
        {tips.map((tip, i) => {
          const Icon = tip.icon
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className={`cr-card ${isOpen ? 'cr-card-open' : ''}`}
              style={{ '--card-color': tip.color, '--card-bg': tip.bg }}
              onClick={() => toggle(i)}
            >
              <div className="cr-card-header">
                <div className="cr-card-left">
                  <div className="cr-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="cr-card-title">{tip.title}</h3>
                    <p className="cr-card-short">{tip.short}</p>
                  </div>
                </div>
                <div className={`cr-chevron ${isOpen ? 'cr-chevron-open' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </div>

              {isOpen && (
                <div className="cr-card-body" onClick={(e) => e.stopPropagation()}>
                  <ul className="cr-details-list">
                    {tip.details.map((d, j) => (
                      <li key={j} className="cr-detail-item">{d}</li>
                    ))}
                  </ul>
                  <div className="cr-card-actions">
                    <button
                      className="cr-learn-more"
                      onClick={(e) => openModal(e, i)}
                    >
                      📖 Learn More
                    </button>
                    <a
                      href={tip.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cr-yt-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Doctor CTA */}
      <div className="cr-doctor-cta">
        <p>Still experiencing severe cramps?</p>
        <a href="/user/doctor-recommendations" className="cr-cta-btn">
          👩‍⚕️ See Doctor Recommendations →
        </a>
      </div>

      {/* ── In-App Modal ── */}
      {activeModal && (
        <>
          <div className="cr-modal-backdrop" onClick={closeModal} />
          <div className="cr-modal" style={{ '--card-color': activeModal.color, '--card-bg': activeModal.bg }}>
            {/* Modal Header */}
            <div className="cr-modal-header">
              <h2 className="cr-modal-title">{activeModal.modal.heading}</h2>
              <button className="cr-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="cr-modal-body">
              {activeModal.modal.sections.map((sec, si) => (
                <div key={si} className="cr-modal-section">
                  <h3 className="cr-modal-section-title">{sec.title}</h3>
                  {sec.text && <p className="cr-modal-text">{sec.text}</p>}
                  {sec.items && (
                    <ul className="cr-modal-list">
                      {sec.items.map((item, ii) => (
                        <li key={ii} className="cr-modal-item">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="cr-modal-footer">
              <a
                href={activeModal.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="cr-modal-yt-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Watch on YouTube
              </a>
              <button className="cr-modal-done" onClick={closeModal}>
                ✓ Got it!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
