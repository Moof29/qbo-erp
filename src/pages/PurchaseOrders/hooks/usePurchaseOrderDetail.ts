
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PurchaseOrderDetail {
  id: string;
  purchase_order_number?: string;
  vendor_id: string;
  vendor_name?: string;
  ship_to?: string;
  po_date?: string;
  expected_date?: string;
  memo?: string;
  total?: number;
  status?: string;
  currency_id?: string;
  exchange_rate?: number;
  sync_status?: string;
  last_sync_at?: string | null;
}

export interface LineItem {
  id: string;
  item_id?: string;
  item_name?: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  tax_code?: string;
  tax_rate?: number;
  tax_amount?: number;
  position?: number;
}

export const usePurchaseOrderDetail = (purchaseOrderId: string) => {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderDetail | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseOrderDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch purchase order details with vendor info
        const { data, error: poError } = await supabase
          .from('purchase_order')
          .select(`
            *,
            vendor_profile:vendor_id (
              display_name
            )
          `)
          .eq('id', purchaseOrderId)
          .single();
        
        if (poError) throw poError;
        
        if (data) {
          // Format purchase order data
          const formattedPO: PurchaseOrderDetail = {
            id: data.id,
            purchase_order_number: data.purchase_order_number,
            vendor_id: data.vendor_id,
            vendor_name: data.vendor_profile?.display_name,
            ship_to: data.ship_to,
            po_date: data.po_date,
            expected_date: data.expected_date,
            memo: data.memo,
            total: data.total,
            status: data.status,
            currency_id: data.currency_id,
            exchange_rate: data.exchange_rate,
            sync_status: data.sync_status,
            last_sync_at: data.last_sync_at
          };
          
          setPurchaseOrder(formattedPO);
          
          // Fetch line items with item info
          const { data: lineItemsData, error: lineItemsError } = await supabase
            .from('purchase_order_line_item')
            .select(`
              *,
              item_record:item_id (
                name
              )
            `)
            .eq('purchase_order_id', purchaseOrderId)
            .order('position', { ascending: true });
          
          if (lineItemsError) throw lineItemsError;
          
          // Format line items data
          const formattedLineItems = (lineItemsData || []).map(item => ({
            id: item.id,
            item_id: item.item_id,
            item_name: item.item_record?.name,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            tax_code: item.tax_code,
            tax_rate: item.tax_rate,
            tax_amount: item.tax_amount,
            position: item.position
          }));
          
          setLineItems(formattedLineItems);
        } else {
          setError('Purchase order not found');
        }
      } catch (err: any) {
        console.error('Error fetching purchase order details:', err);
        setError(err.message || 'Failed to load purchase order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (purchaseOrderId) {
      fetchPurchaseOrderDetail();
    }
  }, [purchaseOrderId]);

  return {
    purchaseOrder,
    lineItems,
    isLoading,
    error
  };
};
