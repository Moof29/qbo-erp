
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/ui/elements/PageHeader';
import { useCustomerDetail } from './hooks/useCustomerDetail';
import DetailsTab from './components/tabs/DetailsTab';
import InvoicesTab from './components/tabs/InvoicesTab';
import PaymentsTab from './components/tabs/PaymentsTab';
import NotesTab from './components/tabs/NotesTab';

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { customer, isLoading, error, mockPayments, mockNotes } = useCustomerDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Customer not found</h2>
          <p className="text-muted-foreground">{error || "The customer you're looking for doesn't exist"}</p>
          <Button onClick={() => navigate('/customers')} className="mt-4">
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title={customer.display_name}
        subtitle={`Since ${customer.created_at}`}
        actions={
          <Button variant="outline" onClick={() => navigate(`/customers/edit/${id}`)}>
            Edit Customer
          </Button>
        }
      />
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
              <div className="text-sm text-muted-foreground">
                {customer.company_name && <div>Company: {customer.company_name}</div>}
                <div>Email: {customer.email}</div>
                {customer.phone && <div>Phone: {customer.phone}</div>}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
              <div className="text-sm text-muted-foreground">
                <div>{customer.billing_address_line1}</div>
                {customer.billing_address_line2 && <div>{customer.billing_address_line2}</div>}
                <div>{customer.billing_city}, {customer.billing_state} {customer.billing_postal_code}</div>
                <div>{customer.billing_country}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    
      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <DetailsTab customer={customer} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <InvoicesTab customerId={id || ''} />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentsTab payments={mockPayments} />
        </TabsContent>
        
        <TabsContent value="notes">
          <NotesTab notes={mockNotes} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CustomerDetailPage;
