import React from "react";

// Reusable style objects
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "24px",
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  minWidth: "320px",
  maxWidth: "90%",
  zIndex: 1000,
};

const closeButtonStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#666",
  transition: "color 0.2s ease",
};

const headerStyle = {
  marginBottom: "20px",
  fontSize: "20px",
  fontWeight: "600",
  color: "#333",
};

const detailItemStyle = {
  marginBottom: "12px",
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.5",
};

const labelStyle = {
  fontWeight: "500",
  color: "#333",
  marginRight: "8px",
};

const ViewUserReservationsDetails = ({ data, onClose: closeView }) => {
  return (
    <div style={modalStyle}>
      <button
        onClick={closeView}
        style={closeButtonStyle}
        onMouseOver={(e) => (e.target.style.color = "#000")}
        onMouseOut={(e) => (e.target.style.color = "#666")}
      >
        &times;
      </button>
      <h3 style={headerStyle}>Reservation Details</h3>
      <div>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Hotel:</span> {data.hotel_name}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Location:</span> {data.hotel_location}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Room Number:</span> {data.room_number}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Room Type:</span> {data.room_type}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Capacity:</span> {data.room_capacity} person
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Check-in:</span>{" "}
          {new Date(data.check_in_date).toLocaleString()}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Check-out:</span>{" "}
          {new Date(data.check_out_date).toLocaleString()}
        </p>
        <p style={detailItemStyle}>
          <span style={labelStyle}>Price:</span> रू {parseFloat(data.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ViewUserReservationsDetails;