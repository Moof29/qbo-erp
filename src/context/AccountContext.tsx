
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Organization } from '@/integrations/supabase/client';

interface AccountContextProps {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_organizations')
        .select(`
          id,
          organization_id,
          role,
          organizations (
            id,
            name,
            industry,
            plan_type,
            timezone,
            is_active,
            created_at,
            qbo_company_id,
            qbo_realm_id
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      if (data && data.length) {
        // Format the organizations for easier access
        const formattedOrgs = data.map(item => ({
          ...item.organizations,
          userRole: item.role
        }));

        setOrganizations(formattedOrgs);
        
        // Try to get last selected organization from localStorage
        const lastOrgId = localStorage.getItem('currentOrganizationId');
        const lastOrg = formattedOrgs.find(org => org.id === lastOrgId);
        
        if (lastOrg) {
          setCurrentOrganization(lastOrg);
        } else if (formattedOrgs.length > 0) {
          // Default to first organization
          setCurrentOrganization(formattedOrgs[0]);
          localStorage.setItem('currentOrganizationId', formattedOrgs[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error.message);
      toast({
        variant: "destructive",
        title: "Failed to load organizations",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', org.id);
      toast({
        title: "Organization switched",
        description: `You are now working in ${org.name}`,
      });
    }
  };

  // Load organizations on mount
  useEffect(() => {
    if (supabase) {
      fetchOrganizations();
    }
  }, []);

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  return (
    <AccountContext.Provider
      value={{
        currentOrganization,
        organizations,
        isLoading,
        switchOrganization,
        refreshOrganizations
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextProps => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
