const pool = require("../config/db");

const Review = {
  create: async ({ id, user_phonenumber, review, rating }) => {
    return pool.query(
      `INSERT INTO Review (hotel_id, user_phone, review, stars) VALUES ($1, $2, $3, $4)`,
      [id, user_phonenumber, review, rating]
    );
  },
  findByHotelId: async (id) => {
    return pool.query(
      `SELECT 
         user_phone, 
         review, 
         stars AS rating
       FROM Review
       WHERE hotel_id = $1`,
      [id]
    );
  },
  findAverageRatingByHotelId: async (id) => {
    return pool.query(
      `SELECT 
         AVG(stars) AS average_rating
       FROM Review
       WHERE hotel_id = $1`,
      [id]
    );
  },
};

module.exports = Review;