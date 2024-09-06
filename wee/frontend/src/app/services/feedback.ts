'use server'
import { createClient } from '../utils/supabase/server';

const supabase = createClient();

interface FeedbackResponse {
  success: boolean;
  error?: string;
}
