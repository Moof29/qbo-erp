
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { X, Save, Loader2 } from 'lucide-react';
import { DrawerClose } from '@/components/ui/drawer';

// Define form validation schema with Zod
const customerSchema = z.object({
  display_name: z.string().min(1, { message: 'Display name is required' }),
  company_name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  billing_street: z.string().optional(),
  billing_city: z.string().optional(),
  billing_state: z.string().optional(),
  billing_postal_code: z.string().optional(),
  billing_country: z.string().optional(),
  shipping_street: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  shipping_country: z.string().optional(),
  customer_type: z.string().optional(),
  tax_exempt_reason: z.string().optional(),
  resale_number: z.string().optional(),
  preferred_delivery_method: z.enum(['Email', 'Print', 'None']).optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  open_balance: z.number().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customerId?: string;
}

const CustomerForm = ({ customerId }: CustomerFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!customerId;
  
  // Define the form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      display_name: '',
      company_name: '',
      email: '',
      phone: '',
      mobile: '',
      fax: '',
      billing_street: '',
      billing_city: '',
      billing_state: '',
      billing_postal_code: '',
      billing_country: '',
      shipping_street: '',
      shipping_city: '',
      shipping_state: '',
      shipping_postal_code: '',
      shipping_country: '',
      customer_type: '',
      tax_exempt_reason: '',
      resale_number: '',
      preferred_delivery_method: 'Email',
      currency: 'USD',
      notes: '',
      is_active: true,
      open_balance: 0,
    }
  });

  // Fetch existing customer data if in edit mode
  const { isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customer",
          description: error.message,
        });
        throw error;
      }
      
      if (data) {
        // Reset form with existing customer data
        form.reset({
          display_name: data.display_name || '',
          company_name: data.company_name || '',
          email: data.email || '',
          phone: data.phone || '',
          mobile: data.mobile || '',
          fax: data.fax || '',
          billing_street: data.billing_street || '',
          billing_city: data.billing_city || '',
          billing_state: data.billing_state || '',
          billing_postal_code: data.billing_postal_code || '',
          billing_country: data.billing_country || '',
          shipping_street: data.shipping_street || '',
          shipping_city: data.shipping_city || '',
          shipping_state: data.shipping_state || '',
          shipping_postal_code: data.shipping_postal_code || '',
          shipping_country: data.shipping_country || '',
          customer_type: data.customer_type || '',
          tax_exempt_reason: data.tax_exempt_reason || '',
          resale_number: data.resale_number || '',
          preferred_delivery_method: (data.preferred_delivery_method as any) || 'Email',
          currency: data.currency || 'USD',
          notes: data.notes || '',
          is_active: data.is_active !== false,
          open_balance: data.open_balance || 0,
        });
      }
      
      return data;
    },
    enabled: !!customerId,
  });

  // Copy billing address to shipping address
  const copyBillingToShipping = () => {
    const billingValues = form.getValues();
    form.setValue('shipping_street', billingValues.billing_street || '');
    form.setValue('shipping_city', billingValues.billing_city || '');
    form.setValue('shipping_state', billingValues.billing_state || '');
    form.setValue('shipping_postal_code', billingValues.billing_postal_code || '');
    form.setValue('shipping_country', billingValues.billing_country || '');
  };

  // Save customer mutation
  const saveCustomerMutation = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      if (isEditMode) {
        // Update existing customer
        const { data, error } = await supabase
          .from('customers')
          .update(values)
          .eq('id', customerId)
          .select();
        
        if (error) throw error;
        return data && data[0];
      } else {
        // Create new customer
        const { data, error } = await supabase
          .from('customers')
          .insert(values)
          .select();
        
        if (error) throw error;
        return data && data[0];
      }
    },
    onSuccess: (data) => {
      toast({
        title: `Customer ${isEditMode ? 'updated' : 'created'} successfully`,
        description: `${data.display_name} has been ${isEditMode ? 'updated' : 'added'} to your customers`,
      });
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      }
      
      // Navigate or close modal/drawer
      if (!isEditMode) {
        navigate(`/customers/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Failed to ${isEditMode ? 'update' : 'create'} customer`,
        description: error.message,
      });
    },
  });

  const onSubmit = (values: CustomerFormValues) => {
    saveCustomerMutation.mutate(values);
  };

  // Function to copy shipping address to billing
  const copyShippingToBilling = () => {
    const shippingValues = form.getValues();
    form.setValue('billing_street', shippingValues.shipping_street || '');
    form.setValue('billing_city', shippingValues.shipping_city || '');
    form.setValue('billing_state', shippingValues.shipping_state || '');
    form.setValue('billing_postal_code', shippingValues.shipping_postal_code || '');
    form.setValue('billing_country', shippingValues.shipping_country || '');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'New'} Customer</h2>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DrawerClose>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer or Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name (if applicable)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium mb-4">Billing Address</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="billing_street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billing_state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing_postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billing_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={copyBillingToShipping}
                  >
                    Copy to Shipping
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="shipping_street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shipping_state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping_postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shipping_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={copyShippingToBilling}
                  >
                    Copy to Billing
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Business, Individual, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tax_exempt_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Exempt Reason</FormLabel>
                        <FormControl>
                          <Input placeholder="If applicable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="resale_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resale Number</FormLabel>
                        <FormControl>
                          <Input placeholder="If applicable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferred_delivery_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Delivery</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Print">Print</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this customer" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Inactive customers won't appear in default views
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            
            <Button 
              type="submit" 
              disabled={saveCustomerMutation.isPending || isLoadingCustomer}
            >
              {saveCustomerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Save Customer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerForm;
