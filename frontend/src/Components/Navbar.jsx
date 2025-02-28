import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/NUBY.png";
import { useSession } from "../Context/SessionContext";
const Navbar = () => {
  const [favCount, setFavCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const { sessionData } = useSession();
  const [role, setRole] = useState("");
  useEffect(() => {
    updateFavorites();
    window.addEventListener("storage", updateFavorites);
    return () => {
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  useEffect(() => {
    if (sessionData?.role) {
      setRole(sessionData?.role);
    }
    console.log(sessionData?.role);
  }, [sessionData]);

  const updateFavorites = () => {
    const favHotels = JSON.parse(localStorage.getItem("favoriteHotels")) || [];
    setFavorites(favHotels);
    setFavCount(favHotels.length);
  };

  const removeFavorite = (hotelId) => {
    const updatedFavorites = favorites.filter(
      (hotel) => hotel.hotel_id !== hotelId
    );
    setFavorites(updatedFavorites);
    setFavCount(updatedFavorites.length);
    localStorage.setItem("favoriteHotels", JSON.stringify(updatedFavorites));
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            draggable={false}
            height={40}
            width={100}
            src={logo}
            alt="nuby"
          />
        </Link>
      </div>

      <div className="nav-right-side">
        <div
          className="list fav-list"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <i className="ri-heart-fill"></i>
          <div>
            <div>
              Favourites <span>({favCount})</span>
            </div>
          </div>

          {isHovered && favorites.length > 0 && (
            <div className="favorites-list">
              {favorites.map((hotel) => (
                <div key={hotel.hotel_id} className="favorite-card">
                  <img src={hotel.hotel_image} alt={hotel.hotel_name} />
                  <div className="favorite-details">
                    <h4>{hotel.hotel_name}</h4>
                    <small className="price">{hotel.price} NPR</small>
                    <Link
                      to={`/hotel/${hotel.hotel_id}`}
                      className="view-details"
                    >
                      View Details
                    </Link>
                    <button
                      className="remove-btn"
                      onClick={() => removeFavorite(hotel.hotel_id)}
                    >
                      <i className="ri-delete-back-2-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {role === "hotel_admin" ? (
          <>
          <div className="list">
            <i className="ri-add-box-fill"></i>
            <Link to="/hotel-admin-dashboard">List your Hotel</Link>
          </div>
          </>
        ) : role === "user" ? (
          <div className="list">
            <i className="ri-dashboard-fill"></i>
            <Link to="/user/user-dashboard">My dashboard</Link>
          </div>
        ) : null}

        <div className="login-signup">
          <i className="ri-account-circle-fill"></i>
          <div style={{ color: "darkgrey" }}>
            <Link to="/login">Login</Link> / <Link to="/signup"> Signup</Link>
          </div>
        </div>

        <div className="login-signup">
          <i className="ri-logout-box-r-fill"></i>
          <div style={{ color: "darkgrey" }}>
            <Link to="/logout">Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
