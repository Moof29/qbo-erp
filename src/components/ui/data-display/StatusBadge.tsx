
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 
  'paid' | 
  'unpaid' | 
  'partial' | 
  'active' | 
  'inactive' | 
  'pending' | 
  'completed' | 
  'cancelled' | 
  'refunded' | 
  'overdue' |
  'draft' |
  'approved' |
  'received' |
  'default';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unpaid':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'partial':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'received':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'default':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getStatusStyles(),
        className
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
