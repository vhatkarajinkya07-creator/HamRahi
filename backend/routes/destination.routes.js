const express = require('express');
const router = express.Router();
const optionalAuth = require("../middlewares/optionalAuth.middleware");

router.get('/search', optionalAuth, require('../controllers/destination.controllers/searchDestination'));
router.get("/discover", optionalAuth, require("../controllers/destination.controllers/getDiscover"));
router.get('/:placeId', optionalAuth, require('../controllers/destination.controllers/getDestination'));
router.get("/discover/tag/:tag", require("../controllers/destination.controllers/getTagSuggestions"));


module.exports = router;