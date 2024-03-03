import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <div className="delivery-info">
        <a href="tel:973-554-5648">free delivery 973-554-5648</a>
      </div>
      <div className="nav-links">
        <NavLink exact to="/" activeClassName="active">Home</NavLink>
        <NavLink to="/reservations" activeClassName="active">Reservations</NavLink>
        <NavLink to="/menu" activeClassName="active">Menu</NavLink>
        <NavLink to="/location-hours" activeClassName="active">Location & Hours</NavLink>
      </div>
      <div className="login">
        <NavLink to="/login" activeClassName="active">Login</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;