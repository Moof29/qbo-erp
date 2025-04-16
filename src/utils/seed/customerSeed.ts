
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { SeedResult } from './types';

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
export const ensureCustomersExist = async (): Promise<string[]> => {
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

export const seedDummyCustomers = async (): Promise<SeedResult> => {
  try {
    const customerIds = await ensureCustomersExist();
    return { 
      success: true, 
      count: customerIds.length,
      message: `Created ${customerIds.length} sample customers`
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};
