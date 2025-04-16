
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import SyncStatus from '@/components/SyncManager/SyncStatus';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRound, Calendar, Truck, FileText, Edit } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { usePurchaseOrderDetail } from './hooks/usePurchaseOrderDetail';

const PurchaseOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { purchaseOrder, lineItems, isLoading, error } = usePurchaseOrderDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Purchase Order not found</h2>
          <p className="text-muted-foreground">{error || "The purchase order you're looking for doesn't exist"}</p>
          <Button onClick={() => navigate('/purchase-orders')} className="mt-4">
            Back to Purchase Orders
          </Button>
        </div>
      </div>
    );
  }

  const getValidStatus = (status?: string): 'draft' | 'pending' | 'approved' | 'received' | 'default' => {
    switch (status) {
      case 'draft': return 'draft';
      case 'pending': return 'pending';
      case 'approved': return 'approved';
      case 'received': return 'received';
      default: return 'draft';
    }
  };

  return (
    <>
      <PageHeader 
        title={`Purchase Order ${purchaseOrder.purchase_order_number || `#${purchaseOrder.id.substring(0, 8)}`}`}
        subtitle={`Vendor: ${purchaseOrder.vendor_name || 'Unknown Vendor'}`}
        actions={
          <Button variant="outline" onClick={() => navigate(`/purchase-orders/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Purchase Order
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Purchase Order Info</h3>
              <div className="flex gap-2">
                <StatusBadge status={getValidStatus(purchaseOrder.status)} />
                <SyncStatus 
                  status={purchaseOrder.sync_status} 
                  lastSyncAt={purchaseOrder.last_sync_at} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <UserRound className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Vendor</div>
                  <div className="font-medium">{purchaseOrder.vendor_name || 'Not specified'}</div>
                </div>
              </div>
              
              {purchaseOrder.po_date && (
                <div className="flex items-start">
                  <Calendar className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">PO Date</div>
                    <div>{formatDate(new Date(purchaseOrder.po_date))}</div>
                  </div>
                </div>
              )}
              
              {purchaseOrder.expected_date && (
                <div className="flex items-start">
                  <Truck className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Expected Date</div>
                    <div>{formatDate(new Date(purchaseOrder.expected_date))}</div>
                  </div>
                </div>
              )}
              
              {purchaseOrder.ship_to && (
                <div className="flex items-start">
                  <FileText className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Ship To</div>
                    <div>{purchaseOrder.ship_to}</div>
                  </div>
                </div>
              )}
              
              {purchaseOrder.memo && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm text-muted-foreground mb-1">Memo</div>
                  <div className="text-sm">{purchaseOrder.memo}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item / Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.length > 0 ? (
                    <>
                      {lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.item_name && <div className="font-medium">{item.item_name}</div>}
                            {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(purchaseOrder.total || 0)}</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">No line items found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PurchaseOrderDetailPage;
