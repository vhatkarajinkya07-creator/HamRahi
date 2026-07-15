# HamRahi — Backend API Documentation

> Full reference for all backend REST APIs. All authenticated endpoints require a valid JWT stored in an HttpOnly cookie. Use `withCredentials: true` on every axios request.

---

## Axios Setup (Frontend)

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export default api;
```

---

## Base URL

```
http://localhost:5000/api
```

---

## Table of Contents

1. [Auth APIs](#auth-apis)
2. [Destination APIs](#destination-apis)
3. [Wishlist APIs](#wishlist-apis)
4. [AI Itinerary API](#ai-itinerary-api)
5. [Trip (Dashboard) APIs](#trip-dashboard-apis)
6. [Upload API](#upload-api)
7. [Frontend Flow Diagrams](#frontend-flow-diagrams)
8. [Environment Variables](#environment-variables)

---

## Auth APIs

### GET `/api/auth/me`

Returns the currently logged-in user. Call once on app load.

**Response 200**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isVerified": true,
  "provider": "local"
}
```

**Response 401**
```json
{ "message": "Unauthorized" }
```

---

### POST `/api/auth/register`

Registers a new user and sends a verification email.

**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 201**
```json
{
  "message": "Verification email sent",
  "registrationSession": "<session_token>"
}
```

Store `registrationSession` in React state/context only. Navigate to email verification waiting page.

---

### POST `/api/auth/verify-email/:token`

Called when the user clicks the link in their email. Token comes from the URL param.

**Response 200**
```json
{ "message": "Email verified successfully" }
```

---

### GET `/api/auth/verification-status?registrationSession=<token>`

Poll every 3 seconds while user is on the verification waiting page.

**Response**
```json
{ "isVerified": false }
```
When `isVerified` becomes `true`, stop polling and call `finalize-registration`.

---

### POST `/api/auth/finalise-registration`

Call immediately after verification status becomes `true`.

**Request**
```json
{ "registrationSession": "<session_token>" }
```

**Response 200**
```json
{ "message": "Registration completed" }
```
Clears `registrationSession` from state. JWT cookie is set. Redirect to Home.

---

### POST `/api/auth/login`

**Request**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 200**
```json
{ "message": "Login successful" }
```
JWT HttpOnly cookie is set automatically.

---

### POST `/api/auth/logout`

**Response 200**
```json
{ "message": "Logged out successfully" }
```
Clears JWT cookie. Redirect to Login.

---

### POST `/api/auth/google-login`

**Request**
```json
{ "credential": "<google_id_token>" }
```

**Response 200**
```json
{ "message": "google login done" }
```
Backend verifies token, creates/links user, sets JWT cookie. No token stored on frontend.

---

### PUT `/api/auth/profile` *(requires auth)*

Update display name.

**Request**
```json
{ "name": "New Name", "email": "same@email.com" }
```

**Response 200**
```json
{
  "message": "Profile updated successfully",
  "user": { "_id": "...", "name": "New Name", "email": "..." }
}
```

---

### PUT `/api/auth/password` *(requires auth)*

Change password.

**Request**
```json
{
  "oldPassword": "current123",
  "newPassword": "newSecure456"
}
```

**Response 200**
```json
{ "message": "Password changed successfully" }
```

---

## Destination APIs

### GET `/api/destination/search?q=<query>`

Search destinations. Returns up to 10 results.

**Example:** `GET /api/destination/search?q=tokyo`

**Response 200**
```json
[
  {
    "placeId": "R1543125",
    "title": "Tokyo",
    "subtitle": "Tokyo, Japan",
    "coordinates": { "latitude": 35.67, "longitude": 139.76 },
    "heroImage": "https://...",
    "tags": ["Cities", "Food", "Culture"]
  }
]
```

---

### GET `/api/destination/:placeId`

Full destination details. Cached in MongoDB after first fetch.

**Example:** `GET /api/destination/R1543125`

