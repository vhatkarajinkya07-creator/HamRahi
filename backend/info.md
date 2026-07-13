# Authentication API Guide

# Axios Configuration

Create a single axios instance.

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export default api;
```

Always use this instance for authenticated requests.


# Important Notes

- Always use `withCredentials: true`.
- `registrationSession` should exist only until registration is completed. baad me hta dena after verification
- If registration is interrupted (refresh/close), the user can simply register again with the same email to receive a new verification email and registration session.


____________________________________________________________________________________
# Get Current User

Used to check whether the user is already authenticated (e.g. on app load or page refresh).

### GET `/api/auth/me`

No request body required.

### Success Response

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isVerified": true,
  "provider": "local"
}
```

### Unauthorized Response

```json
{
  "message": "Unauthorized"
}
```

### Frontend Usage

Call this API once when the application starts.

- **200** → User is authenticated. Save the returned user in global state/context.
- **401** → User is not authenticated. Redirect to Login if accessing protected routes.

---

# Google Authentication

Google authentication is a separate sign-in method and does **not** require email verification.

### POST `/api/auth/google-login`

Request

```json
{
  "credential": "<google_id_token>"
}
```

The `credential` is obtained from the Google Login component.

### Success Response

```json
{
  "message": "google login done"
}
```

The backend will automatically:

- Verify the Google ID token.
- Create the user if it doesn't exist.
- Link the Google account if the email already exists.
- Create a JWT.
- Set the HttpOnly authentication cookie.

No token needs to be stored on the frontend.

### Frontend Flow

```text
User clicks "Continue with Google"
        │
        ▼
Google Login Popup
        │
        ▼
Receive Google credential
        │
        ▼
POST /api/auth/google
        │
        ▼
Backend sets authentication cookie
        │
        ▼
Navigate to Home/Dashboard
```

_____________________________________________________________________________________

# REGISTER via other email pages and flow

`register page`
# Register

### POST `/api/auth/register`

Registers a new user and sends a verification email.

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Verification email sent",
  "registrationSession": "<session_token>"
}
```
- Store `registrationSession` only in React state/context.
- Navigate user to the Email Verification page (waiting page)


`the above api sends verification link to user : base-url/verify-email/:verification-token -> fronend page for verifying email`

`verification page should call below api to verify : ` 
# Email Verification

The verification email redirects the user to:

```
/verify-email/:token
```

Frontend should call:

### GET `/api/auth/verify-email/:token`

Success:

```json
{
  "message": "Email verified successfully"
}
```


`register page or the page comes while waiting for verification should continously call below api to check whether email is verified by user from any other or same device :`
# Verification Status

While the user is on the verification page, poll every **3 seconds**.

### GET `/api/auth/verification-status`

Query Params

```
registrationSession=<session_token>
```

Response

```json
{
  "isVerified": false
}
```

Once it becomes

```json
{
  "isVerified": true
}
```

stop polling.


`if isVerified from the above api becomes true, call below api :`
# Finalize Registration

Immediately after verification succeeds.

### POST `/api/auth/finalize-registration`

Request

```json
{
  "registrationSession": "<session_token>"
}
```

Response

```json
{
  "message": "Registration completed"
}
```

`registration got verified, navigate to main page`
After success:
- Clear `registrationSession` from frontend state.
- Redirect user to Home/Dashboard.


```text
Register
    │
    ▼
Receive registrationSession
    │
    ▼
Go to Verify Email Page (waiting page)
    │
    ▼
Poll verification-status every 3s
    │
    ▼
User verifies email
    │
    ▼
verification-status = true
    │
    ▼
POST finalize-registration
    │
    ▼
JWT Cookie Created
    │
    ▼
Navigate to Dashboard
```

________________________________________________________________________________________

# Login

### POST `/api/auth/login`

Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "message": "Login successful"
}
```

JWT cookie is automatically set by the backend.

---
_________________________________________________________________________________________

# Logout

### POST `/api/auth/logout`

Response

```json
{
  "message": "Logged out successfully"
}
```

Backend clears the authentication cookie.

Redirect user to the Login page.

---
---

# HamRahi Backend API Documentation

---

# Authentication

The following APIs require authentication (JWT stored in cookies):

- Wishlist APIs
- Itinerary API

No Authorization header is required. Cookies are automatically sent using:

```js
axios.defaults.withCredentials = true;
```

---

# 1. Search Destination

### Endpoint

```http
GET /destination/search?q=<search_query>
```

### Example

```http
GET /destination/search?q=tokyo
```

### Response

```json
[
    {
        "placeId": "R1543125",
        "title": "Tokyo",
        "subtitle": "Tokyo, Japan",
        "coordinates": {
            "latitude": 35.67,
            "longitude": 139.76
        },
        "category": "boundary",
        "type": "administrative"
    }
]
```

---

# 2. Destination Details

### Endpoint

```http
GET /destination/:placeId
```

Example

```http
GET /destination/R1543125
```

---

### Response

