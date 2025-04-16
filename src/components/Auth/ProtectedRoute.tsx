
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { OrganizationSelector } from '@/components/Organization/OrganizationSelector';

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
  const { user, loading, hasRole, bypassAuth, organizations, currentOrganization } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full border-t-2 border-primary h-12 w-12" />
      </div>
    );
  }

  // Enable bypass for development purposes
  // This will set a default anonymous user
  if (bypassAuth) {
    console.log('Auth bypass is enabled, skipping auth check and using anonymous user');
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user needs to select an organization
  if (organizations.length > 0 && !currentOrganization) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <OrganizationSelector />
        </div>
      </div>
    );
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
