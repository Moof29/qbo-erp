
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Vendor {
  id: string;
  display_name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  payment_terms?: string;
  is_active: boolean;
  sync_status?: string;
}

// Define sort field type to ensure consistency
export type SortField = 'display_name' | 'company_name';
type SortOrder = 'asc' | 'desc';

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<SortField>('display_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Function to fetch vendors
  const fetchVendors = async () => {
    setIsLoading(true);
    
    try {
      // Start building the query
      let query = supabase
        .from('vendor_profile')
        .select('id, display_name, company_name, email, phone, payment_terms, is_active, sync_status');
      
      // Apply status filter if not "all"
      if (activeTab !== 'all') {
        query = query.eq('is_active', activeTab === 'active');
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Apply search filter client-side (for more complex filtering)
      let filteredData = data || [];
      
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(vendor => 
          vendor.display_name?.toLowerCase().includes(lowercasedQuery) || 
          vendor.company_name?.toLowerCase().includes(lowercasedQuery) || 
          vendor.email?.toLowerCase().includes(lowercasedQuery)
        );
      }
      
      setVendors(filteredData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle sort field and order
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      // If already sorting by this field, toggle the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new field, set to ascending by default
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Fetch vendors whenever dependencies change
  useEffect(() => {
    fetchVendors();
  }, [activeTab, sortField, sortOrder]);

  // Debounce search query to avoid too many re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchVendors();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return {
    vendors,
    isLoading,
    refetch: fetchVendors,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  };
};
