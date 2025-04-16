
import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type SortField } from '../hooks/useCustomers';

type SortOrder = 'asc' | 'desc';

interface CustomerFiltersProps {
  searchQuery: string;
  activeTab: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: string) => void;
  onSortToggle: (field: SortField) => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchQuery,
  activeTab,
  sortField,
  sortOrder,
  onSearchChange,
  onTabChange,
  onSortToggle,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or email..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full md:w-auto"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortToggle('display_name')}>
            Sort by Name {sortField === 'display_name' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortToggle('balance')}>
            Sort by Balance {sortField === 'balance' && (sortOrder === 'asc' ? '(Low-High)' : '(High-Low)')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerFilters;
