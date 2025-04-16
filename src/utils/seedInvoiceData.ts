
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

// Define return types for consistency
export interface SeedSuccessResult {
  success: true;
  count: number;
  data?: any[];
  message?: string;
}

export interface SeedErrorResult {
  success: false;
  error: string;
}

export type SeedResult = SeedSuccessResult | SeedErrorResult;

const dummyInvoices = [
  {
    invoice_number: 'INV-2023-001',
    invoice_date: '2023-05-01',
    due_date: '2023-05-15',
    total: 1250.00,
    balance: 0.00,
    status: 'paid',
    sync_status: 'synced',
    terms: 'Net 15',
    memo: 'Thank you for your business',
  },
  {
    invoice_number: 'INV-2023-002',
    invoice_date: '2023-05-05',
    due_date: '2023-05-20',
    total: 3450.75,
    balance: 3450.75,
    status: 'unpaid',
    sync_status: 'pending',
    terms: 'Net 15',
    memo: 'Please remit payment by due date',
  },
  {
    invoice_number: 'INV-2023-003',
    invoice_date: '2023-05-07',
    due_date: '2023-05-22',
    total: 870.25,
    balance: 400.25,
    status: 'partial',
    sync_status: 'synced',
    terms: 'Net 15',
    memo: 'Partial payment received',
  },
  {
    invoice_number: 'INV-2023-004',
    invoice_date: '2023-05-10',
    due_date: '2023-05-30',
    total: 1100.00,
    balance: 1100.00,
    status: 'unpaid',
    sync_status: 'error',
    terms: 'Net 20',
    memo: '',
  },
  {
    invoice_number: 'INV-2023-005',
    invoice_date: '2023-05-12',
    due_date: '2023-05-27',
    total: 2700.50,
    balance: 2700.50,
    status: 'unpaid',
    sync_status: 'pending',
    terms: 'Net 15',
    memo: 'High priority client',
  },
];

// Sample customers to create if none exist
const sampleCustomers = [
  {
    display_name: 'Acme Inc.',
    company_name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '555-123-4567',
    balance: 5000.00,
    is_active: true
  },
  {
    display_name: 'TechStart Solutions',
    company_name: 'TechStart Solutions LLC',
    email: 'accounts@techstart.com',
    phone: '555-987-6543',
    balance: 2500.00,
    is_active: true
  }
];

// Create customers if none exist
const ensureCustomersExist = async (): Promise<string[]> => {
  try {
    // Check if customers exist
    const { count, error: countError } = await supabase
      .from('customer_profile')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // If customers already exist, fetch their IDs
    if (count && count > 0) {
      const { data, error } = await supabase
        .from('customer_profile')
        .select('id')
        .limit(5);
      
      if (error) throw error;
      return data.map(c => c.id);
    }
    
    // If no customers exist, create sample customers
    console.log("No customers found. Creating sample customers...");
    
    // Get current user and organization
    const { data: { user } } = await supabase.auth.getUser();
    
    // For development purposes, we'll use fixed IDs if auth is not available
    const userId = user?.id || uuidv4();
    let organizationId = uuidv4(); // Default org ID for development
    
    if (user?.id) {
      // If user is authenticated, get their real organization
      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);
      
      if (userOrgs && userOrgs.length > 0) {
        organizationId = userOrgs[0].organization_id;
      }
    }
    
    const customersToInsert = sampleCustomers.map(customer => ({
      ...customer,
      organization_id: organizationId,
      created_by: userId,
      updated_by: userId
    }));
    
    const { data, error } = await supabase
      .from('customer_profile')
      .insert(customersToInsert)
      .select();
    
    if (error) throw error;
    
    console.log("Successfully created sample customers:", data);
    return data.map(c => c.id);
  } catch (error: any) {
    console.error("Error ensuring customers exist:", error.message);
    throw error;
  }
};

export const seedDummyInvoices = async (): Promise<SeedResult> => {
  try {
    // Get current user and organization
    const { data: { user } } = await supabase.auth.getUser();
    
    // For development purposes, we'll use fixed IDs if auth is not available
    const userId = user?.id || uuidv4();
    let organizationId = uuidv4(); // Default org ID for development
    
    if (user?.id) {
      // If user is authenticated, get their real organization
      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);
      
      if (userOrgs && userOrgs.length > 0) {
        organizationId = userOrgs[0].organization_id;
      }
    }
    
    // Ensure we have customers before creating invoices
    const customerIds = await ensureCustomersExist();
    
    if (customerIds.length === 0) {
      return { success: false, error: "No customers available to create invoices for" };
    }
    
    // Add organization_id, created_by, and map customer_ids to invoices
    const invoicesToInsert = dummyInvoices.map((invoice, index) => ({
      ...invoice,
      organization_id: organizationId,
      created_by: userId,
      updated_by: userId,
      // Assign customer ID round-robin style
      customer_id: customerIds[index % customerIds.length],
    }));
    
    // Insert invoices
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoicesToInsert)
      .select();
    
    if (error) throw error;
    
    return { success: true, count: data.length, data };
  } catch (error: any) {
    console.error("Error seeding invoices:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkInvoicesExist = async (): Promise<boolean> => {
  try {
    // Simple count query to check if any invoices exist
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return count !== null && count > 0;
  } catch (error) {
    console.error("Error checking invoices:", error);
    return false;
  }
};

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
