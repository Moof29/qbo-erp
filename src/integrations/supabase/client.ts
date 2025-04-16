
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jobmdcimyvekynnysola.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYm1kY2lteXZla3lubnlzb2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODM5NTcsImV4cCI6MjA2MDE1OTk1N30.kinoqr7nuNC8rVBEGfCe4CJzKPiwgC-hsWmv6gXz9rc";

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Define interfaces for organization and user data
export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  plan_type: string | null;
  timezone: string | null;
  qbo_company_id?: string | null;
  qbo_realm_id?: string | null;
  qbo_access_token?: string | null;
  qbo_refresh_token?: string | null;
  qbo_token_expires_at?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  invited_at?: string | null;
  accepted_at?: string | null;
  invited_by?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// This represents an organization with the user's role in it
export interface OrganizationWithUserRole {
  id: string;
  name: string;
  industry: string | null;
  plan_type: string | null;
  timezone: string | null;
  is_active: boolean;
  created_at: string;
  userRole: string;
}

// Helper functions for organizations
export const fetchUserOrganizations = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_organizations')
    .select(`
      id,
      organization_id,
      role,
      organizations (
        id,
        name,
        industry,
        plan_type,
        timezone,
        is_active,
        created_at
      )
    `)
    .eq('user_id', userId)
    .eq('is_active', true);
    
  if (error) throw error;
  return data;
};

export const createOrganization = async (organizationData: Partial<Organization>) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert(organizationData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const linkUserToOrganization = async (
  userId: string, 
  organizationId: string, 
  role: string = 'admin'
) => {
  const { data, error } = await supabase
    .from('user_organizations')
    .insert({
      user_id: userId,
      organization_id: organizationId,
      role,
      accepted_at: new Date().toISOString()
    })
    .select();
    
  if (error) throw error;
  return data;
};
