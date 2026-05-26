# 🌸 HerCare — Women's Health & Sanitary Napkin Vending App

> A smart, compassionate women's health platform built with React + Vite, designed to work alongside IoT-enabled sanitary napkin vending machines.

---

## 📱 Screenshots

| Dashboard | AI Assistant | Doctor Recommendations |
|-----------|-------------|----------------------|
| Mood tracker, quick actions, wellness tips | Groq-powered multilingual AI | 22 doctors, booking modal |

---

## ✨ Features

### 👤 User App
| Feature | Description |
|---|---|
| 🗺️ **Find Machine** | Locate nearest sanitary napkin vending machine |
| 📷 **QR Scanner** | Scan QR code on machine for instant dispense |
| 🗓️ **Period Tracker** | Log & track your menstrual cycle |
| ⚡ **Cramp Relief** | Guided relief tips, remedies & exercises |
| 📰 **Health Articles** | Curated women's wellness articles |
| 🤖 **AI Assistant** | Ask any health question — powered by Groq AI |
| 👩‍⚕️ **Doctor Recommendations** | Find & book women's health specialists |
| 😊 **Mood Tracker** | Daily mood check-in on dashboard |

### 🤖 AI Assistant
- Powered by **Groq API** (`llama-3.3-70b-versatile` model)
- Answers **any question** — not just predefined topics
- **12 language support**: English, Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, Urdu, Arabic, French, Spanish
- Multi-turn conversation with full context memory
- Responds in the language you select

### 👩‍⚕️ Doctor Recommendations
- **22 doctors** across 11 cities in India
- 8 doctors in **Bengaluru** alone (Fortis, Manipal, Nova IVF, Narayana, Cloudnine, St. Johns, Apollo, Sakra)
- Search by name, city, specialty, or condition
- Filter by specialty & consultation mode (Video / In-person)
- **Working Call button** — dials doctor directly (`tel:` link)
- **3-step Booking Modal** — date picker → patient details → confirmation

### 🔐 Admin App
| Feature | Description |
|---|---|
| 📊 **Dashboard** | Overview of all machines and activity |
| 🏭 **Machine Management** | Add, edit, monitor vending machines |
| 📦 **Stock Management** | Track napkin inventory levels |
| 📋 **Dispense History** | Full log of dispense transactions |
| 🔔 **Alerts** | Low-stock and machine fault alerts |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6 |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Auth & DB** | Firebase (Auth + Firestore) |
| **AI** | Groq API — llama-3.3-70b-versatile |
| **Maps** | Leaflet + React Leaflet |
| **Mobile** | Capacitor (Android) |
| **Styling** | Vanilla CSS with CSS variables |
| **Date Utils** | date-fns |
| **Location Data** | country-state-city |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A free [Groq API key](https://console.groq.com) for the AI assistant

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hercare

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the `hercare/` directory:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Firebase Setup

Update `src/firebase.js` with your Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
}
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
hercare/
├── public/
├── src/
│   ├── components/          # Shared components
│   │   └── GoogleSignInModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Firebase auth context
│   ├── layouts/
│   │   ├── UserLayout.jsx   # User sidebar + nav
│   │   └── AdminLayout.jsx  # Admin sidebar + nav
│   ├── pages/
│   │   ├── Landing.jsx      # Landing / home page
│   │   ├── ProfileSettings.jsx
│   │   ├── user/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── NapkinRequest.jsx      # Find machine / map
│   │   │   ├── QRScanner.jsx
│   │   │   ├── PeriodTracker.jsx
│   │   │   ├── CrampRelief.jsx
│   │   │   ├── HealthArticles.jsx
│   │   │   ├── AIHealthAssistant.jsx  # Groq AI chat
│   │   │   └── DoctorRecommendations.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── MachineManagement.jsx
│   │       ├── StockManagement.jsx
│   │       ├── DispenseHistory.jsx
│   │       └── Alerts.jsx
│   ├── styles/
│   ├── firebase.js
│   ├── App.jsx              # Routes
│   └── main.jsx
├── android/                 # Capacitor Android project
├── .env                     # 🔒 Not committed — add your keys here
├── .gitignore
├── capacitor.config.json
├── vite.config.js
└── package.json
```

---

## 🔑 User Roles

| Role | Access |
|---|---|
| **User** | Dashboard, napkin request, QR scan, period tracker, cramp relief, health articles, AI assistant, doctor recommendations |
| **Admin** | Machine management, stock control, dispense history, alerts |

---

## 🌐 Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/user/login` | User login |
| `/user/register` | User registration |
| `/user` | User dashboard |
| `/user/napkin` | Find machine |
| `/user/scan` | QR scanner |
| `/user/period-tracker` | Period tracker |
| `/user/cramp-relief` | Cramp relief |
| `/user/health-articles` | Health articles |
| `/user/ai-assistant` | AI assistant |
| `/user/doctor-recommendations` | Doctor recommendations |
| `/admin` | Admin dashboard |
| `/admin/machines` | Machine management |
| `/admin/stock` | Stock management |
| `/admin/dispenses` | Dispense history |
| `/admin/alerts` | Alerts |

---

## 📱 Android Build (Capacitor)

```bash
# Build web app
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify and distribute.

---

## 💜 Made with love for women's health

> *"She is clothed with strength and dignity, and she laughs without fear of the future."* — Proverbs 31:25
