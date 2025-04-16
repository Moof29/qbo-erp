
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, CircleDollarSign, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { formatCurrency } from '@/lib/formatters';
import type { Item } from '../hooks/useItems';

interface ItemsTableProps {
  items: Item[];
  isLoading: boolean;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, isLoading }) => {
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

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters, or add a new item.
        </p>
      </div>
    );
  }

  const getItemIcon = (itemType?: string) => {
    switch (itemType) {
      case 'inventory':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'service':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'non-inventory':
        return <CircleDollarSign className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Purchase Cost</TableHead>
          <TableHead>Reorder Point</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow 
            key={item.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/items/${item.id}`)}
          >
            <TableCell>{getItemIcon(item.item_type)}</TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.sku || "—"}</TableCell>
            <TableCell>{item.purchase_cost ? formatCurrency(item.purchase_cost) : "—"}</TableCell>
            <TableCell>{item.reorder_point ?? "—"}</TableCell>
            <TableCell>
              <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ItemsTable;
