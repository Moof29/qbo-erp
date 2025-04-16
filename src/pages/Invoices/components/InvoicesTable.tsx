
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import SyncStatus from '@/components/SyncManager/SyncStatus';
import { formatCurrency } from '@/lib/formatters';
import type { Invoice } from '../hooks/useInvoices';

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onSeedData: () => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ 
  invoices, 
  isLoading, 
  onSeedData 
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="h-24 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </TableCell>
      </TableRow>
    );
  }
  
  if (invoices.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <FileText size={32} className="mb-2" />
            <p>No invoices found matching your criteria</p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onSeedData}
            >
              Add Sample Invoices
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <>
      {invoices.map((invoice) => (
        <TableRow 
          key={invoice.id}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => navigate(`/invoices/${invoice.id}`)}
        >
          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
          <TableCell>{invoice.customer_name || 'Unknown Customer'}</TableCell>
          <TableCell>{invoice.invoice_date}</TableCell>
          <TableCell className="flex items-center gap-1">
            <Calendar size={14} />
            {invoice.due_date}
          </TableCell>
          <TableCell>{formatCurrency(invoice.total)}</TableCell>
          <TableCell>{formatCurrency(invoice.balance)}</TableCell>
          <TableCell>
            <StatusBadge status={invoice.status as 'paid' | 'unpaid' | 'partial'} />
          </TableCell>
          <TableCell>
            <SyncStatus status={invoice.sync_status} lastSyncAt={null} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default InvoicesTable;
