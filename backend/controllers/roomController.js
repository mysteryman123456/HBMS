const Room = require("../models/roomModel");

const roomController = {
  addRoom: async (req, res) => {
    const { room_number, hotel_id, room_capacity, room_type, price } = req.body;
    try {
      await Room.create({ room_number, hotel_id, room_capacity, room_type, price });
      res.status(201).json({ message: "Room added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  updateRoom: async (req, res) => {
    const { price, room_number, room_capacity, hotel_id } = req.body;
    try {
      await Room.update({ price, room_number, room_capacity, hotel_id });
      res.status(200).json({ message: "Room updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  deleteRoom: async (req, res) => {
    const { hotel_id } = req.params;
    try {
      await Room.deleteByHotelId(hotel_id);
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  // Add other room-related controllers here
};

module.exports = roomController;