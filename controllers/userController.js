const DatabaseModel = require("../models/databaseModel");

class UserController {
  static async getUserProfile(req, res, next) {
    try {
      const user = req.session.user;
      res.render("account/profile", { user });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserProfile(req, res, next) {
    try {
      const { name, email, phone, address } = req.body;
      const userId = req.session.user.id;
      // Update user profile logic here
      res.redirect("/account");
    } catch (error) {
      next(error);
    }
  }

  static async getUserWishlist(req, res, next) {
    try {
      const userId = req.session.user.id;
      const wishlist = await DatabaseModel.getList(userId, "wishlist");
      res.render("account/wishlist", { books: wishlist });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromWishlist(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { mediaId } = req.params;
    } catch (error) {
      next(error);
    }
  }

  static async getUserReservations(req, res, next) {
    try {
      const userId = req.session.user.id;
      const reservations = await DatabaseModel.getList(userId, "reservations");
      res.render("account/reservations", { books: reservations });
    } catch (error) {
      next(error);
    }
  }

  static async addReservation(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { mediaId } = req.params;
      // Add reservation logic here
      res.redirect("/users/reservations");
    } catch (error) {
      next(error);
    }
  }

  static async cancelReservation(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { mediaId } = req.params;
      // Cancel reservation logic here
      res.redirect("/users/reservations");
    } catch (error) {
      next(error);
    }
  }

  static async getUserCheckedOut(req, res, next) {
    try {
      const userId = req.session.user.id;
      const checkedOut = await DatabaseModel.getList(userId, "checkedout");
      res.render("account/checkedout", { books: checkedOut });
    } catch (error) {
      next(error);
    }
  }

  static async returnMedia(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { mediaId } = req.params;
      // Return media logic here
      res.redirect("/users/checkedout");
    } catch (error) {
      next(error);
    }
  }

  static async toggleWishlist(req, res) {
    try {
      const userId = req.session.user.id;
      const mediaId = req.body.mediaId;

      if (!mediaId) {
        return res.status(400).json({ error: "Media ID is required" });
      }

      const added = await DatabaseModel.toggleWishlist(userId, mediaId);
      res.json({ success: true, added });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      res.status(500).json({ error: "Failed to update wishlist" });
    }
  }
}

module.exports = UserController;
