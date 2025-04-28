const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middleware/authMiddleware");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Login routes
router.get("/login", isNotAuthenticated, asyncHandler(AuthController.getLogin));
router.post(
  "/login",
  isNotAuthenticated,
  asyncHandler(AuthController.postLogin)
);

// Signup routes
router.get(
  "/signup",
  isNotAuthenticated,
  asyncHandler(AuthController.getSignup)
);
router.post(
  "/signup",
  isNotAuthenticated,
  asyncHandler(AuthController.postSignup)
);

// Logout route
router.get("/logout", isAuthenticated, asyncHandler(AuthController.logout));

module.exports = router;
