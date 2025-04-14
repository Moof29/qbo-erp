
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, Phone, MapPin, Building2, Tag, FileText, CreditCard, 
  Edit, PenLine, Calendar, ArrowLeft, Mobile, MapPinned, 
} from 'lucide-react';
import { formatCurrency, formatPhoneNumber, formatDate } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CustomerForm from './CustomerForm';

interface CustomerNote {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
}

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [currentTab, setCurrentTab] = useState('invoices');
  const queryClient = useQueryClient();
  
  // Fetch customer details
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!id) throw new Error('Customer ID is required');
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customer",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      // In a real app, you would insert into a notes table
      // This is just mock functionality since we don't have a notes table yet
      toast({
        title: "Note added",
        description: "Customer note has been saved",
      });
      return { id: Date.now().toString(), content, created_at: new Date().toISOString(), created_by: 'Current User' };
    },
    onSuccess: () => {
      setNewNote('');
      // In a real app, you would invalidate the notes query
    },
  });

  // Mock data for invoices, payments, and notes
  // In a real app, these would come from separate tables
  const mockInvoices = [
    { id: 'INV-2023-001', date: '2023-05-01', due_date: '2023-05-31', amount: 1250.00, status: 'paid' },
    { id: 'INV-2023-005', date: '2023-05-15', due_date: '2023-06-15', amount: 2700.50, status: 'unpaid' },
  ];

  const mockPayments = [
    { id: 'PAY-2023-001', date: '2023-05-12', method: 'Credit Card', amount: 1250.00 },
  ];

  const mockNotes = [
    { id: '1', created_at: '2023-05-10T14:30:00Z', created_by: 'John Doe', content: 'Called about upcoming invoice. They requested a detailed statement.' },
    { id: '2', created_at: '2023-04-22T09:15:00Z', created_by: 'Jane Smith', content: 'Discussed payment terms, they prefer Net 30 going forward.' },
  ];

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

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote.trim());
    }
  };

  return (
    <>
      <div className="sticky top-0 bg-background z-10 pb-4">
        <PageHeader 
          title={customer.display_name}
          subtitle={customer.company_name || 'Individual Customer'}
          actions={
            <div className="flex flex-wrap gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Customer
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh] overflow-y-auto">
                  <div className="p-4 md:p-6 max-w-4xl mx-auto">
                    <CustomerForm customerId={customer.id} />
                  </div>
                </DrawerContent>
              </Drawer>
              
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
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
            </div>
            
            <div className="space-y-5">
              {customer.open_balance !== null && (
                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Open Balance</div>
                  <div className="text-2xl font-semibold">{formatCurrency(customer.open_balance || 0)}</div>
                </div>
              )}
              
              {customer.email && (
                <div className="flex items-start">
                  <Mail className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                    <div>{customer.email}</div>
                  </div>
                </div>
              )}
              
              {customer.phone && (
                <div className="flex items-start">
                  <Phone className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone Number</div>
                    <div>{formatPhoneNumber(customer.phone)}</div>
                  </div>
                </div>
              )}
              
              {customer.mobile && (
                <div className="flex items-start">
                  <Mobile className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Mobile Number</div>
                    <div>{formatPhoneNumber(customer.mobile)}</div>
                  </div>
                </div>
              )}
              
              {(customer.billing_street || customer.billing_city || customer.billing_state) && (
                <div className="flex items-start">
                  <MapPin className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Billing Address</div>
                    {customer.billing_street && <div>{customer.billing_street}</div>}
                    {(customer.billing_city || customer.billing_state || customer.billing_postal_code) && (
                      <div>
                        {customer.billing_city && `${customer.billing_city}, `}
                        {customer.billing_state && `${customer.billing_state} `}
                        {customer.billing_postal_code && customer.billing_postal_code}
                      </div>
                    )}
                    {customer.billing_country && <div>{customer.billing_country}</div>}
                  </div>
                </div>
              )}
              
              {(customer.shipping_street || customer.shipping_city || customer.shipping_state) && (
                <div className="flex items-start">
                  <MapPinned className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Shipping Address</div>
                    {customer.shipping_street && <div>{customer.shipping_street}</div>}
                    {(customer.shipping_city || customer.shipping_state || customer.shipping_postal_code) && (
                      <div>
                        {customer.shipping_city && `${customer.shipping_city}, `}
                        {customer.shipping_state && `${customer.shipping_state} `}
                        {customer.shipping_postal_code && customer.shipping_postal_code}
                      </div>
                    )}
                    {customer.shipping_country && <div>{customer.shipping_country}</div>}
                  </div>
                </div>
              )}
              
              {customer.currency && (
                <div className="flex items-start">
                  <Tag className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Currency</div>
                    <div>{customer.currency}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.length > 0 ? (
                      mockInvoices.map(invoice => (
                        <TableRow 
                          key={invoice.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                        >
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.due_date}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <StatusBadge status={invoice.status as 'paid' | 'unpaid'} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText size={24} className="mb-2" />
                            No invoices found for this customer
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
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
                    {mockPayments.length > 0 ? (
                      mockPayments.map(payment => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <CreditCard size={24} className="mb-2" />
                            No payments found for this customer
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="notes" className="p-4">
                <div className="space-y-4">
                  {mockNotes.map(note => (
                    <div key={note.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{note.created_by}</span>
                        <span className="text-sm text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                  
                  <div className="mt-6">
                    <Textarea 
                      placeholder="Add a note about this customer..." 
                      className="mb-2" 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || addNoteMutation.isPending}
                    >
                      <PenLine className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="p-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Customer Details</h3>
                      <dl className="grid grid-cols-1 gap-2">
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Display Name</dt>
                          <dd className="col-span-2">{customer.display_name}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Company Name</dt>
                          <dd className="col-span-2">{customer.company_name || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Customer Type</dt>
                          <dd className="col-span-2">{customer.customer_type || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Tax Exempt</dt>
                          <dd className="col-span-2">{customer.tax_exempt_reason || 'No'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Resale Number</dt>
                          <dd className="col-span-2">{customer.resale_number || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="col-span-1 text-sm text-muted-foreground">Preferred Delivery</dt>
                          <dd className="col-span-2">{customer.preferred_delivery_method || '-'}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                      <dl className="grid grid-cols-1 gap-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">Notes</dt>
                          <dd className="mt-1 border rounded p-2 min-h-[100px] bg-muted/30">{customer.notes || 'No additional notes'}</dd>
                        </div>
                      </dl>
                    </div>
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
