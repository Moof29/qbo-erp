
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Customer {
  id: string;
  display_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  balance: number | null;
  is_active: boolean | null;
}

// Make sure this matches the CustomerFilters component
export type SortField = 'display_name' | 'balance';
type SortOrder = 'asc' | 'desc';

export const useCustomers = () => {
  const { toast } = useToast();
  const { currentOrganization } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<SortField>('display_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customers', currentOrganization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_profile')
        .select('id, display_name, company_name, email, phone, balance, is_active')
        .eq('organization_id', currentOrganization?.id || '');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!currentOrganization?.id,
  });

  // Handle sorting
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => {
        // Filter by search query
        const matchesSearch = 
          (customer.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
          (customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        
        // Filter by active status
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'active') return matchesSearch && customer.is_active === true;
        if (activeTab === 'inactive') return matchesSearch && customer.is_active === false;
        
        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort customers
        if (sortField === 'display_name') {
          const nameA = a.display_name || '';
          const nameB = b.display_name || '';
          return sortOrder === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortField === 'balance') {
          const balanceA = a.balance || 0;
          const balanceB = b.balance || 0;
          return sortOrder === 'asc' 
            ? balanceA - balanceB 
            : balanceB - balanceA;
        }
        return 0;
      });
  }, [customers, searchQuery, activeTab, sortField, sortOrder]);

  return {
    customers: filteredCustomers,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  };
};
