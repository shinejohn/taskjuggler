import api from '@/utils/api';

const PORTAL_BASE = '/doctors/portal';

export interface PatientNotification {
    id: string;
    title: string;
    summary: string;
    priority: string;
    is_read: boolean;
    created_at: string;
    patient_friendly_summary?: string;
}

export interface VisitItem {
    id: string;
    item_type: string;
    title: string;
    description: string;
    why_explanation?: string;
    status: string;
    status_message?: string;
    created_at?: string;
    updated_at?: string;
}

export const portalService = {
    async getDashboard() {
        const response = await api.get(`${PORTAL_BASE}/dashboard`);
        return response.data;
    },

    async markNotificationRead(id: string) {
        const response = await api.patch(`${PORTAL_BASE}/notifications/${id}/read`);
        return response.data;
    },

    async chat(message: string) {
        const response = await api.post(`${PORTAL_BASE}/chat`, { message });
        return response.data;
    },

    async getAppointments() {
        const response = await api.get(`${PORTAL_BASE}/appointments`);
        return response.data;
    },

    async getLabs() {
        const response = await api.get(`${PORTAL_BASE}/labs`);
        return response.data;
    },

    async getPriorAuths() {
        const response = await api.get(`${PORTAL_BASE}/prior-auth`);
        return response.data;
    },

    async getMessages() {
        const response = await api.get(`${PORTAL_BASE}/messages`);
        return response.data;
    },

    async sendMessage(recipient_id: string, content: string) {
        const response = await api.post(`${PORTAL_BASE}/messages`, { recipient_id, content });
        return response.data;
    }
};
