//ReservationManagment
import React, { useState, useEffect } from 'react';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Adjust according to your context setup

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
    const { user, isAuthenticated, logoutUser } = useContext(UserContext); // Use your actual context structure
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, [user, isAuthenticated]); // Re-fetch when user or authentication status changes

    const fetchReservations = () => {
        const headers = isAuthenticated ? { 'Authorization': `Bearer ${user.token}` } : {};
        fetch('/reservations', { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                return response.json();
            })
            .then(data => setReservations(data))
            .catch(error => console.error('Error:', error));
    };

    const deleteReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) { // Confirmation step
            const headers = isAuthenticated ? { 'Authorization': `Bearer ${user.token}` } : {};
            fetch(`/reservations/${reservationId}`, { method: 'DELETE', headers })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to cancel reservation');
                    }
                    setReservations(current => current.filter(reservation => reservation.id !== reservationId));
                    alert('Reservation successfully canceled');
                })
                .catch(error => console.error('Failed to cancel reservation:', error));
        }
    };

    const handleLogout = () => {
        logoutUser(); // Implement this function based on your auth logic
        navigate('/login'); // Redirect to login or home page after logout
    };

    return (
        <div>
            <h1>Manage Your Reservations</h1>
            {isAuthenticated && (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    {reservations.length > 0 ? (
                        reservations.map(reservation => (
                            <div key={reservation.id}>
                                {/* Display reservation details */}
                                <p>Reservation for {reservation.date} at {reservation.time} for {reservation.guests} guests.</p>
                                <button onClick={() => navigate(`/update-reservation/${reservation.id}`)}>Update</button>
                                <button onClick={() => deleteReservation(reservation.id)}>Cancel</button>
                            </div>
                        ))
                    ) : <p>No reservations found. Please make a reservation.</p>}
                </div>
            )}
            {!isAuthenticated && (
                <p>Please <button onClick={() => navigate('/login')}>login</button> to manage your reservations.</p>
            )}
        </div>
    );
};

export default ReservationManagement;
