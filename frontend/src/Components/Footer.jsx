import React from 'react';
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer-container">

            <div className="footer-section">
                <h3 className="footer-title">About Nuby</h3>
                <p className="footer-description">
                  Nuby is your trusted platform for finding and booking the perfect hotel stay. Explore a wide range of options, manage your favorites, and experience effortless bookings. With an intuitive UI/UX design, navigating the platform is seamless and user-friendly, making it easy to find and book your ideal hotel. Whether you’re planning a vacation or a business trip, Nuby ensures a hassle-free experience with quick bookings and personalized options to suit your needs.
                </p>
            </div>  

            <div className="footer-section">
                <h3 className="footer-title">Quick Links</h3>
                <ul className="footer-links">
                    <li><Link to="/login" className="footer-link">Login</Link></li>
                    <li><Link to="/signup" className="footer-link">Signup</Link></li>
                    <li><Link to="/dashboard" className="footer-link">User Dashboard</Link></li>
                    <li><Link to="/hotel-admin" className="footer-link">Hotel Admin Dashboard</Link></li>
                    <li><Link to="/favourites" className="footer-link">My Favourites</Link></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3 className="footer-title">Contact us</h3>
                <p className="footer-description">
                  For any trouble booking through our website please contact us in this Phonenumber <span style={{color:"darkgrey"}}>010000000</span> or Email us at <span style={{color:"darkgrey"}}>noemail@gmail.com</span>
                </p>
            </div>

        </footer>
    );
};

export default Footer;
