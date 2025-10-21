import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ onHamburgerClick }) => {
  return (
    <div className='navbar'>
      {/* Hamburger only shows on small screens */}
      <button
        className="hamburger"
        aria-label="Open menu"
        onClick={onHamburgerClick}
      >
        <span />
        <span />
        <span />
      </button>

      <img className='logo' src={assets.logo} alt="logo" />
      <img className='profile' src={assets.profile_image} alt="profile" />
    </div>
  )
}

export default Navbar
