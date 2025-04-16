
// This file exists for backward compatibility
// It re-exports functionality from the new modular seed system
import { 
  seedIfEmptyPurchaseOrders,
  seedDummyPurchaseOrders,
  checkPurchaseOrdersExist,
  SeedResult
} from './seed';

// Re-export everything
export { 
  seedIfEmptyPurchaseOrders, 
  seedDummyPurchaseOrders, 
  checkPurchaseOrdersExist 
};

// Re-export types
export type { SeedResult };

// Re-export the toast import for compatibility
export { toast } from "@/hooks/use-toast";
