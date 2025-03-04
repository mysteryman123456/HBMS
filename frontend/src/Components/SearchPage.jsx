import React , {useEffect, useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import amenitiesList from './Ammenities';
import amenitiesIcons from './AmmentiesIcon';
import LoaderPage from "./LoaderPage"
import NotFound from './NotFound';

const SearchPage = () => {
  const[filterSearch , setFilterSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(location.search)

  const hotel_location = queryParameters.get("hotel_location")
  const hotel_name = queryParameters.get("hotel_name")
  const guest_count = queryParameters.get("guest_count")

  const[listingData , setListingData] = useState([]);
  const[loading , setLoading] = useState(true);

  const addToFav = (hotel_id, hotel_name, price, hotel_image) => {
    const favHotels = JSON.parse(localStorage.getItem("favoriteHotels")) || [];
    const isAlreadyFav = favHotels.some((hotel) => hotel.hotel_id === hotel_id);
    if (!isAlreadyFav) {
      const newFavHotel = { hotel_id, hotel_name, price, hotel_image };
      favHotels.push(newFavHotel);
      localStorage.setItem("favoriteHotels", JSON.stringify(favHotels));
      window.dispatchEvent(new Event("storage"));
      window.success("Added Successfully !")
    } else {
      window.failure("Already added !");
    }
  };

  useEffect(() => {
    const containers = document.querySelectorAll(".filter_section");

    const filterContainers = () => {
      const searchText = filterSearch.toLowerCase();
      containers.forEach((container) => {
        container.style.display = container.textContent
          .toLowerCase()
          .includes(searchText)
          ? "block"
          : "none";
      });
    };
    filterContainers()
  }, [filterSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/hotels/get-searched-listing/?hotel_name=${hotel_name}&hotel_location=${hotel_location}&guest_count=${guest_count}`,
          {
            method: 'GET',
          }
        );
        if (response.ok) {
          const data = await response.json();
          setListingData(data.message);
        } else {
          console.log("Error fetching!");
        }
      } catch (err) {
        console.error("Error:", err);
      }
      finally{
        setLoading(false)
      }
    };
  
    fetchData();
  }, [hotel_name, hotel_location, guest_count]);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortedPrice: "",
    rating: "",
    sortedRating: "",
    roomCategories: [],
    hotelFacilities: [],
  });

  const handleFilter = async () => {
    try {
      const query = new URLSearchParams({
        hotel_name,
        hotel_location,
        guest_count,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortedPrice: filters.sortedPrice,
        rating: filters.rating,
        sortedRating: filters.sortedRating,
        roomCategories: filters.roomCategories.join(","),
        hotelFacilities: filters.hotelFacilities.join(","),
      }).toString();

      const response = await fetch(`http://localhost:3008/hotels/get-searched-listing/?${query}`);
      if (response.ok) {
        const data = await response.json();
        setListingData(data.message);
      } else {
        setListingData([]);
        console.log("Error fetching filtered data!");
      }
    } catch (err) {
      setListingData([]);
      console.error("Error:", err);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const listName = name === "roomCategories" ? "roomCategories" : "hotelFacilities";
      setFilters((prevFilters) => ({
        ...prevFilters,
        [listName]: checked
          ? [...prevFilters[listName], value]
          : prevFilters[listName].filter((item) => item !== value),
      }));
    } else if (type === "radio") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        rating: value,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
   
  };

if (loading) return(<>
    <LoaderPage/>
</>)

  return (
    <div className='search-page'>
        <div className="filter_container">
          <div className="filter_header">
            <h2>Filters</h2>
            <button
              className="filter_clear"
              onClick={() =>
                setFilters({
                  search: "",
                  minPrice: "",
                  maxPrice: "",
                  sortedPrice: "",
                  rating: "",
                  sortedRating: "",
                  roomCategories: [],
                  hotelFacilities: [],
                })
              }
            >
              Clear All
            </button>
          </div>

          <div className="filter_search">
            <input
              value={filterSearch}
              onChange={(e)=>setFilterSearch(e.target.value)}
              type="text"
              className="filter_search_input"
              placeholder="Search here..."
              name="search"
            />
          </div>

          <div className="filter_section">
            <h3>Price Range</h3>
            <div className="filter_price">
              <input
                type="number"
                className="filter_price_input"
                placeholder="Min Price"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
              />
              <span>-</span>
              <input
                type="number"
                className="filter_price_input"
                placeholder="Max Price"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="filter_section">
            <h3>Sort Price</h3>
            <div className="filter_price">
              <select
                name="sortedPrice"
                value={filters.sortedPrice}
                onChange={handleInputChange}
              >
                <option value="">Default</option>
                <option value="l_h">Low to High</option>
                <option value="h_l">High to Low</option>
              </select>
            </div>
          </div>

          <div className="filter_section">
            <h3>Ratings</h3>
            <div className="filter_ratings">
              {[2, 3, 4, 5].map((stars) => (
                <label className="rating_option" key={stars}>
                  <input
                    type="radio"
                    name="rating"
                    value={stars}
                    checked={filters.rating === `${stars}`}
                    onChange={handleInputChange}
                  />
                  <div>
                    {[...Array(stars)].map((_, idx) => (
                      <i key={idx} className="ri-star-fill"></i>
                    ))}
                    <span>& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="filter_section">
            <h3>Sort Rating</h3>
            <div className="filter_price filter_rating">
              <select
                name="sortedRating"
                value={filters.sortedRating}
                onChange={handleInputChange}
              >
                <option value="">Default</option>
                <option value="r_l_h">Low to High</option>
                <option value="r_h_l">High to Low</option>
              </select>
            </div>
          </div>

          <div className="filter_section">
            <h3>Room Categories</h3>
            <div className="filter_categories">
              {["Standard", "Deluxe"].map((room) => (
                <label key={room}>
                  <input
                    type="checkbox"
                    name="roomCategories"
                    value={room}
                    checked={filters.roomCategories.includes(room)}
                    onChange={handleInputChange}
                  />
                  {room + " room"}
                </label>
              ))}
            </div>
          </div>

          <div className="filter_section">
            <h3>Hotel Facilities</h3>
            <div className="filter_facilities">
              {amenitiesList.map((amenity) => (
                <label key={amenity}>
                  <input
                    type="checkbox"
                    name="hotelFacilities"
                    value={amenity}
                    checked={filters.hotelFacilities.includes(amenity)}
                    onChange={handleInputChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
          <button className="filter_btn" onClick={handleFilter}>
            Filter results
          </button>
        </div>
        <div className="search-card">
        {listingData.length > 0 ? (
          listingData.map((card, index) => (
            <div key={index} className="card">
              <div className="card-image">
                <img src={card.hotel_image} alt={card.hotel_name} />
              </div>
              <div className="card-details">
                <h3 className="hotel-name">{card.hotel_name}</h3>
                <p className="hotel-location">{card.hotel_location}</p>
                <p className="room-details">{card.room_type} room • {card.room_capacity} people</p>
                <p className="amenities">
                  {JSON.parse(card.amenities)
                    .slice(0, 5)
                    .map((amenity, index) => {
                      const amenityIndex = amenitiesList.indexOf(amenity);
                      const iconClass = amenitiesIcons[amenityIndex];
                      return (
                        <div className="amenity" key={index}>
                          <i className={`${iconClass}`}></i>
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  {JSON.parse(card.amenities).length > 5 && (
                    <span> + {JSON.parse(card.amenities).length - 5} more
                    </span>
                  )}
                </p>
                <p className="rating">{card.avg_rating ? Number(card.avg_rating).toFixed(1) + " avg rating" : <>< i className="ri-star-off-line"></i> Not rated yet</>}</p>
                <div className="price-details">
                  <span className="price">NPR {Number(card.price).toFixed(2)}</span>
                  <small> per night</small>
                </div>
                <div className="card-actions">
                  <button onClick={()=>(navigate(`../hotel/${card.hotel_id}`))} className="view-details">View Details</button>
                  <button onClick={() =>addToFav(card.hotel_id,card.hotel_name,card.price,card.hotel_image)}className="book-now">Add to Favourites</button>
                </div>
                
              </div>
            </div>
          ))
        ) : (
          <>
          <NotFound/>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage