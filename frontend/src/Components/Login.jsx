import React from 'react'
import { Link } from 'react-router-dom'
import { useState , useEffect } from 'react'
const Login = () => {
  const[eye , setEye] = useState(false);
  const[loginData , setLoginData] = useState({
    email : "",
    password : "",
  });
  const handleChange = (event) =>{
    const {name , value} = event.currentTarget;
    setLoginData((prevData)=>({...prevData , [name] : value})
    )
  }
  const handleLogin=()=>{
    console.log(loginData)
  }
  return (
<div className="signup-container">
        <h1 className="signup-title">Login</h1>

        <label>Email*</label>
        <input onChange={handleChange} name='email' type="email" placeholder="Email" className="signup-input" />

        <label>Password*</label>
        <div className='password-wrapper'>
          <input onChange={handleChange} name='password' style={{border:"0",margin:"0px"}} type={!eye ? "password" : "text"} placeholder="Password" className="signup-input" />
          <div onClick={()=>(setEye(!eye))}>{eye ? <><i className='ri-eye-line'></i></> : <><i className='ri-eye-close-line'></i></>}</div>
        </div>
        <button onClick={handleLogin} className="signup-button">Login</button>
        
        <p className="signup-login">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
    </div>
  )
}
export default Login