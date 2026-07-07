const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');


router.get('/search', auth, require('../controllers/destination.controllers/searchDestination'));
router.get('/:placeId', auth, require('../controllers/destination.controllers/getDestination'));

module.exports = router;