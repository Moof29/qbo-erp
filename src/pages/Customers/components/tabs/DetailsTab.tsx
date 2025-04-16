
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
              <dt className="col-span-1 text-sm text-muted-foreground">First Name</dt>
              <dd className="col-span-2">{customer.first_name || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Last Name</dt>
              <dd className="col-span-2">{customer.last_name || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Website</dt>
              <dd className="col-span-2">{customer.website || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Tax Exempt</dt>
              <dd className="col-span-2">{customer.tax_exempt ? 'Yes' : 'No'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Tax ID</dt>
              <dd className="col-span-2">{customer.tax_id || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Payment Terms</dt>
              <dd className="col-span-2">{customer.payment_terms || '-'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="col-span-1 text-sm text-muted-foreground">Credit Limit</dt>
              <dd className="col-span-2">{customer.credit_limit || '-'}</dd>
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
            <div>
              <dt className="text-sm text-muted-foreground">QBO ID</dt>
              <dd>{customer.qbo_id || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Sync</dt>
              <dd>{customer.last_sync_at ? new Date(customer.last_sync_at).toLocaleString() : 'Never'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Sync Status</dt>
              <dd>{customer.sync_status || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
