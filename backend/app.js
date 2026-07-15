const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

// CLIENT_URL was already defined in .env but never wired up anywhere,
// so cross-origin requests from the frontend (different port/host than
// the API) were being blocked by the browser with no CORS headers set.
// Allow the configured CLIENT_URL plus the common local dev hosts so it
// works whether the frontend is opened on localhost or 127.0.0.1.
const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean),
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header, e.g. curl/Postman).
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use("/api/test", require("./routes/test.routes"));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use("/api/itinerary", require("./routes/itinerary.routes"));
app.use("/api/trips", require("./routes/trip.routes"));

module.exports = app;