<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:2c5364,100:00c6ff&height=220&section=header&text=HamRahi&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Explore%20the%20World.%20Plan%20Smarter.%20Travel%20Farther.&descAlignY=55&descSize=18" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=2500&pause=800&color=00C6FF&center=true&vCenter=true&width=700&lines=AI-Powered+Travel+Planning+Platform;3D+Globe+Explorer+%E2%80%A2+Cesium+%2B+Three.js;Gemini-Generated+Itineraries+in+Seconds;Discover.+Plan.+Remember.+Repeat." alt="Typing SVG" />

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,mongodb,threejs,js&theme=dark" />

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=3&width=100%25" width="100%"/>

</div>

<br/>

AI-powered travel planning platform for discovering destinations, generating
personalised itineraries, and tracking journeys from planning to memory.

<div align="center">

```
                      ╭──────────────────────────╮
                  ╭───┤   🌍  H A M R A H I  🌍   ├───╮
                  │   ╰──────────────────────────╯   │
              ────┼───────────────────────────────────┼────
                  │     plan → explore → remember      │
              ────┼───────────────────────────────────┼────
                  ╰───────────────────────────────────╯
```

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0f2027,100:00c6ff&height=2&width=100%25" width="100%"/>

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Technology Stack](#technology-stack)
6. [Prerequisites](#prerequisites)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [Running the Project](#running-the-project)
10. [API Overview](#api-overview)
11. [Security](#security)
12. [Folder Structure Explanation](#folder-structure-explanation)
13. [Development Workflow](#development-workflow)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)
16. [Future Improvements](#future-improvements)
17. [Contributing](#contributing)

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Project Overview

HamRahi is a full-stack travel planning application that combines an
interactive 3D globe, AI-generated itineraries, and a personal travel
dashboard into a single experience. Users can explore destinations,
generate day-by-day travel plans with AI assistance, save trips to a
wishlist, maintain a travel diary with photo uploads, and unlock
achievement badges as they travel.

The project is built as a decoupled React frontend and Express/MongoDB
backend, integrating third-party services for authentication, geocoding,
weather, imagery, and AI itinerary generation.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Features

### Discovery and Planning

- 3D Globe Explorer — Cesium-powered interactive globe with fly-to
  animations
- 2D Destination Discovery — scrollable destination cards with live
  weather data
- AI Itinerary Generator — Gemini-powered day-by-day travel plans

### Trip Management

- My Trips Dashboard — track upcoming, active, and completed trips
- Travel Diary — log memories with Cloudinary photo uploads
- Wishlist — save destinations and compute a personal Travel DNA profile

### Engagement and Identity

- Travel Passport — 23 achievement badges earned dynamically
- Profile and Settings — update name, change password, view stats

### Platform

- Dark / Light Mode — theme-adaptive UI; 3D mode forces dark theme
- Authentication — email verification and Google OAuth

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Architecture Overview

HamRahi follows a decoupled client-server architecture:

```
┌──────────────────┐        REST API         ┌──────────────────┐
│   React Frontend  │ ───────────────────────▶│  Express Backend  │
│  (Vite, Tailwind, │ ◀─────────────────────── │   (Node.js API)   │
│  Cesium, Three.js)│        JSON / cookies    └──────────────────┘
└──────────────────┘                                    │
                                                          │
              ┌───────────────────────┬───────────────────┴────────────────────┐
              ▼                       ▼                                        ▼
      ┌───────────────┐      ┌────────────────┐                    ┌─────────────────────┐
      │   MongoDB      │      │  Google Gemini │                    │  External Services   │
      │ (Mongoose ODM) │      │ (AI Itinerary) │                    │ Cloudinary, Unsplash,│
      └───────────────┘      └────────────────┘                    │ OSM Nominatim,       │
                                                                     │ Open-Meteo, Nodemailer│
                                                                     └─────────────────────┘
```

- The frontend communicates with the backend exclusively through a
  versioned REST API, authenticated using HttpOnly JWT cookies.
- The backend acts as the single integration point for all external
  services, so API keys and credentials never reach the client.
- AI itinerary generation is handled server-side: the backend builds a
  structured prompt, calls Google Gemini, and returns a normalized
  itinerary object to the frontend.
- Destination search and geocoding use OpenStreetMap Nominatim; weather
  data is sourced from Open-Meteo; destination imagery is fetched from
  Unsplash; user-uploaded photos are stored in Cloudinary.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Project Structure

```
HamRahi/
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Axios API client (api.js)
│   │   └── data/            # Static data and constants
│   └── .env                 # See frontend/.env.example
│
└── backend/                 # Express + MongoDB API
    ├── controllers/         # Request handlers / business logic
    ├── middlewares/         # Auth, error handling, validation
    ├── models/              # Mongoose schemas
    ├── routes/              # Express route definitions
    ├── services/            # External API integrations
    ├── config/              # Environment and app configuration
    └── .env                 # See backend/.env.example
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Technology Stack

### Frontend

| Technology     | Purpose                        |
|-----------------|--------------------------------|
| React 18        | UI library                     |
| Vite            | Build tool and dev server      |
| React Router v6 | Client-side routing            |
| Tailwind CSS    | Utility-first styling          |
| PrimeReact      | UI component / icon library    |
| Axios           | HTTP client                    |

### 3D and Visualization

| Technology | Purpose                          |
|-------------|-----------------------------------|
| CesiumJS    | Interactive 3D globe              |
| Three.js    | Hero section animations           |

### Backend

| Technology  | Purpose                  |
|--------------|---------------------------|
| Node.js      | Runtime environment       |
| Express 5    | HTTP server / routing     |
| Mongoose     | MongoDB ODM               |

### Database

| Technology     | Purpose             |
|-----------------|----------------------|
| MongoDB Atlas   | Primary data store   |

### Authentication

| Technology            | Purpose                          |
|-------------------------|-----------------------------------|
| JSON Web Tokens (JWT)   | Session authentication            |
| HttpOnly cookies        | Secure token storage              |
| Google OAuth            | Third-party sign-in               |
| Nodemailer              | Email verification delivery       |

### AI

| Technology     | Purpose                          |
|-----------------|-----------------------------------|
| Google Gemini   | AI-generated travel itineraries   |

### Cloud and Media Services

| Technology  | Purpose                     |
|--------------|-------------------------------|
| Cloudinary   | Photo storage and delivery    |
| Multer       | Multipart file upload handling|
| Unsplash API | Destination imagery           |

### Maps and Geodata

| Technology              | Purpose                  |
|---------------------------|-----------------------------|
| OpenStreetMap Nominatim   | Destination search / geocoding |
| Open-Meteo                | Weather data              |

### Deployment

| Component | Suggested target                          |
|------------|--------------------------------------------|
| Frontend   | Static hosting (e.g. Vercel, Netlify)       |
| Backend    | Node hosting (e.g. Render, Railway, EC2)    |
| Database   | MongoDB Atlas managed cluster               |

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Prerequisites

Before setting up HamRahi locally, ensure you have the following:

- Node.js v18 or later
- A MongoDB Atlas account and connection string
- A Cloudinary account (free tier is sufficient)
- An Unsplash API key
- A Google Gemini API key
- A Google OAuth Client ID (optional, required only for Google login)

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/vhatkarajinkya07-creator/HamRahi.git
cd HamRahi
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure the backend environment

```bash
cp .env.example .env
```

Fill in the required values as described in
[Environment Variables](#environment-variables).

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure the frontend environment

```bash
cp .env.example .env
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Environment Variables

### Backend (`backend/.env`)

| Variable                 | Required | Description                            |
|----------------------------|:----------:|------------------------------------------|
| `MONGO_URI`                | Yes      | MongoDB Atlas connection string        |
| `JWT_SECRET`                | Yes      | Secret used to sign JWTs (min 32 chars)|
| `NODE_ENV`                  | Yes      | `development` or `production`          |
| `CLIENT_URL`                | Yes      | Frontend origin, used for CORS         |
| `EMAIL_USER`                | Yes      | Gmail address for verification emails  |
| `EMAIL_PASS`                | Yes      | Gmail App Password                     |
| `UNSPLASH_ACCESS_KEY`       | Yes      | Unsplash API key                       |
| `GEMINI_API_KEY`            | Yes      | Google Gemini API key                  |
| `CLOUDINARY_CLOUD_NAME`     | Yes      | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`        | Yes      | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET`     | Yes      | Cloudinary API secret                  |
| `GOOGLE_CLIENT_ID`          | Optional | Google OAuth Client ID                 |

### Frontend (`frontend/.env`)

| Variable                    | Required | Description                                  |
|-------------------------------|:----------:|-------------------------------------------------|
| `VITE_API_URL`                | Optional | Backend API base URL (default: `/api`)         |
| `VITE_GOOGLE_CLIENT_ID`       | Optional | Google OAuth Client ID for Google login        |

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Running the Project

Start the backend server:

```bash
cd backend
node server.js
```

The API will be available at `http://localhost:5000`.

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## API Overview

Full API documentation is available in
[`backend/info.md`](./backend/info.md). The endpoints below are grouped by
module for readability.

### Authentication

| Method | Endpoint                    | Auth Required | Description        |
|---------|-------------------------------|:----------------:|-----------------------|
| GET     | `/api/auth/me`                | No              | Get current user     |
| POST    | `/api/auth/register`          | No              | Register new user    |
| POST    | `/api/auth/login`             | No              | Login                 |
| POST    | `/api/auth/logout`            | Yes             | Logout                |
| POST    | `/api/auth/google-login`      | No              | Google OAuth login   |
| PUT     | `/api/auth/profile`           | Yes             | Update name           |
| PUT     | `/api/auth/password`          | Yes             | Change password       |

### Destinations

| Method | Endpoint                        | Auth Required | Description        |
|---------|-----------------------------------|:----------------:|-----------------------|
| GET     | `/api/destination/search`         | No              | Search destinations   |
| GET     | `/api/destination/:placeId`       | No              | Destination details   |
| GET     | `/api/destination/discover`       | No              | Homepage feed          |

### Wishlist

| Method | Endpoint                    | Auth Required | Description         |
|---------|-------------------------------|:----------------:|------------------------|
| GET     | `/api/wishlist`               | Yes             | Get wishlist            |
| POST    | `/api/wishlist/:placeId`      | Yes             | Add to wishlist         |
| DELETE  | `/api/wishlist/:placeId`      | Yes             | Remove from wishlist    |

### Itinerary

| Method | Endpoint                    | Auth Required | Description             |
|---------|-------------------------------|:----------------:|----------------------------|
| POST    | `/api/itinerary/generate`     | Yes             | Generate AI itinerary      |

### Trips

| Method  | Endpoint            | Auth Required | Description         |
|----------|-----------------------|:----------------:|------------------------|
| GET      | `/api/trips`          | Yes             | Get all trips           |
| POST     | `/api/trips`          | Yes             | Save a trip              |
| PUT      | `/api/trips/:id`      | Yes             | Update trip / diary      |
| DELETE   | `/api/trips/:id`      | Yes             | Delete trip               |

### Media

| Method | Endpoint               | Auth Required | Description                  |
|---------|--------------------------|:----------------:|----------------------------------|
| POST    | `/api/upload/photo`       | Yes             | Upload photo to Cloudinary       |

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Security

HamRahi applies the following practices to protect user data and
application integrity:

- **HttpOnly JWT cookies** — authentication tokens are never exposed to
  client-side JavaScript, reducing exposure to XSS-based token theft.
- **Email verification** — new accounts must verify ownership of their
  email address before gaining full access.
- **Server-side secret management** — all third-party API keys
  (Gemini, Cloudinary, Unsplash) are held only on the backend and never
  shipped to the client bundle.
- **CORS restriction** — the API only accepts requests from the origin
  configured in `CLIENT_URL`.
- **Environment-based configuration** — secrets and environment-specific
  values are supplied through `.env` files and excluded from version
  control.
- **Google OAuth** — offers users an alternative to password-based
  authentication for supported flows.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Folder Structure Explanation

**`frontend/src/components`** — Reusable, presentation-focused UI
building blocks shared across multiple pages.

**`frontend/src/pages`** — Top-level views mapped to application routes
(e.g. Home, Trips, Profile, Diary).

**`frontend/src/context`** — React context providers, including
`AuthContext` for session state and `ThemeContext` for dark/light mode.

**`frontend/src/hooks`** — Custom hooks encapsulating reusable logic
(data fetching, device/performance detection, etc.).

**`frontend/src/services`** — Centralized Axios client (`api.js`)
responsible for all HTTP communication with the backend.

**`backend/controllers`** — Request handlers containing the core
business logic for each resource.

**`backend/middlewares`** — Cross-cutting concerns such as
authentication checks, error handling, and request validation.

**`backend/models`** — Mongoose schema definitions for MongoDB
collections.

**`backend/routes`** — Express route definitions mapping HTTP endpoints
to controllers.

**`backend/services`** — Integration modules for external APIs
(Gemini, Cloudinary, Unsplash, Nominatim, Open-Meteo).

**`backend/config`** — Application-level configuration, including
database connection setup and environment loading.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Development Workflow

### Commit Convention

Commits follow a conventional, scope-based format:

```
feat(scope): short description
fix(scope): short description
docs(scope): short description
refactor(scope): short description
```

Examples:

```
feat(itinerary): add multi-day AI itinerary generation
fix(auth): resolve JWT refresh race condition
docs(readme): update environment variable table
refactor(frontend): extract destination card component
```

### Branching

- `main` — stable, deployable state
- Feature branches should be created from `main` and merged via pull
  request once reviewed and tested.

### Code Style

- Keep controllers thin; business logic belongs in services where
  practical.
- Frontend components should stay presentation-focused, with data
  fetching handled in hooks or the API service layer.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Deployment

### Backend

1. Provision a Node.js hosting environment (e.g. Render, Railway, EC2).
2. Set all required environment variables from the
   [Environment Variables](#environment-variables) section.
3. Ensure `NODE_ENV=production` and `CLIENT_URL` points to the deployed
   frontend origin.
4. Start the server with `node server.js`, or configure your platform's
   process manager to run it.

### Frontend

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Deploy the resulting `dist/` directory to a static hosting provider
   (e.g. Vercel, Netlify).
3. Set `VITE_API_URL` to the deployed backend's public URL.

### Database

- Use a MongoDB Atlas cluster with network access restricted to the
  backend's deployment environment.
- Enable automated backups for production data.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Troubleshooting

**Backend fails to start with a MongoDB connection error**
Verify `MONGO_URI` is correct and that the connecting IP address is
allow-listed in MongoDB Atlas network access settings.

**Frontend cannot reach the backend API**
Confirm the backend is running and that `VITE_API_URL` (or the default
`/api` proxy) matches the backend's actual address and port.

**Google login does not work**
Ensure `GOOGLE_CLIENT_ID` is set identically in both the backend and
frontend environment files, and that the origin is registered in the
Google Cloud OAuth consent configuration.

**Email verification messages are not sent**
Confirm `EMAIL_USER` and `EMAIL_PASS` are set correctly and that the
Gmail account has an App Password generated (standard account passwords
will not work with Nodemailer).

**Cloudinary uploads fail**
Double-check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
`CLOUDINARY_API_SECRET` for typos, and confirm the Cloudinary account is
active.

**CORS errors in the browser console**
Ensure `CLIENT_URL` in the backend environment exactly matches the
frontend's origin, including protocol and port.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Future Improvements

- Expand automated test coverage across backend controllers and
  frontend components.
- Add caching for frequently requested destination and weather data to
  reduce external API calls.
- Introduce rate limiting on public-facing endpoints.
- Support additional OAuth providers beyond Google.
- Add offline-friendly support for the travel diary feature.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. Make your changes, following the commit convention described in
   [Development Workflow](#development-workflow).
4. Push your branch and open a pull request describing the change and
   its motivation.

Please open an issue first for significant changes so the approach can
be discussed before implementation.

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

## Credits

HamRahi integrates the following external services:

- Google Gemini — AI-powered itinerary generation
- Cloudinary — photo storage and delivery
- Unsplash — destination imagery
- OpenStreetMap Nominatim — destination search and geocoding
- Open-Meteo — weather data
- Google OAuth — third-party authentication

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00c6ff,100:0f2027&height=2&width=100%25" width="100%"/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,50:2c5364,100:0f2027&height=150&section=footer&text=Happy%20Travels&fontSize=28&fontColor=ffffff&animation=twinkling" width="100%"/>

</div>