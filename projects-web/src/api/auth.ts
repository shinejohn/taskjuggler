import apiClient from './client'

export interface User {
  id: string
  name: string
  email: string
  organization_id?: string
  created_at?: string
  plan?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  organization_name: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data.data || data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const { data: response } = await apiClient.post('/auth/register', data)
    return response.data || response
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getUser(): Promise<User> {
    const { data } = await apiClient.get('/auth/user')
    return data.user || data.data?.user || data
  },
}

