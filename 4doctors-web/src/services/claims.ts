import api from '@/utils/api';

export interface Claim {
    id: string;
    patient_name: string;
    service_date: string;
    total_billed: number;
    status: 'draft' | 'submitted' | 'paid' | 'denied' | 'pending' | 'auth_required';
    cpt_codes: string[];
}

export const claimsService = {
    // Generate claim from encounter
    generateClaim: async (encounterId: string) => {
        const response = await api.post('/doctors/claims/generate', { encounter_id: encounterId });
        return response.data;
    },

    // Submit claim
    submitClaim: async (claimId: string) => {
        const response = await api.post(`/doctors/claims/${claimId}/submit`);
        return response.data;
    },

    // List claims (Mock for now, as we didn't implement list endpoint yet but frontend needs it)
    // We should implement the list endpoint in RrcmController next
    getClaims: async (): Promise<Claim[]> => {
        // Return mock data for UI development until backend endpoint is ready
        return [
            {
                id: '1',
                patient_name: 'John Doe',
                service_date: '2026-01-24',
                total_billed: 150.00,
                status: 'draft',
                cpt_codes: ['99203']
            },
            {
                id: '2',
                patient_name: 'Jane Smith',
                service_date: '2026-01-23',
                total_billed: 250.00,
                status: 'auth_required',
                cpt_codes: ['70450']
            }
        ];
    }
};
