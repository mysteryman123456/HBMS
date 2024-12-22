// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,  
  host: process.env.DB_HOST,  
  database: "Hotel",          
  password: process.env.DB_PASSWORD, 
  port: 5432,                 
});

module.exports = pool;