import React from 'react';

const LocationAndHours = () => {
  return (
    <div className="location-hours-container" style={{ backgroundImage: 'url(/shrimp.jpg)' }}>
      <div className="map-overlay">
        <img
          src="/BembeDirections.png"
          alt="Directions to Bembe"
          className="location-map"
        />
      </div>
      <div className="info-content">
        <h1>Bembe Puerto Rican Dominican Fusion</h1>
        <h2>FREE DELIVERY</h2>
        <p><a href="tel:973-554-5648">973-554-5648</a></p>
        <address>25 Christopher St.<br />New York, NY 10014</address>
        <p className="hours-of-operation">
          <strong>Hours:</strong><br />
          Mon-Fri: 11am - 10:00pm<br />
          Sat-Sun: 12:00pm - 11:00pm
        </p>
      </div>
    </div>
  );
};

export default LocationAndHours;
