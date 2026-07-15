const express = require("express");
const auth = require("../middlewares/auth.middleware");
const createTrip = require("../controllers/trip.controllers/createTrip");
const getTrips = require("../controllers/trip.controllers/getTrips");
const updateTrip = require("../controllers/trip.controllers/updateTrip");
const deleteTrip = require("../controllers/trip.controllers/deleteTrip");

const router = express.Router();

router.get("/", auth, getTrips);
router.post("/", auth, createTrip);
router.put("/:id", auth, updateTrip);
router.delete("/:id", auth, deleteTrip);

module.exports = router;
