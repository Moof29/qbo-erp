
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { FileText, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SyncStatus from '@/components/SyncManager/SyncStatus';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  balance: number;
  status: string;
  sync_status?: string;
}

interface InvoicesTabProps {
  customerId: string;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ customerId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomerInvoices = async () => {
      setIsLoading(true);
      try {
        if (!customerId) {
          setInvoices([]);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching invoices for customer:", customerId);
        const { data, error } = await supabase
          .from('invoices')
          .select('id, invoice_number, invoice_date, due_date, total, balance, status, sync_status')
          .eq('customer_id', customerId)
          .order('invoice_date', { ascending: false });
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Error fetching invoices",
            description: error.message,
          });
          throw error;
        }
        
        console.log("Customer invoices data:", data);
        setInvoices(data as Invoice[] || []);
      } catch (error) {
        console.error('Error fetching customer invoices:', error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomerInvoices();
  }, [customerId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          size="sm"
          onClick={() => navigate(`/invoices/new?customer=${customerId}`)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sync</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map(invoice => (
              <TableRow 
                key={invoice.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.invoice_date}</TableCell>
                <TableCell>{invoice.due_date}</TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{formatCurrency(invoice.balance)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status as 'paid' | 'unpaid' | 'partial'} />
                </TableCell>
                <TableCell>
                  <SyncStatus status={invoice.sync_status} lastSyncAt={null} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText size={24} className="mb-2" />
                  <p>No invoices found for this customer</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/invoices/new?customer=${customerId}`)}
                  >
                    Create Invoice
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTab;
