
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'paid' | 'unpaid' | 'partial' | 'active' | 'inactive' | 'pending' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={cn('status-badge', status, className)}>
      {label}
    </span>
  );
};

export default StatusBadge;
