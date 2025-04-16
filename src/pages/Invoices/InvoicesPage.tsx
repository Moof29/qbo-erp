
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Search, Calendar, FileText, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { seedIfEmptyInvoices } from '@/utils/seedInvoiceData';
import { useInvoices } from './hooks/useInvoices';
import { useToast } from '@/hooks/use-toast';
import FloatingActionButton from '@/components/ui/actions/FloatingActionButton';
import SyncStatus from '@/components/SyncManager/SyncStatus';

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invoices, isLoading, refetch, searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useInvoices();
  
  // Check for dummy data on initial load
  useEffect(() => {
    const checkAndSeedData = async () => {
      await seedIfEmptyInvoices();
      refetch();
    };
    
    checkAndSeedData();
  }, []);
  
  // Seed dummy data function
  const handleSeedDummyData = async () => {
    try {
      const result = await seedIfEmptyInvoices();
      if (result.success) {
        toast({
          title: "Invoice data added",
          description: result.count > 0 
            ? `${result.count} sample invoices have been added` 
            : result.message || "No new invoices were needed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add sample data",
          description: "success" in result && !result.success && "error" in result 
            ? result.error 
            : "Unknown error occurred",
        });
      }
      refetch(); // Always refetch to ensure UI is updated
    } catch (error) {
      console.error("Error in handleSeedDummyData:", error);
      toast({
        variant: "destructive",
        title: "Error adding sample data",
        description: String(error),
      });
    }
  };

  return (
    <>
      <PageHeader 
        title="Invoices" 
        subtitle="Manage your customer invoices"
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={handleSeedDummyData} 
              variant="outline" 
              className="gap-2"
              disabled={isLoading}
            >
              <FileText className="h-4 w-4" />
              Add Sample Data
            </Button>
            <Button onClick={() => navigate('/invoices/new')} className="gap-2">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>
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
                <TableHead>Sync Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.customer_name || 'Unknown Customer'}</TableCell>
                    <TableCell>{invoice.invoice_date}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Calendar size={14} />
                      {invoice.due_date}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>{formatCurrency(invoice.balance)}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status as 'paid' | 'unpaid' | 'partial'} />
                    </TableCell>
                    <TableCell>
                      <SyncStatus status={invoice.sync_status} lastSyncAt={null} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText size={32} className="mb-2" />
                      <p>No invoices found matching your criteria</p>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleSeedDummyData}
                      >
                        Add Sample Invoices
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FloatingActionButton 
        onClick={() => navigate('/invoices/new')}
        position="bottom-right"
      >
        New Invoice
      </FloatingActionButton>
    </>
  );
};

export default InvoicesPage;
