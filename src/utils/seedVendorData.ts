import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const dummyVendors = [
  {
    display_name: "Office Depot",
    company_name: "Office Depot Inc.",
    first_name: "John",
    last_name: "Manager",
    email: "accounts@officedepot.com",
    phone: "1234567890",
    website: "https://www.officedepot.com",
    billing_address_line1: "123 Supply St",
    billing_city: "Commerce City",
    billing_state: "CA",
    billing_postal_code: "90210",
    billing_country: "USA",
    payment_terms: "Net 30",
    is_1099: false,
    is_active: true,
    notes: "Office supplies vendor",
    sync_status: "synced"
  },
  {
    display_name: "Tech Distributors",
    company_name: "Tech Distributors LLC",
    first_name: "Sarah",
    last_name: "Tech",
    email: "billing@techdist.com",
    phone: "9876543210",
    website: "https://www.techdist.com",
    billing_address_line1: "456 Innovation Way",
    billing_city: "Silicon Valley",
    billing_state: "CA",
    billing_postal_code: "94105",
    billing_country: "USA",
    payment_terms: "Net 15",
    is_1099: false,
    is_active: true,
    notes: "Technology hardware supplier",
    sync_status: "pending"
  },
  {
    display_name: "Global Suppliers",
    company_name: "Global Suppliers Inc.",
    first_name: "Michael",
    last_name: "Global",
    email: "ar@globalsuppliers.com",
    phone: "5551234567",
    website: "https://www.globalsuppliers.com",
    billing_address_line1: "789 International Blvd",
    billing_city: "New York",
    billing_state: "NY",
    billing_postal_code: "10001",
    billing_country: "USA",
    payment_terms: "Net 45",
    is_1099: true,
    is_active: true,
    notes: "International goods supplier",
    sync_status: "synced"
  },
  {
    display_name: "Local Print Shop",
    company_name: "Local Print Shop LLC",
    first_name: "Robert",
    last_name: "Printer",
    email: "billing@localprintshop.com",
    phone: "8887776666",
    website: "https://www.localprintshop.com",
    billing_address_line1: "101 Main St",
    billing_city: "Portland",
    billing_state: "OR",
    billing_postal_code: "97204",
    billing_country: "USA",
    payment_terms: "Net 30",
    is_1099: true,
    is_active: false,
    notes: "Local printing services",
    sync_status: "error"
  },
  {
    display_name: "Marketing Agency",
    company_name: "Creative Marketing Solutions",
    first_name: "Emma",
    last_name: "Creative",
    email: "accounts@marketagency.com",
    phone: "3334445555",
    website: "https://www.marketagency.com",
    billing_address_line1: "202 Brand Ave",
    billing_city: "Chicago",
    billing_state: "IL",
    billing_postal_code: "60607",
    billing_country: "USA",
    payment_terms: "Net 30",
    is_1099: false,
    is_active: true,
    notes: "Marketing and advertising services",
    sync_status: "synced"
  },
];

export const seedDummyVendors = async () => {
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
    
    // Add organization_id and created_by to all vendor records
    const vendorsToInsert = dummyVendors.map(vendor => ({
      ...vendor,
      organization_id: organizationId,
      created_by: userId,
      updated_by: userId
    }));
    
    const { data, error } = await supabase
      .from('vendor_profile')
      .insert(vendorsToInsert)
      .select();
    
    if (error) throw error;
    
    return { success: true, count: data.length, data };
  } catch (error: any) {
    console.error("Error seeding vendors:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkVendorsExist = async () => {
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
      .from('vendor_profile')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    
    return count && count > 0;
  } catch (error) {
    console.error("Error checking vendors:", error);
    return false;
  }
};

export const seedIfEmptyVendors = async () => {
  const hasVendors = await checkVendorsExist();
  if (!hasVendors) {
    const result = await seedDummyVendors();
    if (result.success) {
      toast({
        title: "Dummy vendors created",
        description: `${result.count} sample vendors have been added for testing`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create dummy vendors",
        description: result.error,
      });
    }
  }
};
