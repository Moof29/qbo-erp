
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/ui/elements/PageHeader';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { Package, FileText, BarChart3, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useItemDetail } from './hooks/useItemDetail';

const ItemDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { item, pricing, inventory, isLoading, error } = useItemDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Item not found</h2>
          <p className="text-muted-foreground">{error || "The item you're looking for doesn't exist"}</p>
          <Button onClick={() => navigate('/items')} className="mt-4">
            Back to Items
          </Button>
        </div>
      </div>
    );
  }

  const isInventoryItem = item.item_type === 'inventory';

  return (
    <>
      <PageHeader 
        title={item.name}
        actions={
          <Button variant="outline" onClick={() => navigate(`/items/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Item
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Item Information</h3>
              <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Package className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Item Type</div>
                  <div className="capitalize">{item.item_type || 'Not specified'}</div>
                </div>
              </div>
              
              {item.sku && (
                <div className="flex items-start">
                  <BarChart3 className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">SKU</div>
                    <div>{item.sku}</div>
                  </div>
                </div>
              )}
              
              {item.description && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{item.description}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue={isInventoryItem ? "inventory" : "pricing"} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                {isInventoryItem && <TabsTrigger value="inventory">Inventory</TabsTrigger>}
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
              </TabsList>
              
              {isInventoryItem && (
                <TabsContent value="inventory" className="p-4">
                  {inventory ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">On Hand</div>
                          <div className="text-xl font-medium">{inventory.quantity_on_hand}</div>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">Available</div>
                          <div className="text-xl font-medium">{inventory.quantity_available}</div>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">On Order</div>
                          <div className="text-xl font-medium">{inventory.quantity_on_order}</div>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">Reserved</div>
                          <div className="text-xl font-medium">{inventory.quantity_reserved}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">Location</div>
                          <div className="font-medium">{inventory.warehouse_id}{inventory.location ? `: ${inventory.location}` : ''}</div>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-muted-foreground text-sm">Average Cost</div>
                          <div className="font-medium">{inventory.average_cost ? formatCurrency(inventory.average_cost) : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No inventory information available
                    </div>
                  )}
                </TabsContent>
              )}
              
              <TabsContent value="pricing" className="p-4">
                {pricing.length > 0 ? (
                  <div className="space-y-4">
                    {pricing.map((price) => (
                      <div key={price.id} className="p-4 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-muted-foreground text-sm capitalize">{price.price_type} Price</div>
                            <div className="text-xl font-medium">{formatCurrency(price.price)}</div>
                          </div>
                          {price.effective_date && (
                            <div className="text-sm text-muted-foreground">
                              Effective: {price.effective_date}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pricing information available
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="purchase" className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-muted-foreground text-sm">Purchase Cost</div>
                      <div className="text-xl font-medium">{item.purchase_cost ? formatCurrency(item.purchase_cost) : 'Not set'}</div>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-muted-foreground text-sm">Reorder Point</div>
                      <div className="text-xl font-medium">{item.reorder_point ?? 'Not set'}</div>
                    </div>
                  </div>
                  
                  {item.purchase_description && (
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-muted-foreground text-sm">Purchase Description</div>
                      <div className="mt-1">{item.purchase_description}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ItemDetailPage;
