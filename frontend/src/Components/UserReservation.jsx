import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import LoaderPage from "./LoaderPage";
import { useSession } from "../Context/SessionContext";
import { useNavigate } from "react-router-dom";
import ViewUserReservationsDetails from "./ViewUserReservationDetails";
import UpdateUserReservationDates from "./UpdateUserReservationDates";
import UserReservationDelete from "./UserReservationDelete"

const UserReservation = () => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const { sessionData } = useSession();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewReservationData, setViewReservationData] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [dateData, setDateData] = useState(null);
  const[isDeleteOpen , setIsDeleteOpen] = useState(false);
  const[deleteData , setDeleteData] = useState(null);
  const userPhone = sessionData?.phonenumber;
  const navigate = useNavigate();
  const fetchReservations = async () => {
    if (!userPhone) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3008/users/user-reservations/${userPhone}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReservations();
  }, [userPhone]);

  const closeView=()=>{
    setIsViewOpen(false)
  }

  const closeDate=()=>{
    setIsDateOpen(false)
  }

  const closeDelete=()=>{
    setIsDeleteOpen(false)
  }

  if (loading) return <LoaderPage />;

  const columns = [
    { name: "Hotel Name", selector: (row) => row.hotel_name, sortable: true },
    {
      name: "Check-In Date",
      selector: (row) => row.check_in_date,
      sortable: true,
    },
    {
      name: "Check-Out Date",
      selector: (row) => row.check_out_date,
      sortable: true,
    },
    { name: "Price", selector: (row) => row.price, sortable: true },
    {
      name: "Visit page",
      cell: (row) => (
        <>
          <button
            onClick={() => navigate("/hotel/" + row.hotel_id)}
            className="see-details-btn"
          >
            <i className="ri-arrow-right-long-line"></i>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "View Details",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              setIsViewOpen(true);
              setViewReservationData(row);
            }}
            className="see-details-btn"
          >
            <i className="ri-search-line"></i>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Update Dates",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              setIsDateOpen(true);
              setDateData(row);
            }}
            className="see-details-btn"
          >
            <i className="ri-calendar-2-line"></i>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Delete Reservation",
      cell: (row) => (
        <>
          <button
          className="see-details-btn"
          onClick={() => {
            setIsDeleteOpen(true);
            setDeleteData(row);
          }}
          >
            <i className="ri-delete-bin-5-line"></i>
          </button>
        </>
      ),
      sortable: true,
    },
  ];

  return (
    <>
      <div>
        <h3>User Reservations</h3>
        <DataTable
          columns={columns}
          data={reservations}
          pagination
          highlightOnHover
        />
      </div>
      {isViewOpen && <ViewUserReservationsDetails onClose={closeView} data={viewReservationData} />}
      {isDateOpen && <UpdateUserReservationDates onClose={closeDate} data={dateData} user_phone={userPhone} />}
      {isDeleteOpen && <UserReservationDelete onClose={closeDelete} fetchReservation={fetchReservations} data={deleteData} user_phone={userPhone} />}
    </>
  );
};

export default UserReservation;
