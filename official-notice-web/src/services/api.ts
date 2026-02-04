import axios from 'axios'
import type {
    DocumentArea, Document, SigningSession, Milestone, Team,
    IdentityVerification, ApiResponse, AuthResponse, User
} from '../types'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const { data } = await api.post('/auth/login', { email, password })
        return data
    },
    register: async (name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> => {
        const { data } = await api.post('/auth/register', { name, email, password, password_confirmation })
        return data
    },
    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
    },
    me: async (): Promise<User> => {
        const { data } = await api.get('/auth/user')
        return data
    }
}

// Document Areas API
export const areasApi = {
    list: async (): Promise<DocumentArea[]> => {
        const { data } = await api.get<ApiResponse<DocumentArea[]>>('/official-notice/areas')
        return data.data
    },
    get: async (id: string): Promise<DocumentArea> => {
        const { data } = await api.get<ApiResponse<DocumentArea>>(`/official-notice/areas/${id}`)
        return data.data
    },
    create: async (name: string): Promise<DocumentArea> => {
        const { data } = await api.post<ApiResponse<DocumentArea>>('/official-notice/areas', { name })
        return data.data
    },
    uploadDocument: async (areaId: string, file: File, title: string): Promise<Document> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title)
        const { data } = await api.post<ApiResponse<Document>>(
            `/official-notice/areas/${areaId}/documents`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return data.data
    }
}

// Documents API
export const documentsApi = {
    get: async (id: string): Promise<Document> => {
        const { data } = await api.get<ApiResponse<Document>>(`/official-notice/documents/${id}`)
        return data.data
    }
}

// Milestones API
export const milestonesApi = {
    list: async (documentId?: string): Promise<Milestone[]> => {
        const params = documentId ? { document_id: documentId } : {}
        const { data } = await api.get<ApiResponse<Milestone[]>>('/official-notice/milestones', { params })
        return data.data
    },
    create: async (milestone: Partial<Milestone>): Promise<Milestone> => {
        const { data } = await api.post<ApiResponse<Milestone>>('/official-notice/milestones', milestone)
        return data.data
    },
    update: async (id: string, milestone: Partial<Milestone>): Promise<Milestone> => {
        const { data } = await api.put<ApiResponse<Milestone>>(`/official-notice/milestones/${id}`, milestone)
        return data.data
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/official-notice/milestones/${id}`)
    }
}

// Teams API
export const teamsApi = {
    list: async (): Promise<Team[]> => {
        const { data } = await api.get<{ teams: Team[] }>('/teams')
        // The API returns { teams: [...] } based on TeamController.php
        return data.teams
    },
    create: async (name: string): Promise<Team> => {
        const { data } = await api.post<{ team: Team }>('/teams', { name })
        return data.team
    },
    get: async (id: string): Promise<Team> => {
        const { data } = await api.get<{ team: Team }>(`/teams/${id}`)
        return data.team
    },
    getMembers: async (id: string): Promise<any[]> => {
        const { data } = await api.get<{ members: any[] }>(`/teams/${id}/members`)
        return data.members
    },
    invite: async (teamId: string, email: string) => {
        const { data } = await api.post(`/teams/${teamId}/invite`, { email })
        return data
    },
    removeMember: async (teamId: string, userId: string) => {
        await api.delete(`/teams/${teamId}/members/${userId}`)
    },
    invitation: async (inviteCode: string) => {
        const { data } = await api.get(`/teams/invite/${inviteCode}`)
        return data
    },
    acceptInvitation: async (inviteCode: string) => {
        const { data } = await api.post(`/teams/join/${inviteCode}`)
        return data
    }
}

// Billing API
export const billingApi = {
    checkout: async (planId: string, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
        const { data } = await api.post('/subscriptions/checkout', {
            plan_id: planId,
            billing_period: billingPeriod
        }, {
            headers: { 'X-App-Context': 'official-notice' } // Assuming this is the context
        })
        return data.data // returns { checkout_url, session_id }
    }
}

// Signing Sessions API
export const signingApi = {
    create: async (documentId: string, parties: { name: string; email: string }[]): Promise<SigningSession> => {
        const { data } = await api.post<ApiResponse<SigningSession>>(
            `/official-notice/documents/${documentId}/signing-session`,
            { parties }
        )
        return data.data
    },
    get: async (sessionId: string): Promise<SigningSession> => {
        const { data } = await api.get<ApiResponse<SigningSession>>(`/official-notice/signing-sessions/${sessionId}`)
        return data.data
    },
    myStatus: async (sessionId: string) => {
        const { data } = await api.get(`/official-notice/signing-sessions/${sessionId}/my-status`)
        return data.data
    },
    requestVerification: async (sessionId: string): Promise<void> => {
        await api.post(`/official-notice/signing-sessions/${sessionId}/request-verification`)
    },
    acceptWaiver: async (sessionId: string): Promise<void> => {
        await api.post(`/official-notice/signing-sessions/${sessionId}/accept-waiver`)
    },
    verifyFace: async (sessionId: string, faceImageBase64: string) => {
        const { data } = await api.post(`/official-notice/signing-sessions/${sessionId}/verify-face`, {
            face_image_base64: faceImageBase64
        })
        return data
    },
    sign: async (sessionId: string, payload: {
        signature_image_base64: string
        signature_method: string
        geolocation?: { latitude: number; longitude: number; accuracy: number }
    }) => {
        const { data } = await api.post(`/official-notice/signing-sessions/${sessionId}/sign`, payload)
        return data.data
    }
}

// Identity Verification API
export const identityApi = {
    startVerification: async (): Promise<{ verification_id: string; client_secret?: string; url?: string }> => {
        const { data } = await api.post('/official-notice/identity/start-verification')
        return data
    },
    status: async (): Promise<IdentityVerification> => {
        const { data } = await api.get<ApiResponse<IdentityVerification>>('/official-notice/identity/status')
        return data.data
    },
    refresh: async (): Promise<IdentityVerification> => {
        const { data } = await api.post<ApiResponse<IdentityVerification>>('/official-notice/identity/refresh')
        return data.data
    }
}

export default api
