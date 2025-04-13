
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const payments = [
  { id: 'PAY-2023-001', entity: 'Acme Inc.', date: '2023-05-12', method: 'Credit Card', amount: 1250.00 },
  { id: 'PAY-2023-002', entity: 'Self Corp.', date: '2023-05-14', method: 'Bank Transfer', amount: 3200.50 },
  { id: 'PAY-2023-003', entity: 'Tech Solutions', date: '2023-05-16', method: 'Check', amount: 850.25 },
  { id: 'PAY-2023-004', entity: 'Office Supplies Co.', date: '2023-05-18', method: 'ACH', amount: 450.00 },
];

const RecentPaymentsTable = () => {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Recent Payments</h3>
        <a href="/payments" className="text-sm text-primary hover:underline">View all</a>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment #</TableHead>
            <TableHead>Customer/Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.entity}</TableCell>
              <TableCell className="flex items-center gap-1">
                <Calendar size={14} />
                {payment.date}
              </TableCell>
              <TableCell className="flex items-center gap-1">
                <CreditCard size={14} />
                {payment.method}
              </TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentPaymentsTable;
