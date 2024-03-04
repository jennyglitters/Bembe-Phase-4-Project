import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from './ReservationForm';

const ReservationManager = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setEmail(foundUser.email);
      setIsAuthenticated(true);
      fetchReservations(foundUser.email);
    }
  }, []);

  const handleLogin = async (email) => {
    // Authenticate the user and fetch the reservations
    try {
      const response = await axios.post('/api/auth/login', { email });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data));
      fetchReservations(email);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
    }
  };

  const fetchReservations = async (email) => {
    try {
      const response = await axios.get(`/api/reservations?email=${email}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleUpdateReservation = async (updatedReservationData) => {
    try {
      const response = await axios.put(`/api/reservations/${updatedReservationData.id}`, updatedReservationData);
      setReservations(reservations.map(reservation =>
        reservation.id === updatedReservationData.id ? response.data : reservation
      ));
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`/api/reservations/${reservationId}`);
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleSelectReservation = (reservationId) => {
    const reservation = reservations.find(reservation => reservation.id === reservationId);
    setSelectedReservation(reservation);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setEmail('');
    setReservations([]);
    setSelectedReservation(null);
  };

  return (
    <div>
      <h1>Bembe</h1>
      {!isAuthenticated ? (
        <div>
          <h2>Sign In:</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => handleLogin(email)}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          {reservations.length > 0 ? (
            <>
              <h2>Your Reservations</h2>
              {reservations.map(reservation => (
                <div key={reservation.id}>
                  {/* Display reservation details */}
                  <button onClick={() => handleSelectReservation(reservation.id)}>Update</button>
                  <button onClick={() => handleDeleteReservation(reservation.id)}>Delete</button>
                </div>
              ))}
            </>
          ) : (
            <p>No reservations made yet.</p>
          )}
          {selectedReservation ? (
            <ReservationForm reservation={selectedReservation} onSubmit={handleUpdateReservation} />
          ) : (
            <button onClick={() => setSelectedReservation({})}>Make A Reservation</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationManager;