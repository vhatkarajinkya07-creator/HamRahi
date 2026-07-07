# Authentication API Guide

> Authentication is handled using **JWT stored in an HttpOnly cookie**. The frontend should **never store or manage JWT tokens**.

---

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

### Frontend Flow

- Store `registrationSession` **only in React state/context**.
- Navigate user to the **Email Verification** page.
- Do **not** store `registrationSession` in localStorage, sessionStorage or cookies.

---

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

---

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

---

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

The backend will automatically:

- Validate the registration session
- Create JWT
- Set the authentication cookie

After success:

- Clear `registrationSession` from frontend state.
- Redirect user to Home/Dashboard.

---

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

---

# Authentication Flow

```text
Register
    │
    ▼
Receive registrationSession
    │
    ▼
Go to Verify Email Page
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

---

# Important Notes

- Never store JWT in localStorage/sessionStorage.
- Always use `withCredentials: true`.
- `registrationSession` should exist only until registration is completed.
- If registration is interrupted (refresh/close), the user can simply register again with the same email to receive a new verification email and registration session.