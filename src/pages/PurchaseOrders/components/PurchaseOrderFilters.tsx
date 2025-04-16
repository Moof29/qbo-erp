
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { type SortField } from "../hooks/usePurchaseOrders";

interface PurchaseOrderFiltersProps {
  searchQuery: string;
  statusFilter: string;
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortToggle: (field: SortField) => void;
}

const PurchaseOrderFilters = ({ 
  searchQuery, 
  statusFilter, 
  sortField, 
  sortOrder, 
  onSearchChange, 
  onStatusChange, 
  onSortToggle 
}: PurchaseOrderFiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search purchase orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={statusFilter} value={statusFilter} onValueChange={onStatusChange} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Sort by:</span>
        
        <button 
          onClick={() => onSortToggle('po_date')}
          className={`flex items-center hover:text-foreground ${sortField === 'po_date' ? 'text-foreground font-medium' : ''}`}
        >
          Date
          {sortField === 'po_date' && (
            sortOrder === 'asc' ? 
              <ArrowUp className="ml-1 h-3 w-3" /> : 
              <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </button>
        
        <span>·</span>
        
        <button 
          onClick={() => onSortToggle('purchase_order_number')}
          className={`flex items-center hover:text-foreground ${sortField === 'purchase_order_number' ? 'text-foreground font-medium' : ''}`}
        >
          PO Number
          {sortField === 'purchase_order_number' && (
            sortOrder === 'asc' ? 
              <ArrowUp className="ml-1 h-3 w-3" /> : 
              <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </button>

        <span>·</span>
        
        <button 
          onClick={() => onSortToggle('total')}
          className={`flex items-center hover:text-foreground ${sortField === 'total' ? 'text-foreground font-medium' : ''}`}
        >
          Amount
          {sortField === 'total' && (
            sortOrder === 'asc' ? 
              <ArrowUp className="ml-1 h-3 w-3" /> : 
              <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrderFilters;
