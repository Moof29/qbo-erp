
// This file exists for backward compatibility
// It re-exports functionality from the new modular seed system
import { 
  seedIfEmptyInvoices, 
  seedDummyInvoices, 
  checkInvoicesExist, 
  SeedResult, 
  SeedSuccessResult, 
  SeedErrorResult,
  isSeedErrorResult,
  isSeedSuccessResult
} from './seed';

// Re-export everything
export { 
  seedIfEmptyInvoices, 
  seedDummyInvoices, 
  checkInvoicesExist,
};

// Re-export types
export type { 
  SeedResult, 
  SeedSuccessResult, 
  SeedErrorResult 
};

// Re-export type guards
export {
  isSeedErrorResult,
  isSeedSuccessResult
};
