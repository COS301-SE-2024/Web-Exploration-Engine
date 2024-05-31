import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY
const SUPABASE_SRV_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL')
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_PUBLIC_KEY')
}



export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)