
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { FileText, Send, CreditCard, Download, Edit, Plus, Save, X } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    paymentTerms: 'Net 30',
    payments: [
      { id: 'PAY-001', date: '2023-05-14', amount: 1250.00 }
    ],
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const actionButtonsRef = useRef<HTMLDivElement>(null);

  // Initialize editable items from invoice data
  React.useEffect(() => {
    if (invoice) {
      setEditableItems([...invoice.items]);
    }
  }, [invoice]);

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
  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0);
    const taxAmount = items.reduce((sum, item) => sum + Number(item.tax || 0), 0);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals(isEditMode ? editableItems : invoice.items);

  // Handle item change
  const handleItemChange = (id: number, field: string, value: string | number) => {
    setEditableItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate total if quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            const quantity = field === 'quantity' ? Number(value) : Number(item.quantity);
            const rate = field === 'rate' ? Number(value) : Number(item.rate);
            updatedItem.total = quantity * rate;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Add new line item
  const addLineItem = () => {
    const newId = Math.max(0, ...editableItems.map(item => item.id)) + 1;
    setEditableItems([...editableItems, {
      id: newId,
      name: 'New Item',
      description: '',
      quantity: 1,
      rate: 0,
      tax: 0,
      total: 0
    }]);
  };

  // Save changes
  const saveChanges = () => {
    // In a real app, you would save to backend here
    setIsEditMode(false);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditableItems([...invoice.items]);
    setIsEditMode(false);
  };

  return (
    <>
      <PageHeader 
        title={`Invoice ${invoice.id}`}
        actions={
          <div ref={actionButtonsRef} className="flex gap-2 sticky top-4 z-10 bg-background py-2 px-4 -mr-4 rounded-md shadow-sm">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={saveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => navigate('/send-invoice/' + id)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button variant="outline" onClick={() => setIsPdfPreviewOpen(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => navigate('/payments/new?invoice=' + id)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </>
            )}
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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
                <div className="flex flex-wrap items-center gap-2">
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
                {(isEditMode ? editableItems : invoice.items).map((item) => (
                  <TableRow 
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {isEditMode ? (
                        <Input
                          className="w-full"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode ? (
                        <Input
                          className="w-full"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        />
                      ) : (
                        item.description
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditMode ? (
                        <Input
                          className="w-full text-right"
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditMode ? (
                        <Input
                          className="w-full text-right"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        />
                      ) : (
                        formatCurrency(item.rate)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditMode ? (
                        <Input
                          className="w-full text-right"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.tax || 0}
                          onChange={(e) => handleItemChange(item.id, 'tax', e.target.value)}
                        />
                      ) : (
                        formatCurrency(item.tax || 0)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
                
                {isEditMode && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-dashed" 
                        onClick={addLineItem}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Line Item
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="flex flex-col md:flex-row justify-end mt-8">
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

        {/* Payment Summary Panel */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Status</h4>
                <StatusBadge status={invoice.status as any} className="text-sm" />
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Payment Terms</h4>
                <p className="text-sm">{invoice.paymentTerms}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Linked Payments</h4>
                {invoice.payments && invoice.payments.length > 0 ? (
                  <div className="space-y-2">
                    {invoice.payments.map(payment => (
                      <div key={payment.id} className="text-sm p-2 bg-muted rounded-md flex justify-between">
                        <span>{payment.date}</span>
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No payments recorded</p>
                )}
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Balance</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remaining</span>
                  <span className="text-lg font-bold">{formatCurrency(invoice.balance)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      <Dialog open={isPdfPreviewOpen} onOpenChange={setIsPdfPreviewOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Invoice {invoice.id} - Preview</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="bg-white p-8 shadow-sm border rounded-md">
              {/* PDF Preview Content */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-xl font-bold mb-1">INVOICE</h1>
                  <p className="text-lg text-gray-700">{invoice.id}</p>
                </div>
                
                <div className="text-right">
                  <p className="mb-1"><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
                  <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                  <p className="mt-2"><strong>Status:</strong> <StatusBadge status={invoice.status as any} /></p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">From</h3>
                  <p className="font-semibold">Your Company Name</p>
                  <p>123 Your Street</p>
                  <p>Your City, State ZIP</p>
                  <p>billing@yourcompany.com</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Bill To</h3>
                  <p className="font-semibold">{invoice.customer.name}</p>
                  <p className="whitespace-pre-line">{invoice.customer.address}</p>
                  <p>{invoice.customer.email}</p>
                </div>
              </div>
              
              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-4 text-left">Item</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-right">Qty</th>
                    <th className="py-2 px-4 text-right">Rate</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.description}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
                    <span>Amount Due</span>
                    <span>{formatCurrency(invoice.balance)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-300 text-center text-gray-600 text-sm">
                <p>Payment Terms: {invoice.paymentTerms}</p>
                <p className="mt-2">Thank you for your business!</p>
              </div>
            </div>
          </div>
          
          <div className="border-t p-4 flex justify-end">
            <Button onClick={() => {
              console.log('Downloading PDF...');
              // In a real app, here you would trigger the download
              setIsPdfPreviewOpen(false);
            }}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceDetailPage;
