import api from '@/utils/api';

export interface Contact {
  id: string;
  organization_id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  phone_secondary?: string;
  company?: string;
  job_title?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  source?: string;
  status: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  notes?: string;
  lifetime_value?: number;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFilters {
  search?: string;
  status?: string;
  source?: string;
  tags?: string[];
  last_contacted?: string;
  page?: number;
  per_page?: number;
}

export const contactsApi = {
  // Get all contacts for organization
  getAll: (orgId: string, filters?: ContactFilters) =>
    api.get<{ data: Contact[]; total: number; page: number; per_page: number }>(
      `/coordinator/organizations/${orgId}/contacts`,
      { params: filters }
    ),

  // Get contact by ID
  getById: (orgId: string, id: string) =>
    api.get<Contact>(`/coordinator/organizations/${orgId}/contacts/${id}`),

  // Create contact
  create: (orgId: string, data: Partial<Contact>) =>
    api.post<Contact>(`/coordinator/organizations/${orgId}/contacts`, data),

  // Update contact
  update: (orgId: string, id: string, data: Partial<Contact>) =>
    api.put<Contact>(`/coordinator/organizations/${orgId}/contacts/${id}`, data),

  // Delete contact
  delete: (orgId: string, id: string) =>
    api.delete(`/coordinator/organizations/${orgId}/contacts/${id}`),

  // Bulk operations
  bulkDelete: (orgId: string, ids: string[]) =>
    api.post(`/coordinator/organizations/${orgId}/contacts/bulk-delete`, { ids }),

  bulkTag: (orgId: string, ids: string[], tags: string[]) =>
    api.post(`/coordinator/organizations/${orgId}/contacts/bulk-tag`, { ids, tags }),
};




