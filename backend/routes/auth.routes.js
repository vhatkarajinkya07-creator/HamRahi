const express = require('express');

const router = express.Router();

const { registerUser, loginUser, verifyEmail } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email/:token', verifyEmail);

module.exports = router;