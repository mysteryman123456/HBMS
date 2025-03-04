import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {

  const[eye , setEye] = useState(false);
  const[loading , setLoading] = useState(false);
  const[loginData , setLoginData] = useState({
    email : "",
    password : "",
  });
  const handleChange = (event) =>{
    const {name , value} = event.currentTarget;
    setLoginData((prevData)=>({...prevData , [name] : value})
    )
  }

  const handleLogin= async ()=>{
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3008/users/login", { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();

      if (response.ok && response.status === 200) {
        window.success(data.message);
        localStorage.setItem("token",data.token)
        window.location.href = "./"
      } else {
        window.failure(data.message);
      }
    } catch (error) {
      console.log('Error login');
    }
    finally{
      setLoading(false);
    }
  }

  return (
<div className="signup-container">
        <h1 className="signup-title">Welcome Back!</h1>

        <label>Email*</label>
        <input onChange={handleChange} name='email' type="email" placeholder="Email" className="signup-input" />

        <label>Password*</label>
        <div className='password-wrapper'>
          <input onChange={handleChange} name='password' style={{border:"0",margin:"0px"}} type={!eye ? "password" : "text"} placeholder="Password" className="signup-input" />
          <div onClick={()=>(setEye(!eye))}>{eye ? <><i className='ri-eye-line'></i></> : <><i className='ri-eye-close-line'></i></>}</div>
        </div>

        <button disabled={loading === true ? true : false} onClick={handleLogin} className="signup-button">{loading === true ? "Please wait..." : "Login"}</button>
        
        <p className="signup-login">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
    </div>
  )
}
export default Login