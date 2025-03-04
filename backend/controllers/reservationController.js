const Reservation = require("../models/reservationModel");
const { sendReservationEmail, sendCancellationEmail } = require("../utils/email");

const reservationController = {
  addReservation: async (req, res) => {
    const { hotel_name, seller_email, hotel_id, room_number, room_id, user_phone, check_in_date, check_out_date } = req.body;

    try {
      const conflict = await Reservation.checkReservationConflictForProductPage(room_id, check_in_date, check_out_date)
      if (conflict.rows.length > 0) {
        return res.status(400).json({ message: "Unavailable for picked dates" });
      }
      await Reservation.add({ hotel_id, user_phone, room_id, room_number, check_in_date, check_out_date });
      sendReservationEmail({ hotel_name, seller_email, room_number, user_phone, check_in_date, check_out_date });
      res.status(201).json({ message: "Reservation successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Reservation failed!" });
    }
  },
  deleteReservation: async (req, res) => {
    const { reservation_id } = req.params;
    try {
      await Reservation.delete(reservation_id);
      res.status(200).json({ message: "Reservation deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reservation!" });
    }
  },
  fetchReservations: async (req, res) => {
    const { seller_email } = req.params;
    try {
      const result = await Reservation.findBySellerEmail(seller_email);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No reservations found!" });
      }
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching reservations" });
    }
  },
  adminDeleteReservation: async (req, res) => {
    const { reservation_id } = req.params;
    const { hotel_name, check_in_date, check_out_date, room_number, user_email } = req.body;

    try {
      await Reservation.delete(reservation_id);
      sendCancellationEmail({ hotel_name, check_in_date, check_out_date, room_number, user_email });
      res.status(200).json({ message: "Reservation deleted successfully and email sent!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to delete reservation!" });
    }
  },
  userDeleteReservation: async (req, res) => {
    const { reservation_id } = req.params;
    const { seller_email, hotel_name, check_in_date, check_out_date, room_number, user_phone } = req.body;

    try {
      await Reservation.delete(reservation_id);
      sendCancellationEmail({ seller_email, hotel_name, check_in_date, check_out_date, room_number, user_phone });
      res.status(200).json({ message: "Reservation deleted successfully!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to delete reservation!" });
    }
  },
};

module.exports = reservationController;