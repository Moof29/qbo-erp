
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Building2, UserPlus } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const vendors = [
  { id: 1, name: 'Office Depot', email: 'accounts@officedepot.com', phone: '1234567890', terms: 'Net 30', status: 'active' },
  { id: 2, name: 'Tech Distributors', email: 'billing@techdist.com', phone: '9876543210', terms: 'Net 15', status: 'active' },
  { id: 3, name: 'Global Suppliers', email: 'ar@globalsuppliers.com', phone: '5551234567', terms: 'Net 45', status: 'active' },
  { id: 4, name: 'Local Print Shop', email: 'billing@localprintshop.com', phone: '8887776666', terms: 'Net 30', status: 'inactive' },
  { id: 5, name: 'Marketing Agency', email: 'accounts@marketagency.com', phone: '3334445555', terms: 'Net 30', status: 'active' },
];

const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && vendor.status === activeTab;
  });

  return (
    <>
      <PageHeader 
        title="Vendors" 
        subtitle="Manage your supplier accounts"
        actions={
          <Button onClick={() => navigate('/vendors/new')}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Vendor
          </Button>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
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
                <TableHead>Vendor Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <TableRow 
                    key={vendor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{formatPhoneNumber(vendor.phone)}</TableCell>
                    <TableCell>{vendor.terms}</TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.status as 'active' | 'inactive'} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 size={32} className="mb-2" />
                      No vendors found matching your criteria
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

export default VendorsPage;
