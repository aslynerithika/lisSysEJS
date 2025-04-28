const pool = require("../config/database");
const bcrypt = require("bcrypt");

class DatabaseModel {
  static async query(sql, params) {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async getItems(table) {
    const sql = "SELECT * FROM " + table;
    return this.query(sql);
  }

  static async getUser(username) {
    const sql = "SELECT * FROM users WHERE username = ?";
    const users = await this.query(sql, [username]);
    return users.length > 0 ? users[0] : null;
  }

  static async createUser(name, email, username, password, dob, phone) {
    const sql =
      "INSERT INTO users (name, email, username, password, DOB, phone) VALUES (?, ?, ?, ?, ?, ?)";
    return this.query(sql, [name, email, username, password, dob, phone]);
  }

  static async getList(userId, list) {
    const sql =
      "SELECT * FROM " +
      list +
      " INNER JOIN media ON " +
      list +
      ".media_id = media.id AND " +
      list +
      ".user_id = " +
      userId;
    return this.query(sql);
  }

  static async getBooks(userId, search) {
    let query = `
      SELECT 
        media.*,
        CASE 
          WHEN wishlist.media_id IS NOT NULL THEN 1
          ELSE 0
        END as wishlisted
      FROM media
      LEFT JOIN wishlist ON media.id = wishlist.media_id AND wishlist.user_id = ?
    `;

    const args = [userId];
    if (search) {
      args.push(`%${search}%`);
      args.push(`%${search}%`);
      query += "WHERE media.name LIKE ? OR media.author LIKE ?";
    }

    return this.query(query, args);
  }

  static async getBook(id, userId) {
    const sql = `SELECT m.*, 
                CASE WHEN w.user_id IS NOT NULL THEN true ELSE false END as wishlisted
                FROM media m 
                LEFT JOIN wishlist w ON m.id = w.media_id AND w.user_id = ?
                WHERE m.id = ?`;
    return this.query(sql, [userId, id]);
  }

  static async addMedia(name, description, author, numAvail, numOf) {
    const sql =
      "INSERT INTO media (name, description, author, numAvail, numOf) VALUES (?, ?, ?, ?, ?)";
    return this.query(sql, [name, description, author, numAvail, numOf]);
  }

  static async deleteMedia(mediaID) {
    const queries = [
      `DELETE FROM wishlist WHERE media_id = ?`,
      `DELETE FROM reservations WHERE media_id = ?`,
      `DELETE FROM checkedout WHERE media_id = ?`,
      `DELETE FROM media WHERE id = ?`,
    ];

    for (const query of queries) {
      await this.query(query, [mediaID]);
    }
  }

  static async updateMedia(id, name, description, author, numAvail, numOf) {
    const sql =
      "UPDATE media SET name = ?, description = ?, author = ?, numAvail = ?, numOf = ? WHERE id = ?";
    return this.query(sql, [name, description, author, numAvail, numOf, id]);
  }

  static async isListed(userId, mediaId) {
    const sql = "SELECT * FROM wishlist WHERE media_id = ? AND user_id = ?";
    return this.query(sql, [mediaId, userId]);
  }

  static async toggleWishlist(userId, mediaId) {
    const exists = await this.isListed(userId, mediaId);

    if (exists.length > 0) {
      // Remove from wishlist
      const sql = "DELETE FROM wishlist WHERE media_id = ? AND user_id = ?";
      await this.query(sql, [mediaId, userId]);
      return false;
    } else {
      // Add to wishlist
      const sql = "INSERT INTO wishlist (media_id, user_id) VALUES (?, ?)";
      await this.query(sql, [mediaId, userId]);
      return true;
    }
  }
}

module.exports = DatabaseModel;
