import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationManagement = () => {
 const [reservations, setReservations] = useState([]);
 const navigate = useNavigate();

 useEffect(() => {
    // Fetch reservations for the current user
    const fetchReservations = async () => {
      try {
        const response = await fetch('/reservations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReservations();
 }, []);

 const deleteReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await fetch(`/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to cancel reservation');
        }
        setReservations(current => current.filter(reservation => reservation.id !== reservationId));
        alert('Reservation successfully canceled');
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
        alert(error.message);
      }
    }
 };

 const handleUpdateClick = (reservationId) => {
  navigate(`/reservations/${reservationId}`);
 };

 const handleCreateClick = () => {
  navigate('/reservations');
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
      ) : <p>No reservations found. Please make a reservation.</p>}
      <button onClick={handleCreateClick}>Create New Reservation</button>
    </div>
 );
};

export default ReservationManagement;