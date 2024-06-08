import { LoginRequest, SignUpRequest } from '../models/AuthModels';
import { supabase } from '../utils/supabase_service_client';


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

  return { 
    accessToken: data?.session?.access_token,
    uuid: data?.user?.id,
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
    accessToken: data?.session?.access_token,
    uuid: data?.user?.id,
   }
}