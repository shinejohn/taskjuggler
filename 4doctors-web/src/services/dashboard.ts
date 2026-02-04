import api from '@/utils/api';

export interface DashboardStats {
    appointments_today: number;
    patients_total: number;
    tasks_pending: number;
}

export interface UpcomingAppointment {
    id: string;
    start_time: string;
    status: string;
    first_name: string;
    last_name: string;
}

export interface RecentPatient {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export interface DashboardData {
    stats: DashboardStats;
    upcoming_appointments: UpcomingAppointment[];
    recent_patients: RecentPatient[];
    provider_profile: any;
}

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardData> => {
        const response = await api.get<DashboardData>('/doctors/dashboard');
        return response.data;
    }
};
