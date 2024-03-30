import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import ReservationCard from './ReservationCard'; // Assuming you have a ReservationCard component

const UserAccountPage = () => {
  const { userToken, isAuthenticated, logout } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchReservations();
    }
  }, [isAuthenticated, navigate]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/reservations', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <h1>User Account</h1>
      <button onClick={handleLogoutClick}>Logout</button>
      <h2>Your Reservations</h2>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} fetchReservations={fetchReservations} />
        ))
      ) : (
        <p>You have no reservations.</p>
      )}
    </div>
  );
};

export default UserAccountPage;