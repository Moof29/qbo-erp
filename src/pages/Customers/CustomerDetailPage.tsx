
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/elements/PageHeader';
import { Edit, FileText, CreditCard, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CustomerForm from './CustomerForm';
import { useCustomerDetail } from './hooks/useCustomerDetail';
import CustomerInfo from './components/CustomerInfo';
import CustomerTabs from './components/CustomerTabs';

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const {
    customer,
    isLoading,
    error,
    mockInvoices,
    mockPayments,
    mockNotes
  } = useCustomerDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full border-t-2 border-primary h-12 w-12" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Customer not found</h2>
          <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 bg-background z-10 pb-4">
        <PageHeader 
          title={customer.display_name}
          subtitle={customer.company_name || 'Individual Customer'}
          actions={
            <div className="flex flex-wrap gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Customer
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
                  <div className="p-4 md:p-6">
                    <CustomerForm customerId={customer.id} />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button onClick={() => navigate(`/invoices/new?customer=${id}`)}>
                <FileText className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
              
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </div>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CustomerInfo customer={customer} />
        <CustomerTabs 
          customer={customer}
          mockInvoices={mockInvoices}
          mockPayments={mockPayments}
          mockNotes={mockNotes}
        />
      </div>
    </>
  );
};

export default CustomerDetailPage;
