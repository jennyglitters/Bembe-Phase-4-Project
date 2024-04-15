import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import ReservationCard from './ReservationCard'; // Ensure this component is imported

const ReservationManagement = () => {
  const { isAuthenticated, userToken } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch('/reservations', {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (!response.ok) {
        // Handle potential 401 Unauthorized or other network errors
        if (response.status === 401) {
          console.error('Session expired or invalid. Redirecting to login.');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  }, [userToken, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    } else {
      console.log('User is not authenticated, navigating to login...');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, fetchReservations]);

  return (
    <div>
      <h1>Manage Your Reservations</h1>
      {reservations.length > 0 ? (
        reservations.map(reservation => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            fetchReservations={fetchReservations} // Pass this if the card needs to refresh the list after an operation
          />
        ))
      ) : (
        <p>No reservations found. Please make a reservation.</p>
      )}
    </div>
  );
};

export default ReservationManagement;
