
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import PageHeader from '@/components/ui/elements/PageHeader';
import { seedIfEmptyItems } from '@/utils/seedItemData';
import ItemsTable from './components/ItemsTable';
import ItemFilters from './components/ItemFilters';
import { useItems, type SortField } from './hooks/useItems';

const ItemsPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isLoading, 
    refetch,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  } = useItems();

  // Check for dummy data on initial load
  useEffect(() => {
    seedIfEmptyItems();
  }, []);

  // Seed dummy data function
  const handleSeedDummyData = () => {
    seedIfEmptyItems().then(() => {
      refetch();
    });
  };

  return (
    <>
      <PageHeader 
        title="Items & Inventory" 
        subtitle="Manage your products, services and inventory"
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={handleSeedDummyData} 
              variant="outline" 
              className="gap-2"
              disabled={isLoading}
            >
              <Package className="h-4 w-4" />
              Add Sample Data
            </Button>
            <Button onClick={() => navigate('/items/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Item
            </Button>
          </div>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <ItemFilters 
            searchQuery={searchQuery}
            activeTab={activeTab}
            sortField={sortField}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onTabChange={setActiveTab}
            onSortToggle={toggleSort}
          />

          <div className="rounded-md border mt-4">
            <ItemsTable 
              items={items}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemsPage;
