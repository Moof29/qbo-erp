
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const positions = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const FloatingActionButton = ({
  onClick,
  icon = <Plus />,
  children,
  className,
  variant = 'default',
  position = 'bottom-right',
}: FloatingActionButtonProps) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "fixed shadow-lg z-10 flex items-center gap-2",
        positions[position],
        className
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
};

export default FloatingActionButton;
