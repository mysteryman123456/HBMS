import React , {useState} from 'react'
import { useLocation } from 'react-router-dom'
import amenitiesList from './Ammenities';

const SearchPage = () => {
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search)
  const hotel_location = queryParameters.get("hotel_location")
  const hotel_name = queryParameters.get("hotel_name")
  const guest_count = queryParameters.get("guest_count")

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortedPrice: "",
    rating: "",
    sortedRating: "",
    roomCategories: [],
    hotelFacilities: [],
  });

  const handleFilter = () => {
    console.log(filters);
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
              type="text"
              className="filter_search_input"
              placeholder="Search here..."
              name="search"
              value={filters.search}
              onChange={handleInputChange}
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
              {["Standard room", "Deluxe room"].map((room) => (
                <label key={room}>
                  <input
                    type="checkbox"
                    name="roomCategories"
                    value={room}
                    checked={filters.roomCategories.includes(room)}
                    onChange={handleInputChange}
                  />
                  {room}
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
        Search card here....
      </div>
    </div>
  )
}

export default SearchPage
