
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
    console.log('Auth bypass is enabled, skipping auth check');
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // Check for role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    // If user doesn't have the required role, redirect them
    console.log(`User doesn't have required role: ${requiredRole}, redirecting to home`);
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
