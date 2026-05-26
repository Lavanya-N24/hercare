import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, RefreshCw, AlertCircle, Sparkles, Globe } from 'lucide-react'
import './AIHealthAssistant.css'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'   // Updated — llama3-70b-8192 was decommissioned

const LANGUAGES = [
  { code: 'en',    name: 'English',    native: 'English',    flag: '🇬🇧' },
  { code: 'ta',    name: 'Tamil',      native: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'hi',    name: 'Hindi',      native: 'हिंदी',        flag: '🇮🇳' },
  { code: 'te',    name: 'Telugu',     native: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'ml',    name: 'Malayalam',  native: 'മലയാളം',     flag: '🇮🇳' },
  { code: 'kn',    name: 'Kannada',    native: 'ಕನ್ನಡ',       flag: '🇮🇳' },
  { code: 'bn',    name: 'Bengali',    native: 'বাংলা',        flag: '🇮🇳' },
  { code: 'mr',    name: 'Marathi',    native: 'मराठी',        flag: '🇮🇳' },
  { code: 'ur',    name: 'Urdu',       native: 'اردو',         flag: '🇵🇰' },
  { code: 'ar',    name: 'Arabic',     native: 'العربية',       flag: '🇸🇦' },
  { code: 'fr',    name: 'French',     native: 'Français',    flag: '🇫🇷' },
  { code: 'es',    name: 'Spanish',    native: 'Español',     flag: '🇪🇸' },
]

const QUICK_PROMPTS_BY_LANG = {
  en: ['How can I relieve cramps fast?', 'Signs of PCOS?', 'Why is my period irregular?', 'Best foods during period?', 'When to see a doctor?'],
  ta: ['மாதவிடாய் வலியை எப்படி குறைப்பது?', 'PCOS அறிகுறிகள் என்ன?', 'ஏன் மாதவிடாய் ஒழுங்கற்றதாக உள்ளது?', 'மாதவிடாயின் போது சாப்பிட வேண்டியவை?', 'மருத்துவரை எப்போது பார்க்க வேண்டும்?'],
  hi: ['पीरियड दर्द जल्दी कैसे कम करें?', 'PCOS के लक्षण क्या हैं?', 'पीरियड अनियमित क्यों है?', 'पीरियड में क्या खाएं?', 'डॉक्टर को कब दिखाएं?'],
  te: ['నొప్పి తగ్గించడం ఎలా?', 'PCOS లక్షణాలు ఏమిటి?', 'పీరియడ్ అనియమితంగా ఎందుకు?', 'పీరియడ్‌లో ఏం తినాలి?', 'డాక్టర్‌ను ఎప్పుడు చూపించాలి?'],
  ml: ['ആർത്തവ വേദന കുറയ്ക്കാൻ?', 'PCOS ലക്ഷണങ്ങൾ?', 'ആർത്തവം ക്രമക്കേടായിരിക്കുന്നത് എന്തുകൊണ്ട്?', 'ആർത്തവ സമയത്ത് ഭക്ഷണം?', 'ഡോക്ടർ എപ്പോൾ?'],
  kn: ['ನೋವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುವುದು?', 'PCOS ಲಕ್ಷಣಗಳು?', 'ಋತುಚಕ್ರ ಅನಿಯಮಿತ ಏಕೆ?', 'ಋತುಸ್ರಾವದಲ್ಲಿ ಏನು ತಿನ್ನಬೇಕು?', 'ವೈದ್ಯರನ್ನು ಯಾವಾಗ ನೋಡಬೇಕು?'],
  bn: ['ব্যথা কমানোর উপায়?', 'PCOS এর লক্ষণ?', 'পিরিয়ড অনিয়মিত কেন?', 'পিরিয়ডে কী খাবেন?', 'কখন ডাক্তার দেখাবেন?'],
  mr: ['वेदना कशी कमी करावी?', 'PCOS ची लक्षणे?', 'मासिक पाळी अनियमित का?', 'मासिक पाळीत काय खावे?', 'डॉक्टरकडे कधी जावे?'],
  ur: ['درد کیسے کم کریں؟', 'PCOS کی علامات؟', 'ماہواری بے قاعدہ کیوں؟', 'ماہواری میں کیا کھائیں؟', 'ڈاکٹر کب دکھائیں؟'],
  ar: ['كيف أخفف آلام الدورة؟', 'أعراض PCOS؟', 'لماذا دورتي غير منتظمة؟', 'ماذا آكل أثناء الدورة؟', 'متى أزور الطبيب؟'],
  fr: ['Comment soulager les crampes?', 'Signes de SOPK?', 'Pourquoi mes règles sont irrégulières?', 'Que manger pendant les règles?', 'Quand consulter un médecin?'],
  es: ['¿Cómo aliviar calambres?', '¿Síntomas del SOP?', '¿Por qué mi período es irregular?', '¿Qué comer durante el período?', '¿Cuándo ver al médico?'],
}

