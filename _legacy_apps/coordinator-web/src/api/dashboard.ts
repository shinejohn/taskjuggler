import api from '@/utils/api';

export interface DashboardMetrics {
  calls_today: number;
  appointments_this_week: number;
  total_contacts: number;
  no_show_rate: number;
  calls_today_trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  appointments_trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  no_show_trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

export interface RecentCall {
  id: string;
  time: string;
  contact_name: string;
  coordinator_name: string;
  duration: string;
  outcome: string;
  status: 'success' | 'neutral' | 'error';
}

export interface TodayAppointment {
  id: string;
  time: string;
  contact_name: string;
  type: string;
  coordinator_name: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: (orgId: string) =>
    api.get<DashboardMetrics>(`/coordinator/organizations/${orgId}/dashboard/metrics`),

  // Get recent calls
  getRecentCalls: (orgId: string, limit = 10) =>
    api.get<{ data: RecentCall[] }>(
      `/coordinator/organizations/${orgId}/dashboard/recent-calls`,
      { params: { limit } }
    ),

  // Get today's appointments
  getTodayAppointments: (orgId: string) =>
    api.get<{ data: TodayAppointment[] }>(
      `/coordinator/organizations/${orgId}/dashboard/today-appointments`
    ),
};




