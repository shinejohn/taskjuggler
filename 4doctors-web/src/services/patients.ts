import api from '@/utils/api';

export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob?: string;
    email?: string;
    phone?: string;
    last_visit?: string;
    mrn?: string;
    insurance?: string;
    status?: 'active' | 'inactive';
}

export interface ClinicalEncounter {
    id: string;
    encounter_date: string;
    type: string;
    chief_complaint?: string;
    status: string;
}

export interface NetworkEncounter {
    id: string;
    encounter_date: string;
    chief_complaint?: string;
    organization_name?: string;
}

export interface Medication {
    id: string;
    drug_name: string;
    dosage?: string;
    frequency?: string;
    status?: string;
}

export interface PatientChartData extends Patient {
    encounters: ClinicalEncounter[];
    network_history: NetworkEncounter[];
    medications: Medication[];
}

export const patientsService = {
    // Get all patients (mocking filtering/pagination for now)
    getPatients: async (): Promise<Patient[]> => {
        const response = await api.get<Patient[]>('/doctors/patients');
        return response.data;
    },

    // Get single patient chart (patient record + encounters + federated network history)
    getPatient: async (id: string): Promise<PatientChartData> => {
        const response = await api.get<{
            patient: Patient;
            encounters: ClinicalEncounter[];
            network_history: NetworkEncounter[];
        }>(`/doctors/patients/${id}`);
        const { patient, encounters, network_history } = response.data;
        return {
            ...patient,
            encounters: encounters ?? [],
            network_history: network_history ?? [],
            medications: [],
        };
    },

    createPatient: async (data: Partial<Patient>) => {
        const response = await api.post('/doctors/patients', data);
        return response.data;
    },

    // Medication Management
    addMedication: async (patientId: string, medication: Omit<Medication, 'id'>): Promise<Medication> => {
        // TODO: api.post(`/doctors/patients/${patientId}/medications`, medication);
        return { ...medication, id: Math.random().toString(36).slice(2, 11) };
    },

    removeMedication: async (patientId: string, medicationId: string) => {
        // TODO: api.delete(`/doctors/patients/${patientId}/medications/${medicationId}`);
        return true;
    }
};
