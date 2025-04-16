
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ItemDetail {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  item_type?: string;
  is_active: boolean;
  is_taxable?: boolean;
  tax_code?: string;
  tax_rate?: number;
  purchase_description?: string;
  purchase_cost?: number;
  reorder_point?: number;
  manufacturer?: string;
  manufacturer_part_number?: string;
  weight?: number;
  weight_unit?: string;
  size?: string;
  size_unit?: string;
  notes?: string;
  sync_status?: string;
}

export interface ItemPrice {
  id: string;
  price_type: string;
  price: number;
  currency_id?: string;
  effective_date?: string;
  expiration_date?: string;
}

export interface ItemInventory {
  id: string;
  warehouse_id?: string;
  location?: string;
  quantity_on_hand: number;
  quantity_on_order: number;
  quantity_reserved: number;
  quantity_available: number;
  last_inventory_date?: string;
  average_cost?: number;
}

export const useItemDetail = (itemId: string) => {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [pricing, setPricing] = useState<ItemPrice[]>([]);
  const [inventory, setInventory] = useState<ItemInventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch item details
        const { data: itemData, error: itemError } = await supabase
          .from('item_record')
          .select('*')
          .eq('id', itemId)
          .single();
        
        if (itemError) throw itemError;
        
        if (itemData) {
          setItem(itemData as ItemDetail);
          
          // Fetch pricing data
          const { data: pricingData, error: pricingError } = await supabase
            .from('item_pricing')
            .select('*')
            .eq('item_id', itemId);
          
          if (pricingError) throw pricingError;
          setPricing(pricingData as ItemPrice[]);
          
          // Fetch inventory data if it's an inventory item
          if (itemData.item_type === 'inventory') {
            const { data: inventoryData, error: inventoryError } = await supabase
              .from('item_inventory')
              .select('*')
              .eq('item_id', itemId)
              .maybeSingle();
            
            if (inventoryError) throw inventoryError;
            setInventory(inventoryData as ItemInventory);
          }
        } else {
          setError('Item not found');
        }
      } catch (err: any) {
        console.error('Error fetching item details:', err);
        setError(err.message || 'Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetail();
    }
  }, [itemId]);

  return {
    item,
    pricing,
    inventory,
    isLoading,
    error
  };
};
