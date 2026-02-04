// Official Notice TypeScript Types

export interface DocumentArea {
    id: string
    owner_id: string
    alt_leader_id?: string
    name: string
    status: 'active' | 'archived'
    documents_count?: number
    documents?: Document[]
    members?: AreaMember[]
    created_at: string
    updated_at: string
}

export interface Document {
    id: string
    area_id: string
    uploader_id: string
    title: string
    description?: string
    file_path: string
    file_type: 'pdf' | 'docx' | string
    is_analyzed: boolean
    sections?: DocumentSection[]
    critical_dates?: CriticalDate[]
    created_at: string
    updated_at: string
}

export interface DocumentSection {
    id: string
    document_id: string
    section_type: 'clause' | 'party' | 'term' | 'payment' | string
    content: string
    analysis?: string
    risk_score: number // 0-100
    created_at: string
}

export interface CriticalDate {
    id: string
    document_id: string
    title: string
    due_date: string
    notification_type: 'email' | 'sms' | 'push'
    reminder_days_before: number
    is_resolved: boolean
    last_reminder_sent_at?: string
    created_at: string
}

export interface Milestone {
    id: string
    title: string
    description?: string
    start_date: string
    end_date?: string
    is_all_day: boolean
    rrule?: string
    document_id?: string
    status: 'pending' | 'completed' | 'cancelled'
    created_at: string
}

export interface SigningSession {
    id: string
    document_id: string
    created_by?: string
    status: 'pending' | 'in_progress' | 'completed' | 'expired'
    verification_required: boolean
    deadline?: string
    completed_at?: string
    signatures?: Signature[]
    created_at: string
}

export interface Signature {
    id: string
    session_id: string
    user_id: string
    party_name: string
    party_email: string
    verification_status: 'pending' | 'verified' | 'skipped'
    face_match_passed?: boolean
    face_match_confidence?: number
    signature_image_s3_key?: string
    signature_method?: 'draw' | 'type' | 'upload'
    document_hash?: string
    geolocation?: {
        latitude: number
        longitude: number
        accuracy: number
    }
    ip_address?: string
    signed_at?: string
    created_at: string
}

export interface IdentityVerification {
    id: string
    user_id: string
    status: 'pending' | 'verified' | 'failed'
    verified_at?: string
    expires_at?: string
    created_at: string
}

export interface User {
    id: string
    name: string
    email: string
    email_verified_at?: string
    created_at: string
}

export interface AreaMember {
    id: number
    area_id: string
    user_id: string
    role: 'leader' | 'alt_leader' | 'member'
    contact_info?: {
        phone?: string
        email_override?: string
    }
    created_at: string
}

// API Response Types
export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export interface AuthResponse {
    user: User
    token: string
}

export interface Team {
    id: string
    name: string
    slug: string
    owner_id: string
    created_at: string
    members?: {
        id: string
        name: string
        email: string
        pivot?: {
            is_admin: boolean
            joined_at: string
        }
    }[]
}
