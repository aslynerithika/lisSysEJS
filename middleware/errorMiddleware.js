const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error status and message
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred";

  // Don't expose internal errors in production
  const errorResponse = {
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An error occurred. Please try again later."
        : message,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
