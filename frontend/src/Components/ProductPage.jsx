import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import amenitiesIcons from "./Ammenities";
import amenitiesList from "./AmmentiesIcon";

const ProductPage = () => {
  const { id } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  // rating section
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3008/add-rating/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating, id }),
      });
      if (response.ok) {
        const data = await response.json();
        setHotelData(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReview("");
      setRating(1);
    }
  };
  

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/get-hotel-listing/${id}`
        );
        if (!response.ok) {
          console.error("Failed to fetch hotel data");
          return;
        }
        const data = await response.json();
        setHotelData(data.message);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!hotelData) {
    return <p>No hotel data found.</p>;
  }

  const {
    hotel_name,
    hotel_location,
    amenities,
    description,
    price,
    room_capacity,
    room_type,
    hotel_image,
  } = hotelData;

  const parsedAmenities = JSON.parse(amenities);

  const sliderSettings = {
    dots: true,
    infinite: hotel_image.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: hotel_image.length > 1,
    autoplaySpeed: 3000,
  };

  return (
    <div className="product-page">
      <div className="hotel-slider">
        <Slider {...sliderSettings}>
          {hotel_image.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`${hotel_name} - ${index + 1}`}
                className="hotel-slider-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="hotel-details">
        <h1 className="hotel-name">{hotel_name}</h1>
        <p className="hotel-location">{hotel_location}</p>
        <p className="hotel-rating">⭐ 4.5</p>
        <p className="hotel-description">
          {description || "No description provided."}
        </p>

        <div className="hotel-amenities">
          <h3>Amenities</h3>
          <ul>
            {parsedAmenities.map((amenity, index) => {
              const iconIndex = amenitiesList.indexOf(amenity);
              return (
                <li key={index}>
                  {iconIndex !== -1 && (
                    <i className={`ri ${amenitiesIcons[iconIndex]}`} />
                  )}
                  {amenity}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="add-review">
      <h3 className="text-lg font-semibold mb-2">Add Your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`text-2xl ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
      </div>
    </div>
  );
};

export default ProductPage;
