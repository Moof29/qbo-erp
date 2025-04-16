
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const dummyInvoices = [
  {
    invoice_number: 'INV-2023-001',
    customer_id: null, // Will be populated dynamically
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
    customer_id: null, // Will be populated dynamically
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
    customer_id: null, // Will be populated dynamically
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
    customer_id: null, // Will be populated dynamically
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
    customer_id: null, // Will be populated dynamically
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
    
    // For development purposes, use a fixed user and organization ID if auth is not available
    const userId = user?.id || 'dev-user-id';
    let organizationId = 'dev-org-id';
    
    if (user?.id) {
      // If user is authenticated, get their real organization
      const { data: userOrgs, error: orgError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);
      
      if (orgError) {
        console.error("Error fetching user organizations:", orgError);
      } else if (userOrgs && userOrgs.length > 0) {
        organizationId = userOrgs[0].organization_id;
      }
    }
    
    // Try to get customers to associate with invoices
    const { data: customers, error: customerError } = await supabase
      .from('customer_profile')
      .select('id, display_name')
      .eq('organization_id', organizationId)
      .limit(5);
    
    if (customerError) {
      console.error("Error fetching customers:", customerError);
    }
    
    // Add organization_id, created_by, and map customer_ids to invoices
    const invoicesToInsert = dummyInvoices.map((invoice, index) => ({
      ...invoice,
      organization_id: organizationId,
      created_by: userId,
      updated_by: userId,
      // Assign customer ID if available, otherwise leave null
      customer_id: customers && customers[index % customers.length] ? customers[index % customers.length].id : null,
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
    // Get current user and organization
    const { data: { user } } = await supabase.auth.getUser();
    
    // For development purposes, use a fixed organization ID if auth is not available
    let organizationId = 'dev-org-id';
    
    if (user?.id) {
      // If user is authenticated, get their real organization
      const { data: userOrgs, error: orgError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);
      
      if (orgError) {
        console.error("Error fetching user organizations:", orgError);
      } else if (userOrgs && userOrgs.length > 0) {
        organizationId = userOrgs[0].organization_id;
      }
    }
    
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    
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
    const result = await seedDummyInvoices();
    if (result.success) {
      // Using direct import to avoid circular dependency
      const { toast } = require('@/hooks/use-toast');
      toast({
        title: "Dummy invoices created",
        description: `${result.count} sample invoices have been added for testing`,
      });
    } else {
      const { toast } = require('@/hooks/use-toast');
      toast({
        variant: "destructive",
        title: "Failed to create dummy invoices",
        description: result.error,
      });
    }
    return result;
  }
  return { success: true, count: 0, message: "Invoices already exist" };
};
