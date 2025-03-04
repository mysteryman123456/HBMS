const Review = require("../models/reviewModel");

const reviewController = {
  addReview: async (req, res) => {
    const { review, rating, user_phonenumber, id } = req.body;
    if (!review || !rating || !user_phonenumber || !id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      await Review.create({ id, user_phonenumber, review, rating });
      res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getReviews: async (req, res) => {
    const { id } = req.params;
    try {
      const reviewsResult = await Review.findByHotelId(id);
      const avgRatingResult = await Review.findAverageRatingByHotelId(id);
      if (reviewsResult.rows.length === 0) {
        return res.status(404).json({ message: "No reviews found" });
      }
      const averageRating = avgRatingResult.rows[0]?.average_rating || 0;
      res.status(200).json({
        averageRating: parseFloat(averageRating).toFixed(1),
        reviews: reviewsResult.rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = reviewController;