import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface CallAnalytics {
  total_calls: number;
  inbound_calls: number;
  outbound_calls: number;
  answered_calls: number;
  missed_calls: number;
  answer_rate: number;
  avg_duration_seconds: number;
  appointments_booked: number;
  booking_rate: number;
  total_cost: number;
  outcomes: Record<string, number>;
  by_hour: number[];
}

export interface AppointmentAnalytics {
  total_appointments: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_shows: number;
  confirmation_rate: number;
  completion_rate: number;
  no_show_rate: number;
}

export interface ContactAnalytics {
  total_contacts: number;
  new_contacts: number;
  contacts_with_appointments: number;
}

export interface CoordinatorPerformance {
  coordinator_id: string;
  coordinator_name: string;
  calls: number;
  answered: number;
  appointments: number;
  answer_rate: number;
  booking_rate: number;
  avg_duration: number;
}

export interface TrendPoint {
  date: string;
  calls?: number;
  appointments?: number;
}

export interface Analytics {
  period: { from: string; to: string };
  calls: CallAnalytics;
  appointments: AppointmentAnalytics;
  contacts: ContactAnalytics;
  coordinators: CoordinatorPerformance[];
  trends: {
    calls: TrendPoint[];
    appointments: TrendPoint[];
  };
}

export const analyticsApi = {
  get(orgId: string, params?: { date_from?: string; date_to?: string }): Promise<AxiosResponse<Analytics>> {
    return api.get(`/coordinator/organizations/${orgId}/analytics`, { params });
  },
};
