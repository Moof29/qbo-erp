
// This file exists for backward compatibility
// It re-exports functionality from the new modular seed system
import { 
  seedIfEmptyVendors,
  seedDummyVendors,
  checkVendorsExist,
  SeedResult
} from './seed';

// Re-export everything
export { 
  seedIfEmptyVendors, 
  seedDummyVendors, 
  checkVendorsExist 
};

// Re-export types
export type { SeedResult };
