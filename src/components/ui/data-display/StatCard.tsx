
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon,
  trend,
  className,
  valueClassName 
}: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <h3 className={cn("text-2xl font-bold", valueClassName)}>
          {value}
        </h3>
        
        {trend && (
          <span className={cn(
            "ml-2 text-xs",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
