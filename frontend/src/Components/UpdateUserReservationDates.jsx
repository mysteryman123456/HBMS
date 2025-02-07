import axios from "axios";
import React, { useState } from "react";

const UpdateUserReservationDates = ({ data , onClose , user_phone }) => {
  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState(""); 
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      window.failure("Please select both dates");
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

    try {
      setLoading(true);
      await axios.post("http://localhost:3008/update-user-reservation", {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        user_phone,
        room_id : data?.room_id,
        reservation_id : data?.reservation_id,
      });

      window.success("Reservation updated !");
      onClose();
    } catch (error) {
      window.failure("Failed to update !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-overlay">
      <div className="update-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Update Reservation Dates</h2>
        
        <label>Check-in Date:</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <label>Check-out Date:</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <button onClick={handleBooking} disabled={loading}>
          {loading ? "Updating..." : "Update Reservation"}
        </button>
      </div>
    </div>
  );
};

export default UpdateUserReservationDates;
