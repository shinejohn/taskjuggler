import api from '@/utils/api';

export interface Appointment {
  id: string;
  organization_id: string;
  contact_id: string;
  appointment_type_id?: string;
  booked_by_coordinator_id?: string;
  assigned_to_user_id?: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  status: string;
  location?: string;
  location_type: string;
  notes?: string;
  cancellation_reason?: string;
  reminders_sent?: any[];
  confirmed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  appointment_type?: {
    id: string;
    name: string;
  };
  contact?: any;
  coordinator?: any;
}

export interface AppointmentFilters {
  date_from?: string;
  date_to?: string;
  status?: string;
  coordinator_id?: string;
  contact_id?: string;
  page?: number;
  per_page?: number;
}

export const appointmentsApi = {
  // Get appointments for organization
  getAll: (orgId: string, filters?: AppointmentFilters) =>
    api.get<{ data: Appointment[]; total?: number; page?: number; per_page?: number }>(
      `/coordinator/organizations/${orgId}/appointments`,
      { params: filters }
    ),

  // Get today's appointments
  getToday: (orgId: string) =>
    api.get<{ data: Appointment[] }>(
      `/coordinator/organizations/${orgId}/appointments/today`
    ),

  // Get appointment by ID
  getById: (orgId: string, id: string) =>
    api.get<Appointment>(`/coordinator/organizations/${orgId}/appointments/${id}`),

  // Create appointment
  create: (orgId: string, data: Partial<Appointment>) =>
    api.post<Appointment>(`/coordinator/organizations/${orgId}/appointments`, data),

  // Update appointment
  update: (orgId: string, id: string, data: Partial<Appointment>) =>
    api.put<Appointment>(`/coordinator/organizations/${orgId}/appointments/${id}`, data),

  // Cancel appointment
  cancel: (orgId: string, id: string, reason?: string) =>
    api.post(`/coordinator/organizations/${orgId}/appointments/${id}/cancel`, { reason }),

  // Delete appointment
  delete: (orgId: string, id: string) =>
    api.delete(`/coordinator/organizations/${orgId}/appointments/${id}`),
};

