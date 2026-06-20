import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  SYSTEM_ADMIN: '/admin',
  NORMAL_USER: '/user/stores',
  STORE_OWNER: '/owner/dashboard',
};

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  
  if (role && user?.role !== role) {
    return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />;
  }

  return children;
}
