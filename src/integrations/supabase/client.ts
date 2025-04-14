
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jobmdcimyvekynnysola.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYm1kY2lteXZla3lubnlzb2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODM5NTcsImV4cCI6MjA2MDE1OTk1N30.kinoqr7nuNC8rVBEGfCe4CJzKPiwgC-hsWmv6gXz9rc";

// Check for development mode to bypass RLS
const devMode = import.meta.env.DEV || import.meta.env.VITE_BYPASS_AUTH === 'true';

// Create a version of the client with anonymous access for development
const getClient = () => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  
  // If in development mode, use service role or anonymous ID
  if (devMode) {
    // Use a constant UUID for development that will be consistent
    const devUserId = '00000000-0000-0000-0000-000000000000';
    
    // In development, we'll bypass RLS by using manual headers
    client.realtime.setAuth(devUserId);
    
    // For all other requests, set a header that our RLS policies can check
    const originalFetch = client.rest.headers['headers'];
    client.rest.headers['headers'] = (...args) => {
      const headers = originalFetch ? originalFetch(...args) : {};
      return {
        ...headers,
        'x-dev-user-id': devUserId,
      };
    };
  }
  
  return client;
};

export const supabase = getClient();
