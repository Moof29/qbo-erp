
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/ui/elements/PageHeader';
import { Trash2, Plus, Save, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Mock customers for dropdown
const customers = [
  { id: '1', name: 'Acme Inc.' },
  { id: '2', name: 'Tech Solutions' },
  { id: '3', name: 'Global Enterprises' },
  { id: '4', name: 'Local Business' },
];

// Mock products/services for dropdown
const items = [
  { id: '1', name: 'Web Development', rate: 95.00 },
  { id: '2', name: 'Graphic Design', rate: 85.00 },
  { id: '3', name: 'Hosting (Basic)', rate: 15.00 },
  { id: '4', name: 'Hosting (Premium)', rate: 35.00 },
  { id: '5', name: 'SEO Services', rate: 55.00 },
];

// Mock tax codes for dropdown
const taxCodes = [
  { id: '1', name: 'No Tax', rate: 0 },
  { id: '2', name: 'Sales Tax (7%)', rate: 0.07 },
  { id: '3', name: 'Sales Tax (8.5%)', rate: 0.085 },
];

interface LineItem {
  id: string;
  itemId: string;
  description: string;
  quantity: number;
  rate: number;
  taxId: string;
  taxRate: number;
}

const NewInvoiceForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  // Default due date (15 days from today)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [invoiceDueDate, setInvoiceDueDate] = useState(dueDateStr);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', itemId: '', description: '', quantity: 1, rate: 0, taxId: '1', taxRate: 0 }
  ]);

  // Add a new line item
  const addLineItem = () => {
    const newId = `${lineItems.length + 1}`;
    setLineItems([
      ...lineItems, 
      { id: newId, itemId: '', description: '', quantity: 1, rate: 0, taxId: '1', taxRate: 0 }
    ]);
  };

  // Remove a line item
  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  // Update a line item
  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        // If selecting an item from the dropdown, update the rate too
        if (field === 'itemId' && items) {
          const selectedItem = items.find(i => i.id === value);
          if (selectedItem) {
            return { ...item, [field]: value, rate: selectedItem.rate };
          }
        }
        
        // If selecting a tax code, update the tax rate
        if (field === 'taxId' && taxCodes) {
          const selectedTax = taxCodes.find(t => t.id === value);
          if (selectedTax) {
            return { ...item, [field]: value, taxRate: selectedTax.rate };
          }
        }
        
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let tax = 0;
    
    lineItems.forEach(item => {
      const lineTotal = item.quantity * item.rate;
      subtotal += lineTotal;
      tax += lineTotal * item.taxRate;
    });
    
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const { subtotal, tax, total } = calculateTotals();

  // Save or send invoice
  const saveInvoice = (send = false) => {
    // Here you would typically send data to your backend
    console.log('Invoice data:', {
      customerId,
      invoiceDate,
      dueDate: invoiceDueDate,
      lineItems,
      subtotal,
      tax,
      total,
      status: send ? 'sent' : 'draft'
    });
    
    // Navigate back to invoices list
    navigate('/invoices');
  };

  return (
    <>
      <PageHeader 
        title="Create New Invoice" 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => saveInvoice(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => saveInvoice(true)}>
              <Send className="mr-2 h-4 w-4" />
              Save & Send
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger id="customer" className="mt-1">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input 
                  id="invoice-date" 
                  type="date" 
                  value={invoiceDate} 
                  onChange={e => setInvoiceDate(e.target.value)} 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input 
                  id="due-date" 
                  type="date" 
                  value={invoiceDueDate} 
                  onChange={e => setInvoiceDueDate(e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground">
                <div className="col-span-3">Item</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-1 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Tax</div>
                <div className="col-span-1"></div>
              </div>
              
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <Select value={item.itemId} onValueChange={value => updateLineItem(item.id, 'itemId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Textarea 
                      placeholder="Description" 
                      className="resize-none h-10"
                      value={item.description}
                      onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Input 
                      type="number"
                      min="1"
                      className="text-right"
                      value={item.quantity}
                      onChange={e => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      className="text-right"
                      value={item.rate}
                      onChange={e => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Select value={item.taxId} onValueChange={value => updateLineItem(item.id, 'taxId', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {taxCodes.map(tax => (
                          <SelectItem key={tax.id} value={tax.id}>
                            {tax.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="mt-2" onClick={addLineItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Line Item
              </Button>
            </div>
            
            <div className="flex justify-end mt-8">
              <div className="w-full md:w-64">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Total Due</span>
                  <span className="font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NewInvoiceForm;
