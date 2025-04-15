
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface Payment {
  id: string;
  date: string;
  method: string;
  amount: number;
}

interface PaymentsTabProps {
  payments: Payment[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  const navigate = useNavigate();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length > 0 ? (
          payments.map(payment => (
            <TableRow 
              key={payment.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/payments/${payment.id}`)}
            >
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <CreditCard size={24} className="mb-2" />
                No payments found for this customer
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTab;
