
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import PageHeader from '@/components/ui/elements/PageHeader';
import { seedIfEmpty } from '@/utils/seedDummyData';
import CustomerFilters from './components/CustomerFilters';
import CustomersTable from './components/CustomersTable';
import { useCustomers, type SortField } from './hooks/useCustomers';

const CustomersPage = () => {
  const navigate = useNavigate();
  const { 
    customers, 
    isLoading, 
    refetch,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortOrder,
    toggleSort
  } = useCustomers();

  // Check for dummy data on initial load
  useEffect(() => {
    seedIfEmpty();
  }, []);

  // Seed dummy data function
  const handleSeedDummyData = () => {
    seedIfEmpty().then(() => {
      refetch();
    });
  };

  return (
    <>
      <PageHeader 
        title="Customers" 
        subtitle="Manage your customer accounts"
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={handleSeedDummyData} 
              variant="outline" 
              className="gap-2"
              disabled={isLoading}
            >
              <Users className="h-4 w-4" />
              Add Sample Data
            </Button>
            <Button onClick={() => navigate('/customers/new')} className="gap-2">
              <UserPlus className="h-4 w-4" />
              New Customer
            </Button>
          </div>
        }
      />
      
      <div className="rounded-lg border bg-card mb-6">
        <div className="p-4">
          <CustomerFilters 
            searchQuery={searchQuery}
            activeTab={activeTab}
            sortField={sortField}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onTabChange={setActiveTab}
            onSortToggle={toggleSort}
          />

          <div className="rounded-md border">
            <CustomersTable 
              customers={customers}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPage;
