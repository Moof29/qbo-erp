
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import { seedIfEmptyInvoices, isSeedErrorResult } from '@/utils/seed';
import { useInvoices } from './hooks/useInvoices';
import { useToast } from '@/hooks/use-toast';
import FloatingActionButton from '@/components/ui/actions/FloatingActionButton';
import InvoiceFilters from './components/InvoiceFilters';
import InvoicesTable from './components/InvoicesTable';
import InvoiceActions from './components/InvoiceActions';

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invoices, isLoading, refetch, searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useInvoices();
  
  // Check for dummy data on initial load
  useEffect(() => {
    const checkAndSeedData = async () => {
      try {
        await seedIfEmptyInvoices();
      } catch (error) {
        console.error("Error in initial seed:", error);
      } finally {
        refetch();
      }
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
      } else if (isSeedErrorResult(result)) {
        toast({
          variant: "destructive",
          title: "Failed to add sample data",
          description: result.error || "Unknown error occurred",
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
        actions={<InvoiceActions onSeedData={handleSeedDummyData} isLoading={isLoading} />}
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <InvoiceFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

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
              <InvoicesTable 
                invoices={invoices} 
                isLoading={isLoading} 
                onSeedData={handleSeedDummyData}
              />
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
