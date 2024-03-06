import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import LoginForm from './LoginForm';

const ReservationManagement = () => {
  const { isAuthenticated, userToken } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = () => {
    fetch('/reservations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch reservations');
      return response.json();
    })
    .then(setReservations)
    .catch(error => console.error('Error fetching reservations:', error));
  };

  const deleteReservation = async (reservationId) => {
    try {
      await fetch(`/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      alert('Reservation successfully canceled');
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Manage Your Reservations</h1>
      {reservations.length > 0 ? (
        reservations.map(reservation => (
          <div key={reservation.id}>
            <p>Reservation Details: {reservation.details} (Placeholder for actual reservation details)</p>
            <button onClick={() => navigate(`/update-reservation/${reservation.id}`)}>Update</button>
            <button onClick={() => deleteReservation(reservation.id)}>Cancel</button>
          </div>
        ))
      ) : (
        <p>No reservations found. Please make a reservation.</p>
      )}
    </div>
  );
};

export default ReservationManagement;


