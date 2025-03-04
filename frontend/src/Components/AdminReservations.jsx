import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { SessionContext, useSession } from "../Context/SessionContext";
import LoaderPage from "./LoaderPage";
import AdminReservationDelete from "./AdminReservationDelete";

const AdminReservations = () => {
  const { sessionData } = useSession(SessionContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const[deleteData , setDeleteData] = useState(null);
  const[showDeleteCard , setShowDeleteCard] = useState(false);
  const seller_email = sessionData?.email;

  const closeDeleteWrapper =()=>{
    setShowDeleteCard(false);
  }

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3008/reservations/reservations/${seller_email}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller_email) return;
    fetchReservations();
  }, [seller_email]);

  const columns = [
    {
      name: "Hotel Name",
      selector: (row) => row.hotel_name,
      sortable: true,
    },
    {
      name: "Room Number",
      selector: (row) => row.room_number,
      sortable: true,
    },
    {
      name: "User Phone",
      selector: (row) => row.user_phone,
    },
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
    {
      name: "Remove Reservation",
      cell: (row) => (
        <div style={{position:"relative",left:"30px",fontSize:"18px"}}>
          <button
            onClick={()=> {setShowDeleteCard(true);setDeleteData(row)}}
            className="ec_button_delete"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <>
        <LoaderPage />
      </>
    );

  return (
    <>
    <div style={{ width: "100%" }}>
      <DataTable
        columns={columns}
        data={reservations}
        pagination
        highlightOnHover
      />
    </div>
    {showDeleteCard && <>
    <AdminReservationDelete fetchReservation={fetchReservations} close={closeDeleteWrapper} data={deleteData}/>
    </>}
    </>
  );
};

export default AdminReservations;
