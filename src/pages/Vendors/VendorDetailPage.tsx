
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, Calendar, Building, FileText, Receipt, GlobeIcon, User, CircleDollarSign } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';
import { useVendorDetail } from './hooks/useVendorDetail';

const VendorDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vendor, isLoading, error, bills, payments, files } = useVendorDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Vendor not found</h2>
          <p className="text-muted-foreground">{error || "The vendor you're looking for doesn't exist"}</p>
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
        title={vendor.display_name}
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
              <StatusBadge status={vendor.is_active ? 'active' : 'inactive'} />
            </div>
            
            <div className="space-y-4">
              {(vendor.first_name || vendor.last_name) && (
                <div className="flex items-start">
                  <User className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Contact Person</div>
                    <div>{[vendor.first_name, vendor.last_name].filter(Boolean).join(' ')}</div>
                  </div>
                </div>
              )}
              
              {vendor.email && (
                <div className="flex items-start">
                  <Mail className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                    <div>{vendor.email}</div>
                  </div>
                </div>
              )}
              
              {vendor.phone && (
                <div className="flex items-start">
                  <Phone className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone Number</div>
                    <div>{formatPhoneNumber(vendor.phone)}</div>
                  </div>
                </div>
              )}
              
              {(vendor.billing_address_line1 || vendor.billing_city || vendor.billing_state || vendor.billing_postal_code) && (
                <div className="flex items-start">
                  <Building className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    {vendor.billing_address_line1 && <div>{vendor.billing_address_line1}</div>}
                    {vendor.billing_address_line2 && <div>{vendor.billing_address_line2}</div>}
                    {(vendor.billing_city || vendor.billing_state || vendor.billing_postal_code) && (
                      <div>
                        {[
                          vendor.billing_city,
                          vendor.billing_state,
                          vendor.billing_postal_code
                        ].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {vendor.billing_country && <div>{vendor.billing_country}</div>}
                  </div>
                </div>
              )}
              
              {vendor.website && (
                <div className="flex items-start">
                  <GlobeIcon className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <div>{vendor.website}</div>
                  </div>
                </div>
              )}
              
              {vendor.payment_terms && (
                <div className="flex items-start">
                  <Calendar className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Terms</div>
                    <div>{vendor.payment_terms}</div>
                  </div>
                </div>
              )}
              
              {vendor.tax_id && (
                <div className="flex items-start">
                  <CircleDollarSign className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Tax ID</div>
                    <div>{vendor.tax_id}</div>
                  </div>
                </div>
              )}
              
              {vendor.notes && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm">{vendor.notes}</div>
                </div>
              )}
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
                    {bills.length > 0 ? bills.map(bill => (
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
                          <StatusBadge status={bill.status} />
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No bills found
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
                    {payments.length > 0 ? payments.map(payment => (
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
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No payments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="files" className="p-4">
                <div className="space-y-4">
                  {files.length > 0 ? files.map(file => (
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
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No files available
                    </div>
                  )}
                  
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
