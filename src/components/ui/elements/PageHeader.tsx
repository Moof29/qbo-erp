
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ 
  title, 
  subtitle,
  actions,
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn(
      "flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b",
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0 space-x-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
