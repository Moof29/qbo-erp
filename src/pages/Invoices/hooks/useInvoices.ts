
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name?: string;
  invoice_date?: string;
  due_date?: string;
  total: number;
  balance: number;
  status: string;
  sync_status?: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Function to fetch invoices
  const fetchInvoices = async () => {
    setIsLoading(true);
    
    try {
      // Start building the query
      let query = supabase
        .from('invoices')
        .select(`
          *,
          customer_profile:customer_id (
            display_name
          )
        `);
      
      // Apply status filter if not "all"
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply sorting (recent invoices first)
      query = query.order('invoice_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching invoices",
          description: error.message,
        });
        throw error;
      }
      
      // Format the data to include customer name
      const formattedData = (data || []).map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_profile?.display_name,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        total: invoice.total || 0,
        balance: invoice.balance || 0,
        status: invoice.status,
        sync_status: invoice.sync_status
      }));
      
      // Apply search filter client-side (for more complex filtering)
      let filteredData = formattedData;
      
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(invoice => 
          invoice.invoice_number?.toLowerCase().includes(lowercasedQuery) || 
          invoice.customer_name?.toLowerCase().includes(lowercasedQuery)
        );
      }
      
      setInvoices(filteredData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch invoices whenever dependencies change
  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  // Debounce search query to avoid too many re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInvoices();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return {
    invoices,
    isLoading,
    refetch: fetchInvoices,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  };
};
