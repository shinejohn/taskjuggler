import api from '@/utils/api';

export interface CallLog {
  id: string;
  organization_id: string;
  coordinator_id?: string;
  contact_id?: string;
  phone_number_id?: string;
  direction: 'inbound' | 'outbound';
  from_number: string;
  to_number: string;
  status: string;
  duration_seconds: number;
  recording_url?: string;
  transcript?: string;
  transcript_segments?: any[];
  ai_summary?: string;
  outcome?: string;
  metadata?: Record<string, any>;
  provider: string;
  provider_call_id?: string;
  cost: number;
  started_at: string;
  answered_at?: string;
  ended_at?: string;
  created_at: string;
}

export interface CallFilters {
  search?: string;
  coordinator_id?: string;
  direction?: 'inbound' | 'outbound';
  status?: string;
  outcome?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export const callsApi = {
  // Get call history for organization
  getHistory: (orgId: string, filters?: CallFilters) =>
    api.get<{ data: CallLog[]; total: number; page: number; per_page: number }>(
      `/coordinator/organizations/${orgId}/calls`,
      { params: filters }
    ),

  // Get call by ID
  getById: (orgId: string, id: string) =>
    api.get<CallLog>(`/coordinator/organizations/${orgId}/calls/${id}`),

  // Get call statistics
  getStats: (orgId: string, filters?: CallFilters) =>
    api.get<{
      calls_today: number;
      avg_duration: number;
      booking_rate: number;
      total_calls: number;
    }>(`/coordinator/organizations/${orgId}/calls/stats`, { params: filters }),
};




