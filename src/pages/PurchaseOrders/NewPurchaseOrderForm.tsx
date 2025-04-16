
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/elements/PageHeader';

const NewPurchaseOrderForm = () => {
  const navigate = useNavigate();
  
  // This is just a placeholder - would implement the real form in a future task
  return (
    <>
      <PageHeader 
        title="New Purchase Order" 
        subtitle="Create a new order for vendor supplies" 
      />
      
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Purchase Order Form - Placeholder</h3>
        <p className="mb-4 text-muted-foreground">This is a placeholder for the new purchase order form.</p>
        <Button onClick={() => navigate('/purchase-orders')}>
          Back to Purchase Orders
        </Button>
      </div>
    </>
  );
};

export default NewPurchaseOrderForm;
