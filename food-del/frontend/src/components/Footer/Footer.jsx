import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Momo Magic Cafe" className="footer-logo" />
          <p>
            At Momo Magic Cafe, we serve joy wrapped in every momo. A cozy space to relax, eat, and enjoy authentic flavors —
            where every visit feels like home.
          </p>

          <div className="footer-social-icons">
            <a
              href="https://www.facebook.com/share/1BrZRWpBh4/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-link"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>

            <a
              href="https://www.instagram.com/momomagiccafe.bhilai?igsh=MW1hdjFhNW01eTZs"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://www.google.com/maps?rlz=1C1OPNX_enIN1096IN1096&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KcVgdORXPSk6MR1yOyZtRGD_&daddr=block+no+5,+Nehru+Nagar+Main+Rd,+next+to+ek+saath+cafe,+Vidya+Vihar+Colony,+Bhilai,+Chhattisgarh+490020"
              target="_blank"
              rel="noreferrer"
              aria-label="Location"
              className="social-link"
            >
              <i className="fa-solid fa-map-location-dot"></i>
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li onClick={handleHomeClick}>Home</li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/privacy-policy">Privacy policy</Link></li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-6262111109</li>
            <li>Khomesh1008sahu@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">
        Copyright 2024 © Momo Magic Cafe Bhilai - All Right Reserved.
      </p>
      <p className="footer-copyright">
        (Designed and Developed by Team Code2dbug)
      </p>
    </div>
  );
};

export default Footer;
