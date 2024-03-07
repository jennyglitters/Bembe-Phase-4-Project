import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback to your imports
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ReservationManagement = () => {
  const { userToken, isAuthenticated } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/reservations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        // It's a good practice to handle potential errors from the server
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [userToken, isAuthenticated]); // Dependencies for useCallback

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]); // fetchReservations is now a dependency

  const deleteReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await fetch(`/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          // Again, handling potential server errors
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to cancel reservation');
        }
        setReservations(current => current.filter(reservation => reservation.id !== reservationId));
        alert('Reservation successfully canceled');
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
        alert(error.message); // Providing feedback to the user
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
        <>
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
          <button onClick={() => navigate('/create-reservation')}>Create New Reservation</button>
        </>
      ) : (
        <p>Please <button onClick={() => navigate('/login')}>login</button> to manage your reservations.</p>
      )}
    </div>
  );
};

export default ReservationManagement;
