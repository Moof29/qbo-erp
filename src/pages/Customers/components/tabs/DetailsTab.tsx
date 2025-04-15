
import React from 'react';

interface CustomerDetailsTabProps {
  customer: any;
}

const DetailsTab: React.FC<CustomerDetailsTabProps> = ({ customer }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Customer Details</h3>
          <dl className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Display Name</dt>
              <dd className="col-span-2">{customer.display_name}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Company Name</dt>
              <dd className="col-span-2">{customer.company_name || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Customer Type</dt>
              <dd className="col-span-2">{customer.customer_type || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Tax Exempt</dt>
              <dd className="col-span-2">{customer.tax_exempt_reason || 'No'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Resale Number</dt>
              <dd className="col-span-2">{customer.resale_number || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Preferred Delivery</dt>
              <dd className="col-span-2">{customer.preferred_delivery_method || '-'}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Additional Information</h3>
          <dl className="grid grid-cols-1 gap-2">
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 border rounded p-2 min-h-[100px] bg-muted/30">{customer.notes || 'No additional notes'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
