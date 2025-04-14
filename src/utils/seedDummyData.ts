
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const dummyCustomers = [
  {
    display_name: "Acme Corporation",
    company_name: "ACME Inc.",
    email: "contact@acmecorp.com",
    phone: "(555) 123-4567",
    mobile: "(555) 765-4321",
    billing_street: "123 Business Ave",
    billing_city: "Metropolis",
    billing_state: "NY",
    billing_postal_code: "10001",
    billing_country: "USA",
    shipping_street: "123 Business Ave",
    shipping_city: "Metropolis",
    shipping_state: "NY",
    shipping_postal_code: "10001",
    shipping_country: "USA",
    customer_type: "Business",
    preferred_delivery_method: "Email",
    currency: "USD",
    notes: "Large enterprise client",
    open_balance: 5250.00,
    is_active: true
  },
  {
    display_name: "TechStart Solutions",
    company_name: "TechStart LLC",
    email: "info@techstart.io",
    phone: "(555) 987-6543",
    mobile: null,
    billing_street: "456 Innovation Way",
    billing_city: "San Francisco",
    billing_state: "CA",
    billing_postal_code: "94105",
    billing_country: "USA",
    shipping_street: "789 Warehouse Blvd",
    shipping_city: "Oakland",
    shipping_state: "CA",
    shipping_postal_code: "94607",
    shipping_country: "USA",
    customer_type: "Business",
    preferred_delivery_method: "Email",
    currency: "USD",
    notes: "Tech startup, rapid growth",
    open_balance: 1200.75,
    is_active: true
  },
  {
    display_name: "Global Retail Group",
    company_name: "GRG International",
    email: "orders@grg-global.com",
    phone: "(555) 222-3333",
    mobile: "(555) 444-5555",
    billing_street: "1000 Commerce Drive",
    billing_city: "Chicago",
    billing_state: "IL",
    billing_postal_code: "60607",
    billing_country: "USA",
    shipping_street: "1000 Commerce Drive",
    shipping_city: "Chicago",
    shipping_state: "IL",
    shipping_postal_code: "60607",
    shipping_country: "USA",
    customer_type: "Enterprise",
    preferred_delivery_method: "Print",
    currency: "USD",
    notes: "International retail chain",
    open_balance: 12750.00,
    is_active: true
  },
  {
    display_name: "Jane Smith Design",
    company_name: "Jane Smith LLC",
    email: "jane@janesmith.design",
    phone: "(555) 777-8888",
    mobile: "(555) 999-0000",
    billing_street: "25 Creative Lane",
    billing_city: "Portland",
    billing_state: "OR",
    billing_postal_code: "97204",
    billing_country: "USA",
    shipping_street: "25 Creative Lane",
    shipping_city: "Portland",
    shipping_state: "OR",
    shipping_postal_code: "97204",
    shipping_country: "USA",
    customer_type: "Individual",
    preferred_delivery_method: "Email",
    currency: "USD",
    notes: "Freelance designer",
    open_balance: 450.25,
    is_active: true
  },
  {
    display_name: "Vintage Collectibles",
    company_name: "Vintage Collectibles Ltd",
    email: "sales@vintagecollect.com",
    phone: "(555) 111-2222",
    mobile: null,
    billing_street: "500 Antique Road",
    billing_city: "Boston",
    billing_state: "MA",
    billing_postal_code: "02110",
    billing_country: "USA",
    shipping_street: "500 Antique Road",
    shipping_city: "Boston",
    shipping_state: "MA",
    shipping_postal_code: "02110",
    shipping_country: "USA",
    customer_type: "Business",
    preferred_delivery_method: "Print",
    currency: "USD",
    notes: "Specialty collectibles retailer",
    open_balance: 3200.00,
    is_active: false
  }
];

export const seedDummyCustomers = async () => {
  try {
    // For development mode, need to manually set a user ID
    // This aligns with the client.ts approach
    const headers: Record<string, string> = {};
    const devMode = import.meta.env.DEV || import.meta.env.VITE_BYPASS_AUTH === 'true';
    
    if (devMode) {
      headers['x-dev-user-id'] = '00000000-0000-0000-0000-000000000000';
    }
    
    const { data, error } = await supabase
      .from('customers')
      .insert(dummyCustomers)
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
    const { count, error } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
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
