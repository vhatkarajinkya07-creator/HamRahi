const express = require("express");
const auth = require("../middlewares/auth.middleware");
const addToWishlist = require("../controllers/wishlist.controllers/addToWishlist");
const removeFromWishlist = require("../controllers/wishlist.controllers/removeFromWishlist");
const getWishlist = require("../controllers/wishlist.controllers/getWishlist");

const router = express.Router();

router.get("/", auth, getWishlist);
router.post("/:placeId", auth, addToWishlist);
router.delete("/:placeId", auth, removeFromWishlist);

module.exports = router;