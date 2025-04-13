
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Building, Tag, FileText } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

// Mock data
const customers = [
  { 
    id: '1', 
    name: 'Acme Inc.', 
    email: 'billing@acme.com', 
    phone: '1234567890', 
    status: 'active',
    address: {
      street: '123 Business Ave',
      city: 'Techville',
      state: 'CA',
      zip: '90210',
    },
    invoices: [
      { id: 'INV-2023-001', date: '2023-05-01', amount: 1250.00, status: 'paid' },
      { id: 'INV-2023-005', date: '2023-05-15', amount: 2700.50, status: 'unpaid' },
    ],
    payments: [
      { id: 'PAY-2023-001', date: '2023-05-12', method: 'Credit Card', amount: 1250.00 },
    ],
    notes: [
      { id: 1, date: '2023-05-10', author: 'John Doe', content: 'Called about upcoming invoice. They requested a detailed statement.' },
      { id: 2, date: '2023-04-22', author: 'Jane Smith', content: 'Discussed payment terms, they prefer Net 30 going forward.' },
    ]
  },
];

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Customer not found</h2>
          <p className="text-muted-foreground">The customer you're looking for doesn't exist</p>
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
        title={customer.name}
        actions={
          <Button onClick={() => navigate(`/invoices/new?customer=${id}`)}>
            <FileText className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <StatusBadge status={customer.status as 'active' | 'inactive'} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email Address</div>
                  <div>{customer.email}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                  <div>{formatPhoneNumber(customer.phone)}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Billing Address</div>
                  <div>{customer.address.street}</div>
                  <div>{customer.address.city}, {customer.address.state} {customer.address.zip}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Customer Tags</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">Enterprise</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">Tech</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoices" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.invoices.map(invoice => (
                      <TableRow 
                        key={invoice.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status as any} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="payments" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.payments.map(payment => (
                      <TableRow 
                        key={payment.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/payments/${payment.id}`)}
                      >
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="notes" className="p-4">
                <div className="space-y-4">
                  {customer.notes.map(note => (
                    <div key={note.id} className="border rounded-md p-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{note.author}</span>
                        <span className="text-sm text-muted-foreground">{note.date}</span>
                      </div>
                      <p>{note.content}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Textarea placeholder="Add a note..." className="mb-2" />
                    <Button size="sm">Add Note</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CustomerDetailPage;
