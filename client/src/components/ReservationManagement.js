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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email: email, password }),
      });
      if (response.ok) {
        const { access_token } = await response.json();
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(updatedData),
    });
  
    if (response.ok) {
      // Handle successful update
      console.log("Reservation updated successfully");
    } else {
      console.error('Failed to update reservation');
    }
  };
  const deleteReservation = async (reservationId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });
  
    if (response.ok) {
      // Handle successful deletion
      console.log("Reservation deleted successfully");
      setReservation(null); // Or adjust based on your state management
    } else {
      console.error('Failed to delete reservation');
    }
  };
  


  const fetchReservation = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations/your-reservation-id`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setReservation(data); // Assuming the backend returns the most recent reservation for this email
      } else {
        console.error('Error Failed to fetch reservation:', error);
      }
    } catch (error) {
      console.error('Error Failed to fetch reservation:', error);
    }
  };
  const fetchUserReservations = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user_reservations`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      setReservation(data.length > 0 ? data[0] : null); // Assuming we're interested in the first reservation
    } else {
      console.error('Failed to fetch reservations');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleUpdateReservationClick = () => {
    navigate('/reservation', { state: { reservation: reservation, isNew: false } });
  };

  const handleDeleteReservation = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/reservations/${reservation.id}`);
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