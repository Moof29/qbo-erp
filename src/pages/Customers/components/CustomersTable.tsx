
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Users } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

interface Customer {
  id: string;
  display_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  balance: number | null;
  is_active: boolean | null;
}

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ customers, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <div className="animate-spin rounded-full border-t-2 border-primary h-8 w-8 mb-2" />
                Loading customers...
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (customers.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Users size={32} className="mb-2" />
                No customers found matching your criteria
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Display Name</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow 
            key={customer.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            <TableCell className="font-medium">{customer.display_name}</TableCell>
            <TableCell>{customer.company_name || '-'}</TableCell>
            <TableCell>{customer.email || '-'}</TableCell>
            <TableCell>{customer.phone ? formatPhoneNumber(customer.phone) : '-'}</TableCell>
            <TableCell className="text-right">{formatCurrency(customer.balance || 0)}</TableCell>
            <TableCell>
              <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomersTable;
