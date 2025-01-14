import React, { useEffect, useState } from 'react';
import { data, useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams(); 
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`http://localhost:3008/get-hotel-listing/${id}`);
        if (!response.ok) {
          console.log("An errror occured")
        }
        const data = await response.json();
        if (response.ok) {
          console.log(data.message)
          setHotelData(data.message)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false); 
      }
    };

    fetchHotelData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {
        JSON.stringify(hotelData)
      }
    </div>
  );
};

export default ProductPage;