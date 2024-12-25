import React, { useState , useEffect } from "react";

const HoteListing = () => {
  const [hotelDetails, setHotelDetails] = useState({
    hotel_name: "",
    hotel_location: "",
    l_l : "",
    room_capacity: 1,
    room_type: "standard",
    room_number: "",
    price: "",
    amenities: [],
    images: []
  });

  const amenitiesList = [
    "Free WiFi",
    "Swimming Pool",
    "Parking",
    "Air Conditioning",
    "Restaurant",
    "Gym",
    "Spa",
    "Room Service",
    "Bar",
    "Pet Friendly",
    "Laundry Service",
    "Airport Shuttle",
    "Breakfast Included",
    "Conference Room",
    "24-hour Reception"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setHotelDetails((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value)
    }));
  };


  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setHotelDetails((prevData)=>({...prevData , l_l : `${lat} , ${lon}`}))
          },
          (error) => {
            console.error("Error getting location");
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();
  }, []);


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setHotelDetails((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = () => {
    console.log("Hotel Details:", hotelDetails);
  };

  return (
    <div className="lp_dashboard">

      <div className="lp-container">
        <h3>Descriptive details</h3>
        <div className="lp_form_group">
          <label htmlFor="hotel_name">Hotel Name</label>
          <input
            placeholder="eg. Hotel nuby"
            type="text"
            id="hotel_name"
            name="hotel_name"
            value={hotelDetails.hotel_name}
            onChange={handleInputChange}
            className="lp_input"y
          />
        </div>

        <div className="lp_form_group">
          <label htmlFor="hotel_location">Location</label>
          <input
            placeholder="eg. Pepsicola Kathmandu"
            type="text"
            id="hotel_location"
            name="hotel_location"
            value={hotelDetails.hotel_location}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>

        <div className="lp_form_group">
          <label htmlFor="room_capacity">Room Capacity <small>(person)</small></label>
          <input
            type="number"
            id="room_capacity"
            name="room_capacity"
            min="1"
            value={hotelDetails.room_capacity}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>

        <div className="lp_form_group">
          <label>Room Type</label>
          <select
            name="room_type"
            value={hotelDetails.room_type}
            onChange={handleInputChange}
            className="lp_select"
          >
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </div>

        <div className="lp_form_group">
          <label htmlFor="room_number">Room Number</label>
          <input
            type="text"
            placeholder="eg. R4"
            id="room_number"
            name="room_number"
            value={hotelDetails.room_number}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>

        <div className="lp_form_group">
          <label htmlFor="price">Price per night</label>
          <input
            type="number"
            id="price"
            name="price"
            value={hotelDetails.price}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>
      </div>

        <div className="lp_form_group">
          <h3 style={{marginTop:"20px"}}>Amenities</h3>
            <div className="lp_amenities">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="lp_checkbox">
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={hotelDetails.amenities.includes(amenity)}
                    onChange={handleCheckboxChange}
                  />
                  <span className="custom_checkbox">{amenity}</span>
                </label>
              ))}
            </div>
        </div>

        <div className="lp_form_group">
          <h3 style={{marginTop:"30px"}}>Hotel Images</h3>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="lp_input"
            />
        </div>

        <button className="lp_button" onClick={handleSubmit}>Add listing</button>
    </div>
  );
};

export default HoteListing;