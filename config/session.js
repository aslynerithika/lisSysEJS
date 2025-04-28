const session = require("express-session");

const sessionConfig = {
  secret: "baloney and ch33se",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

module.exports = sessionConfig;
