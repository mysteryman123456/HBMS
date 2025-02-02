import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/NUBY.png";

const Navbar = () => {
  const [favCount, setFavCount] = useState(0);

  // Function to fetch favorites from localStorage and update count
  const updateFavCount = () => {
    const favHotels = JSON.parse(localStorage.getItem("favoriteHotels")) || [];
    setFavCount(favHotels.length);
  };

  useEffect(() => {
    updateFavCount(); // Initial fetch

    // Listen for localStorage changes
    const handleStorageChange = () => {
      updateFavCount();
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <nav>
      <div className="logo">
        <Link to="/">
          <img draggable={false} height={40} width={100} src={logo} alt="nuby" />
        </Link>
      </div>
      <div className="nav-right-side">
        <div className="list fav-list">
          <i className="ri-heart-fill"></i>
          <div>
            <Link to="/favourites">
              Favourites <span>({favCount})</span>
            </Link>
          </div>
        </div>
        <div className="list">
          <i className="ri-add-box-fill"></i>
          <div>
            <Link to="/hotel-admin-dashboard">List your Hotel</Link>
          </div>
        </div>
        <div className="login-signup">
          <i className="ri-account-circle-fill"></i>
          <div style={{ color: "darkgrey" }}>
            <Link to="/login">Login</Link> / <Link to="/signup"> Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
