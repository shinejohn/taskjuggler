import { api } from '@/lib/api';
import type { URPAMode } from '@/types/mode';

/**
 * URPA Dashboard API service for mode-aware data
 */
export interface EmailItem {
    id: number;
    from: string;
    subject: string;
    preview: string;
    mode: URPAMode;
    time: string;
    unread: boolean;
}

export interface CalendarEvent {
    id: number;
    title: string;
    time: string;
    duration: string;
    mode: URPAMode;
    type: string;
}

export interface TaskItem {
    id: number;
    title: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
    mode: URPAMode;
    completed: boolean;
}

export interface VoicemailItem {
    id: number;
    caller: string;
    transcription: string;
    duration: string;
    mode: URPAMode;
    time: string;
    line: string;
}

export interface MessageItem {
    id: number;
    from: string;
    message: string;
    mode: URPAMode;
    time: string;
    channel: string;
}

export interface DashboardStats {
    practice?: {
        patients_today: number;
        charts_pending: number;
        prior_auths: number;
        prescriptions: number;
        labs_to_review: number;
    };
    business?: {
        revenue_today: number;
        claims_pending: number;
        staff_on_shift: number;
        vendor_orders: number;
        pto_requests: number;
    };
    personal?: {
        goals_active: number;
        trips_planned: number;
        messages_unread: number;
        files_uploaded: number;
        events_today: number;
    };
}

export interface DashboardData {
    emails: EmailItem[];
    calendar: CalendarEvent[];
    tasks: TaskItem[];
    voicemails: VoicemailItem[];
    messages: MessageItem[];
    stats: DashboardStats;
}

export const urpaDashboardApi = {
    /**
     * Get all dashboard widget data for current mode
     */
    async getAll(): Promise<DashboardData> {
        const response = await api.get('/urpa/dashboard');
        return response.data;
    },

    /**
     * Get mode-filtered emails
     */
    async getEmails(limit = 10): Promise<EmailItem[]> {
        const response = await api.get('/urpa/dashboard/emails', { params: { limit } });
        return response.data;
    },

    /**
     * Get mode-filtered calendar events
     */
    async getCalendar(limit = 5): Promise<CalendarEvent[]> {
        const response = await api.get('/urpa/dashboard/calendar', { params: { limit } });
        return response.data;
    },

    /**
     * Get mode-filtered tasks
     */
    async getTasks(limit = 10): Promise<TaskItem[]> {
        const response = await api.get('/urpa/dashboard/tasks', { params: { limit } });
        return response.data;
    },

    /**
     * Get mode-filtered voicemails
     */
    async getVoicemails(limit = 5): Promise<VoicemailItem[]> {
        const response = await api.get('/urpa/dashboard/voicemails', { params: { limit } });
        return response.data;
    },

    /**
     * Get mode-filtered messages
     */
    async getMessages(limit = 10): Promise<MessageItem[]> {
        const response = await api.get('/urpa/dashboard/messages', { params: { limit } });
        return response.data;
    },

    /**
     * Get dashboard stats for current mode
     */
    async getStats(): Promise<DashboardStats> {
        const response = await api.get('/urpa/dashboard/stats');
        return response.data;
    },
};

export default urpaDashboardApi;
