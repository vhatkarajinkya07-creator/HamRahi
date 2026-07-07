const express = require('express');

const router = express.Router();

router.post('/register', require('../controllers/auth.controllers/registerUser'));
router.post('/login', require('../controllers/auth.controllers/loginUser'));
router.post('/logout', require('../controllers/auth.controllers/logoutUser'));
router.post('/verify-email/:token', require('../controllers/auth.controllers/verifyEmail'));
router.get('/verification-status', require('../controllers/auth.controllers/verificationStatus'));
router.post('/finalise-registration', require('../controllers/auth.controllers/finaliseRegistration'));
router.post('/google-login', require('../controllers/auth.controllers/googleLogin'));

module.exports = router;