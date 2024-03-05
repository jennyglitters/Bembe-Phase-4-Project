import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <header>
      <div className="top-bar">
        <div className="delivery-info">
          <span>free delivery</span>
          <a href="tel:973-554-5648">973-554-5648</a>
        </div>
        <div className="manage-reservation">
          <NavLink to="/manage-reservation" className={({ isActive }) => (isActive ? "active" : "")}>
            Manage Reservation
          </NavLink>
        </div>
      </div>
      <nav className="navbar">
        {/* Logo text */}
        <div className="logo">Bembe</div>
        
        {/* Navigation links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? "active" : "")}>Reservations</NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? "active" : "")}>Menu</NavLink>
          <NavLink to="/location-hours" className={({ isActive }) => (isActive ? "active" : "")}>Location & Hours</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;