import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservationManagement = () => {
  const [email, setEmail] = useState('');
  const [reservation, setReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

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
    const response = await axios.post('/users/login', { email });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token); // Storing the token
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`; // Setting the default header
    setIsAuthenticated(true);
    // Further actions after successful login
  } catch (error) {
    console.error('Login failed:', error);
  }
};

  //Visitor's email is used to fetch the reservation
  const fetchReservation = async (email) => {
    try {
      const response = await axios.get(`/reservations?email=${email}`);
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
      await axios.delete(`/reservations/${reservation.id}`);
      setReservation(null); // Clear the reservation after deletion
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleMakeReservationClick = () => {
    navigate('/reservations');
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
      ) : null}
      {!reservation ? (
        <div>
          <p>No reservation made yet.</p>
          <button onClick={handleMakeReservationClick}>Make A Reservation</button>
        </div>
      ) : (
        <div>
          <h2>Your Reservation</h2>
          <p>Reservation details...</p>
          <button onClick={handleUpdateReservationClick}>Update Reservation</button>
          <button onClick={handleDeleteReservation}>Cancel Reservation</button>
        </div>
      )}
    </div>
  );
}

export default ReservationManagement;


