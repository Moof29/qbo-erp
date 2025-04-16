
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { type SortField } from "../hooks/useItems";

interface ItemFiltersProps {
  searchQuery: string;
  activeTab: string;
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onTabChange: (value: string) => void;
  onSortToggle: (field: SortField) => void;
}

const ItemFilters = ({ 
  searchQuery, 
  activeTab, 
  sortField, 
  sortOrder, 
  onSearchChange, 
  onTabChange, 
  onSortToggle 
}: ItemFiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
          <TabsTrigger value="non-inventory">Non-Inventory</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Sort by:</span>
        
        <button 
          onClick={() => onSortToggle('name')}
          className={`flex items-center hover:text-foreground ${sortField === 'name' ? 'text-foreground font-medium' : ''}`}
        >
          Name
          {sortField === 'name' && (
            sortOrder === 'asc' ? 
              <ArrowUp className="ml-1 h-3 w-3" /> : 
              <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </button>
        
        <span>·</span>
        
        <button 
          onClick={() => onSortToggle('sku')}
          className={`flex items-center hover:text-foreground ${sortField === 'sku' ? 'text-foreground font-medium' : ''}`}
        >
          SKU
          {sortField === 'sku' && (
            sortOrder === 'asc' ? 
              <ArrowUp className="ml-1 h-3 w-3" /> : 
              <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemFilters;
