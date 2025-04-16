
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  balance: number;
  status: string;
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
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
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
        
        setInvoices(data as Invoice[] || []);
      } catch (error) {
        console.error('Error fetching customer invoices:', error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (customerId) {
      fetchCustomerInvoices();
    }
  }, [customerId, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
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
              <TableCell>
                <StatusBadge status={invoice.status as 'paid' | 'unpaid' | 'partial'} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <FileText size={24} className="mb-2" />
                No invoices found for this customer
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InvoicesTab;
