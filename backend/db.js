// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',  
  host: 'localhost',           
  database: 'Hotel',   
  password: 'MacBookAir',   
  port: 5432,                
});

module.exports = pool;