**Response 200**
```json
{
  "placeId": "R1543125",
  "basicInfo": {
    "title": "Tokyo",
    "subtitle": "Tokyo, Japan",
    "coordinates": { "latitude": 35.67, "longitude": 139.76 },
    "location": { "city": "Tokyo", "state": null, "country": "Japan", "countryCode": "JP" },
    "tagline": "Where tradition meets tomorrow.",
    "tags": ["Cities", "Food", "Shopping", "Nightlife", "Culture"]
  },
  "gallery": {
    "heroImage": { "title": "Tokyo", "description": "...", "heroImage": "https://..." },
    "images": [
      { "id": "...", "imageUrl": "...", "thumbnail": "...", "photographer": "...", "alt": "..." }
    ]
  },
  "stats": {
    "rating": 4.8,
    "reviewCount": 1240,
    "bestSeason": "Mar–May, Sep–Nov",
    "estimatedBudget": "Mid-range",
    "difficulty": "Easy"
  },
  "weather": { "temperature": 26.3, "windSpeed": 15.3, "condition": "Cloudy", "icon": "cloudy" },
  "nearby": {
    "attractions": [
      {
        "placeId": "N12345",
        "title": "Tokyo Tower",
        "coordinates": { "latitude": 35.6586, "longitude": 139.7454 },
        "metadata": { "category": "attraction", "wikipedia": "en:Tokyo Tower", "wikidata": "Q17754", "website": null }
      }
    ]
  },
  "discover": { "featured": true, "categories": ["Cities"], "priority": 10 }
}
```

---

### GET `/api/destination/discover`

Homepage swipe cards. Personalized for logged-in users, trending for guests.

**Response 200**
```json
[
  {
    "placeId": "R1543125",
    "title": "Tokyo",
    "subtitle": "Tokyo, Japan",
    "coordinates": { "latitude": 35.67, "longitude": 139.76 },
    "heroImage": { "imageUrl": "https://..." },
    "tags": ["Cities", "Food", "Culture"]
  }
]
```

---

## Wishlist APIs

All endpoints require authentication.

### POST `/api/wishlist/:placeId`
Add to wishlist.
```json
{ "message": "Added to wishlist" }
```

### DELETE `/api/wishlist/:placeId`
Remove from wishlist.
```json
{ "message": "Removed from wishlist" }
```

### GET `/api/wishlist`
Returns full destination objects for all wishlisted places.

```json
[
  {
    "placeId": "R1543125",
    "basicInfo": { "title": "Tokyo", "tags": ["Cities", "Food"] },
    "gallery": { "heroImage": { "heroImage": "https://..." } },
    "weather": { "temperature": 27, "condition": "Sunny" }
  }
]
```

---

## AI Itinerary API

Requires authentication.

### POST `/api/itinerary/generate`

**Request**
```json
{
  "placeId": "R1543125",
  "days": 5,
  "budget": "Medium",
  "travelStyle": "Friends",
  "interests": ["Food", "Shopping", "Nightlife"]
}
```

**Response 200**
```json
{
  "destination": "Tokyo",
  "tripSummary": "...",
  "estimatedBudget": "~$1,200 USD",
  "bestTimeToVisit": "March–May",
  "packingEssentials": ["Comfortable shoes", "Umbrella"],
  "localTips": ["Buy a Suica card", "Book teamLab in advance"],
  "days": [
    {
      "day": 1,
      "title": "Historic Tokyo",
      "activities": [
        { "time": "Morning", "activity": "Visit Senso-ji Temple", "description": "..." },
        { "time": "Afternoon", "activity": "Street Food at Nakamise", "description": "..." }
      ]
    }
  ]
}
```

---

## Trip (Dashboard) APIs

All endpoints require authentication. Trips represent saved itineraries with diary logs.

### GET `/api/trips`
Returns all trips for the logged-in user.

