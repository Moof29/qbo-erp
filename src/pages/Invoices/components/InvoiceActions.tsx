
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface InvoiceActionsProps {
  onSeedData: () => void;
  isLoading: boolean;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ onSeedData, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onSeedData} 
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
  );
};

export default InvoiceActions;
