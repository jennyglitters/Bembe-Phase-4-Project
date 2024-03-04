import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservationManager = () => {
  const [email, setEmail] = useState('');
  const [reservation, setReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setEmail(foundUser.email);
      setIsAuthenticated(true);
      fetchReservation(foundUser.email);
    }
  }, []);

  const handleLogin = async (email) => {
    try {
      const response = await axios.post('/api/auth/login', { email });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data));
      fetchReservation(email);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchReservation = async (email) => {
    try {
      const response = await axios.get(`/api/reservations?email=${email}`);
      setReservation(response.data); // Assuming the backend returns the most recent reservation for this email
    } catch (error) {
      console.error('Error fetching reservation:', error);
    }
  };

  const handleUpdateReservationClick = () => {
    navigate('/reservation', { state: { reservation: reservation, isNew: false } });
  };

  const handleDeleteReservation = async () => {
    try {
      await axios.delete(`/api/reservations/${reservation.id}`);
      setReservation(null); // Clear the reservation after deletion
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleMakeReservationClick = () => {
    navigate('/reservation', { state: { email: email, isNew: true } });
  };

  return (
    <div>
      <h1>Manage Your Reservation</h1>
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
      ) : !reservation ? (
        <div>
          <h2>Your Reservation</h2>
          <p>Reservation details...</p>
          <button onClick={handleUpdateReservationClick}>Update Reservation</button>
          <button onClick={handleDeleteReservation}>Cancel Reservation</button>
        </div>
      ) : (
        <div>
          <p>No reservation made yet.</p>
          <button onClick={handleMakeReservationClick}>Make A Reservation</button>
        </div>
      )}
    </div>
  );
};

export default ReservationManager;