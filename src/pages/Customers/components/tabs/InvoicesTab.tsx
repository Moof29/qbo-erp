
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface Invoice {
  id: string;
  date: string;
  due_date: string;
  amount: number;
  status: string;
}

interface InvoicesTabProps {
  invoices: Invoice[];
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ invoices }) => {
  const navigate = useNavigate();
  
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
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.due_date}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <StatusBadge status={invoice.status as 'paid' | 'unpaid'} />
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
