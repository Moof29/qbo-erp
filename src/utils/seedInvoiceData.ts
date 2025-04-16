
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

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

export const seedDummyInvoices = async () => {
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
    
    // Try to get customers to associate with invoices
    const { data: customers } = await supabase
      .from('customer_profile')
      .select('id, display_name')
      .limit(5);
    
    // If no customers exist, create a dummy one
    let customerIds = [];
    if (!customers || customers.length === 0) {
      const { data: newCustomer } = await supabase
        .from('customer_profile')
        .insert([
          { 
            display_name: 'Acme Inc.', 
            company_name: 'Acme Corporation', 
            organization_id: organizationId,
            created_by: userId,
            updated_by: userId,
            balance: 5000.00,
            is_active: true
          }
        ])
        .select();
        
      if (newCustomer && newCustomer.length > 0) {
        customerIds = [newCustomer[0].id];
      }
    } else {
      customerIds = customers.map(c => c.id);
    }
    
    if (customerIds.length === 0) {
      throw new Error("No customers available to create invoices for");
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

export const checkInvoicesExist = async () => {
  try {
    // Simple count query to check if any invoices exist
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return count && count > 0;
  } catch (error) {
    console.error("Error checking invoices:", error);
    return false;
  }
};

export const seedIfEmptyInvoices = async () => {
  const hasInvoices = await checkInvoicesExist();
  if (!hasInvoices) {
    const { toast } = require('@/hooks/use-toast');
    const result = await seedDummyInvoices();
    if (result.success) {
      toast({
        title: "Dummy invoices created",
        description: `${result.count} sample invoices have been added for testing`,
      });
      return result;
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create dummy invoices",
        description: result.error || "Unknown error",
      });
      return result;
    }
  }
  return { success: true, count: 0, message: "Invoices already exist" };
};
