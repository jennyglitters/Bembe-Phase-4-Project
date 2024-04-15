import React, { useState } from 'react';
import { useUser } from './UserContext';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationCard = ({ reservation, fetchReservations }) => {
  const { userToken } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [updatedReservation, setUpdatedReservation] = useState({
    name: reservation.name,
    date: new Date(reservation.date),
    time: reservation.time,
    guests: reservation.guest_count,
    specialNotes: reservation.specialNotes,
  });

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/reservations/${reservation.id}`, {
        method: 'PATCH',  // Changed from 'PUT' to 'PATCH'
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedReservation,
          date: updatedReservation.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
          guest_count: parseInt(updatedReservation.guests), // Ensure guest count is an integer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not update reservation.');
      }

      alert('Reservation updated successfully');
      setEditMode(false);
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert(error.message);
    }
  };

  const deleteReservation = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

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
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert(error.message);
    }
  };

  return (
    <div className="reservation-card">
      {editMode ? (
        <div>
          <input
            type="text"
            value={updatedReservation.name}
            onChange={(e) => setUpdatedReservation({ ...updatedReservation, name: e.target.value })}
          />
          <ReactDatePicker
            selected={updatedReservation.date}
            onChange={(date) => setUpdatedReservation({ ...updatedReservation, date })}
          />
          <input
            type="time"
            value={updatedReservation.time}
            onChange={(e) => setUpdatedReservation({ ...updatedReservation, time: e.target.value })}
          />
          <input
            type="number"
            value={updatedReservation.guests}
            onChange={(e) => setUpdatedReservation({ ...updatedReservation, guests: e.target.value })}
          />
          <textarea
            value={updatedReservation.specialNotes}
            onChange={(e) => setUpdatedReservation({ ...updatedReservation, specialNotes: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>Reservation Details</h3>
          <p>Name: {reservation.name}</p>
          <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
          <p>Time: {reservation.time}</p>
          <p>Guests: {reservation.guest_count}</p>
          <p>Special Notes: {reservation.specialNotes}</p>
          <button onClick={handleUpdateClick}>Edit</button>
          <button onClick={deleteReservation}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;