
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, UserPlus } from 'lucide-react';
import PageHeader from '@/components/ui/elements/PageHeader';
import { seedIfEmptyVendors } from '@/utils/seedVendorData';
import VendorFilters from './components/VendorFilters';
import VendorsTable from './components/VendorsTable';
import { useVendors, type SortField } from './hooks/useVendors';

const VendorsPage = () => {
  const navigate = useNavigate();
  const { 
    vendors, 
    isLoading, 
    refetch,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  } = useVendors();

  // Check for dummy data on initial load
  useEffect(() => {
    seedIfEmptyVendors();
  }, []);

  // Seed dummy data function
  const handleSeedDummyData = () => {
    seedIfEmptyVendors().then(() => {
      refetch();
    });
  };

  return (
    <>
      <PageHeader 
        title="Vendors" 
        subtitle="Manage your supplier accounts"
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={handleSeedDummyData} 
              variant="outline" 
              className="gap-2"
              disabled={isLoading}
            >
              <Building2 className="h-4 w-4" />
              Add Sample Data
            </Button>
            <Button onClick={() => navigate('/vendors/new')} className="gap-2">
              <UserPlus className="h-4 w-4" />
              New Vendor
            </Button>
          </div>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <VendorFilters 
            searchQuery={searchQuery}
            activeTab={activeTab}
            sortField={sortField}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onTabChange={setActiveTab}
            onSortToggle={toggleSort}
          />

          <div className="rounded-md border">
            <VendorsTable 
              vendors={vendors}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorsPage;
