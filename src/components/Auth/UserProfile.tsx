
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Building, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserProfile = () => {
  const { user, signOut, currentOrganization, organizations, setCurrentOrganization } = useAuth();

  // Extract email for display
  const email = user?.email || '';
  // Just display the first part of the email for now
  const displayName = user?.user_metadata?.first_name || email.split('@')[0];
  
  // Check if we have organizations to switch between
  const hasMultipleOrgs = organizations.length > 1;

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium">{displayName}</p>
        {currentOrganization && (
          <div className="flex items-center text-xs text-muted-foreground">
            {hasMultipleOrgs ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground gap-1">
                    <Building className="h-3 w-3" />
                    {currentOrganization.name}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {organizations.map(org => (
                    <DropdownMenuItem 
                      key={org.id}
                      onClick={() => setCurrentOrganization(org)}
                      className={org.id === currentOrganization.id ? "bg-muted" : ""}
                    >
                      <Building className="h-3.5 w-3.5 mr-2" />
                      {org.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {currentOrganization.name}
              </div>
            )}
          </div>
        )}
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
