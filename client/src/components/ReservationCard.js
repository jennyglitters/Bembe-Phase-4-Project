import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ReservationCard = ({ reservation, fetchReservations }) => {
  const { userToken } = useUser();
  const navigate = useNavigate();

  const deleteReservation = async () => {
    const confirmation = window.confirm('Are you sure you want to cancel this reservation?');
    if (!confirmation) return;

    try {
      const response = await fetch(`/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not delete reservation.');
      }

      alert('Reservation successfully canceled');
      fetchReservations(); // Refresh the reservations list after deletion
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert(error.message);
    }
  };

  const handleUpdateClick = () => {
    navigate(`/update-reservation/${reservation.id}`);
  };

  return (
    <div className="reservation-card">
      <h3>Reservation Details</h3>
      <p>Name: {reservation.name}</p>
      <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
      <p>Time: {reservation.time}</p>
      <p>Guests: {reservation.guests}</p>
      <p>Special Notes: {reservation.specialNotes}</p>
      <div className="reservation-actions">
        <button onClick={handleUpdateClick}>Update</button>
        <button onClick={deleteReservation}>Cancel</button>
      </div>
    </div>
  );
};

export default ReservationCard;