const express = require("express");
const router = express.Router();

const { LoggedIn } = require("../middleware");

const wishlistController =
require("../controllers/wishlist");

// Show Wishlist
router.get(
  "/",
  LoggedIn,
  wishlistController.showWishlist
);

// Add to Wishlist
router.post(
  "/:id",
  LoggedIn,
  wishlistController.addToWishlist
);

// Remove from Wishlist
router.delete(
  "/:id",
  LoggedIn,
  wishlistController.removeFromWishlist
);

module.exports = router;