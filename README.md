# HamRahi 🌍

> **AI-powered travel planning platform** — discover destinations, generate personalised itineraries, build your travel passport, and log memories from your journeys.

---

## ✨ Features

- 🌐 **3D Globe Explorer** — Cesium-powered interactive globe with fly-to animations
- 🗺️ **2D Destination Discovery** — Scrollable destination cards with live weather
- 🤖 **AI Itinerary Generator** — Gemini-powered day-by-day travel plans
- 📋 **My Trips Dashboard** — Track upcoming, active & completed trips
- 📓 **Travel Diary** — Log memories with Cloudinary photo uploads
- ❤️ **Wishlist** — Save destinations and compute your Travel DNA
- 🏅 **Travel Passport** — 23 achievement badges earned dynamically
- 👤 **Profile & Settings** — Update name, change password, view stats
- 🌙 **Dark / Light Mode** — Theme-adaptive UI; 3D mode forces dark
- 🔐 **Auth** — Email verification + Google OAuth

---

## 🗂️ Project Structure

```
HamRahi/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/   # AuthContext, ThemeContext
│   │   ├── hooks/
│   │   ├── services/  # axios api.js
│   │   └── data/
│   └── .env           # see frontend/.env.example
│
└── backend/           # Express + MongoDB API
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    ├── config/
    └── .env           # see backend/.env.example
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (free tier)
- Unsplash API key
- Google Gemini API key
- Google OAuth Client ID (optional, for Google login)

---

### 1. Clone the repository

```bash
git clone https://github.com/vhatkarajinkya07-creator/HamRahi.git
cd HamRahi
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Start the backend server:

```bash
node server.js
```

Server runs on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Copy the example env file:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (min 32 chars) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS |
| `EMAIL_USER` | ✅ | Gmail address for verification emails |
| `EMAIL_PASS` | ✅ | Gmail App Password |
| `UNSPLASH_ACCESS_KEY` | ✅ | Unsplash API key |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | ⚙️ | Google OAuth Client ID (optional) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ⚙️ | Backend API base URL (default: `/api`) |
| `VITE_GOOGLE_CLIENT_ID` | ⚙️ | Google OAuth Client ID for Google login |

---

## 📡 API Reference

Full API documentation is in [`backend/info.md`](./backend/info.md).

### Quick overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/auth/me` | — | Get current user |
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| POST | `/api/auth/google-login` | — | Google OAuth |
| PUT | `/api/auth/profile` | ✅ | Update name |
| PUT | `/api/auth/password` | ✅ | Change password |
| GET | `/api/destination/search` | — | Search destinations |
| GET | `/api/destination/:placeId` | — | Destination details |
| GET | `/api/destination/discover` | — | Homepage feed |
| GET | `/api/wishlist` | ✅ | Get wishlist |
| POST | `/api/wishlist/:placeId` | ✅ | Add to wishlist |
| DELETE | `/api/wishlist/:placeId` | ✅ | Remove from wishlist |
| POST | `/api/itinerary/generate` | ✅ | Generate AI itinerary |
| GET | `/api/trips` | ✅ | Get all trips |
| POST | `/api/trips` | ✅ | Save a trip |
| PUT | `/api/trips/:id` | ✅ | Update trip / diary |
| DELETE | `/api/trips/:id` | ✅ | Delete trip |
| POST | `/api/upload/photo` | ✅ | Upload photo to Cloudinary |

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Tailwind CSS + PrimeReact
- CesiumJS (3D Globe)
- Three.js (Hero animations)
- Axios

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (HttpOnly cookies)
- Nodemailer (email verification)
- Cloudinary + Multer (photo uploads)
- Google Gemini (AI itineraries)
- Unsplash (destination images)
- OpenStreetMap Nominatim (destination search)
- Open-Meteo (weather data)

---

## 📝 Git Commit Convention

```
feat(scope): short description
fix(scope): short description
docs(scope): short description
refactor(scope): short description
```

---

## 📄 License

MIT
