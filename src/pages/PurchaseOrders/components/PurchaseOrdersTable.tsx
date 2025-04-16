import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { PurchaseOrder } from '../hooks/usePurchaseOrders';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
}

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({ purchaseOrders, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No purchase orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters, or create a new purchase order.
        </p>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO Number</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Expected Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchaseOrders.map((po) => (
          <TableRow 
            key={po.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/purchase-orders/${po.id}`)}
          >
            <TableCell className="font-medium">{po.purchase_order_number || `PO-${po.id.substring(0, 8)}`}</TableCell>
            <TableCell>{po.vendor_name || "—"}</TableCell>
            <TableCell>{po.po_date ? formatDate(new Date(po.po_date)) : "—"}</TableCell>
            <TableCell>{po.expected_date ? formatDate(new Date(po.expected_date)) : "—"}</TableCell>
            <TableCell>{po.total ? formatCurrency(po.total) : "—"}</TableCell>
            <TableCell>
              <StatusBadge status={getValidStatus(po.status)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PurchaseOrdersTable;
