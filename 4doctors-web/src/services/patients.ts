import api from '@/utils/api';

export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob?: string;
    email?: string;
    phone?: string;
    last_visit?: string;
}

export interface ClinicalEncounter {
    id: string;
    encounter_date: string;
    type: string;
    chief_complaint?: string;
    status: string;
}

export const patientsService = {
    // Get all patients (mocking filtering/pagination for now)
    getPatients: async (): Promise<Patient[]> => {
        const response = await api.get<Patient[]>('/doctors/patients');
        return response.data;
    },

    // Get single patient details (including clinical history mock)
    getPatient: async (id: string) => {
        // In real app, fetching patient + recent encounters
        // Mocking response for UI development until generic show endpoint is ready
        return {
            id: id,
            first_name: 'John',
            last_name: 'Doe',
            dob: '1980-05-12',
            email: 'john.doe@example.com',
            phone: '555-0123',
            encounters: [
                { id: 'e1', encounter_date: '2026-01-20', type: 'office_visit', chief_complaint: 'Cough', status: 'signed' },
                { id: 'e2', encounter_date: '2025-11-15', type: 'follow_up', chief_complaint: 'BP Check', status: 'signed' }
            ],
            vitals: {
                bp: '120/80',
                hr: '72',
                temp: '98.6'
            },
            medications: [
                { id: 'm1', drug_name: 'Lisinopril', dosage: '10mg', frequency: 'daily', status: 'active' }
            ]
        };
    },

    createPatient: async (data: Partial<Patient>) => {
        const response = await api.post('/doctors/patients', data);
        return response.data;
    },

    // Medication Management
    addMedication: async (patientId: string, medication: any) => {
        // api.post(`/doctors/patients/${patientId}/medications`, medication);
        console.log(`Adding medication for patient ${patientId}`, medication);
        return { ...medication, id: Math.random().toString(36).substr(2, 9) };
    },

    removeMedication: async (patientId: string, medicationId: string) => {
        // api.delete(`/doctors/patients/${patientId}/medications/${medicationId}`);
        console.log(`Removing medication ${medicationId} for patient ${patientId}`);
        return true;
    }
};
