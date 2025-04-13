
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Users, UserPlus } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const customers = [
  { id: 1, name: 'Acme Inc.', email: 'billing@acme.com', phone: '1234567890', balance: 1250.00, status: 'active' },
  { id: 2, name: 'Tech Solutions', email: 'accounts@techsolutions.com', phone: '9876543210', balance: 3450.75, status: 'active' },
  { id: 3, name: 'Global Enterprises', email: 'finance@globalent.com', phone: '5551234567', balance: 0, status: 'active' },
  { id: 4, name: 'Local Business', email: 'info@localbusiness.com', phone: '8887776666', balance: 1100.00, status: 'inactive' },
  { id: 5, name: 'Creative Studios', email: 'billing@creative.com', phone: '3334445555', balance: 750.25, status: 'active' },
  { id: 6, name: 'Innovative Tech', email: 'ar@innovtech.com', phone: '6667778888', balance: 0, status: 'inactive' },
];

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && customer.status === activeTab;
  });

  return (
    <>
      <PageHeader 
        title="Customers" 
        subtitle="Manage your customer accounts"
        actions={
          <Button onClick={() => navigate('/customers/new')}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{formatPhoneNumber(customer.phone)}</TableCell>
                    <TableCell>{formatCurrency(customer.balance)}</TableCell>
                    <TableCell>
                      <StatusBadge status={customer.status as 'active' | 'inactive'} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users size={32} className="mb-2" />
                      No customers found matching your criteria
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

export default CustomersPage;
