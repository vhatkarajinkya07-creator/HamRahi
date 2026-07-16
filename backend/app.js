const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet')

require('dotenv').config();

const app = express();

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
app.use(helmet({ crossOriginOpenerPolicy: false }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use("/api/test", require("./routes/test.routes"));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use("/api/itinerary", require("./routes/itinerary.routes"));
app.use("/api/trips", require("./routes/trip.routes"));
app.use("/api/upload", require("./routes/upload.routes"));

module.exports = app;