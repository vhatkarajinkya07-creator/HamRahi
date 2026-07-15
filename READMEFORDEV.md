# HamRahi — Developer Documentation (READMEFORDEV.md)

Welcome to the development documentation of **HamRahi**, a premium travel discovery and itinerary builder platform.

---

## 1. Project Overview & Architecture
HamRahi is composed of:
- **Frontend**: Built with React (JavaScript), styled with Tailwind CSS and PrimeReact components, animated using Framer Motion. Uses a client-side context state for auth (`AuthContext`) and theme preferences (`ThemeContext`).
- **Backend**: Express.js server providing authentication, search, destination discovery, and AI-powered itinerary generation.

---

## 2. Folder Structure
```text
HamRahi/
├── frontend/
│   ├── src/
│   │   ├── animations/     # Framer Motion entrance & hover animation curves
│   │   ├── components/     # Shared layout pieces (Navbar, Footer, Hero, Search)
│   │   ├── context/        # AuthState & ThemeState managers
│   │   ├── data/           # Offline datasets & fallback descriptions
│   │   ├── hooks/          # Global scroll, mode, and view state utilities
│   │   ├── model/          # Client settings store (Cesium/mode view options)
│   │   ├── pages/          # Full page layout views (Home, Destination, Itinerary, etc.)
│   │   ├── routes/         # Central AppRoutes registry
│   │   ├── services/       # Axios API client instance & mapper functions
│   │   ├── styles/         # global.css (Light/Dark themes & 13 category classes)
│   │   ├── App.jsx         # App bootstrapping
│   │   └── main.jsx        # App root mounting
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── controllers/        # Route controllers (Auth, Destination, Itinerary, Wishlist)
    ├── routes/             # Router endpoints mappings
    ├── models/             # Mongoose DB schema definitions
    ├── app.js              # Server configuration & middleware setup
    ├── server.js           # Server startup script
    ├── package.json
    └── info.md             # Authoritative API Guide
```

---

## 3. Setup Instructions & Environment Variables
To get the frontend and backend running locally:

### 3.1 Backend Setup
1. Go to the `backend` directory.
2. Initialize `.env` file (copy `.env.example`).
3. Set database connections and environment variables:
   ```text
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hamrahi
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   CLOUDINARY_URL=your_cloudinary_url
   ```
4. Run `npm install` followed by `npm start` (or `npx nodemon server.js`).

### 3.2 Frontend Setup
1. Go to the `frontend` directory.
2. Create/copy `.env` from `.env.example`:
   ```text
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   VITE_CESIUM_ACCESS_TOKEN=your_cesium_ion_access_token (optional)
   ```
3. Run `npm install`.
4. Launch dev server: `npm run dev -- --force`.

---

## 4. Theme System
The theme system supports both global Light/Dark states and 13 category-specific tag accents:

### 4.1 Custom CSS Variables (`global.css`)
- **Light Theme**:
  `--bg-base` (#FFFAF3), `--bg-surface` (#FFF3E6), `--bg-surface-raised` (#FFFFFF), `--text-primary` (#101A33), `--text-secondary` (#45507A), `--border-subtle` (rgba(16, 26, 51, 0.08)). Accents: Coral, Teal, Gold, Violet, Sky.
- **Dark Theme** (`.dark` selector):
  `--bg-base` (#0D0F1C), `--bg-surface` (#161A2E), `--bg-surface-raised` (#1F2438), `--text-primary` (#F5F0E6), `--text-secondary` (#9CA3C4), `--border-subtle` (rgba(255, 246, 224, 0.08)). Accents brightened by ~6-8% for better contrast.

### 4.2 Category Tag Themes (13 Classes)
Category tags affect accents, button outline active borders, and tag glows:
- Beaches (`.theme-beach`), Mountains (`.theme-mountain`), Cities (`.theme-urban`), Deserts (`.theme-desert`), Forests (`.theme-forest`), Snow (`.theme-snow`), Islands (`.theme-island`), Lakes (`.theme-lake`), Rivers (`.theme-river`), Waterfalls (`.theme-waterfall`), National Parks (`.theme-national-park`), Historical (`.theme-historical`), Religious (`.theme-religious`), Wildlife (`.theme-wildlife`).

---

## 5. Route Documentation
Every navigation link is active and properly mapped:
- `/` - **Home**: Hero 3D/Normal toggle, dynamic search, moods section, discover feed.
- `/destination/:id` - **Destination Details**: Displays stats, weather, description, nearby locations, and booking logistics.
- `/itinerary` - **AI Itinerary Planner**: Prefills and locks destination ID; generates timeline. Has a client-side print layout export.
- `/wishlist` - **Saved Wishlist Board**: Displays user's bookmarked destinations.
- `/profile` - **User Settings**: Houses account settings, theme settings, Travel DNA analytics, and badge passport.
- `/dashboard` - **My Trips**: Tabbed sections matching upcoming, active (live diary writing), and completed trips (Memory Vault and cover card exports).
- `/login` / `/register` / `/verify-email` - **Authentication pages**.

---

## 6. API Integration

### 6.1 Existing Connected Endpoints
- `GET /api/auth/me` - Verifies session status.
- `POST /api/auth/login` - Authenticates user credentials.
- `POST /api/auth/logout` - Terminates user session.
- `POST /api/auth/register` - Begins registration.
- `GET /api/auth/verification-status` - Polls registration email verification.
- `POST /api/auth/finalise-registration` - Finishes registration session.
- `POST /api/auth/google-login` - Authenticates Google OAuth credentials.
- `GET /api/destination/discover` - Populates explore boards.
- `GET /api/destination/search` - Searches locations.
- `GET /api/destination/:placeId` - Fetches destination details.
- `GET /api/wishlist` - Retrieves wishlist spots.
- `POST /api/wishlist/:placeId` - Saves destination.
- `DELETE /api/wishlist/:placeId` - Removes destination.
- `POST /api/itinerary/generate` - Invokes AI itinerary generation.

### 6.2 New Proposed Backend APIs (Specs Documented)
The following endpoints are currently mocked on the client-side pending backend models development:

1. **Trip Lifecycle Endpoint**:
   - `POST /api/trips` -> Create upcoming trip.
   - `GET /api/trips` -> Fetch list of user's active, completed, or upcoming trips.
   - `PUT /api/trips/:tripId` -> Transition trip status (`upcoming` -> `active` -> `completed`).
2. **Travel Diary Entry Endpoints**:
   - `POST /api/diary/entries` -> Create diary entry (date, text, photo URL).
   - `DELETE /api/diary/entries/:entryId` -> Delete entry.
   - `PUT /api/diary/entries/:entryId` -> Edit entry.
3. **Achievements Endpoint**:
   - `GET /api/achievements` -> Returns unlocked user badges.

---

## 7. Performance & Optimization Highlights
- **Staggered Animations**: Entrance fades use Framer Motion's parent stagger containers to orchestrate transitions. We modified clashing viewport observers to use immediate mount sequences (`animate="visible"`), which eliminates render-blocking bugs and prevents scroll lags.
- **Client-Side Exporters**: Story Cover and Map Route cards render directly onto offscreen HTML Canvas contexts and download as clean vector-aligned PNGs.
- **Zero-Dependency PDF Print**: Used CSS `@media print` directives to generate vector-text timelines directly from browsers without heavy third-party canvas converters.
