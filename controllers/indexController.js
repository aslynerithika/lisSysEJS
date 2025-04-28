const DatabaseModel = require("../models/databaseModel");

class IndexController {
  static async getIndex(req, res, next) {
    try {
      if (!req.session.user) {
        res.redirect("/login");
        return;
      }

      const books = await DatabaseModel.getBooks(req.session.user.id);
      const recommendations = books.slice(0, 6);

      res.render("index", {
        books,
        recommendations,
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = IndexController;
