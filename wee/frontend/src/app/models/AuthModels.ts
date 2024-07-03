export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  uuid: string;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export interface User {
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
  }
}
