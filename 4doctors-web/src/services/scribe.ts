import api from '@/utils/api';

export interface ScribeSession {
    note_id: string;
    encounter_id: string;
    status: 'recording' | 'processing' | 'ready';
    generated_note?: string;
}

export const scribeService = {
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
        // Fetch real data from the API
        // This endpoint should aggregate transcript, generated note, coding, and orders
        try {
            const response = await api.get(`/doctors/visits/${visitId}/review`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch visit review', error);
            throw error;
        }
    }
};
