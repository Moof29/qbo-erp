
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useCustomerDetail = (customerId: string | undefined) => {
  const { toast } = useToast();
  const { currentOrganization } = useAuth();
  
  // Fetch customer details
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required');
      
      const { data, error } = await supabase
        .from('customer_profile')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customer",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!customerId,
  });

  // Mock data for invoices, payments, and notes
  // In a real app, these would come from separate database tables
  const mockInvoices = [
    { id: 'INV-2023-001', date: '2023-05-01', due_date: '2023-05-31', amount: 1250.00, status: 'paid' },
    { id: 'INV-2023-005', date: '2023-05-15', due_date: '2023-06-15', amount: 2700.50, status: 'unpaid' },
  ];

  const mockPayments = [
    { id: 'PAY-2023-001', date: '2023-05-12', method: 'Credit Card', amount: 1250.00 },
  ];

  const mockNotes = [
    { id: '1', created_at: '2023-05-10T14:30:00Z', created_by: 'John Doe', content: 'Called about upcoming invoice. They requested a detailed statement.' },
    { id: '2', created_at: '2023-04-22T09:15:00Z', created_by: 'Jane Smith', content: 'Discussed payment terms, they prefer Net 30 going forward.' },
  ];

  return {
    customer,
    isLoading,
    error,
    mockInvoices,
    mockPayments,
    mockNotes
  };
};
