
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, Role } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UserCheck } from 'lucide-react';

type UserWithRoles = {
  id: string;
  email: string;
  role: Role;
  first_name: string | null;
  last_name: string | null;
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasRole, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        throw profilesError;
      }

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        throw rolesError;
      }

      // Create a map of user IDs to their roles
      const roleMap = new Map();
      userRoles.forEach((userRole) => {
        roleMap.set(userRole.user_id, userRole.role);
      });

      // Combine the data
      const combinedData = profiles.map((profile) => ({
        id: profile.id,
        email: '', // Will be filled via auth.admin API in the future
        role: roleMap.get(profile.id) || 'sales_rep',
        first_name: profile.first_name,
        last_name: profile.last_name,
      }));

      setUsers(combinedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "There was an error loading the user list",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: Role) => {
    if (!hasRole('admin')) return;

    setUpdatingUserId(userId);
    try {
      // First, check if the user already has a role
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (existingRoles && existingRoles.length > 0) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}`,
      });

    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update user role",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!hasRole('admin')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            You don't have permission to access this section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users and their roles in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                  </div>
                  {user.id === currentUser?.id && (
                    <div className="flex items-center text-sm text-primary">
                      <UserCheck className="h-4 w-4 mr-1" />
                      You
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <RadioGroup 
                    value={user.role} 
                    onValueChange={(value) => updateUserRole(user.id, value as Role)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id={`admin-${user.id}`} />
                      <Label htmlFor={`admin-${user.id}`}>Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sales_rep" id={`sales-${user.id}`} />
                      <Label htmlFor={`sales-${user.id}`}>Sales Rep</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warehouse" id={`warehouse-${user.id}`} />
                      <Label htmlFor={`warehouse-${user.id}`}>Warehouse</Label>
                    </div>
                  </RadioGroup>
                </div>

                {updatingUserId === user.id && (
                  <div className="mt-2 text-sm text-primary flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Updating...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
