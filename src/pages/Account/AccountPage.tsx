
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useAccount } from '@/context/AccountContext';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/ui/elements/PageHeader';
import UserProfile from './components/UserProfile';

const organizationSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
  industry: z.string().optional(),
  timezone: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

const AccountPage = () => {
  const { currentOrganization, refreshOrganizations } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: currentOrganization?.name || '',
      industry: currentOrganization?.industry || '',
      timezone: currentOrganization?.timezone || '',
    },
  });

  const onSubmit = async (data: OrganizationFormValues) => {
    if (!currentOrganization) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: data.name,
          industry: data.industry || null,
          timezone: data.timezone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrganization.id);

      if (error) throw error;

      toast({
        title: "Organization updated",
        description: "Your organization details have been updated successfully",
      });
      
      // Refresh the organizations data
      await refreshOrganizations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update organization",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when organization changes
  React.useEffect(() => {
    if (currentOrganization) {
      form.reset({
        name: currentOrganization.name || '',
        industry: currentOrganization.industry || '',
        timezone: currentOrganization.timezone || '',
      });
    }
  }, [currentOrganization, form]);

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <h2 className="text-2xl font-semibold">No Organization Selected</h2>
        <p className="text-muted-foreground">Please select or create an organization to continue</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your account and organization settings"
      />
      
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="organization" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Update your organization's information
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your industry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., America/New_York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            {currentOrganization.qbo_company_id && (
              <Card>
                <CardHeader>
                  <CardTitle>QuickBooks Integration</CardTitle>
                  <CardDescription>
                    Manage your QuickBooks Online connection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Connection Status:</span>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Company ID:</span>
                      <span className="text-sm">{currentOrganization.qbo_company_id}</span>
                    </div>
                    {currentOrganization.qbo_token_expires_at && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Token Expires:</span>
                        <span className="text-sm">
                          {new Date(currentOrganization.qbo_token_expires_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Refresh Token</Button>
                  <Button variant="destructive" className="ml-2">Disconnect</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Configure your personal preferences for this organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preference settings will be added in a future update. 
                  These settings will allow you to customize your experience in this application.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AccountPage;
