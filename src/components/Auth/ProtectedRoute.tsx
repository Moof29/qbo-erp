
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth'
}) => {
  const { user, loading, hasRole, bypassAuth } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full border-t-2 border-primary h-12 w-12" />
      </div>
    );
  }

  // If bypass is enabled, allow access without authentication
  if (bypassAuth) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check for role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    // If user doesn't have the required role, redirect them
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
