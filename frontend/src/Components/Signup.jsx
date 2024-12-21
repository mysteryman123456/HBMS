import React from 'react';
import { useState , useEffect } from 'react';
import {Link} from 'react-router-dom';
const Signup = () => {
  const[eye , setEye] = useState(false);
  const[signupData , setSignupData] = useState({
    email : "",
    password : "",
    confirm_password : "",
    fullname : "",
    role : "",
    phonenumber : "",
  });
  const handleChange = (event) =>{
    const {name , value} = event.currentTarget;
    setSignupData((prevData)=>({...prevData , [name] : value})
    )
  }
  const handleSignup=()=>{
    console.log(signupData)
  }
  return (
    <div className="signup-container">
        <h1 className="signup-title">Create your Account</h1>

        <label>Fullname*</label>
        <input onChange={handleChange} name='fullname' type="text" placeholder="Full Name" className="signup-input" />

        <label>Email*</label>
        <input onChange={handleChange}  name='email' type="email" placeholder="Email" className="signup-input" />

        <label>Phonenumber*</label>
        <input onChange={handleChange}  name='phonenumber' type="number" placeholder="Phonenumber" className="signup-input" />

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
        <button onClick={handleSignup} className="signup-button">Signup</button>
        <p className="signup-login">
          Already have an account? <Link to="/login">Login</Link>
        </p>
    </div>
  );
};

export default Signup;
