
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Get the current user's organization and authentication info
export const getUserAndOrganization = async (): Promise<{
  userId: string;
  organizationId: string;
}> => {
  // Get current user and organization
  const { data: { user } } = await supabase.auth.getUser();
  
  // For development purposes, we'll use fixed IDs if auth is not available
  const userId = user?.id || uuidv4();
  let organizationId = uuidv4(); // Default org ID for development
  
  if (user?.id) {
    // If user is authenticated, get their real organization
    const { data: userOrgs } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);
    
    if (userOrgs && userOrgs.length > 0) {
      organizationId = userOrgs[0].organization_id;
    } else {
      // Create an organization if user doesn't have one
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({ 
          name: 'Default Organization',
          industry: 'Technology',
          timezone: 'UTC'
        })
        .select();
      
      if (orgError) {
        console.error("Failed to create organization:", orgError);
        throw orgError;
      }

      if (newOrg && newOrg.length > 0) {
        organizationId = newOrg[0].id;
        
        // Link user to organization
        const { error: linkError } = await supabase
          .from('user_organizations')
          .insert({
            user_id: userId,
            organization_id: organizationId,
            role: 'admin',
            is_active: true
          });
        
        if (linkError) {
          console.error("Failed to link user to organization:", linkError);
        }
      }
    }
  }
  
  return { userId, organizationId };
};
