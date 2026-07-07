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