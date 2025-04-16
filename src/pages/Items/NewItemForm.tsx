
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/elements/PageHeader';

const NewItemForm = () => {
  const navigate = useNavigate();
  
  // This is just a placeholder - would implement the real form in a future task
  return (
    <>
      <PageHeader 
        title="New Item" 
        subtitle="Add a new product or service to your inventory" 
      />
      
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Item Form - Placeholder</h3>
        <p className="mb-4 text-muted-foreground">This is a placeholder for the new item form.</p>
        <Button onClick={() => navigate('/items')}>
          Back to Items
        </Button>
      </div>
    </>
  );
};

export default NewItemForm;
