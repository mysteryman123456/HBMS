const pool = require("../config/db");

const Room = {
  create: async ({ room_number, hotel_id, room_capacity, room_type, price }) => {
    return pool.query(
      `INSERT INTO Room (room_number, hotel_id, room_capacity, room_type, price) 
       VALUES ($1, $2, $3, $4, $5)`,
      [room_number, hotel_id, room_capacity, room_type, price]
    );
  },
  update: async ({ price, room_number, room_capacity, hotel_id }) => {
    return pool.query(
      `UPDATE Room 
       SET price = $1, room_number = $2, room_capacity = $3
       WHERE hotel_id = $4`,
      [price, room_number, room_capacity, hotel_id]
    );
  },
  deleteByHotelId: async (hotel_id) => {
    return pool.query("DELETE FROM Room WHERE hotel_id = $1", [hotel_id]);
  },
};

module.exports = Room;