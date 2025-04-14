
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();

  // Extract email for display
  const email = user?.email || '';
  // Just display the first part of the email for now
  const displayName = email.split('@')[0];

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium">{displayName}</p>
        {user?.roles && user.roles.length > 0 && (
          <p className="text-xs text-muted-foreground capitalize">{user.roles[0]}</p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
