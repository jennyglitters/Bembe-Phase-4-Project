import React from 'react';

const Home = () => {
  return (
    <div className="location-hours-container" style={{ backgroundImage: 'url(/spanish-food.jpg)' }}>
      <div className="map-overlay">
      </div>
      <div className="info-content">
        <h1>Bembe</h1>
        <h2>Puerto Rican/Dominican Fusion</h2>
        <h3>FREE DELIVERY</h3>
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

export default Home;


