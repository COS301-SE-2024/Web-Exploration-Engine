import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY

if (!SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL')
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_PUBLIC_KEY')
}

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
};