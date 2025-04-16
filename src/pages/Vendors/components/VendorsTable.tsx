
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { formatPhoneNumber } from '@/lib/formatters';
import type { Vendor } from '../hooks/useVendors';

interface VendorsTableProps {
  vendors: Vendor[];
  isLoading: boolean;
}

const VendorsTable: React.FC<VendorsTableProps> = ({ vendors, isLoading }) => {
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

  if (vendors.length === 0) {
    return (
      <div className="py-16 text-center">
        <Building className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No vendors found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters, or add a new vendor.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor Name</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Payment Terms</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <TableRow 
            key={vendor.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/vendors/${vendor.id}`)}
          >
            <TableCell className="font-medium">{vendor.display_name}</TableCell>
            <TableCell>{vendor.email || "—"}</TableCell>
            <TableCell>{vendor.phone ? formatPhoneNumber(vendor.phone) : "—"}</TableCell>
            <TableCell>{vendor.payment_terms || "—"}</TableCell>
            <TableCell>
              <StatusBadge status={vendor.is_active ? 'active' : 'inactive'} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VendorsTable;
