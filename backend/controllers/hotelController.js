const Hotel = require("../models/hotelModel");
const Room = require("../models/roomModel");
const { generateUUID } = require("../utils/helpers");

const hotelController = {
  addHotel: async (req, res) => {
    const { seller_email, hotel_name, hotel_location, l_l, description, room_capacity, room_type, room_number, price, amenities } = req.body;
    const hotel_id = generateUUID();

    try {
      await Hotel.create({ hotel_id, hotel_name, l_l, hotel_location, amenities, seller_email, description });
      const imagePromises = req.files.map((file) => Hotel.addImage(hotel_id, file.path));
      await Promise.all(imagePromises);
      await Room.create({ room_number, hotel_id, room_capacity, room_type, price });
      res.status(201).json({ message: "Hotel listed successfully" });
    } catch (error) {
      console.error("Error in addHotel:", error);
      res.status(500).json({ message: "An error occurred while adding the hotel" });
    }
  },
  fetchHotelEdit: async (req, res) => {
    const { seller_email } = req.body;
    try {
      const data = await Hotel.findBySellerEmail(seller_email);
      res.status(200).json({ rows: data.rows });
    } catch (err) {
      res.status(400).json({ message: "Internal server error" });
      console.log(err);
    }
  },
  updateListing: async (req, res) => {
    const { seller_email, hotel_name, hotel_location, amenities, price, room_number, room_capacity, hotel_id } = req.body;

    try {
      const hotelResult = await Hotel.update(hotel_id, seller_email, hotel_name, hotel_location, amenities);
      const roomResult = await Room.update({ price, room_number, room_capacity, hotel_id });

      if (hotelResult.affectedRows === 0 && roomResult.affectedRows === 0) {
        return res.status(404).json({ message: "No record found!" });
      }
      res.status(200).json({ message: "Listing updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error!" });
    }
  },
  deleteListing: async (req, res) => {
    const { seller_email, hotel_id } = req.body;
    if (!seller_email || !hotel_id) {
      return res.status(400).json({ message: "Invalid data provided!" });
    }
    try {
      const hotelResult = await Hotel.delete(hotel_id, seller_email);
      if (hotelResult.rowCount === 0) {
        return res.status(404).json({ message: "Listing not found!" });
      }
      await Room.deleteByHotelId(hotel_id);
      await Hotel.deleteImages(hotel_id);

      res.status(200).json({ message: "Listing deleted successfully!" });
    } catch (err) {
      console.error("Could not delete!");
      res.status(500).json({ message: "Server error!", error: err.message });
    }
  },  
  getHotelLocationAndName: async (req, res) => {
    try {
      const data = await Hotel.getLocationAndName();
      if (data.rowCount > 0) {
        res.status(200).json({ message: data.rows });
      } else {
        res.status(404).json({ message: "No data available" });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "No data available" });
    }
  },
  getHotelListing: async (req, res) => {
    const { id } = req.params;

    try {
      const data = await Hotel.getListingById(id);

      if (data.rowCount > 0) {
        res.status(200).json({ message: data.rows[0] });
      } else {
        res.status(404).json({ message: "Hotel not found" });
      }
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  getALLHotelListing: async (req, res) => {
    try {
      const data = await Hotel.getAllListings();
      if (data.rowCount > 0) {
        res.status(200).json({ message: data.rows });
      } else {
        res.status(404).json({ message: "No data available" });
      }
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  getSearchedListing: async (req, res) => {
    const {
      hotel_location,
      hotel_name,
      guest_count,
      minPrice,
      maxPrice,
      sortedPrice,
      rating,
      sortedRating,
      roomCategories,
      hotelFacilities,
    } = req.query;

    try {
      const data = await Hotel.search({ hotel_location, hotel_name, guest_count, minPrice, maxPrice, sortedPrice, rating, sortedRating, roomCategories, hotelFacilities });

      if (data.rowCount > 0) {
        res.status(200).json({ message: data.rows });
      } else {
        res.status(404).json({ message: "No data available" });
      }
    } catch (err) {
      console.error("Database query error", err);
      res.status(500).json({ message: "An error occurred while fetching data" });
    }
  },
};

module.exports = hotelController;