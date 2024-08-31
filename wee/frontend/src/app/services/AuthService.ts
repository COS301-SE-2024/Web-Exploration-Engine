import { LoginRequest, SignUpRequest } from '../models/AuthModels';
import { getSupabase } from '../utils/supabase_anon_client';

const supabase = getSupabase();

export async function login(req: LoginRequest) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: req.email,
    password: req.password,
  })

  if (error) {
    return {
      code: error.code,
      message: error.message,
    }
  }
  const user = data?.user;
  const userName = user?.user_metadata?.first_name || user?.user_metadata?.name || user?.user_metadata?.name || user?.email || '';

  return {
    uuid: data?.user?.id,
    emailVerified: data?.user?.email_confirmed_at ? true : false,
    name: userName
  }
}

export async function signUp(req: SignUpRequest) {
  // check if email is already taken
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', req.email)


  if (usersError) {
    return {
      code: usersError.code,
      message: usersError.message,
    }
  }


  if (users && users.length > 0) {
    return {
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email: req.email,
    password: req.password,
    options: {
      data: {
        first_name: req.firstName,
        last_name: req.lastName,
        fullname: `${req.firstName} ${req.lastName}`,
      },
    },
  })

  if (error) {
    return {
      code: error.code,
      message: error.message,
    }
  }

  return {
    uuid: data?.user?.id,
    emailVerified: data?.user?.email_confirmed_at ? true : false,
  }
}

export async function googleLogin() {
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
    name: userName ,
  }
}

export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/reset-password',
    // redirectTo:'https://capstone-wee.dns.net.za/reset-password', add this when deployed
  });

  if (error) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    message: 'Password reset email sent. Please check your inbox.',
  };
}

export async function resetPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    message: 'Password reset successfully.',
    user: data,
  };
}
