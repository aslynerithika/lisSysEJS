const express = require("express");
const router = express.Router();
const MediaController = require("../controllers/mediaController");
const {
  isAuthenticated,
  isLibrarian,
} = require("../middleware/authMiddleware");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.get("/", isAuthenticated, asyncHandler(MediaController.getMedia));
router.get("/:id", isAuthenticated, asyncHandler(MediaController.getMediaById));

// Protected routes - only for librarians
router.post(
  "/",
  isAuthenticated,
  isLibrarian,
  asyncHandler(MediaController.addMedia)
);
router.put(
  "/:id",
  isAuthenticated,
  isLibrarian,
  asyncHandler(MediaController.updateMedia)
);
router.delete(
  "/:id",
  isAuthenticated,
  isLibrarian,
  asyncHandler(MediaController.deleteMedia)
);

module.exports = router;
