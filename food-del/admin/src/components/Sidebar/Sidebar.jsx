import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
  const handleNav = () => { if (onClose) onClose() }

  return (
    <>
      {/* overlay for small screens */}
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-options">
          <NavLink to='/add' className="sidebar-option" onClick={handleNav}>
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
          </NavLink>

          <NavLink to='/list' className="sidebar-option" onClick={handleNav}>
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
          </NavLink>

          <NavLink to='/orders' className="sidebar-option" onClick={handleNav}>
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
          </NavLink>

          <NavLink to='/analytics' className="sidebar-option" onClick={handleNav}>
            <img src={assets.order_icon} alt="" />
            <p>Analytics</p>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar
