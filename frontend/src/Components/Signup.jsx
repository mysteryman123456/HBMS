import React from 'react';
import { useState} from 'react';
import {Link , useNavigate} from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const[eye , setEye] = useState(false);
  const[loading , setLoading] = useState(false);
  const[signupData , setSignupData] = useState({
    email : "",
    password : "",
    confirm_password : "",
    username : "",
    role : "user",
    phone : "",
  });

  const handleChange = (event) =>{
    const {name , value} = event.currentTarget;
    setSignupData((prevData)=>({...prevData , [name] : value})
    )
  }
  const handleSignup = async () => {
    if (!signupData.username || !signupData.email || !signupData.phone || !signupData.password || !signupData.confirm_password || !signupData.role) {
      window.failure("All fields are required");
      return;
    }

    if(signupData.password !== signupData.confirm_password){
      window.failure("Password do not match!")
      return
    }

    if(!/^9\d{9}$/.test(signupData.phone)) return window.failure("Invalid phonenumber!")


    setLoading(true);
    try {
      const response = await fetch("http://localhost:3008/users/signup", { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
  
      const data = await response.json();
  
      if (response.ok && response.status === 201) {
        window.success(data.message);
        navigate("/login");
      } else {
        window.failure(data.message);
      }
    } catch (error) {
      console.log('Error during signup');
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div className="signup-container">
        <h1 className="signup-title">Create your Account</h1>

        <label>Username*</label>
        <input onChange={handleChange} name='username' type="text" placeholder="Username" className="signup-input" />

        <label>Email*</label>
        <input onChange={handleChange}  name='email' type="email" placeholder="Email" className="signup-input" />

        <label>Phonenumber*</label>
        <input onChange={handleChange}  name='phone' type="number" placeholder="Phonenumber" className="signup-input" />

        <label>Password*</label>
        <div style={{marginBottom:"20px"}} className='password-wrapper'>
          <input onChange={handleChange}  name='password' style={{border:"0",margin:"0px"}} type={!eye ? "password" : "text"} placeholder="Password" className="signup-input" />
          <div onClick={()=>(setEye(!eye))}>{eye ? <><i className='ri-eye-line'></i></> : <><i className='ri-eye-close-line'></i></>}</div>
        </div>

        <label>Confirm Password*</label>
        <input onChange={handleChange}  type="password" name='confirm_password' placeholder="Confirm password" className="signup-input" />

        <label>Role*</label>
        <select name='role' onChange={handleChange}>
          <option value="" disabled>
            Choose role
          </option>
          <option value="user">User</option>
          <option value="hotel_admin">Hotel Admin</option>
        </select>
        <button onClick={handleSignup} disabled={loading === true ? true : false} className="signup-button">{loading ? "Please wait..." : "Signup"}</button>
        <p className="signup-login">
          Already have an account? <Link to="/login">Login</Link>
        </p>
    </div>
  );
};

export default Signup;














//   // Function to add a hotel to favorites (localStorage)
//   const addToFav = (hotel_id, hotel_name, price, hotel_image) => {
//     const favHotels = JSON.parse(localStorage.getItem("favoriteHotels")) || [];

//     // Check if the hotel is already in favorites
//     const isAlreadyFav = favHotels.some((hotel) => hotel.hotel_id === hotel_id);

//     if (!isAlreadyFav) {
//       const newFavHotel = { hotel_id, hotel_name, price, hotel_image };
//       favHotels.push(newFavHotel);
//       localStorage.setItem("favoriteHotels", JSON.stringify(favHotels));
//       console.log("Added to favorites:", newFavHotel);
//     } else {
//       console.log("Hotel already in favorites.");
//     }
//   };



  // <button onClick={() =>addToFav(card.hotel_id,card.hotel_name,card.price,card.hotel_image)}className="book-now">Add to Favourites</button>