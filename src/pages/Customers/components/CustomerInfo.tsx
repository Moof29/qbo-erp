
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/ui/data-display/StatusBadge';
import { 
  Mail, Phone, Building2, Tag, MapPin, Smartphone, MapPinned, 
} from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

interface CustomerInfoProps {
  customer: any;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
  return (
    <Card className="md:col-span-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
        </div>
        
        <div className="space-y-5">
          {customer.open_balance !== null && (
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <div className="text-sm text-muted-foreground mb-1">Open Balance</div>
              <div className="text-2xl font-semibold">{formatCurrency(customer.open_balance || 0)}</div>
            </div>
          )}
          
          {customer.email && (
            <div className="flex items-start">
              <Mail className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email Address</div>
                <div>{customer.email}</div>
              </div>
            </div>
          )}
          
          {customer.phone && (
            <div className="flex items-start">
              <Phone className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div>{formatPhoneNumber(customer.phone)}</div>
              </div>
            </div>
          )}
          
          {customer.mobile && (
            <div className="flex items-start">
              <Smartphone className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Mobile Number</div>
                <div>{formatPhoneNumber(customer.mobile)}</div>
              </div>
            </div>
          )}
          
          {(customer.billing_street || customer.billing_city || customer.billing_state) && (
            <div className="flex items-start">
              <MapPin className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Billing Address</div>
                {customer.billing_street && <div>{customer.billing_street}</div>}
                {(customer.billing_city || customer.billing_state || customer.billing_postal_code) && (
                  <div>
                    {customer.billing_city && `${customer.billing_city}, `}
                    {customer.billing_state && `${customer.billing_state} `}
                    {customer.billing_postal_code && customer.billing_postal_code}
                  </div>
                )}
                {customer.billing_country && <div>{customer.billing_country}</div>}
              </div>
            </div>
          )}
          
          {(customer.shipping_street || customer.shipping_city || customer.shipping_state) && (
            <div className="flex items-start">
              <MapPinned className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Shipping Address</div>
                {customer.shipping_street && <div>{customer.shipping_street}</div>}
                {(customer.shipping_city || customer.shipping_state || customer.shipping_postal_code) && (
                  <div>
                    {customer.shipping_city && `${customer.shipping_city}, `}
                    {customer.shipping_state && `${customer.shipping_state} `}
                    {customer.shipping_postal_code && customer.shipping_postal_code}
                  </div>
                )}
                {customer.shipping_country && <div>{customer.shipping_country}</div>}
              </div>
            </div>
          )}
          
          {customer.currency && (
            <div className="flex items-start">
              <Tag className="mr-3 h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Currency</div>
                <div>{customer.currency}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
