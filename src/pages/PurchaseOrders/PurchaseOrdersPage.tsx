
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import PageHeader from '@/components/ui/elements/PageHeader';
import { seedIfEmptyPurchaseOrders } from '@/utils/seedPurchaseOrderData';
import PurchaseOrdersTable from './components/PurchaseOrdersTable';
import PurchaseOrderFilters from './components/PurchaseOrderFilters';
import { usePurchaseOrders, type SortField } from './hooks/usePurchaseOrders';

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const { 
    purchaseOrders, 
    isLoading, 
    refetch,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortOrder,
    toggleSort
  } = usePurchaseOrders();

  // Check for dummy data on initial load
  useEffect(() => {
    seedIfEmptyPurchaseOrders();
  }, []);

  // Seed dummy data function
  const handleSeedDummyData = () => {
    seedIfEmptyPurchaseOrders().then(() => {
      refetch();
    });
  };

  return (
    <>
      <PageHeader 
        title="Purchase Orders" 
        subtitle="Manage your vendor orders and supplies"
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
            <Button onClick={() => navigate('/purchase-orders/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Purchase Order
            </Button>
          </div>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <PurchaseOrderFilters 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortField={sortField}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSortToggle={toggleSort}
          />

          <div className="rounded-md border mt-4">
            <PurchaseOrdersTable 
              purchaseOrders={purchaseOrders}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrdersPage;
