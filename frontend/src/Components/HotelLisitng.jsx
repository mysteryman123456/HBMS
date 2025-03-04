import React, { useState, useEffect } from "react";
import { useSession } from '../Context/SessionContext';
import amenitiesList from "./Ammenities";

const HotelListing = () => {
  const { sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [hotelDetails, setHotelDetails] = useState({
    seller_email: "",
    hotel_name: "",
    hotel_location: "",
    l_l: "",
    room_capacity: 1,
    room_type: "standard",
    room_number: "",
    price: "",
    description: "",
    amenities: [],
    images: []
  });

  useEffect(() => {
    if (sessionData?.email) {
      setHotelDetails((prevData) => ({
        ...prevData,
        seller_email: sessionData.email,
      }));
    }
  }, [sessionData]);

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
            setHotelDetails((prevData) => ({ ...prevData, l_l: `${lat}, ${lon}` }));
          },
          (error) => {
            console.error("Error getting location:", error);
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

  const handleSubmit = async () => {
    if (!hotelDetails.images || hotelDetails.images.length === 0) {
      window.failure("One image is required");
      return;
    }

    if (isNaN(hotelDetails.price) || hotelDetails.price <= 0) {
      window.failure("Please enter a valid price");
      return;
    }

    const requiredFields = [
      'hotel_name',
      'hotel_location',
      'l_l',
      'room_capacity',
      'room_type',
      'room_number',
    ];

    const toTitle = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    for (const field of requiredFields) {
      if (!hotelDetails[field]) {
        window.failure(`${toTitle(field.replace('_', ' '))} is required`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("hotel_name", hotelDetails.hotel_name);
    formData.append("hotel_location", hotelDetails.hotel_location);
    formData.append("l_l", hotelDetails.l_l);
    formData.append("room_capacity", hotelDetails.room_capacity);
    formData.append("room_type", hotelDetails.room_type);
    formData.append("room_number", hotelDetails.room_number);
    formData.append("price", hotelDetails.price);
    formData.append("description", hotelDetails.description);
    formData.append("seller_email", hotelDetails.seller_email);
    formData.append("amenities", JSON.stringify(hotelDetails.amenities));

    hotelDetails.images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true)

    try {
      const response = await fetch("http://localhost:3008/hotels/add-hotel", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && response.status === 201) {
        window.success(data.message);
      } else {
        window.failure(data.message);
      }
    } catch (error) {
      console.error("Error submitting hotel listing:", error);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="lp_dashboard">
      <div className="lp-container">
        <h3>Descriptive details</h3>
        <div className="lp_form_group">
          <label htmlFor="hotel_name">Hotel Name</label>
          <input
            placeholder="eg. Hotel Nuby"
            type="text"
            id="hotel_name"
            name="hotel_name"
            value={hotelDetails.hotel_name}
            onChange={handleInputChange}
            className="lp_input"
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
          <label htmlFor="room_capacity">
            Room Capacity <small>(person)</small>
          </label>
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
            placeholder="eg. 1290"
            type="number"
            id="price"
            name="price"
            value={hotelDetails.price}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>

        <div className="lp_form_group">
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="eg. Hotel description"
            type="text"
            id="description"
            name="description"
            value={hotelDetails.description}
            onChange={handleInputChange}
            className="lp_input"
          />
        </div>
      </div>

      <div className="lp_form_group">
        <h3 style={{ marginTop: "20px" }}>Amenities</h3>
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
        <h3 style={{ marginTop: "30px" }}>Hotel Images</h3>
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

      <button className="lp_button" onClick={handleSubmit} disabled={loading}>{loading ? "Adding..." : "Add Listing"}</button>
    </div>
  );
};

export default HotelListing;