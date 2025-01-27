import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import amenitiesIcons from "./Ammenities";
import amenitiesList from "./AmmentiesIcon";

const ProductPage = () => {
  const { id } = useParams();
  const [hotelData, setHotelData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // rating section
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [user_phonenumber, setUserPhonenumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3008/add-rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating, user_phonenumber, id }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchRating();
        window.success(data.message)
      }else{
        window.success("Please try again later")
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReview("");
      setRating(1);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await fetch(`http://localhost:3008/get-rating/${id}`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setRatingData(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRating();
  }, []);


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
        {
  <>
    {ratingData?.reviews?.length > 0 && <>
      <h3 style={{fontWeight:"550",marginTop:"30px",marginBottom:"15px",borderTop:"1px solid #eee",paddingTop:"20px"}}>User Reviews</h3>
    </>}
    {ratingData?.reviews?.length > 0 && (
      <div className="rating-display">
        {ratingData.reviews.map((item, index) => (
          <div key={index} className="review-item">
            <div className="review-info">
              <p className="review-detail"><i style={{fontSize:"25px",position:'relative',top:'3px'}} className="ri-account-circle-fill"></i> {item.user_phone} <span className="rating-stars">{Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}</span></p>
              <p className="review-detail-description">{item.review}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
}

      <div className="add-review">
      <h3 className="text-lg font-semibold mb-2">Add Rating & Review</h3>
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
        <label htmlFor="phone">Phonenumber</label>
        <input
          id="phone"
          pattern="9[0-9]{9}"
          className="user-phonenumber"
          placeholder="eg. 9861041960"
          value={user_phonenumber}
          onChange={(e) => setUserPhonenumber(e.target.value)}
          required
        />

        <label htmlFor="review">Review</label>
        <textarea
        id="review"
        maxLength={200}
        minLength={10}
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button
          type="submit"
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