const DEFAULT_MSG_BY_LANG = {
  en: `Hello! 👋 I'm your **HerCare AI Assistant**, powered by advanced AI.\n\nI can help you with **anything** — just ask!\n\n🩸 **Period & Cycle Health** — cramps, heavy bleeding, irregular periods\n🩺 **Conditions** — PCOS, endometriosis, fibroids, UTIs\n🧠 **Mental Health** — PMS, PMDD, stress, anxiety\n🥗 **Nutrition & Wellness** — diet tips, supplements, lifestyle\n💊 **Medications & Remedies** — what to take, how to use\n❓ **Any other question** — I'm here to help!\n\nType anything below and I'll do my best to help you. 💜`,
  ta: `வணக்கம்! 👋 நான் உங்கள் **HerCare AI உதவியாளர்**.\n\nயாரையும் கேளுங்கள் — நான் உதவுவேன்!\n\n🩸 **மாதவிடாய் ஆரோக்கியம்** — வலி, அதிக இரத்தப்போக்கு\n🩺 **நோய்கள்** — PCOS, எண்டோமெட்ரியோசிஸ்\n🧠 **மன ஆரோக்கியம்** — PMS, PMDD, மன அழுத்தம்\n🥗 **ஊட்டச்சத்து** — உணவு, சப்ளிமெண்ட்கள்\n\nகீழே தட்டச்சு செய்யுங்கள் 💜`,
  hi: `नमस्ते! 👋 मैं आपका **HerCare AI सहायक** हूं।\n\nकुछ भी पूछें — मैं मदद करूंगी!\n\n🩸 **माहवारी स्वास्थ्य** — दर्द, अनियमित पीरियड\n🩺 **बीमारियाँ** — PCOS, एंडोमेट्रियोसिस\n🧠 **मानसिक स्वास्थ्य** — PMS, तनाव\n🥗 **पोषण** — खान-पान, सप्लीमेंट्स\n\nनीचे लिखें 💜`,
  ar: `مرحباً! 👋 أنا مساعدك **HerCare AI**.\n\nاسأليني أي شيء — أنا هنا للمساعدة!\n\n🩸 **صحة الدورة الشهرية**\n🩺 **الأمراض** — PCOS, بطانة الرحم\n🧠 **الصحة النفسية** — متلازمة ما قبل الحيض\n🥗 **التغذية والعافية**\n\nاكتبي أي شيء أدناه 💜`,
}

function getDefaultMsg(lang) {
  return DEFAULT_MSG_BY_LANG[lang] || DEFAULT_MSG_BY_LANG['en']
}

function buildSystemPrompt(lang) {
  const langObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  return `You are HerCare AI — a compassionate, knowledgeable women's health assistant built into the HerCare app (a sanitary napkin vending machine platform).

CRITICAL LANGUAGE INSTRUCTION: You MUST respond ONLY in ${langObj.name} (${langObj.native}). Even if the user writes in another language, always reply in ${langObj.name}. This is mandatory.

Your role:
- Answer ANY health question with warmth, accuracy, and clarity
- Specialise in women's health: menstrual health, PCOS, endometriosis, pregnancy, menopause, reproductive health, nutrition, mental health, general wellness
- For non-health topics, still be helpful and friendly
- Always be empathetic and non-judgmental
- Use simple language — avoid heavy medical jargon
- Format responses clearly using bullet points, bold headers, and structured sections when appropriate
- Always add a brief disclaimer when giving medical advice reminding users to consult a healthcare provider
- Never refuse to answer a question — always try to be helpful

Response style:
- Conversational yet informative
- Use markdown formatting (**, bullet points, etc.)
- Keep responses concise but complete (100–350 words typically)
- If a question is urgent/emergency, clearly say so and direct to emergency services`
}

function formatResponse(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**'))
      return <p key={i} className="ai-line bold-line">{line.replace(/\*\*/g, '')}</p>
    if (line.startsWith('• ') || line.startsWith('- '))
      return <p key={i} className="ai-line bullet-line"><span className="bullet">•</span>{line.slice(2)}</p>
    if (line.startsWith('⚠️'))
      return <p key={i} className="ai-line warn-line">{line}</p>
    if (/^[🩸🩺🧠🥗💊❓💜✅⚡🔹🔸👉📌🌿]/.test(line))
      return <p key={i} className="ai-line bullet-line">{line}</p>
    if (line.trim() === '') return <div key={i} className="ai-line-gap" />
    if (/^\d+\./.test(line))
      return <p key={i} className="ai-line bullet-line">
        <span className="bullet num">{line.match(/^\d+\./)[0]}</span>{line.replace(/^\d+\./, '')}
      </p>
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="ai-line">
        {parts.map((p, j) =>
          p.startsWith('**') ? <strong key={j}>{p.replace(/\*\*/g, '')}</strong> : p
        )}
      </p>
    )
  })
}

