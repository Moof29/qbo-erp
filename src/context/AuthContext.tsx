import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export type Role = 'admin' | 'sales_rep' | 'warehouse';

type UserWithRole = User & {
  roles?: Role[];
};

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
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('bypassAuth', JSON.stringify(bypassAuth));
  }, [bypassAuth]);

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
          }, 0);
        } else {
          setUser(null);
          setUserRoles([]);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
