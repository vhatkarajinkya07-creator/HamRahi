const express = require("express");

const seedDestinations = require("../controllers/test/seedDestinations.controller");

const router = express.Router();

router.post(
    "/seed-destinations",
    seedDestinations
);

module.exports = router;