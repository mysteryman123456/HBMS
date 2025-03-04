const pool = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  create: async ({ username, email, phone, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return pool.query(
      "INSERT INTO Users (username, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, phone, hashedPassword, role]
    );
  },
  findByEmailOrPhone: async (email, phone) => {
    return pool.query("SELECT * FROM Users WHERE email = $1 OR phone = $2", [email, phone]);
  },
  findByEmail: async (email) => {
    return pool.query("SELECT * FROM Users WHERE email = $1", [email]);
  },
  updatePassword: async (email, hashedPassword) => {
    return pool.query("UPDATE Users SET password = $1 WHERE email = $2", [hashedPassword, email]);
  },
  updatePhoneNumber: async (email, new_phone_number) => {
    return pool.query("UPDATE Users SET phone = $1 WHERE email = $2", [new_phone_number, email]);
  },
  delete: async (email) => {
    return pool.query("DELETE FROM Users WHERE email = $1", [email]);
  },
  findReservationsByPhone: async (phone) => {
    return pool.query(
      `SELECT 
         r.reservation_id, 
         r.room_number, 
         r.check_in_date, 
         r.check_out_date, 
         rm.room_type, 
         rm.room_capacity, 
         rm.price,
         rm.room_id,
         h.hotel_name,
         h.hotel_id,
         h.seller_email,
         h.hotel_location
       FROM reservation r
       INNER JOIN room rm ON r.room_id = rm.room_id
       INNER JOIN hotel h ON r.hotel_id = h.hotel_id
       WHERE r.user_phone = $1`,
      [phone]
    );
  },
  checkReservationConflict: async (room_id, check_in_date, check_out_date, reservation_id) => {
    return pool.query(
      `SELECT * FROM reservation 
       WHERE room_id = $1 
       AND reservation_id != $4 
       AND (
         (check_in_date <= $2 AND check_out_date > $2) OR
         (check_in_date < $3 AND check_out_date >= $3) OR
         (check_in_date >= $2 AND check_out_date <= $3)
       )`,
      [room_id, check_in_date, check_out_date, reservation_id]
    );
  },
  updateReservation: async (check_in_date, check_out_date, reservation_id) => {
    return pool.query(
      "UPDATE reservation SET check_in_date = $1, check_out_date = $2 WHERE reservation_id = $3",
      [check_in_date, check_out_date, reservation_id]
    );
  },
};

module.exports = User;