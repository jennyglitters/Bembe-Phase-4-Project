//ReservationManagment
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import LoginForm from './LoginForm';

const ReservationManagement = () => {
  const { user, userToken } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
        const response = await fetch(`/reservations/user/${user.id}`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
  
        const data = await response.json();
        setReservations(data);
    } catch (error) {
        console.error('Failed to fetch reservations:', error);
    }
  };

  const deleteReservation = async (reservationId) => {
    const response = await fetch(`/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` },
    });

    if (response.ok) {
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      alert('Reservation successfully deleted');
    } else {
      alert('Failed to delete reservation');
    }
  };

  const handleUpdateClick = (reservationId) => {
    navigate(`/update-reservation/${reservationId}`, { state: { reservationId } });
  };

  return (
    <div>
      <h1>Manage Your Reservations</h1>
      {reservations.length > 0 ? (
        reservations.map(reservation => (
          <div key={reservation.id}>
            <p>Reservation for {reservation.name} on {new Date(reservation.date).toLocaleDateString()} at {reservation.time}</p>
            <p>Guests: {reservation.guests}</p>
            <button onClick={() => handleUpdateClick(reservation.id)}>Update</button>
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


