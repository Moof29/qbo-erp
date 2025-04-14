
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Users, UserPlus, ArrowUpDown, Filter } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Customer {
  id: string;
  display_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  open_balance: number | null;
  is_active: boolean | null;
}

type SortField = 'display_name' | 'open_balance';
type SortOrder = 'asc' | 'desc';

const CustomersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<SortField>('display_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Fetch customers from Supabase
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, display_name, company_name, email, phone, open_balance, is_active');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
  });

  // Handle sorting
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort customers
  const filteredCustomers = React.useMemo(() => {
    return customers
      .filter(customer => {
        // Filter by search query
        const matchesSearch = 
          (customer.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
          (customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        
        // Filter by active status
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'active') return matchesSearch && customer.is_active === true;
        if (activeTab === 'inactive') return matchesSearch && customer.is_active === false;
        
        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort customers
        if (sortField === 'display_name') {
          const nameA = a.display_name || '';
          const nameB = b.display_name || '';
          return sortOrder === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortField === 'open_balance') {
          const balanceA = a.open_balance || 0;
          const balanceB = b.open_balance || 0;
          return sortOrder === 'asc' 
            ? balanceA - balanceB 
            : balanceB - balanceA;
        }
        return 0;
      });
  }, [customers, searchQuery, activeTab, sortField, sortOrder]);

  return (
    <>
      <PageHeader 
        title="Customers" 
        subtitle="Manage your customer accounts"
        actions={
          <Button onClick={() => navigate('/customers/new')} className="gap-2">
            <UserPlus className="h-4 w-4" />
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
                placeholder="Search customers by name or email..."
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleSort('display_name')}>
                  Sort by Name {sortField === 'display_name' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('open_balance')}>
                  Sort by Balance {sortField === 'open_balance' && (sortOrder === 'asc' ? '(Low-High)' : '(High-Low)')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Open Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-spin rounded-full border-t-2 border-primary h-8 w-8 mb-2" />
                        Loading customers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <TableCell className="font-medium">{customer.display_name}</TableCell>
                      <TableCell>{customer.company_name || '-'}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>{customer.phone ? formatPhoneNumber(customer.phone) : '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.open_balance || 0)}</TableCell>
                      <TableCell>
                        <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
      </div>
    </>
  );
};

export default CustomersPage;
