
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Retrieve favorites from localStorage
    const favHotels = JSON.parse(localStorage.getItem('favoriteHotels')) || [];
    setFavorites(favHotels);
  }, []);

  return (
    <div className="favourites-page">
      <h2>Favourites</h2>
      {favorites.length > 0 ? (
        <div className="favorites-list">
          {favorites.map((hotel, index) => (
            <div key={index} className="favorite-card">
              <img src={hotel.hotel_image} alt={hotel.hotel_name} />
              <div className="favorite-details">
                <h3>{hotel.hotel_name}</h3>
                <p>{hotel.price} NPR</p>
                <Link to={`/hotel/${hotel.hotel_id}`} className="view-details">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No favourites added yet!</p>
      )}
    </div>
  );
};

export default Favourite;
