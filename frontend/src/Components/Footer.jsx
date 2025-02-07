import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="content">
        <h2 className="title">Nuby</h2>
        <p className="description">
        Nuby helps you find and book the perfect hotel with ease.
        Enjoy a user-friendly platform for exploring options and managing favorites.
        Effortless bookings for a seamless travel experience.
        </p>
        <div className="menu">
          <Link to="." className="menuItem">Home</Link>
          <Link to="/login" className="menuItem">Login</Link>
          <Link to="/signup" className="menuItem">Signup</Link>
        </div>
        <p className="credit">
          Designed By <a className="link">Team Nuby</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
