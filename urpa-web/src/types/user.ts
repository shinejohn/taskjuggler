export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  timezone?: string;
  plan?: string;
  plan_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

