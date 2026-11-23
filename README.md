# Aditi & Nitin – Royal Indian Wedding Invitation Website

A luxury, production-grade, bilingual digital wedding invitation web application crafted for **Aditi & Nitin**. Built with modern software architecture, traditional Indian palace aesthetics, interactive WhatsApp integrations, automated Cloud API reminders, and an administrative control portal.

---

## 🌟 Visual Identity & Design System
- **Colors**:
  - Royal Maroon (`#581C2B`)
  - Burgundy (`#800020`)
  - Antique Gold (`#D4AF37`)
  - Champagne (`#F5E6CC`)
  - Ivory (`#FFF9F0`)
  - Deep Brown (`#38251F`)
- **Typography**:
  - Headings: *Playfair Display*
  - Elegant Accents & Quotes: *Cormorant Garamond*
  - Body Text: *Poppins*
  - Sanskrit & Devanagari Hindi: *Rozha One* & *Noto Serif Devanagari*
- **Ornaments**:
  - Sacred Lord Ganesha Invocation
  - Intricate Mandala Backgrounds
  - Traditional Kalash & Swastik Motifs
  - Royal Gold Borders & Glassmorphic Cards

---

## 🏛️ Wedding Information
- **Bride**: Aditi (Mother: Smt. Meera Devi, Father: Shri KBL Srivastava)
- **Groom**: Nitin (Mother: Smt. Suman, Father: Shri Lalit Mohan Joshi)
- **Location**: 002E Bank Colony, Padari Bazaar, Gorakhpur, Uttar Pradesh, 273014, India
- **Timezone**: Asia/Kolkata (`+05:30`)

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Hook Form, Zod, QR Code React, Canvas Confetti.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM, Helmet, CORS, Cookie-Parser, Rate Limiting, Morgan, Axios.
- **Database**: MongoDB Atlas.
- **Testing**: Vitest, Supertest, React Testing Library.
- **Storage & Cloud**: Meta WhatsApp Business Cloud API, Vercel, Render.

---

## 📂 Monorepo Architecture
```
wedding-website/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── images/
│   │   └── music/
│   └── src/
│       ├── components/
│       │   ├── common/       # Navbar, ShareModal, FloatingWhatsApp, Ornaments
│       │   └── ui/
│       ├── config/           # wedding.config.ts (Single source of truth)
│       ├── context/          # LanguageContext, AudioContext
│       ├── data/             # translations.ts (English & Hindi)
│       ├── pages/            # HomePage, AdminLogin, AdminDashboard
│       ├── sections/         # WelcomeModal, Hero, Invitation, Couple, Countdown, Events, Gallery, Family, Venue, RSVP, Footer
│       ├── services/         # api.ts (REST client with resilient fallbacks)
│       ├── types/            # wedding.ts
│       ├── utils/            # countdown.ts, whatsapp.ts
│       └── test/             # Vitest test suite
│
├── backend/
│   └── src/
│       ├── config/           # env.ts, db.ts
│       ├── controllers/      # auth, wedding, rsvp, admin, webhook
│       ├── middleware/       # auth, rateLimiter, errorHandler
│       ├── models/           # Admin, Wedding, Event, Guest, Gallery, WhatsAppMessage
│       ├── routes/           # auth, wedding, rsvp, admin, webhook
│       ├── services/         # whatsappService.ts (Meta Cloud API)
│       ├── validators/       # schemas.ts (Zod)
│       └── server.ts         # Express bootstrap & auto-seeder
│
├── docs/
│   ├── ARCHITECTURE.md       # Technical blueprints
│   ├── DEPLOYMENT.md         # Vercel, Render, MongoDB Atlas deployment
│   ├── WHATSAPP_SETUP.md     # WhatsApp Cloud API & Template instructions
│   └── API_DOCUMENTATION.md  # Complete REST API reference
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "Di Wedding"

# Install frontend & backend dependencies
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```
Default local settings work out of the box with resilient fallbacks.

### 3. Run Development Servers
Open two terminal tabs:
```bash
# Terminal 1: Run Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Run Frontend UI (Port 5173)
npm run dev:frontend
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing
Run automated unit and integration tests across both frontend and backend:
```bash
# Run Frontend Tests (Countdown, WhatsApp links, Translations)
npm run test:frontend

# Run Backend Tests (RSVP validation, Webhook verification, Healthcheck)
npm run test:backend
```

---

## 🔐 Admin Portal Credentials
- **URL**: `http://localhost:5173/admin/login`
- **Default Email**: `admin@aditinitinwedding.com`
- **Default Password**: `ChangeMe@Wedding2026!`
*(Credentials auto-seed upon server start and can be configured in `.env`)*

---

## 📱 WhatsApp Integration Capabilities
1. **Floating WhatsApp Chat**: Pre-filled inquiry chat with the host family.
2. **Share Invitation**: Click-to-Chat & Native Web Share with festive invitation text & website link.
3. **WhatsApp RSVP**: Direct messaging shortcut pre-filling guest name, attendance status, attendee count, and ceremonies.
4. **Venue Sharing**: Instant WhatsApp sharing of venue address and Google Maps GPS navigation links.
5. **Automated Reminders**: Official WhatsApp Business Cloud API template dispatcher with delivery receipts tracking via webhooks.

---

## 🌐 Bilingual Support (English & Hindi)
Switch between **English** and **हिन्दी** with one click in the top navigation bar. Every section, from the sacred Vedic shlokas to the RSVP form and celebration details, renders natively in both languages with persistent preference storage in `localStorage`.
