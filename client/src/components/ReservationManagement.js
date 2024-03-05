import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservationManagement = () => {
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

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        user_email: email,
        password,
      });
      if (response.status === 200) {
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        setIsAuthenticated(true);
      } else {
        console.error('Login failed:');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
    }
  };

  const updateReservation = async (reservationId, updatedData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/reservations/${reservationId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        console.log("Reservation updated successfully");
      } else {
        console.error('Failed to update reservation');
      }
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const deleteReservation = async (reservationId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        console.log("Reservation deleted successfully");
        setReservation(null);
      } else {
        console.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Failed to delete reservation:', error);
    }
  };

  const fetchReservation = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/your-reservation-id`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        setReservation(response.data);
      } else {
        console.error('Failed to fetch reservation');
      }
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
    }
  };

  const fetchUserReservations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user_reservations`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setReservation(data.length > 0 ? data[0] : null);
      } else {
        console.error('Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleUpdateReservationClick = () => {
    navigate('/reservation', { state: { reservation: reservation, isNew: false } });
  };

  const handleDeleteReservation = async () => {
    if (reservation && reservation.id) {
      try {
        await deleteReservation(reservation.id);
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
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
