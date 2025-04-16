
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PurchaseOrder {
  id: string;
  purchase_order_number?: string;
  vendor_id: string;
  vendor_name?: string;
  po_date?: string;
  expected_date?: string;
  total?: number;
  status?: string;
  sync_status?: string;
}

// Define sort field type to ensure consistency
export type SortField = 'purchase_order_number' | 'po_date' | 'total';
type SortOrder = 'asc' | 'desc';

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('po_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Function to fetch purchase orders
  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    
    try {
      // Start building the query
      let query = supabase
        .from('purchase_order')
        .select(`
          *,
          vendor_profile:vendor_id (
            display_name
          )
        `);
      
      // Apply status filter if not "all"
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === 'asc' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format the data to include vendor name
      const formattedData = (data || []).map(po => ({
        id: po.id,
        purchase_order_number: po.purchase_order_number,
        vendor_id: po.vendor_id,
        vendor_name: po.vendor_profile?.display_name,
        po_date: po.po_date,
        expected_date: po.expected_date,
        total: po.total,
        status: po.status,
        sync_status: po.sync_status
      }));
      
      // Apply search filter client-side (for more complex filtering)
      let filteredData = formattedData;
      
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(po => 
          po.purchase_order_number?.toLowerCase().includes(lowercasedQuery) || 
          po.vendor_name?.toLowerCase().includes(lowercasedQuery)
        );
      }
      
      setPurchaseOrders(filteredData);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setPurchaseOrders([]);
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

  // Fetch purchase orders whenever dependencies change
  useEffect(() => {
    fetchPurchaseOrders();
  }, [statusFilter, sortField, sortOrder]);

  // Debounce search query to avoid too many re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPurchaseOrders();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return {
    purchaseOrders,
    isLoading,
    refetch: fetchPurchaseOrders,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortOrder,
    toggleSort
  };
};
