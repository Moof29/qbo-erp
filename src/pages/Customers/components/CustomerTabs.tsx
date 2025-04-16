
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoicesTab from './tabs/InvoicesTab';
import PaymentsTab from './tabs/PaymentsTab';
import NotesTab from './tabs/NotesTab';
import DetailsTab from './tabs/DetailsTab';

interface CustomerTabsProps {
  customer: any;
  mockPayments: any[];
  mockNotes: any[];
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({
  customer,
  mockPayments,
  mockNotes,
}) => {
  const [currentTab, setCurrentTab] = useState('invoices');

  return (
    <Card className="md:col-span-2">
      <CardContent className="p-0">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices" className="p-4">
            <InvoicesTab customerId={customer?.id || ''} />
          </TabsContent>
          
          <TabsContent value="payments" className="p-4">
            <PaymentsTab payments={mockPayments} />
          </TabsContent>
          
          <TabsContent value="notes" className="p-4">
            <NotesTab notes={mockNotes} />
          </TabsContent>
          
          <TabsContent value="details" className="p-4">
            <DetailsTab customer={customer} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomerTabs;
