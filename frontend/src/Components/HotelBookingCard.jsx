import { useState } from "react";
import axios from "axios";

const HotelBookingCard = ({
  hotel_id,
  room_number,
  room_capacity,
  room_type,
  price,
  room_id,
  sessionData,
  seller_email,
  hotel_name,
}) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      window.failure("Please check both dates");
      return;
    }

    if (checkInDate < today) {
      window.failure("Invalid check-in date");
      return;
    }

    if (checkOutDate <= checkInDate) {
      window.failure("Invalid checkout date");
      return;
    }

    const bookingDetails = {
      hotel_name,
      seller_email,
      hotel_id,
      room_number,
      room_id,
      user_phone: sessionData?.phonenumber,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    };

    try {
      setLoading(true); 
      const response = await axios.post("http://localhost:3008/reservations/add-reservation", bookingDetails);
      window.success(response.data.message); 
      setLoading(false); 
    } catch (error) {
      console.error(error);
      setLoading(false);
      window.failure(error?.response?.data?.message || "Reservation failed !");
    }
  };

  return (
    <div className="hotel-booking-card">
      <div className="booking-details">
      <p>Hotel ID {hotel_id}</p>
      <p>Hotel email {seller_email}</p>
      <p>Room Number {room_number}</p>
      <p>Room Capacity {room_capacity}</p>
      <p>Room Type {room_type}</p>
      <p>Room Price NPR {price}</p>
      <p>Room ID: {room_id}</p>
      <p>Your Phonenumber  {sessionData?.phonenumber}</p>
      </div>
      <label>
        Check-in Date
        <input
          name="check_in_date"
          type="date"
          min={today}
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </label>
      <br />
      <label>
        Check-out Date
        <input
          name="check_out_date"
          type="date"
          min={checkInDate}
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default HotelBookingCard;