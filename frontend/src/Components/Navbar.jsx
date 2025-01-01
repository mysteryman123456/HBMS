import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../Assets/NUBY.png"
const Navbar = () => {
  return (
    <nav>
      <div className='logo'>
        <Link to="/"><img draggable={false} height={40} width={100} src={logo} alt="nuby" /></Link>
      </div>
      <div className="nav-right-side">
        <div className="list">
            <i className="ri-add-box-fill"></i>
            <div>
              <Link to="/hotel-admin-dashboard">
                List your Hotel
            </Link></div>
        </div>
        <div className="login-signup">
            <i className="ri-account-circle-fill"></i>
            <div style={{color:"darkgrey"}}><Link to="/login">Login</Link> /<Link to="/signup"> Signup</Link></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
