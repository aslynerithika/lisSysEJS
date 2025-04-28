const express = require("express");
const router = express.Router();
const IndexController = require("../controllers/indexController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/", asyncHandler(IndexController.getIndex));

module.exports = router;
