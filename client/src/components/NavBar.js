import React from 'react';
import { Link } from 'react-router-dom';



const NavBar = () => {
  return (
    <nav>
      <div className="delivery-info">
        free delivery 973-554-5648
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/reservations">Reservations</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/location-hours">Location & Hours</Link>
      </div>
      <div className="login">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default NavBar;