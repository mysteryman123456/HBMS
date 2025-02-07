import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import amenitiesIcons from "./Ammenities";
import amenitiesList from "./AmmentiesIcon";
import { SessionContext, useSession } from "../Context/SessionContext";
import HotelMap from "./HotelMap";
import HotelBookingCard from "./HotelBookingCard";
import LoaderPage from "./LoaderPage"
const ProductPage = () => {
  const navigate = useNavigate();
  const { sessionData } = useSession(SessionContext);
  const { id } = useParams();
  const [hotelData, setHotelData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!sessionData) {
      navigate("../");
      window.failure("Please login first!");
    }
  }, [sessionData]);
  // Un-comment above lines for allowing users to visit product page only after login

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3008/add-rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review,
          rating,
          user_phonenumber: sessionData?.phonenumber,
          id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchRating();
        window.success(data.message);
      } else {
        window.success("Please try again later");
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
    return <>
    <LoaderPage/>
    </>;
  }

  const {
    hotel_id,
    seller_email,
    hotel_name,
    hotel_location,
    amenities,
    description,
    price,
    room_capacity,
    room_number,
    room_type,
    room_id,
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
        <p className="hotel-rating">
          {ratingData?.averageRating + " star rating" || "No rating provided"}
        </p>
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
        <br />

        {/* cancellation policy */}
        <h2>Cancellation policy</h2>
        <p>Write here about hotels cancelation policy...  hard coded, same for all</p>

        {/* hotel booking details */}
        <HotelBookingCard {...hotelData} sessionData={sessionData}/>

        {/* display hotel map only if available to see */}
        {
          hotelData?.l_l && <>
          <h2>Hotel Map</h2>
        <HotelMap location={hotelData?.l_l} />
        </>
        }


        {
          <>
            {ratingData?.reviews?.length > 0 && (
              <>
                <h3
                  style={{
                    fontWeight: "550",
                    marginTop: "30px",
                    marginBottom: "15px",
                    borderTop: "1px solid #eee",
                    paddingTop: "20px",
                  }}
                >
                  User Reviews
                </h3>
              </>
            )}
            {ratingData?.reviews?.length > 0 && (
              <div className="rating-display">
                {ratingData.reviews.map((item, index) => (
                  <div key={index} className="review-item">
                    <div className="review-info">
                      <p className="review-detail">
                        <i
                          style={{
                            fontSize: "25px",
                            position: "relative",
                            top: "3px",
                          }}
                          className="ri-account-circle-fill"
                        ></i>{" "}
                        {item.user_phone}{" "}
                        <span className="rating-stars">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <span key={i} className="star">
                              ★
                            </span>
                          ))}
                        </span>
                      </p>
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
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
