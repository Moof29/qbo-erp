
import { SeedResult, isSeedErrorResult, isSeedSuccessResult } from './types';
import { seedDummyInvoices, checkInvoicesExist } from './invoiceSeed';
import { seedIfEmptyVendors } from './vendorSeed';
import { seedIfEmptyPurchaseOrders } from './purchaseOrderSeed';
import { useToast } from "@/hooks/use-toast";

// Main entry point for seeding invoices
export const seedIfEmptyInvoices = async (): Promise<SeedResult> => {
  try {
    const hasInvoices = await checkInvoicesExist();
    if (!hasInvoices) {
      return await seedDummyInvoices();
    }
    return { 
      success: true, 
      count: 0, 
      message: "Invoices already exist" 
    };
  } catch (error: any) {
    console.error("Error in seedIfEmptyInvoices:", error);
    return { success: false, error: String(error) };
  }
};

// Create a collection of all seed functions
export const seedDummyData = async () => {
  const results = {
    invoices: await seedIfEmptyInvoices(),
    vendors: await seedIfEmptyVendors(),
    purchaseOrders: await seedIfEmptyPurchaseOrders()
  };
  
  return results;
};

// Re-export types and functions
export * from './types';
export * from './customerSeed';
export * from './invoiceSeed';
export * from './vendorSeed';
export * from './purchaseOrderSeed';
