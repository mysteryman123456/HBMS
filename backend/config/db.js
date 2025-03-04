const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Hotel",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = pool;