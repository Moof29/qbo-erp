
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Payment {
  id: string;
  date: string;
  method: string;
  amount: number;
}

export interface Note {
  id: string;
  created_at: string;
  created_by: string;
  content: string;
}

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

  // Mock data for payments and notes
  // In a real app, these would come from separate database tables
  const mockPayments: Payment[] = [
    { id: 'PAY-2023-001', date: '2023-05-12', method: 'Credit Card', amount: 1250.00 },
  ];

  const mockNotes: Note[] = [
    { id: '1', created_at: '2023-05-10T14:30:00Z', created_by: 'John Doe', content: 'Called about upcoming invoice. They requested a detailed statement.' },
    { id: '2', created_at: '2023-04-22T09:15:00Z', created_by: 'Jane Smith', content: 'Discussed payment terms, they prefer Net 30 going forward.' },
  ];

  return {
    customer,
    isLoading,
    error,
    mockPayments,
    mockNotes
  };
};
