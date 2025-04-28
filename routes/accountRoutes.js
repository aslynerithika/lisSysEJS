const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Account routes
router.get("/", isAuthenticated, UserController.getUserProfile);
router.get("/wishlist", isAuthenticated, UserController.getUserWishlist);
router.get(
  "/reservations",
  isAuthenticated,
  UserController.getUserReservations
);
router.get("/checkedout", isAuthenticated, UserController.getUserCheckedOut);

module.exports = router;
