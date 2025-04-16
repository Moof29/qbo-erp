
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  supabase, 
  fetchUserOrganizations, 
  createOrganization, 
  linkUserToOrganization, 
  Organization, 
  OrganizationWithUserRole 
} from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export type Role = 'admin' | 'sales_rep' | 'warehouse';

type UserWithRole = User & {
  roles?: Role[];
};

export interface OrganizationWithDetails extends OrganizationWithUserRole {
  userRole: string;
}

type AuthContextType = {
  user: UserWithRole | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  bypassAuth: boolean;
  setBypassAuth: (bypass: boolean) => void;
  organizations: OrganizationWithDetails[];
  currentOrganization: OrganizationWithDetails | null;
  setCurrentOrganization: (org: OrganizationWithDetails | null) => void;
  refreshOrganizations: () => Promise<void>;
  createNewOrganization: (name: string, industry?: string) => Promise<Organization | null>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null, success: false }),
  signUp: async () => ({ error: null, success: false }),
  signOut: async () => {},
  refreshRoles: async () => {},
  hasRole: () => false,
  bypassAuth: false,
  setBypassAuth: () => {},
  organizations: [],
  currentOrganization: null,
  setCurrentOrganization: () => {},
  refreshOrganizations: async () => {},
  createNewOrganization: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [bypassAuth, setBypassAuth] = useState(() => {
    const storedBypass = localStorage.getItem('bypassAuth');
    return storedBypass ? JSON.parse(storedBypass) : false;
  });
  const [organizations, setOrganizations] = useState<OrganizationWithDetails[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('bypassAuth', JSON.stringify(bypassAuth));
  }, [bypassAuth]);

  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('currentOrganizationId', currentOrganization.id);
    }
  }, [currentOrganization]);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data ? data.map(item => item.role as Role) : [];
    } catch (error) {
      console.error('Exception fetching user roles:', error);
      return [];
    }
  };

  const refreshOrganizations = async () => {
    if (!user) return;
    
    try {
      const userOrgs = await fetchUserOrganizations(user.id);
      
      if (userOrgs) {
        const orgsWithDetails: OrganizationWithDetails[] = userOrgs.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name,
          industry: item.organizations.industry,
          plan_type: item.organizations.plan_type,
          timezone: item.organizations.timezone,
          is_active: item.organizations.is_active,
          created_at: item.organizations.created_at,
          userRole: item.role
        }));
        
        setOrganizations(orgsWithDetails);
        
        // If we have organizations but no current one selected, select the first one
        if (orgsWithDetails.length > 0 && !currentOrganization) {
          // First try to get the last used org from localStorage
          const lastOrgId = localStorage.getItem('currentOrganizationId');
          const lastUsedOrg = lastOrgId ? 
            orgsWithDetails.find(org => org.id === lastOrgId) : 
            undefined;
            
          setCurrentOrganization(lastUsedOrg || orgsWithDetails[0]);
        } else if (orgsWithDetails.length === 0) {
          setCurrentOrganization(null);
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        variant: "destructive",
        title: "Failed to load organizations",
        description: "Please try refreshing the page",
      });
    }
  };

  const refreshRoles = async () => {
    if (user) {
      const roles = await fetchUserRoles(user.id);
      
      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, roles };
      });
      
      setUserRoles(roles);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setTimeout(async () => {
            const roles = await fetchUserRoles(session.user.id);
            setUser({ ...session.user, roles });
            setUserRoles(roles);
            refreshOrganizations();
          }, 0);
        } else {
          setUser(null);
          setUserRoles([]);
          setOrganizations([]);
          setCurrentOrganization(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id);
        setUser({ ...session.user, roles });
        setUserRoles(roles);
        refreshOrganizations();
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return { error, success: false };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { error: null, success: true };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "An unexpected error occurred",
      });
      return { error: error as Error, success: false };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return { error, success: false };
      }

      toast({
        title: "Signed up successfully",
        description: "Welcome to ERP Flow!",
      });
      
      return { error: null, success: true };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "An unexpected error occurred",
      });
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const hasRole = (role: Role): boolean => {
    return userRoles.includes(role);
  };

  const createNewOrganization = async (name: string, industry?: string): Promise<Organization | null> => {
    if (!user) return null;
    
    try {
      // 1. Create the organization
      const orgData: Partial<Organization> = { 
        name, 
        industry: industry || null,
      };
      
      const newOrg = await createOrganization(orgData);
        
      // 2. Link the user to the organization as admin
      await linkUserToOrganization(user.id, newOrg.id, 'admin');
      
      // 3. Refresh organizations list
      await refreshOrganizations();
      
      // 4. Set the new organization as current
      if (newOrg) {
        const newOrgWithDetails: OrganizationWithDetails = {
          id: newOrg.id,
          name: newOrg.name,
          industry: newOrg.industry,
          plan_type: newOrg.plan_type,
          timezone: newOrg.timezone,
          is_active: newOrg.is_active,
          created_at: newOrg.created_at,
          userRole: 'admin'
        };
        setCurrentOrganization(newOrgWithDetails);
      }
      
      toast({
        title: "Organization created",
        description: `${name} has been created successfully`,
      });
      
      return newOrg;
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        variant: "destructive",
        title: "Failed to create organization",
        description: error.message || "An unexpected error occurred",
      });
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshRoles,
        hasRole,
        bypassAuth,
        setBypassAuth,
        organizations,
        currentOrganization,
        setCurrentOrganization,
        refreshOrganizations,
        createNewOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
