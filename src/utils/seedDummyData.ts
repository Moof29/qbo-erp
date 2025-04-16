
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const dummyCustomers = [
  {
    display_name: "Acme Corporation",
    company_name: "ACME Inc.",
    first_name: "John",
    last_name: "Smith",
    email: "contact@acmecorp.com",
    phone: "(555) 123-4567",
    mobile: "(555) 765-4321",
    website: "https://acmecorp.com",
    billing_address_line1: "123 Business Ave",
    billing_city: "Metropolis",
    billing_state: "NY",
    billing_postal_code: "10001",
    billing_country: "USA",
    shipping_address_line1: "123 Business Ave",
    shipping_city: "Metropolis",
    shipping_state: "NY",
    shipping_postal_code: "10001",
    shipping_country: "USA",
    tax_exempt: false,
    tax_id: null,
    currency_id: "USD",
    payment_terms: "Net 30",
    balance: 5250.00,
    is_active: true,
    notes: "Large enterprise client",
    sync_status: "synced"
  },
  {
    display_name: "TechStart Solutions",
    company_name: "TechStart LLC",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "info@techstart.io",
    phone: "(555) 987-6543",
    mobile: null,
    website: "https://techstart.io",
    billing_address_line1: "456 Innovation Way",
    billing_city: "San Francisco",
    billing_state: "CA",
    billing_postal_code: "94105",
    billing_country: "USA",
    shipping_address_line1: "789 Warehouse Blvd",
    shipping_city: "Oakland",
    shipping_state: "CA",
    shipping_postal_code: "94607",
    shipping_country: "USA",
    tax_exempt: false,
    tax_id: null,
    currency_id: "USD",
    payment_terms: "Net 15",
    balance: 1200.75,
    is_active: true,
    notes: "Tech startup, rapid growth",
    sync_status: "pending"
  },
  {
    display_name: "Global Retail Group",
    company_name: "GRG International",
    first_name: "Michael",
    last_name: "Chen",
    email: "orders@grg-global.com",
    phone: "(555) 222-3333",
    mobile: "(555) 444-5555",
    website: "https://grg-global.com",
    billing_address_line1: "1000 Commerce Drive",
    billing_city: "Chicago",
    billing_state: "IL",
    billing_postal_code: "60607",
    billing_country: "USA",
    shipping_address_line1: "1000 Commerce Drive",
    shipping_city: "Chicago",
    shipping_state: "IL",
    shipping_postal_code: "60607",
    shipping_country: "USA",
    tax_exempt: true,
    tax_id: "12-3456789",
    currency_id: "USD",
    payment_terms: "Net 60",
    balance: 12750.00,
    is_active: true,
    notes: "International retail chain",
    sync_status: "synced"
  },
  {
    display_name: "Jane Smith Design",
    company_name: "Jane Smith LLC",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@janesmith.design",
    phone: "(555) 777-8888",
    mobile: "(555) 999-0000",
    website: "https://janesmith.design",
    billing_address_line1: "25 Creative Lane",
    billing_city: "Portland",
    billing_state: "OR",
    billing_postal_code: "97204",
    billing_country: "USA",
    shipping_address_line1: "25 Creative Lane",
    shipping_city: "Portland",
    shipping_state: "OR",
    shipping_postal_code: "97204",
    shipping_country: "USA",
    tax_exempt: false,
    tax_id: null,
    currency_id: "USD",
    payment_terms: "Net 15",
    balance: 450.25,
    is_active: true,
    notes: "Freelance designer",
    sync_status: "synced"
  },
  {
    display_name: "Vintage Collectibles",
    company_name: "Vintage Collectibles Ltd",
    first_name: "Robert",
    last_name: "Miller",
    email: "sales@vintagecollect.com",
    phone: "(555) 111-2222",
    mobile: null,
    website: "https://vintagecollect.com",
    billing_address_line1: "500 Antique Road",
    billing_city: "Boston",
    billing_state: "MA",
    billing_postal_code: "02110",
    billing_country: "USA",
    shipping_address_line1: "500 Antique Road",
    shipping_city: "Boston",
    shipping_state: "MA",
    shipping_postal_code: "02110",
    shipping_country: "USA",
    tax_exempt: false,
    tax_id: null,
    currency_id: "USD",
    payment_terms: "Net 30",
    balance: 3200.00,
    is_active: false,
    notes: "Specialty collectibles retailer",
    sync_status: "error"
  }
];

export const seedDummyCustomers = async () => {
  try {
    // Get current user and organization
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    // Get the organization ID for the current user
    const { data: userOrgs, error: orgError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);
    
    if (orgError) throw orgError;
    if (!userOrgs || userOrgs.length === 0) {
      throw new Error('No active organization found for user');
    }
    
    const organizationId = userOrgs[0].organization_id;
    
    // Add organization_id and created_by to all customer records
    const customersToInsert = dummyCustomers.map(customer => ({
      ...customer,
      organization_id: organizationId,
      created_by: user.id,
      updated_by: user.id
    }));
    
    const { data, error } = await supabase
      .from('customer_profile')
      .insert(customersToInsert)
      .select();
    
    if (error) throw error;
    
    return { success: true, count: data.length, data };
  } catch (error: any) {
    console.error("Error seeding customers:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkCustomersExist = async () => {
  try {
    // Get current user and organization
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      console.error("User not authenticated");
      return false;
    }
    
    // Get the organization ID for the current user
    const { data: userOrgs, error: orgError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);
    
    if (orgError) {
      console.error("Error fetching user organizations:", orgError);
      return false;
    }
    
    if (!userOrgs || userOrgs.length === 0) {
      console.error("No active organization found for user");
      return false;
    }
    
    const organizationId = userOrgs[0].organization_id;
    
    const { count, error } = await supabase
      .from('customer_profile')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    
    return count && count > 0;
  } catch (error) {
    console.error("Error checking customers:", error);
    return false;
  }
};

export const seedIfEmpty = async () => {
  const hasCustomers = await checkCustomersExist();
  if (!hasCustomers) {
    const result = await seedDummyCustomers();
    if (result.success) {
      toast({
        title: "Dummy customers created",
        description: `${result.count} sample customers have been added for testing`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create dummy customers",
        description: result.error,
      });
    }
  }
};
