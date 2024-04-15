import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but keep where they were trying to go in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}