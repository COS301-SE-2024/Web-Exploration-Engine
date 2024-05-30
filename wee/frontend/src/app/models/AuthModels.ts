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
