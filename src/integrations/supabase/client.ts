
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://szsftwtukvxllmppewqv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6c2Z0d3R1a3Z4bGxtcHBld3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjIyNjYsImV4cCI6MjA2MjE5ODI2Nn0.M1W_Crq-KLX65FJj-PIj4E87BlgRA8FQoiF05yEcrRA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
