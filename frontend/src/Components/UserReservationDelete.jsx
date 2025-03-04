import React, { useState, useEffect } from "react";
import axios from "axios";
import LoaderPage from "./LoaderPage";

const UserReservationDelete = ({
  data,
  onClose: closeDelete,
  user_phone,
  fetchReservation: fetchReservations,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDelete = async () => {
      if (!data?.reservation_id) {
        closeDelete();
        return;
      }

      console.log(data);

      try {
        const response = await axios.delete(
          `http://localhost:3008/reservations/user-delete-reservation/${data.reservation_id}`,
          { data: { 
            seller_email: data?.seller_email,
            hotel_name : data?.hotel_name,
            room_number : data?.room_number,
            check_in_date : data?.check_in_date,
            check_out_date : data?.check_out_date,
            user_phone ,
          } }
        );
        if (response.status === 200) {
          window.success("Removed successfully!");
          fetchReservations();
          closeDelete();
        } else {
          window.failure("Failed to remove !");
          closeDelete();
        }
      } catch (error) {
        window.failure("Something went wrong!");
        closeDelete();
      } finally {
        setLoading(false);
        closeDelete();
      }
    };

    handleDelete();
  }, [data.reservation_id, closeDelete]);

  return (
    loading && (
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "99",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderPage />
      </div>
    )
  );
};

export default UserReservationDelete;
