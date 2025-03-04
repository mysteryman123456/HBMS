import axios from "axios";
import React, { useState } from "react";

const UpdateUserReservationDates = ({ data, onClose, user_phone }) => {
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
      await axios.post("http://localhost:3008/users/update-user-reservation", {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        user_phone,
        room_id: data?.room_id,
        reservation_id: data?.reservation_id,
      });

      window.success("Reservation updated successfully!");
      onClose();
    } catch (error) {
      window.failure("Failed to update reservation!");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const containerStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    position : "relative"
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "5px",
    zIndex : "9999999",
    right: "15px",
    background: "none",
    fontWeight : "normal",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    transition: "color 0.2s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#34495e",
    marginBottom: "8px",
    textAlign: "left",
  };

  const inputStyle = {
    width: "calc(100% - 20px)",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "16px",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#3498db",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: "#bdc3c7",
    cursor: "not-allowed",
  };

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        <button
          style={closeButtonStyle}
          onClick={onClose}
        >
          &times;
        </button>
        <label style={labelStyle}>Check-in Date</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          style={inputStyle}
          min={today}
        />
        <label style={labelStyle}>Check-out Date</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          style={inputStyle}
          min={checkInDate || today}
        />
        <button
          onClick={handleBooking}
          disabled={loading}
          style={loading ? buttonDisabledStyle : buttonStyle}
        >
          {loading ? "Updating..." : "Update Reservation"}
        </button>
      </div>
    </div>
  );
};

export default UpdateUserReservationDates;