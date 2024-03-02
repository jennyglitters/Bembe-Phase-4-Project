import React from 'react';

const LocationAndHours = () => {
    return (
        <div className='location-hours'>
            <h1>Bembe Puerto Rican Dominican Fusion</h1>
            <h2>FREE DELIVERY</h2>
            <p>973-554-5648</p>
            <address>
                25 Christopher St.<br />
                New York, NY 10014
            </address>
            <img
                src="/BembeDirections.png"
                alt="Directions to Bembe"
                className="location-map"
            />
            <p className="hours-of-operation">
                <strong>Hours:</strong><br />
                Mon-Fri: 11am - 10:00pm<br />
                Sat-Sun: 12:00pm - 11:00pm
            </p>
        </div>
    );
};

export default LocationAndHours;