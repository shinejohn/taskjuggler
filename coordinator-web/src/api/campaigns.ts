import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface Campaign {
  id: string;
  organization_id: string;
  coordinator_id?: string;
  name: string;
  type: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  description?: string;
  target_contacts?: string[];
  target_count?: number;
  script?: Record<string, any>;
  filters?: Record<string, any>;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
  schedule_rules?: Record<string, any>;
  contacts_processed: number;
  contacts_contacted: number;
  contacts_answered: number;
  appointments_booked: number;
  appointments_confirmed: number;
  appointments_rescheduled: number;
  answer_rate?: number;
  booking_rate?: number;
  confirmation_rate?: number;
  started_at?: string;
  completed_at?: string;
  paused_at?: string;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  coordinator?: {
    id: string;
    display_name: string;
  };
}

export interface CampaignFilters {
  status?: string;
  type?: string;
  page?: number;
  per_page?: number;
}

export interface CampaignStats {
  contacts_processed: number;
  contacts_contacted: number;
  contacts_answered: number;
  appointments_booked: number;
  appointments_confirmed: number;
  appointments_rescheduled: number;
  answer_rate?: number;
  booking_rate?: number;
  confirmation_rate?: number;
}

export const campaignsApi = {
  getAll(orgId: string, filters?: CampaignFilters): Promise<AxiosResponse<{ data: Campaign[]; total?: number; page?: number; per_page?: number }>> {
    return api.get(`/coordinator/organizations/${orgId}/campaigns`, { params: filters });
  },
  getById(orgId: string, id: string): Promise<AxiosResponse<Campaign>> {
    return api.get(`/coordinator/organizations/${orgId}/campaigns/${id}`);
  },
  create(orgId: string, data: Partial<Campaign>): Promise<AxiosResponse<Campaign>> {
    return api.post(`/coordinator/organizations/${orgId}/campaigns`, data);
  },
  update(orgId: string, id: string, data: Partial<Campaign>): Promise<AxiosResponse<Campaign>> {
    return api.put(`/coordinator/organizations/${orgId}/campaigns/${id}`, data);
  },
  delete(orgId: string, id: string): Promise<AxiosResponse<void>> {
    return api.delete(`/coordinator/organizations/${orgId}/campaigns/${id}`);
  },
  start(orgId: string, id: string): Promise<AxiosResponse<Campaign>> {
    return api.post(`/coordinator/organizations/${orgId}/campaigns/${id}/start`);
  },
  pause(orgId: string, id: string): Promise<AxiosResponse<Campaign>> {
    return api.post(`/coordinator/organizations/${orgId}/campaigns/${id}/pause`);
  },
  getStats(orgId: string, id: string): Promise<AxiosResponse<CampaignStats>> {
    return api.get(`/coordinator/organizations/${orgId}/campaigns/${id}/stats`);
  },
};

