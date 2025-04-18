
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const navigate = useNavigate();
  const { signIn, signUp, user, bypassAuth, setBypassAuth, organizations, createNewOrganization } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Organization selection after login
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('');

  // If user is already logged in or bypass is enabled, redirect to home page
  React.useEffect(() => {
    if (user || (bypassAuth && !window.location.pathname.includes('/auth'))) {
      navigate('/');
    }
  }, [user, bypassAuth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { success } = await signIn(loginEmail, loginPassword);
      
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { success } = await signUp(signupEmail, signupPassword, firstName, lastName);
      
      if (success) {
        // Create organization for the new user
        if (organizationName) {
          await createNewOrganization(organizationName, industry || undefined);
        }
        
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateOrganization = async () => {
    setIsLoading(true);
    try {
      await createNewOrganization(newOrgName, newOrgIndustry || undefined);
      setShowCreateOrg(false);
      setNewOrgName('');
      setNewOrgIndustry('');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBypassToggle = () => {
    setBypassAuth(!bypassAuth);
    if (!bypassAuth) {
      // When enabling bypass, redirect to home
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">ERP Flow Nexus</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>
        
        {/* Development bypass toggle */}
        <div className="mb-6 p-4 bg-yellow-100/50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium text-yellow-800">Development Mode</h4>
              <p className="text-sm text-yellow-700">Bypass authentication while developing</p>
            </div>
            <Switch
              checked={bypassAuth}
              onCheckedChange={handleBypassToggle}
            />
          </div>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input 
                      id="signupEmail" 
                      type="email" 
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input 
                      id="signupPassword" 
                      type="password"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="organizationName" className="text-base font-medium">Organization Details</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your organization to get started
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input 
                        id="organizationName" 
                        value={organizationName}
                        onChange={e => setOrganizationName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry (Optional)</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account & Organization
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
