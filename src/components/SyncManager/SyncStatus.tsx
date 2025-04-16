
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SyncStatusProps {
  status?: string;
  lastSyncAt?: string | null;
  className?: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ status, lastSyncAt, className }) => {
  if (!status) return null;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'synced':
        return <Check className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'syncing':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'syncing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'synced':
        return 'Synced';
      case 'pending':
        return 'Pending Sync';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      default:
        return 'Not Synced';
    }
  };
  
  const formatLastSyncTime = () => {
    if (!lastSyncAt) return 'Never synced';
    
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`gap-1 cursor-help font-normal ${getStatusColor()} ${className}`} 
            variant="outline"
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>QBO Sync Status: {getStatusText()}</p>
          <p className="text-xs mt-1">
            Last synced: {formatLastSyncTime()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatus;
