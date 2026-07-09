const express = require("express");
 auth = require("../middlewares/auth.middleware");

const generateItinerary = require("../controllers/itinerary.controllers/generateItinerary");

const router = express.Router();

router.post("/generate", auth, generateItinerary);

module.exports = router;