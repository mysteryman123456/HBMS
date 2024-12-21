import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../Assets/NUBY.png"
const Navbar = () => {
  return (
    <nav>
      <div className='logo'>
        <Link to="/"><img height={40} width={100} src={logo} alt="nuby" /></Link>
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
            <div><Link to="/signup">Login / Signup</Link></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
