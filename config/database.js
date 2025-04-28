const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "libdb",
  port: "3306",
  connectionLimit: 10,
});

module.exports = pool;
