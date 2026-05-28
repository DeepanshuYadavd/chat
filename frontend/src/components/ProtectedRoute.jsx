import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
