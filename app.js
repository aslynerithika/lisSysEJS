const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const sessionConfig = require("./config/session");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorMiddleware");

// Import routes
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(session(sessionConfig));

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/media", mediaRoutes);
app.use("/account", accountRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
