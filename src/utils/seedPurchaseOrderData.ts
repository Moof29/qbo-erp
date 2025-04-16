
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const seedDummyPurchaseOrders = async () => {
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
    
    // Create simple dummy purchase order data that doesn't rely on vendors or items
    const purchaseOrders = [
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${Date.now().toString().substring(7)}`,
        vendor_id: 'dummy-vendor-1',
        po_date: new Date().toISOString().split('T')[0],
        expected_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        memo: "Regular monthly supplies order",
        status: "pending",
        total: 1250.75,
        created_by: userId,
        updated_by: userId,
        sync_status: "pending"
      },
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${(Date.now() + 100).toString().substring(7)}`,
        vendor_id: 'dummy-vendor-2',
        po_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
        expected_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        memo: "Urgent equipment replacement",
        status: "approved",
        total: 3450.25,
        created_by: userId,
        updated_by: userId,
        sync_status: "synced"
      },
      {
        organization_id: organizationId,
        purchase_order_number: `PO-${(Date.now() + 200).toString().substring(7)}`,
        vendor_id: 'dummy-vendor-3',
        po_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        expected_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
        memo: "Office furniture update",
        status: "received",
        total: 5678.90,
        created_by: userId,
        updated_by: userId,
        sync_status: "synced"
      }
    ];
    
    // Insert purchase orders directly (without worrying about foreign keys for development)
    const { data: insertedPOs, error: poError } = await supabase
      .from('purchase_order')
      .insert(purchaseOrders)
      .select();
    
    if (poError) throw poError;
    
    // Create simple dummy line items
    const lineItems = [];
    
    insertedPOs.forEach((po) => {
      // Add 2-3 dummy line items per purchase order
      const itemCount = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < itemCount; i++) {
        const quantity = Math.floor(Math.random() * 5) + 1;
        const rate = Math.random() * 100 + 50;
        const amount = quantity * rate;
        
        lineItems.push({
          purchase_order_id: po.id,
          item_id: `dummy-item-${i}`,
          description: `Sample item ${i+1} for purchase order ${po.purchase_order_number}`,
          quantity,
          rate,
          amount,
          position: i + 1
        });
      }
    });
    
    // Insert all line items
    if (lineItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('purchase_order_line_item')
        .insert(lineItems);
      
      if (itemsError) console.error("Error inserting line items:", itemsError);
    }
    
    return { 
      success: true, 
      count: insertedPOs.length, 
      itemCount: lineItems.length,
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
