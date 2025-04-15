
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
