import api from '@/utils/api';

export interface PostAttachment {
    file_name: string;
    file_type: string;
    file_size: string;
}

export interface PostComment {
    id: string;
    content: string;
    created_at: string;
}

export interface Post {
    id: string;
    content: string;
    visibility: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    provider: {
        id: string;
        specialty: string;
        user: {
            name: string;
            avatar?: string;
        };
    };
    attachments: PostAttachment[];
    comments: PostComment[];
}

export interface Peer {
    id: string;
    specialty: string;
    user: {
        name: string;
        avatar?: string;
    };
    online_status?: {
        status: 'on' | 'off' | 'busy' | 'away';
        last_seen_at: string;
    };
}

export interface CreatePostData {
    content: string;
    visibility: string;
}

export interface CreateReferralData {
    patient_id: string;
    provider_id?: string;
    specialty?: string;
    reason?: string;
    urgency?: string;
    requires_prior_auth?: boolean;
    prior_auth_type?: string;
}

export interface DirectoryFilters {
    specialty?: string;
    name?: string;
    location?: string;
}

export const docConnectService = {
    async getFeed(params: Record<string, string> = {}) {
        const { data } = await api.get('/doctors/docconnect/feed', { params });
        return data;
    },

    async createPost(postData: CreatePostData) {
        const { data } = await api.post('/doctors/docconnect/posts', postData);
        return data;
    },

    async createReferral(referralData: CreateReferralData) {
        const { data } = await api.post('/doctors/docconnect/referrals', referralData);
        return data;
    },

    async getOnlinePeers() {
        const { data } = await api.get('/doctors/docconnect/peers');
        return data;
    },

    async updateStatus(status: 'on' | 'off' | 'busy' | 'away') {
        const { data } = await api.patch('/doctors/docconnect/status', { status });
        return data;
    },

    async searchDirectory(filters: DirectoryFilters) {
        const { data } = await api.get('/doctors/docconnect/directory/search', { params: filters });
        return data;
    }
};