```json
[
  {
    "_id": "...",
    "placeId": "R1543125",
    "name": "Tokyo Adventure",
    "destination": "Tokyo",
    "country": "Japan",
    "heroImage": "https://...",
    "status": "upcoming",
    "startDate": "2026-09-10",
    "endDate": "2026-09-17",
    "daysCount": 7,
    "budget": "Medium",
    "travelStyle": "Friends",
    "itinerarySummary": "...",
    "diary": [],
    "createdAt": "..."
  }
]
```

**Status values:** `upcoming` | `active` | `completed`

---

### POST `/api/trips`
Create a new trip (called when saving a generated itinerary).

**Request**
```json
{
  "placeId": "R1543125",
  "name": "Tokyo Adventure",
  "startDate": "2026-09-10",
  "endDate": "2026-09-17",
  "daysCount": 7,
  "budget": "Medium",
  "travelStyle": "Friends",
  "itinerarySummary": "...",
  "packingEssentials": ["Umbrella"],
  "localTips": ["Get Suica card"],
  "days": []
}
```

**Response 201** — full trip object.

---

### PUT `/api/trips/:id`
Update a trip's status, diary, name, dates, budget, or travelStyle.

**Allowed fields:** `name` | `status` | `startDate` | `endDate` | `budget` | `travelStyle` | `itinerarySummary` | `diary`

**Request (status update)**
```json
{ "status": "active" }
```

**Request (add diary entry)**
```json
{
  "diary": [
    { "date": "2026-09-10", "text": "Visited Senso-ji!", "photo": "https://..." }
  ]
}
```

**Response 200** — updated trip object.

---

### DELETE `/api/trips/:id`
Permanently delete a trip.

**Response 200**
```json
{ "message": "Trip deleted successfully" }
```

---

## Upload API

Requires authentication. Uploads photos to Cloudinary.

### POST `/api/upload/photo`

Multipart form upload. Field name: `photo`.

**Content-Type:** `multipart/form-data`  
**Max size:** 10 MB  
**Allowed types:** jpg, jpeg, png, webp, gif

```js
const formData = new FormData();
formData.append("photo", file);
const { data } = await api.post("/upload/photo", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
// data.url → Cloudinary CDN URL
// data.publicId → Cloudinary public_id
```

**Response 200**
```json
{
  "url": "https://res.cloudinary.com/your_cloud/image/upload/...",
  "publicId": "hamrahi/diary/abc123"
}
```

Images are auto-optimized (`quality: auto:good`, max 1200×900).

---

## Frontend Flow Diagrams

### Registration
```
POST /auth/register
  → store registrationSession in state
  → navigate to /verify-email
  → poll GET /auth/verification-status every 3s
  → when isVerified = true
  → POST /auth/finalise-registration
  → JWT cookie set → navigate to /
```

### Dashboard (My Trips)
```
GET /trips → display trips by status tab
  Start Journey → PUT /trips/:id { status: "active" }
  Finish Journey → PUT /trips/:id { status: "completed" }
  Add Diary Entry → PUT /trips/:id { diary: [...] }
  Delete Trip → DELETE /trips/:id
```

### Save Itinerary
```
POST /itinerary/generate → display itinerary
  User clicks "Save to Trips"
  → POST /trips { placeId, name, startDate, endDate, ... }
  → Trip created → visible in My Trips Dashboard
```

### Photo Upload
```
User selects file from device
  → POST /upload/photo (multipart)
  → Cloudinary returns URL
  → URL stored in diary entry
```

---

## Environment Variables

See `.env.example` at project root for all required variables.

### Required for backend
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `EMAIL_USER` | Gmail address for sending verification emails |
| `EMAIL_PASS` | Gmail App Password |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key for destination images |
| `GEMINI_API_KEY` | Google Gemini API key for AI itineraries & tags |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Notes

- All authenticated endpoints expect cookies — use `withCredentials: true` on every request.
- `placeId` is the universal identifier for destinations (OSM format: `R123`, `W456`, `N789`).
- Destination details are cached in MongoDB after the first fetch — subsequent calls are fast.
- Diary entries are stored as a sub-array on the Trip document; replace the full array on each update.
- JWT is stored in an HttpOnly cookie — never accessible via JavaScript.