import { LoginRequest, SignUpRequest } from '../models/AuthModels';
import { supabase } from '../utils/supabase_client';


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