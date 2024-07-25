const express = require("express");
const wishlistController = require("../controllers/wishlisst");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, wishlistController.getWishlist);
router.post("/add", authMiddleware, wishlistController.addToWishList);
router.post("/remove", authMiddleware, wishlistController.removeFromWishList);

module.exports = router;

