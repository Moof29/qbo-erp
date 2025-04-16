import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Building } from 'lucide-react';

export const OrganizationSelector = () => {
  const { organizations, setCurrentOrganization, createNewOrganization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '');
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('');
  
  const handleSelectOrg = () => {
    if (selectedOrgId) {
      const selectedOrg = organizations.find(org => org.id === selectedOrgId);
      if (selectedOrg) {
        setCurrentOrganization(selectedOrg);
      }
    }
  };
  
  const handleCreateOrg = async () => {
    if (!newOrgName) return;
    
    setIsLoading(true);
    try {
      await createNewOrganization(newOrgName, newOrgIndustry || undefined);
      setShowCreateForm(false);
      setNewOrgName('');
      setNewOrgIndustry('');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Select Organization</CardTitle>
        <CardDescription>Choose an organization to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCreateForm ? (
          <>
            {organizations.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Your Organizations</Label>
                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleSelectOrg} 
                  className="w-full"
                  disabled={!selectedOrgId || isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue with Selected Organization
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> 
              Create New Organization
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">New Organization</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newOrgName">Organization Name</Label>
              <Input
                id="newOrgName"
                value={newOrgName}
                onChange={e => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newOrgIndustry">Industry (Optional)</Label>
              <Select value={newOrgIndustry} onValueChange={setNewOrgIndustry}>
                <SelectTrigger id="newOrgIndustry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="services">Professional Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateForm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCreateOrg}
                disabled={!newOrgName.trim() || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Organization
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
