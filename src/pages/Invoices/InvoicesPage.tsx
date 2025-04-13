
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Calendar, FileText, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const invoices = [
  { id: 'INV-2023-001', customer: 'Acme Inc.', invoiceDate: '2023-05-01', dueDate: '2023-05-15', amount: 1250.00, balance: 0, status: 'paid' },
  { id: 'INV-2023-002', customer: 'Tech Solutions', invoiceDate: '2023-05-05', dueDate: '2023-05-20', amount: 3450.75, balance: 3450.75, status: 'unpaid' },
  { id: 'INV-2023-003', customer: 'Global Enterprises', invoiceDate: '2023-05-07', dueDate: '2023-05-22', amount: 870.25, balance: 400.25, status: 'partial' },
  { id: 'INV-2023-004', customer: 'Local Business', invoiceDate: '2023-05-10', dueDate: '2023-05-30', amount: 1100.00, balance: 1100.00, status: 'unpaid' },
  { id: 'INV-2023-005', customer: 'Acme Inc.', invoiceDate: '2023-05-12', dueDate: '2023-05-27', amount: 2700.50, balance: 2700.50, status: 'unpaid' },
];

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && invoice.status === statusFilter;
  });

  return (
    <>
      <PageHeader 
        title="Invoices" 
        subtitle="Manage your customer invoices"
        actions={
          <Button onClick={() => navigate('/invoices/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
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
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Calendar size={14} />
                      {invoice.dueDate}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.balance)}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status as any} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText size={32} className="mb-2" />
                      No invoices found matching your criteria
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

export default InvoicesPage;
