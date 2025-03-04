import React, { useState, useEffect } from "react";
import axios from "axios";
import LoaderPage from "./LoaderPage";

const AdminReservationDelete = ({ data, close: closeDeleteWrapper , fetchReservation : fetchReservations }) => {
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const handleDelete = async () => {
      if (!data?.reservation_id) {
        closeDeleteWrapper(); 
        return;
      } 

      console.log(data)

      try {
        const response = await axios.delete(`http://localhost:3008/reservations/admin-delete-reservation/${data.reservation_id}`,{data : {
          user_email : data?.user_email,
          seller_email : data?.seller_email,
          hotel_name : data.hotel_name,
          room_number : data.room_number,
          check_in_date : data.check_in_date,
          check_out_date : data.check_out_date
        }});
        if (response.status === 200) {
          window.success("Removed successfully!");
          fetchReservations();
          closeDeleteWrapper();
        } else {
          window.failure("Failed to remove !");
          closeDeleteWrapper()
        }
      } catch (error) {
        window.failure("Something went wrong!");
        closeDeleteWrapper();
      } finally {
        setLoading(false);
        closeDeleteWrapper();
      }
    };

    handleDelete();
  }, [data.reservation_id, closeDeleteWrapper]);

  return (
    loading && (
      <div style={{ width: "100%", height: "100vh", position: "absolute", top: "0", left: "0", zIndex: "99", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoaderPage />
      </div>
    )
  );
};

export default AdminReservationDelete;
