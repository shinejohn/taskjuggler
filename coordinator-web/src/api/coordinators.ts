import api from '@/utils/api';

export interface Coordinator {
  id: string;
  organization_id: string;
  role_template_id: string;
  persona_template_id: string;
  display_name?: string;
  voice_id?: string;
  custom_greeting?: string;
  custom_prompts?: Record<string, any>;
  custom_scripts?: Record<string, any>;
  availability?: Record<string, any>;
  status: string;
  monthly_price: number;
  activated_at?: string;
  role_template?: any;
  persona_template?: any;
}

export const coordinatorsApi = {
  // Get coordinators for organization
  getByOrganization: (orgId: string) =>
    api.get<Coordinator[]>(`/coordinator/organizations/${orgId}/coordinators`),

  // Get coordinator by ID
  getById: (id: string) =>
    api.get<Coordinator>(`/coordinator/coordinators/${id}`),

  // Create coordinator
  create: (orgId: string, data: Partial<Coordinator>) =>
    api.post<Coordinator>(`/coordinator/organizations/${orgId}/coordinators`, data),

  // Update coordinator
  update: (id: string, data: Partial<Coordinator>) =>
    api.put<Coordinator>(`/coordinator/coordinators/${id}`, data),

  // Delete coordinator
  delete: (id: string) =>
    api.delete(`/coordinator/coordinators/${id}`),
};