export default function AIHealthAssistant() {
  const [lang, setLang]           = useState('en')
  const [messages, setMessages]   = useState([{ role: 'ai', text: getDefaultMsg('en') }])
  const [input, setInput]         = useState('')
  const [typing, setTyping]       = useState(false)
  const [apiKey]                  = useState(() =>
    import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || ''
  )
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [error, setError]         = useState('')
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const historyRef = useRef([])
  const langMenuRef = useRef(null)


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Close lang menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target))
        setShowLangMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLang = (code) => {
    setLang(code)
    setShowLangMenu(false)
    setMessages([{ role: 'ai', text: getDefaultMsg(code) }])
    historyRef.current = []
    inputRef.current?.focus()
  }

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q) return
    if (!apiKey) return

    setError('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTyping(true)

    historyRef.current = [...historyRef.current, { role: 'user', content: q }].slice(-20)

    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: buildSystemPrompt(lang) },
            ...historyRef.current,
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 401) throw new Error('Invalid API key. Please check your Groq API key.')
        if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.')
        throw new Error(err?.error?.message || `API error: ${res.status}`)
      }

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }].slice(-20)
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch (err) {
      const errMsg = err.message || 'Something went wrong. Please try again.'
      setError(errMsg)
      setMessages(m => [...m, { role: 'ai', text: `⚠️ **Error:** ${errMsg}`, isError: true }])
    } finally {
      setTyping(false)
    }
  }

  const handleSubmit = (e) => { e.preventDefault(); send() }

  const reset = () => {
    setMessages([{ role: 'ai', text: getDefaultMsg(lang) }])
    setInput('')
    setTyping(false)
    setError('')
    historyRef.current = []
    inputRef.current?.focus()
  }

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const quickPrompts = QUICK_PROMPTS_BY_LANG[lang] || QUICK_PROMPTS_BY_LANG['en']

  return (
    <div className="ai-wrap">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-avatar">
            <Bot size={20} color="white" />
          </div>
          <div>
            <h1 className="ai-title">HerCare AI Assistant</h1>
          </div>
        </div>
        <div className="ai-header-actions">
          {/* Language selector */}
          <div className="lang-selector-wrap" ref={langMenuRef}>
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(v => !v)}
              title="Change language"
            >
              <Globe size={14} />
              <span className="lang-flag">{currentLang.flag}</span>
              <span className="lang-name-short">{currentLang.native}</span>
            </button>
            {showLangMenu && (
              <div className="lang-menu">
                <div className="lang-menu-header">
                  <Globe size={13} /> Choose Language
                </div>
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option ${l.code === lang ? 'lang-option-active' : ''}`}
                    onClick={() => switchLang(l.code)}
                  >
                    <span className="lang-opt-flag">{l.flag}</span>
                    <span className="lang-opt-native">{l.native}</span>
                    <span className="lang-opt-en">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="ai-reset-btn" onClick={reset} title="Reset conversation">
            <RefreshCw size={15} />
            New chat
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="ai-disclaimer">
        <AlertCircle size={13} />
        For informational purposes only. Not a substitute for professional medical advice.
      </div>

      {/* Chat area */}
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.role === 'user' ? 'msg-user-row' : 'msg-ai-row'}`}>
            {m.role === 'ai' && (
              <div className="msg-avatar bot-av">
                <Bot size={14} color="white" />
              </div>
            )}
            <div className={`msg-bubble ${m.role === 'user' ? 'bubble-user' : m.isError ? 'bubble-error' : 'bubble-ai'}`}>
              {m.role === 'ai' ? formatResponse(m.text) : <p>{m.text}</p>}
            </div>
            {m.role === 'user' && (
              <div className="msg-avatar user-av">
                <User size={14} color="white" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="msg-row msg-ai-row">
            <div className="msg-avatar bot-av"><Bot size={14} color="white" /></div>
            <div className="msg-bubble bubble-ai typing-bubble">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="quick-prompts">
        {quickPrompts.map((q) => (
          <button key={q} className="quick-chip" onClick={() => send(q)} disabled={typing}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder={`Ask anything in ${currentLang.native}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={typing}
          autoComplete="off"
        />
        <button
          className="send-btn"
          type="submit"
          disabled={!input.trim() || typing}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}
