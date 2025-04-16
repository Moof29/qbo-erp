
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Item {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  item_type?: string;
  is_active: boolean;
  purchase_cost?: number;
  reorder_point?: number;
  sync_status?: string;
}

// Define sort field type to ensure consistency
export type SortField = 'name' | 'sku';
type SortOrder = 'asc' | 'desc';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Function to fetch items
  const fetchItems = async () => {
    setIsLoading(true);
    
    try {
      // Start building the query
      let query = supabase
        .from('item_record')
        .select('id, name, sku, description, item_type, is_active, purchase_cost, reorder_point, sync_status');
      
      // Apply status filter if not "all"
      if (activeTab !== 'all') {
        if (activeTab === 'active') {
          query = query.eq('is_active', true);
        } else if (activeTab === 'inactive') {
          query = query.eq('is_active', false);
        } else if (activeTab !== 'all') {
          // Filter by item type if the tab is a type filter
          query = query.eq('item_type', activeTab);
        }
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Apply search filter client-side (for more complex filtering)
      let filteredData = data || [];
      
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.name?.toLowerCase().includes(lowercasedQuery) || 
          item.sku?.toLowerCase().includes(lowercasedQuery) || 
          item.description?.toLowerCase().includes(lowercasedQuery)
        );
      }
      
      setItems(filteredData);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
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

  // Fetch items whenever dependencies change
  useEffect(() => {
    fetchItems();
  }, [activeTab, sortField, sortOrder]);

  // Debounce search query to avoid too many re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return {
    items,
    isLoading,
    refetch: fetchItems,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  };
};
