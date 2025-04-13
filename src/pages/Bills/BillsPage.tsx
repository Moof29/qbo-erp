
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Calendar, Receipt, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const bills = [
  { id: 'BILL-2023-001', vendor: 'Office Depot', billDate: '2023-05-01', dueDate: '2023-05-31', amount: 850.75, status: 'paid' },
  { id: 'BILL-2023-002', vendor: 'Tech Distributors', billDate: '2023-05-10', dueDate: '2023-05-25', amount: 3200.50, status: 'paid' },
  { id: 'BILL-2023-003', vendor: 'Office Supplies Co.', billDate: '2023-05-12', dueDate: '2023-06-12', amount: 450.00, status: 'paid' },
  { id: 'BILL-2023-004', vendor: 'Global Suppliers', billDate: '2023-05-15', dueDate: '2023-06-30', amount: 1850.25, status: 'unpaid' },
  { id: 'BILL-2023-005', vendor: 'Office Depot', billDate: '2023-05-22', dueDate: '2023-06-21', amount: 1200.25, status: 'unpaid' },
];

const BillsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bill.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : bill.status === statusFilter;
    const matchesVendor = vendorFilter === 'all' ? true : bill.vendor.toLowerCase() === vendorFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesVendor;
  });

  // Get unique vendors for filter
  const vendors = ['all', ...Array.from(new Set(bills.map(bill => bill.vendor)))];

  return (
    <>
      <PageHeader 
        title="Vendor Bills" 
        subtitle="Manage your accounts payable"
        actions={
          <Button onClick={() => navigate('/bills/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Button>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills..."
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

            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.filter(v => v !== 'all').map(vendor => (
                  <SelectItem key={vendor} value={vendor.toLowerCase()}>{vendor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <TableRow 
                    key={bill.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/bills/${bill.id}`)}
                  >
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.vendor}</TableCell>
                    <TableCell>{bill.billDate}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Calendar size={14} />
                      {bill.dueDate}
                    </TableCell>
                    <TableCell>{formatCurrency(bill.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={bill.status as any} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Receipt size={32} className="mb-2" />
                      No bills found matching your criteria
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

export default BillsPage;
