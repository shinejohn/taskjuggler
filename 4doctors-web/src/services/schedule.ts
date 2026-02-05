// import api from '@/utils/api';

export interface Appointment {
    id: string;
    patient_id: string;
    patient_name: string;
    start_time: string;
    end_time: string;
    type: string; // new_patient, follow_up, physical
    status: 'scheduled' | 'checked_in' | 'in_room' | 'completed' | 'cancelled';
    notes?: string;
}

export const scheduleService = {
    getAppointments: async (date: string): Promise<Appointment[]> => {
        // Mocking response for now until backend endpoint supports date query fully
        // In real app: return api.get('/doctors/appointments', { params: { date } });

        // Generating mock data relative to requested date to ensure calendar always has data
        const baseDate = new Date(date);
        const mockAppointments: Appointment[] = [
            {
                id: 'apt1',
                patient_id: 'p1',
                patient_name: 'John Doe',
                start_time: new Date(baseDate.setHours(9, 0)).toISOString(),
                end_time: new Date(baseDate.setHours(9, 30)).toISOString(),
                type: 'follow_up',
                status: 'scheduled',
                notes: 'BP Check'
            },
            {
                id: 'apt2',
                patient_id: 'p2',
                patient_name: 'Alice Smith',
                start_time: new Date(baseDate.setHours(10, 0)).toISOString(),
                end_time: new Date(baseDate.setHours(10, 45)).toISOString(),
                type: 'new_patient',
                status: 'checked_in',
                notes: 'Shoulder pain'
            },
            {
                id: 'apt3',
                patient_id: 'p3',
                patient_name: 'Bob Jones',
                start_time: new Date(baseDate.setHours(14, 0)).toISOString(),
                end_time: new Date(baseDate.setHours(14, 15)).toISOString(),
                type: 'telehealth',
                status: 'scheduled',
                notes: 'Med refill'
            }
        ];
        return mockAppointments;
    },

    createAppointment: async (data: Partial<Appointment>) => {
        // return api.post('/doctors/appointments', data);
        return data;
    }
};
