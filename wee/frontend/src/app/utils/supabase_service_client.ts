import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SRV_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL')
}

if (!SUPABASE_SRV_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SRV_KEY)