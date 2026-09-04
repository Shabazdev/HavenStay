import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { LoadingSpinner } from './LoadingSpinner.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner label="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's native dashboard if role not allowed
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'owner') return <Navigate to="/dashboard/owner" replace />;
    return <Navigate to="/dashboard/tenant" replace />;
  }

  return <>{children}</>;
};
