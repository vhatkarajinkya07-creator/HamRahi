const express = require('express');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use("/api/test", require("./routes/test.routes"));

module.exports = app;