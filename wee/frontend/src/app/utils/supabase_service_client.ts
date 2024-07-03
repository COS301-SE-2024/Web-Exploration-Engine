import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!SUPABASE_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
}

let supabase: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
};
