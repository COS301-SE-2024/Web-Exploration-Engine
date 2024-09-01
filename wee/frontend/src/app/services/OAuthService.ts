import { createClient } from "../utils/supabase/client";

export async function googleLogin() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Error logging in with Google:', error.message);
    return {
      code: error.code,
      message: error.message,
    }
  }

  // get user data
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.first_name || user?.user_metadata?.name || user?.user_metadata?.fullname || user?.email || '';
  return {
    uuid: user?.id,
    emailVerified: user?.email_confirmed_at ? true : false,
    name: userName,
  }
}