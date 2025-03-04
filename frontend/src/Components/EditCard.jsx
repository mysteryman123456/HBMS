import React, { useState, useEffect } from 'react';
import amenitiesList from "./Ammenities";
import { useSession } from '../Context/SessionContext';

const EditCard = ({ editData }) => {
  const {sessionData} = useSession();
  const [newData, setEditedData] = useState(editData);
  const [newAmenities , setNewAmenities] = useState(JSON.parse(newData.amenities));
  const[hideCard , setHideCard] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "amenities") {
        setNewAmenities((prevData) => 
          checked ? [...prevData, value] : prevData.filter((item) => item !== value)
        );
      }else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const newUpdatedData = {
   ...newData,
    amenities : JSON.stringify(newAmenities),
    seller_email : sessionData?.email || "",
  }
  const updateData= async ()=>{
    for (let key in newUpdatedData) {
        if (typeof newUpdatedData[key] === "string" && newUpdatedData[key].trim().length === 0) {
            window.failure("Fields can't be empty");
            return;
        }
        else if(newUpdatedData[key] <= 0){
            window.failure("Provide valid data");
            return;
        }
    }

    try{
        const response = await fetch("http://localhost:3008/hotels/update-listing",{
            method:"PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(newUpdatedData)
        })
        const data = await response.json();
        if(response.ok){
            window.success(data.message);
        }else{
            window.failure(data.message);
        }
    }
    catch{
        window.failure("Server error!")
    }
  }

  const deleteData = async (event)=>{
    const dataId = event.currentTarget.getAttribute("data-id");
    if(!dataId){
      window.failure("Please try again later!");
      return
    }
    try{
      const response = await fetch("http://localhost:3008/hotels/delete-listing",{
          method:"DELETE",
          headers : {
              "Content-Type" : "application/json"
          },
          body : JSON.stringify(
            {
            seller_email : newUpdatedData.seller_email,
            hotel_id : dataId,
          })
      })
      const data = await response.json();
      if(response.ok){
          window.success(data.message);
          setHideCard(dataId)
      }else{
          window.failure(data.message);
      }
    }
    catch{
      window.failure("Server error!")
    }
  }
  
  return (
    <div style={hideCard === editData.hotel_id ? { display: "none" } : {}}  className="ec_card">
      <small className='label'>Hotel name</small>
      <input
        className="ec_input"
        name="hotel_name"
        onChange={handleChange}
        value={newData.hotel_name || ''}
      />

      <input
        type='hidden'
        name='hotel_id'
        value={newData.hotel_id}
      />

      <small className='label'>Hotel location</small>
      <input
        className="ec_input"
        name="hotel_location"
        onChange={handleChange}
        value={newData.hotel_location || ''}
      />

      <small className='label'>Room price per night</small>
      <input
      type='number'
        className="ec_input"
        name="price"
        onChange={handleChange}
        value={`${newData.price || ''}`}
      />

      <small className='label'>Room number</small>
      <input
        className="ec_input"
        name="room_number"
        onChange={handleChange}
        value={`${newData.room_number || ''}`}
      />

      <small className='label'>Room capacity</small>
      <input
        type='number'
        min="1"
        className="ec_input"
        name="room_capacity"
        onChange={handleChange}
        value={`${newData.room_capacity || ''}`}
      />

     <small style={{marginBottom:"2px"}} className='label'>Hotel amenities</small>
      <div className="p_form_group">
        <div className="ec_amenity_list lp_amenities">
          {amenitiesList.map((amenity, i) => (
            <>
              <label className='lp_checkbox' htmlFor={amenity+"_"+newData.hotel_id}>
              <input
                name="amenities"
                onChange={handleChange}
                id={amenity+"_"+newData.hotel_id}
                checked={newAmenities?.includes(amenity) || false}
                value={amenity}
                type="checkbox"
              />
              <span className="custom_checkbox">{amenity}</span>
              </label>
            </>
          ))}
        </div>
      </div>

      <div className="ec_buttons">
        <button onClick={updateData} className="ec_button_save">Save Details</button>
        <button onClick={deleteData} data-id={`${editData.hotel_id}`} className="ec_button_delete">
          Delete <i className="ri-delete-bin-5-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default EditCard;
