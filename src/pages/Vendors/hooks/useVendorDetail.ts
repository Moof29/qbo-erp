
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VendorDetail {
  id: string;
  display_name: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  tax_id?: string;
  account_number?: string;
  payment_terms?: string;
  is_1099?: boolean;
  is_active: boolean;
  notes?: string;
  sync_status?: string;
}

export interface Bill {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'partial';
}

export interface Payment {
  id: string;
  date: string;
  method: string;
  amount: number;
}

export interface VendorFile {
  id: number;
  name: string;
  date: string;
  size: string;
}

export const useVendorDetail = (vendorId: string) => {
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Temporary mock data for bills and payments until we implement those tables
  const [bills, setBills] = useState<Bill[]>([
    { id: 'BILL-2023-001', date: '2023-05-01', dueDate: '2023-05-31', amount: 850.75, status: 'paid' },
    { id: 'BILL-2023-005', date: '2023-05-15', dueDate: '2023-06-15', amount: 1200.25, status: 'unpaid' },
  ]);
  
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'PAY-2023-002', date: '2023-05-14', method: 'Bank Transfer', amount: 850.75 },
  ]);
  
  const [files, setFiles] = useState<VendorFile[]>([
    { id: 1, name: 'vendor_agreement.pdf', date: '2023-04-15', size: '1.2 MB' },
    { id: 2, name: 'w9_form.pdf', date: '2023-04-15', size: '345 KB' },
  ]);

  useEffect(() => {
    const fetchVendorDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('vendor_profile')
          .select('*')
          .eq('id', vendorId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setVendor(data as VendorDetail);
        } else {
          setError('Vendor not found');
        }
      } catch (err: any) {
        console.error('Error fetching vendor details:', err);
        setError(err.message || 'Failed to load vendor details');
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorDetail();
    }
  }, [vendorId]);

  return {
    vendor,
    isLoading,
    error,
    bills,
    payments,
    files
  };
};
