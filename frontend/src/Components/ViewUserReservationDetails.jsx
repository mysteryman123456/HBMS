import React from "react";

const ViewUserReservationsDetails = ({ data, onClose : closeView }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        border: ".1px solid lightgrey",
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
        minWidth: "300px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={()=>closeView()}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "25px",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <h3>Reservation Details</h3>
      {
        <>
            <p><strong>Hotel</strong> {data.hotel_name}</p>
            <p><strong>Location</strong> {data.hotel_location}</p>
            <p><strong>Room Number</strong> {data.room_number}</p>
            <p><strong>Room Type</strong> {data.room_type}</p>
            <p><strong>Capacity:</strong> {data.room_capacity} person</p>
            <p><strong>Check-in</strong> {new Date(data.check_in_date).toLocaleString()}</p>
            <p><strong>Check-out</strong> {new Date(data.check_out_date).toLocaleString()}</p>
            <p><strong>Price</strong> रू {parseFloat(data.price).toFixed(2)}</p>
        </>
      }
    </div>
  );
};

export default ViewUserReservationsDetails;
