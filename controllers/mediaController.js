const DatabaseModel = require("../models/databaseModel");

class MediaController {
  static async getMedia(req, res, next) {
    try {
      const userId = req.session.user ? req.session.user.id : null;
      const search = req.query.search;
      const media = await DatabaseModel.getBook(search, userId);
      res.render("media/index", { book: media[0], user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  static async getMediaById(req, res, next) {
    try {
      const userId = req.session.user ? req.session.user.id : null;
      const media = await DatabaseModel.getBook(req.params.id, userId);
      if (media.length < 1) {
        return res.status(404).render("error", {
          message: "Media not found",
          error: { status: 404 },
        });
      }

      res.render("media/index", { book: media[0], user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  static async searchMedia(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { query } = req.query;
      const media = await DatabaseModel.getBooks(userId, query);
      const filteredMedia = media.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.author.toLowerCase().includes(query.toLowerCase())
      );
      res.render("media/search", {
        books: filteredMedia,
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMedia(req, res, next) {
    try {
      const { name, description, author, numAvail, numOf } = req.body;
      await DatabaseModel.addMedia(name, description, author, numAvail, numOf);
      res.redirect("/media");
    } catch (error) {
      next(error);
    }
  }

  static async updateMedia(req, res, next) {
    try {
      const { name, description, author, numAvail, numOf } = req.body;
      await DatabaseModel.updateMedia(
        req.params.id,
        name,
        description,
        author,
        numAvail,
        numOf
      );
      res.redirect("/media");
    } catch (error) {
      next(error);
    }
  }

  static async deleteMedia(req, res, next) {
    try {
      await DatabaseModel.deleteMedia(req.params.id);
      res.redirect("/media");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MediaController;
