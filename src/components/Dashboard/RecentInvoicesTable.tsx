
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const invoices = [
  { id: 'INV-2023-001', customer: 'Acme Inc.', dueDate: '2023-05-15', amount: 1250.00, status: 'paid' },
  { id: 'INV-2023-002', customer: 'Tech Solutions', dueDate: '2023-05-20', amount: 3450.75, status: 'unpaid' },
  { id: 'INV-2023-003', customer: 'Global Enterprises', dueDate: '2023-05-22', amount: 870.25, status: 'partial' },
  { id: 'INV-2023-004', customer: 'Local Business', dueDate: '2023-05-30', amount: 1100.00, status: 'unpaid' },
];

const RecentInvoicesTable = () => {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Recent Invoices</h3>
        <a href="/invoices" className="text-sm text-primary hover:underline">View all</a>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell className="flex items-center gap-1">
                <Calendar size={14} />
                {invoice.dueDate}
              </TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <StatusBadge status={invoice.status as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentInvoicesTable;