```json
{
    "placeId": "R1543125",

    "basicInfo": {
        "title": "Tokyo",
        "subtitle": "Tokyo, Japan",

        "coordinates": {
            "latitude": 35.67,
            "longitude": 139.76
        },

        "location": {
            "city": "Tokyo",
            "state": null,
            "country": "Japan",
            "countryCode": "JP"
        },

        "tagline": "Where tradition meets tomorrow.",

        "tags": [
            "Cities",
            "Food",
            "Shopping",
            "Nightlife",
            "Culture"
        ]
    },

    "gallery": {
        "heroImage": {
            "title": "Tokyo",
            "description": "...",
            "heroImage": "https://..."
        },

        "images": [
            {
                "id": "...",
                "imageUrl": "...",
                "thumbnail": "...",
                "photographer": "...",
                "photographerProfile": "...",
                "alt": "..."
            }
        ]
    },

    "stats": {
        "rating": 4.8,
        "reviewCount": 1240,
        "bestSeason": "Mar-May, Sep-Nov",
        "estimatedBudget": "Mid-range",
        "difficulty": "Easy"
    },

    "weather": {
        "temperature": 26.3,
        "windSpeed": 15.3,
        "condition": "Cloudy",
        "icon": "cloudy"
    },

    "nearby": {
        "attractions": [
            {
                "placeId": "N12345",
                "title": "Tokyo Tower",

                "coordinates": {
                    "latitude": 35.6586,
                    "longitude": 139.7454
                },

                "metadata": {
                    "category": "attraction",
                    "wikipedia": "en:Tokyo Tower",
                    "wikidata": "Q17754",
                    "website": null
                }
            }
        ]
    }
}
```
---

# 3. Discover Feed

Used for homepage swipe cards.

Supports both:

- Guest users
- Logged in users

Guest

- Returns trending destinations.

Logged In

- Returns AI personalized destinations.

---

### Endpoint

```http
GET /destination/discover
```

---

### Response

```json
[
    {
        "placeId": "R1543125",
        "title": "Tokyo",
        "subtitle": "Tokyo, Japan",
        "coordinates": {
            "latitude": 35.67,
            "longitude": 139.76
        },
        "heroImage": {
            "imageUrl": "..."
        },
        "tags": [
            "Cities",
            "Food",
            "Culture"
        ]
    }
]
```

Response already contains complete destination objects. Frontend can render cards directly without making an additional `GET /destination/:placeId` request unless it explicitly wants refreshed destination details.

---

# Wishlist APIs

Requires Login.

---

# 1. Add to Wishlist

```http
POST /wishlist/:placeId
```

Example

```http
POST /wishlist/R1543125
```

Response

```json
{
    "message": "Added to wishlist"
}
```

---

# 2. Remove from Wishlist

```http
DELETE /wishlist/:placeId
```

Example

```http
DELETE /wishlist/R1543125
```

Response

```json
{
    "message": "Removed from wishlist"
}
```

---

# 3. Get Wishlist

```http
GET /wishlist
```

Returns complete destination objects.

Response

```json
[
    {
        "placeId": "R1543125",

        "basicInfo": {
            "title": "Tokyo"
        },

        "gallery": {
            "heroImage": {
                "heroImage": "..."
            }
        },

        "weather": {
            "temperature": 27,
            "condition": "Sunny"
        }
    }
]
```

No extra API calls are required by frontend.

---

# AI Itinerary

Requires Login.

---

### Endpoint

```http
POST /itinerary/generate
```

### Body

```json
{
    "placeId": "R1543125",
    "days": 5,
    "budget": "Medium",
    "travelStyle": "Friends",
    "interests": [
        "Food",
        "Shopping",
        "Nightlife"
    ]
}
```

---

### Response

```json
{
    "destination": "Tokyo",

    "tripSummary": "...",

    "estimatedBudget": "...",

    "bestTimeToVisit": "...",

    "packingEssentials": [
        "...",
        "..."
    ],

    "localTips": [
        "...",
        "..."
    ],

    "days": [
        {
            "day": 1,

            "title": "Historic Tokyo",

            "activities": [
                {
                    "time": "Morning",

                    "activity": "Visit Senso-ji Temple",

                    "description": "Explore Tokyo's oldest Buddhist temple."
                },
                {
                    "time": "Afternoon",

                    "activity": "Street Food at Nakamise",

                    "description": "Taste authentic Japanese snacks."
                }
            ]
        }
    ]
}
```

---

# Frontend Flow

## Homepage

```
GET /destination/discover
        ↓
Swipe Cards
        ↓
Click Card
        ↓
GET /destination/:placeId
```

---

## Search

```
GET /destination/search?q=...
        ↓
User selects destination
        ↓
GET /destination/:placeId
```

---

## Wishlist

```
POST /wishlist/:placeId

↓

GET /wishlist

↓

DELETE /wishlist/:placeId
```

---

## AI Itinerary

```
User fills form

↓

POST /itinerary/generate

↓

Display itinerary
```

---

# Notes for Frontend

- Always use `placeId` as the unique identifier.
- Destination Details API returns everything required to render the destination page.
- Discover API returns lightweight destination cards.
- Wishlist APIs require authentication.
- AI Itinerary API requires authentication.
- Axios should use:

```js
axios.defaults.withCredentials = true;
```

for authenticated requests.