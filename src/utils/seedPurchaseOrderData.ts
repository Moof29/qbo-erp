
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const seedDummyPurchaseOrders = async () => {
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
    
    // Get vendors for this organization
    const { data: vendors, error: vendorError } = await supabase
      .from('vendor_profile')
      .select('id, display_name')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .limit(3);
    
    if (vendorError) throw vendorError;
    if (!vendors || vendors.length === 0) {
      throw new Error('No active vendors found for organization. Please create vendors first.');
    }
    
    // Get items for this organization
    const { data: items, error: itemError } = await supabase
      .from('item_record')
      .select('id, name, purchase_cost')
      .eq('organization_id', organizationId)
      .eq('is_active', true);
    
    if (itemError) throw itemError;
    if (!items || items.length === 0) {
      throw new Error('No active items found for organization. Please create items first.');
    }
    
    // Create a few purchase orders
    const purchaseOrders = [
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${Date.now().toString().substring(7)}`,
        vendor_id: vendors[0].id,
        po_date: new Date().toISOString().split('T')[0],
        expected_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        memo: "Regular monthly supplies order",
        status: "pending",
        created_by: user.id,
        updated_by: user.id,
        sync_status: "pending"
      },
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${(Date.now() + 100).toString().substring(7)}`,
        vendor_id: vendors.length > 1 ? vendors[1].id : vendors[0].id,
        po_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
        expected_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        memo: "Urgent equipment replacement",
        status: "approved",
        created_by: user.id,
        updated_by: user.id,
        sync_status: "synced"
      },
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${(Date.now() + 200).toString().substring(7)}`,
        vendor_id: vendors.length > 2 ? vendors[2].id : vendors[0].id,
        po_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        expected_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
        memo: "Office furniture update",
        status: "received",
        created_by: user.id,
        updated_by: user.id,
        sync_status: "synced"
      }
    ];
    
    // Insert purchase orders
    const { data: insertedPOs, error: poError } = await supabase
      .from('purchase_order')
      .insert(purchaseOrders)
      .select();
    
    if (poError) throw poError;
    
    // Create line items for each purchase order
    const lineItems: any[] = [];
    
    insertedPOs.forEach((po, poIndex) => {
      // Different number of line items for each PO
      const itemCount = Math.min(items.length, poIndex + 2);
      
      for (let i = 0; i < itemCount; i++) {
        const item = items[i % items.length];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const rate = item.purchase_cost || (Math.random() * 100 + 50).toFixed(2);
        const amount = quantity * rate;
        
        lineItems.push({
          purchase_order_id: po.id,
          item_id: item.id,
          description: `${item.name} - purchased from ${vendors[poIndex % vendors.length].display_name}`,
          quantity,
          rate,
          amount,
          position: i + 1
        });
      }
      
      // Update the total on the purchase order
      const poTotal = lineItems
        .filter(item => item.purchase_order_id === po.id)
        .reduce((sum, item) => sum + item.amount, 0);
      
      supabase
        .from('purchase_order')
        .update({ total: poTotal })
        .eq('id', po.id)
        .then(({ error }) => {
          if (error) console.error("Error updating PO total:", error);
        });
    });
    
    // Insert all line items
    const { data: insertedItems, error: itemsError } = await supabase
      .from('purchase_order_line_item')
      .insert(lineItems)
      .select();
    
    if (itemsError) throw itemsError;
    
    return { 
      success: true, 
      count: insertedPOs.length, 
      itemCount: insertedItems.length,
      data: insertedPOs 
    };
  } catch (error: any) {
    console.error("Error seeding purchase orders:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkPurchaseOrdersExist = async () => {
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
      .from('purchase_order')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    
    return count && count > 0;
  } catch (error) {
    console.error("Error checking purchase orders:", error);
    return false;
  }
};

export const seedIfEmptyPurchaseOrders = async () => {
  const hasPurchaseOrders = await checkPurchaseOrdersExist();
  if (!hasPurchaseOrders) {
    const result = await seedDummyPurchaseOrders();
    if (result.success) {
      toast({
        title: "Dummy purchase orders created",
        description: `${result.count} sample purchase orders with ${result.itemCount} line items have been added for testing`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to create dummy purchase orders",
        description: result.error,
      });
    }
  }
};
