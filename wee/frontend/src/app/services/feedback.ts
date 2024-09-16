'use server'
import { createClient } from '../utils/supabase/server';

const supabase = createClient();

interface FeedbackResponse {
  success: boolean;
  error?: string;
}

export const submitFeedback = async (email: string, name: string, message: string): Promise<FeedbackResponse> => {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          email,
          name,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

    // Check if error is present in the response
    if (error) {
      return { success: false, error: error.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: (error as Error).message || 'Unknown error' };
  }
};
