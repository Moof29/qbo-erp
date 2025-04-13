
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import { Search, CreditCard, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const payments = [
  { id: 'PAY-2023-001', payer: 'Acme Inc.', date: '2023-05-12', amount: 1250.00, method: 'Credit Card', linkedDoc: 'INV-2023-001' },
  { id: 'PAY-2023-002', payer: 'Office Depot', date: '2023-05-14', amount: 3200.50, method: 'Bank Transfer', linkedDoc: 'BILL-2023-002' },
  { id: 'PAY-2023-003', payer: 'Tech Solutions', date: '2023-05-16', amount: 850.25, method: 'Check', linkedDoc: 'INV-2023-002' },
  { id: 'PAY-2023-004', payer: 'Office Supplies Co.', date: '2023-05-18', amount: 450.00, method: 'ACH', linkedDoc: 'BILL-2023-003' },
  { id: 'PAY-2023-005', payer: 'Acme Inc.', date: '2023-05-20', amount: 2700.50, method: 'Credit Card', linkedDoc: 'INV-2023-005' },
];

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.payer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (methodFilter === 'all') return matchesSearch;
    return matchesSearch && payment.method.toLowerCase() === methodFilter.toLowerCase();
  });

  return (
    <>
      <PageHeader 
        title="Payments" 
        subtitle="All payment transactions"
        actions={
          <Button onClick={() => navigate('/payments/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="ach">ACH</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Last 30 days</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
                <SelectItem value="year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Number</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Linked Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow 
                    key={payment.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/payments/${payment.id}`)}
                  >
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.payer}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.linkedDoc}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <CreditCard size={32} className="mb-2" />
                      No payments found matching your criteria
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default PaymentsPage;
