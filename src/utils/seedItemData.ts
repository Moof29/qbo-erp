
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const dummyItems = [
  {
    name: "Office Chair",
    sku: "FURN-001",
    description: "Ergonomic office chair with lumbar support",
    item_type: "inventory",
    is_active: true,
    is_taxable: true,
    tax_code: "TAX-001",
    tax_rate: 8.25,
    purchase_description: "Bulk purchase of ergonomic chairs",
    purchase_cost: 149.99,
    reorder_point: 5,
    manufacturer: "ErgoCorp",
    manufacturer_part_number: "EC-001",
    weight: 30,
    weight_unit: "lb",
    size: "25x25x45",
    size_unit: "in",
    sync_status: "synced"
  },
  {
    name: "Laptop Computer",
    sku: "TECH-001",
    description: "Business laptop with 16GB RAM, 512GB SSD",
    item_type: "inventory",
    is_active: true,
    is_taxable: true,
    tax_code: "TAX-001",
    tax_rate: 8.25,
    purchase_description: "Bulk purchase of business laptops",
    purchase_cost: 999.99,
    reorder_point: 3,
    manufacturer: "TechCorp",
    manufacturer_part_number: "TC-001",
    weight: 4.5,
    weight_unit: "lb",
    size: "13x9x0.75",
    size_unit: "in",
    sync_status: "synced"
  },
  {
    name: "Office Supplies Bundle",
    sku: "SUPPLY-001",
    description: "Bundle including pens, papers, stapler, and other office supplies",
    item_type: "inventory",
    is_active: true,
    is_taxable: true,
    tax_code: "TAX-001",
    tax_rate: 8.25,
    purchase_description: "Office supplies bundle",
    purchase_cost: 75.50,
    reorder_point: 10,
    manufacturer: "SupplyCo",
    manufacturer_part_number: "SC-001",
    weight: 5,
    weight_unit: "lb",
    sync_status: "synced"
  },
  {
    name: "Monthly Cleaning Service",
    sku: "SERVICE-001",
    description: "Professional office cleaning service, monthly contract",
    item_type: "service",
    is_active: true,
    is_taxable: false,
    purchase_description: "Monthly cleaning service contract",
    purchase_cost: 250.00,
    sync_status: "pending"
  },
  {
    name: "Software License",
    sku: "LICENSE-001",
    description: "Annual subscription for productivity software suite",
    item_type: "non-inventory",
    is_active: true,
    is_taxable: false,
    purchase_description: "Bulk software licenses",
    purchase_cost: 299.99,
    sync_status: "synced"
  }
];

// Pricing data to be added for each item
const getPricingForItem = (itemId: string) => [
  {
    item_id: itemId,
    price_type: "retail",
    price: Math.random() * 500 + 100, // Random price between 100 and 600
    currency_id: "USD",
    effective_date: new Date().toISOString().split('T')[0]
  },
  {
    item_id: itemId,
    price_type: "wholesale",
    price: Math.random() * 300 + 50, // Random price between 50 and 350
    currency_id: "USD",
    effective_date: new Date().toISOString().split('T')[0]
  }
];

// Inventory data for inventory type items
const getInventoryForItem = (itemId: string) => ({
  item_id: itemId,
  warehouse_id: "WH-001",
  location: "Shelf A",
  quantity_on_hand: Math.floor(Math.random() * 100) + 10, // Random quantity between 10 and 109
  quantity_on_order: Math.floor(Math.random() * 20),
  quantity_reserved: Math.floor(Math.random() * 5),
  quantity_available: 0, // Will be calculated before insert
  last_inventory_date: new Date().toISOString().split('T')[0],
  average_cost: Math.random() * 200 + 50 // Random cost between 50 and 250
});

export const seedDummyItems = async () => {
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
    
    // Add organization_id and created_by to all item records
    const itemsToInsert = dummyItems.map(item => ({
      ...item,
      organization_id: organizationId,
      created_by: user.id,
      updated_by: user.id
    }));
    
    // Insert items
    const { data: insertedItems, error: itemError } = await supabase
      .from('item_record')
      .insert(itemsToInsert)
      .select();
    
    if (itemError) throw itemError;
    
    // Insert pricing for each item
    const allPricingData: any[] = [];
    insertedItems.forEach(item => {
      allPricingData.push(...getPricingForItem(item.id));
    });
    
    const { error: pricingError } = await supabase
      .from('item_pricing')
      .insert(allPricingData);
    
    if (pricingError) throw pricingError;
    
    // Insert inventory for inventory type items
    const inventoryItems = insertedItems.filter(item => item.item_type === 'inventory');
    const inventoryData = inventoryItems.map(item => {
      const invData = getInventoryForItem(item.id);
      // Calculate available quantity
      invData.quantity_available = invData.quantity_on_hand - invData.quantity_reserved + invData.quantity_on_order;
      return invData;
    });
    
    if (inventoryData.length > 0) {
      const { error: inventoryError } = await supabase
        .from('item_inventory')
        .insert(inventoryData);
      
      if (inventoryError) throw inventoryError;
    }
    
    return { success: true, count: insertedItems.length, data: insertedItems };
  } catch (error: any) {
    console.error("Error seeding items:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkItemsExist = async () => {
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
      .from('item_record')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    
    return count && count > 0;
  } catch (error) {
    console.error("Error checking items:", error);
    return false;
  }
};

export const seedIfEmptyItems = async () => {
  const hasItems = await checkItemsExist();
  if (!hasItems) {
    const result = await seedDummyItems();
    if (result.success) {
      toast({
        title: "Dummy items created",
        description: `${result.count} sample items have been added for testing`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create dummy items",
        description: result.error,
      });
    }
  }
};
