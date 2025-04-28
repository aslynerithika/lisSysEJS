const DatabaseModel = require("../models/databaseModel");
const bcrypt = require("bcrypt");

class AuthController {
  static async getLogin(req, res, next) {
    try {
      res.render("auth/login", { user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  static async postLogin(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await DatabaseModel.getUser(username);

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          req.session.user = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            error: "Invalid credentials",
            user: req.session.user,
          });
        }
      } else {
        res.render("auth/login", {
          error: "Invalid credentials",
          user: req.session.user,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getSignup(req, res, next) {
    try {
      res.render("auth/signup", { user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  static async postSignup(req, res, next) {
    try {
      const { name, email, username, password, DOB, number } = req.body;

      // Input validation checks
      if (!name || !email || !username || !password || !DOB || !number) {
        throw new Error("MISSING_BODY_FIELDS");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("INVALID_EMAIL_FORMAT");
      }

      // Username validation (alphanumeric, 3-20 chars)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error("INVALID_USERNAME_FORMAT");
      }

      // Password complexity regex
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error("INVALID_PASSWORD_FORMAT");
      }

      // Phone number validation
      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(number)) {
        throw new Error("INVALID_PHONE_NUMBER");
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with validated and sanitized inputs
      const result = await DatabaseModel.createUser(
        name,
        email,
        username,
        hashedPassword,
        DOB,
        number
      );

      if (result) {
        const users = await DatabaseModel.getUser(username);
        req.session.user = users[0];
        res.redirect("/");
      } else {
        res.render("auth/signup", {
          error: "Failed to create account",
          user: req.session.user,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
