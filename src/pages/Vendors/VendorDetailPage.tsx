
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, Calendar, Building, FileText, Receipt } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

// Mock data
const vendors = [
  { 
    id: '1', 
    name: 'Office Depot', 
    email: 'accounts@officedepot.com', 
    phone: '1234567890', 
    status: 'active',
    terms: 'Net 30',
    address: {
      street: '123 Supply St',
      city: 'Commerce City',
      state: 'CA',
      zip: '90210',
    },
    bills: [
      { id: 'BILL-2023-001', date: '2023-05-01', dueDate: '2023-05-31', amount: 850.75, status: 'paid' },
      { id: 'BILL-2023-005', date: '2023-05-15', dueDate: '2023-06-15', amount: 1200.25, status: 'unpaid' },
    ],
    payments: [
      { id: 'PAY-2023-002', date: '2023-05-14', method: 'Bank Transfer', amount: 850.75 },
    ],
    files: [
      { id: 1, name: 'vendor_agreement.pdf', date: '2023-04-15', size: '1.2 MB' },
      { id: 2, name: 'w9_form.pdf', date: '2023-04-15', size: '345 KB' },
    ]
  },
];

const VendorDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vendor = vendors.find(v => v.id === id);

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Vendor not found</h2>
          <p className="text-muted-foreground">The vendor you're looking for doesn't exist</p>
          <Button onClick={() => navigate('/vendors')} className="mt-4">
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title={vendor.name}
        actions={
          <Button onClick={() => navigate(`/bills/new?vendor=${id}`)}>
            <Receipt className="mr-2 h-4 w-4" />
            Create New Bill
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Vendor Information</h3>
              <StatusBadge status={vendor.status as 'active' | 'inactive'} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email Address</div>
                  <div>{vendor.email}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                  <div>{formatPhoneNumber(vendor.phone)}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div>{vendor.address.street}</div>
                  <div>{vendor.address.city}, {vendor.address.state} {vendor.address.zip}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Payment Terms</div>
                  <div>{vendor.terms}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="bills" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="bills">Bills</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bills" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.bills.map(bill => (
                      <TableRow 
                        key={bill.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/bills/${bill.id}`)}
                      >
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>{bill.date}</TableCell>
                        <TableCell>{bill.dueDate}</TableCell>
                        <TableCell>{formatCurrency(bill.amount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={bill.status as any} />
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
                    {vendor.payments.map(payment => (
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
              
              <TabsContent value="files" className="p-4">
                <div className="space-y-4">
                  {vendor.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">Uploaded {file.date} • {file.size}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                  
                  <div className="flex justify-center p-6 border border-dashed rounded-md">
                    <div className="text-center">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Upload Files</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here or click to browse
                      </div>
                      <Button size="sm">Upload</Button>
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

export default VendorDetailPage;
