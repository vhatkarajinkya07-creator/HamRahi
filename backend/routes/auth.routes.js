const express = require('express');

const router = express.Router();

const { registerUser, loginUser, logoutUser, verifyEmail, verificationStatus, finalizeRegistration } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-email/:token', verifyEmail);
router.get('/verification-status', verificationStatus);
router.post('/finalise-registration', finalizeRegistration);

module.exports = router;