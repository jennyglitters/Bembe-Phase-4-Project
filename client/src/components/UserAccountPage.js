import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import LoginForm from './LoginForm';
import ReservationCard from './ReservationCard'; // Component to display each reservation

const UserAccountPage = () => {
  const { isAuthenticated, userToken, logout, userInfo } = useUser();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login...');
      navigate('/login', { replace: true });
      return;
    }
    try {
      const response = await fetch('/reservations', {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Session expired or invalid. Redirecting to login.');
          logout();
          navigate('/login', { replace: true });
          return;
        }
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  }, [userToken, isAuthenticated, navigate, logout]); // Dependencies included in useCallback

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]); // fetchReservations now included in the dependencies array

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>User Account</h1>
      <p>Welcome, {userInfo ? userInfo.name : 'Guest'}!</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Your Reservations</h2>
      {reservations.length > 0 ? (
        reservations.map(res => <ReservationCard key={res.id} reservation={res} />)
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default UserAccountPage;