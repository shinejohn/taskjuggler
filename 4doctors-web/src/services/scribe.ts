import api from '@/utils/api';
import type { Visit, DashboardItem, Claim, Note, ItemCategory } from '@/stores/scribemd/dashboardStore';

// Legacy types (preserved for backwards compatibility)
export interface ScribeSession {
    note_id: string;
    encounter_id: string;
    status: 'recording' | 'processing' | 'ready';
    generated_note?: string;
}

export interface ApprovalResult {
    status: 'approved';
    routing_results: {
        prescriptions: Array<{ item_id: string; drug: string; status: string; destination: string }>;
        orders: Array<{ item_id: string; order: string; type: string; status: string }>;
        prior_auths: Array<{ item_id: string; procedure: string; status: string; destination: string }>;
        claim: { status: string; clearinghouse: string; tracking_id: string } | null;
        note: { status: string; signed_by: string; signed_at: string } | null;
        follow_ups: Array<{ item_id: string; timeframe: string; status: string; destination: string }>;
        instructions: Array<{ item_id: string; status: string; destination: string }>;
    };
}

export const scribeService = {
    // =====================================================
    // LEGACY ENDPOINTS (Backwards Compatibility)
    // =====================================================

    startRecording: async (patientId: string, encounterId?: string): Promise<ScribeSession> => {
        const response = await api.post<ScribeSession>('/doctors/scribe/start', {
            patient_id: patientId,
            encounter_id: encounterId
        });
        return response.data;
    },

    generateNote: async (noteId: string): Promise<ScribeSession> => {
        const response = await api.post<ScribeSession>(`/doctors/scribe/${noteId}/generate`);
        return response.data;
    },

    getVisitReview: async (visitId: string) => {
        const response = await api.get(`/doctors/visits/${visitId}/review`);
        return response.data;
    },

    // =====================================================
    // NEW LIVE DASHBOARD API
    // =====================================================

    // Visit Management
    createVisit: async (patientId: string, appointmentId?: string): Promise<Visit> => {
        const response = await api.post<Visit>('/doctors/scribemd/visits', {
            patient_id: patientId,
            appointment_id: appointmentId,
        });
        return response.data;
    },

    getVisit: async (visitId: string): Promise<Visit> => {
        const response = await api.get<Visit>(`/doctors/scribemd/visits/${visitId}`);
        return response.data;
    },

    listVisits: async (params: { status?: string; per_page?: number; page?: number } = {}) => {
        const response = await api.get('/doctors/scribemd/visits', { params });
        return response.data;
    },

    stopVisitRecording: async (visitId: string): Promise<Visit> => {
        const response = await api.post<Visit>(`/doctors/scribemd/visits/${visitId}/stop`);
        return response.data;
    },

    // Dashboard Items
    addItem: async (visitId: string, data: {
        category: ItemCategory;
        item_data: Record<string, unknown>;
        source?: 'ai' | 'manual';
        source_text?: string;
        ai_confidence?: number;
    }): Promise<DashboardItem> => {
        const response = await api.post<DashboardItem>(`/doctors/scribemd/visits/${visitId}/items`, data);
        return response.data;
    },

    updateItem: async (visitId: string, itemId: string, data: {
        item_data?: Record<string, unknown>;
        is_accepted?: boolean;
    }): Promise<DashboardItem> => {
        const response = await api.patch<DashboardItem>(
            `/doctors/scribemd/visits/${visitId}/items/${itemId}`,
            data
        );
        return response.data;
    },

    deleteItem: async (visitId: string, itemId: string): Promise<void> => {
        await api.delete(`/doctors/scribemd/visits/${visitId}/items/${itemId}`);
    },

    toggleItem: async (visitId: string, itemId: string): Promise<DashboardItem> => {
        const response = await api.post<DashboardItem>(
            `/doctors/scribemd/visits/${visitId}/items/${itemId}/toggle`
        );
        return response.data;
    },

    // Claim
    getClaim: async (visitId: string): Promise<Claim> => {
        const response = await api.get<Claim>(`/doctors/scribemd/visits/${visitId}/claim`);
        return response.data;
    },

    updateClaim: async (visitId: string, data: {
        primary_diagnosis?: string;
        em_level?: number;
        em_method?: 'mdm' | 'time';
    }): Promise<Claim> => {
        const response = await api.patch<Claim>(`/doctors/scribemd/visits/${visitId}/claim`, data);
        return response.data;
    },

    // Note
    updateNote: async (visitId: string, data: {
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan_text?: string;
    }): Promise<Note> => {
        const response = await api.patch<Note>(`/doctors/scribemd/visits/${visitId}/note`, data);
        return response.data;
    },

    // Approval
    approveVisit: async (visitId: string, options: {
        sign_note?: boolean;
        send_prescriptions?: boolean;
        send_orders?: boolean;
        queue_prior_auths?: boolean;
        submit_claim?: boolean;
        schedule_follow_ups?: boolean;
        send_instructions?: boolean;
    } = {}): Promise<ApprovalResult> => {
        const response = await api.post<ApprovalResult>(
            `/doctors/scribemd/visits/${visitId}/approve`,
            options
        );
        return response.data;
    },
};

