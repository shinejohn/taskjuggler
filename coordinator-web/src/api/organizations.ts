import api from '@/utils/api';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  timezone: string;
  business_hours?: Record<string, any>;
  settings?: Record<string, any>;
  subscription_tier: string;
  compliance_modes?: string[];
}

export const organizationsApi = {
  // Get all organizations for user
  getAll: () => api.get<Organization[]>('/coordinator/organizations'),

  // Get organization by ID
  getById: (id: string) => api.get<Organization>(`/coordinator/organizations/${id}`),

  // Create organization
  create: (data: Partial<Organization>) => 
    api.post<Organization>('/coordinator/organizations', data),

  // Update organization
  update: (id: string, data: Partial<Organization>) =>
    api.put<Organization>(`/coordinator/organizations/${id}`, data),

  // Delete organization
  delete: (id: string) =>
    api.delete(`/coordinator/organizations/${id}`),
};




