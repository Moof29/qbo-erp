
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/ui/elements/PageHeader';

const NewVendorForm = () => {
  const navigate = useNavigate();
  
  // Placeholder form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
    navigate('/vendors');
  };
  
  return (
    <>
      <PageHeader 
        title="New Vendor" 
        subtitle="Add a new supplier to your system" 
      />
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name">Display Name *</Label>
                    <Input id="display_name" placeholder="Enter vendor display name" required />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input id="company_name" placeholder="Enter company name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" placeholder="Enter last name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="billing_address_line1">Address Line 1</Label>
                  <Input id="billing_address_line1" placeholder="Enter street address" />
                </div>
                <div>
                  <Label htmlFor="billing_address_line2">Address Line 2</Label>
                  <Input id="billing_address_line2" placeholder="Enter suite, apartment, etc." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billing_city">City</Label>
                    <Input id="billing_city" placeholder="Enter city" />
                  </div>
                  <div>
                    <Label htmlFor="billing_state">State/Province</Label>
                    <Input id="billing_state" placeholder="Enter state or province" />
                  </div>
                  <div>
                    <Label htmlFor="billing_postal_code">Postal Code</Label>
                    <Input id="billing_postal_code" placeholder="Enter postal code" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="billing_country">Country</Label>
                  <Input id="billing_country" placeholder="Enter country" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Input id="payment_terms" placeholder="e.g. Net 30" />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="Enter website URL" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional notes or information" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendors')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Vendor
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewVendorForm;
