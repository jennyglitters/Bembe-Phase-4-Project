import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; 

const ReservationManagement = () => {
  const { user, userToken, isAuthenticated } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [user, isAuthenticated]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/reservations/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
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

  const deleteReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await fetch(`/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (!response.ok) {
          throw new Error('Failed to cancel reservation');
        }
        setReservations(current => current.filter(reservation => reservation.id !== reservationId));
        alert('Reservation successfully canceled');
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
      }
    }
  };

  const handleUpdateClick = (reservationId) => {
    navigate(`/update-reservation/${reservationId}`);
  };
  

  return (
    <div>
      <h1>Manage Your Reservations</h1>
      {isAuthenticated ? (
        reservations.length > 0 ? (
          reservations.map(reservation => (
            <div key={reservation.id}>
              <p>Reservation for {reservation.name} on {new Date(reservation.date).toLocaleDateString()} at {reservation.time}</p>
              <p>Guests: {reservation.guests}</p>
              <button onClick={() => handleUpdateClick(reservation.id)}>Update</button>
              <button onClick={() => deleteReservation(reservation.id)}>Cancel</button>
              <button onClick={() => navigate('/create-reservation')}>Create New Reservation</button>
            </div>
          ))
        ) : <p>No reservations found. Please make a reservation.</p>
      ) : (
        <p>Please <button onClick={() => navigate('/login')}>login</button> to manage your reservations.</p>
      )}
    </div>
  );
};

export default ReservationManagement;
