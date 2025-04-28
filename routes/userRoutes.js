const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// User profile routes
router.get(
  "/profile",
  isAuthenticated,
  asyncHandler(UserController.getUserProfile)
);
router.post("/profile", isAuthenticated, UserController.updateUserProfile);

// User lists routes
router.get(
  "/wishlist",
  isAuthenticated,
  asyncHandler(UserController.getWishlist)
);
router.post(
  "/wishlist",
  isAuthenticated,
  asyncHandler(UserController.toggleWishlist)
);
router.delete(
  "/wishlist/:mediaId",
  isAuthenticated,
  UserController.removeFromWishlist
);

router.get(
  "/reservations",
  isAuthenticated,
  asyncHandler(UserController.getUserReservations)
);
router.post(
  "/reservations/add/:mediaId",
  isAuthenticated,
  asyncHandler(UserController.addReservation)
);
router.delete(
  "/reservations/:mediaId",
  isAuthenticated,
  UserController.cancelReservation
);

router.get("/checkedout", isAuthenticated, UserController.getUserCheckedOut);
router.post(
  "/checkedout/return/:mediaId",
  isAuthenticated,
  UserController.returnMedia
);

// Borrowing history routes
router.get(
  "/borrowed",
  isAuthenticated,
  asyncHandler(UserController.getBorrowedHistory)
);
router.get(
  "/current-loans",
  isAuthenticated,
  asyncHandler(UserController.getCurrentLoans)
);

module.exports = router;
