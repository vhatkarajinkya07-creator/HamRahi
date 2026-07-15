const express = require('express');
const router = express.Router();
const optionalAuth = require("../middlewares/optionalAuth.middleware");

const auth = require("../middlewares/auth.middleware");

router.get('/search', optionalAuth, require('../controllers/destination.controllers/searchDestination'));
router.get("/discover", optionalAuth, require("../controllers/destination.controllers/getDiscover"));
router.get('/:placeId', optionalAuth, require('../controllers/destination.controllers/getDestination'));
router.get("/discover/tag/:tag", require("../controllers/destination.controllers/getTagSuggestions"));

// Reviews routes
router.get('/:placeId/reviews', require('../controllers/destination.controllers/getReviews'));
router.post('/:placeId/reviews', auth, require('../controllers/destination.controllers/submitReview'));
router.delete('/:placeId/reviews/:reviewId', auth, require('../controllers/destination.controllers/deleteReview'));

module.exports = router;