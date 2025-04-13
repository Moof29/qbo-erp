
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/ui/elements/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Check, X, Link2 } from 'lucide-react';

const SettingsPage = () => {
  return (
    <>
      <PageHeader 
        title="Settings" 
        subtitle="Configure your account and preferences"
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" defaultValue="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Administrator" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex-1">
                        Email Notifications
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about invoices, payments, and bills
                        </p>
                      </Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminder-notifications" className="flex-1">
                        Due Date Reminders
                        <p className="text-sm text-muted-foreground">
                          Get reminded before due dates for invoices and bills
                        </p>
                      </Label>
                      <Switch id="reminder-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Manage your account connections to external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-black rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        QB
                      </div>
                      <div>
                        <h4 className="font-medium">QuickBooks</h4>
                        <p className="text-sm text-muted-foreground">Sync financial data</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1 items-center">
                        <Check className="h-3 w-3" /> Connected
                      </Badge>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        Xero
                      </div>
                      <div>
                        <h4 className="font-medium">Xero</h4>
                        <p className="text-sm text-muted-foreground">Alternative accounting software</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        CSV
                      </div>
                      <div>
                        <h4 className="font-medium">CSV Import/Export</h4>
                        <p className="text-sm text-muted-foreground">Bulk data management</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Processors</CardTitle>
                <CardDescription>Manage your payment gateway connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#6772E5] rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div>
                        <h4 className="font-medium">Stripe</h4>
                        <p className="text-sm text-muted-foreground">Online payments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1 items-center">
                        <Check className="h-3 w-3" /> Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#003087] rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <div>
                        <h4 className="font-medium">PayPal</h4>
                        <p className="text-sm text-muted-foreground">Online payments</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#2d3277] rounded-md p-2 h-12 w-12 flex items-center justify-center text-white font-bold">
                        QBP
                      </div>
                      <div>
                        <h4 className="font-medium">QuickBooks Payments</h4>
                        <p className="text-sm text-muted-foreground">Integrated payment solution</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex gap-1 items-center">
                        <X className="h-3 w-3" /> Disconnected
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default SettingsPage;
