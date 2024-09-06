'use server'
import { createClient } from '../utils/supabase/server';

const supabase = createClient();

interface FeedbackResponse {
  success: boolean;
  error?: string;
}

export const submitFeedback = async (email: string, name: string, message: string): Promise<FeedbackResponse> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          email,
          name,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: (error as Error).message };
  }
};
