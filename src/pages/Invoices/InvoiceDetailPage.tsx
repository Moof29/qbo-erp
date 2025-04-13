
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { FileText, Send, CreditCard, Download, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mock data
const invoices = [
  { 
    id: 'INV-2023-001', 
    customer: {
      name: 'Acme Inc.',
      email: 'billing@acme.com',
      address: '123 Business Ave, Techville, CA 90210'
    },
    invoiceDate: '2023-05-01', 
    dueDate: '2023-05-15', 
    amount: 1250.00, 
    balance: 0, 
    status: 'paid',
    items: [
      { id: 1, name: 'Website Development', description: 'Homepage redesign', quantity: 1, rate: 950.00, tax: 0, total: 950.00 },
      { id: 2, name: 'Hosting Services', description: 'Monthly hosting (Premium plan)', quantity: 2, rate: 150.00, tax: 0, total: 300.00 },
    ]
  },
  // More invoices...
];

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Invoice not found</h2>
          <p className="text-muted-foreground">The invoice you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/invoices')} className="mt-4">
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = invoice.items.reduce((sum, item) => sum + (item.tax || 0), 0);
  const total = subtotal + taxAmount;

  return (
    <>
      <PageHeader 
        title={`Invoice ${invoice.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/invoices/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate('/payments/new?invoice=' + id)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To</h3>
              <div className="text-sm">
                <p className="font-medium">{invoice.customer.name}</p>
                <p>{invoice.customer.email}</p>
                <p className="whitespace-pre-line">{invoice.customer.address}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm font-normal">
                  Invoice Date: {invoice.invoiceDate}
                </Badge>
                <Badge variant="outline" className="text-sm font-normal">
                  Due Date: {invoice.dueDate}
                </Badge>
              </div>
              
              <div className="mt-4 md:mt-0">
                <StatusBadge status={invoice.status as any} className="text-sm" />
              </div>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.tax || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-end mt-8">
            <div className="w-full md:w-64">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Balance Due</span>
                <span className="font-bold">{formatCurrency(invoice.balance)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default InvoiceDetailPage;
