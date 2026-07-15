const express = require("express");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const uploadPhoto = require("../controllers/upload.controller");

const router = express.Router();

// POST /api/upload/photo  — multipart/form-data, field name: "photo"
router.post("/photo", auth, upload.single("photo"), uploadPhoto);

module.exports = router;
