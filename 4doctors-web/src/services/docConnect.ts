import axios from 'axios';

const API_BASE = '/api/doctors/docconnect';

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
    attachments: any[];
    comments: any[];
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

export const docConnectService = {
    async getFeed(params = {}) {
        const { data } = await axios.get(`${API_BASE}/feed`, { params });
        return data;
    },

    async createPost(postData: any) {
        const { data } = await axios.post(`${API_BASE}/posts`, postData);
        return data;
    },

    async createReferral(referralData: any) {
        const { data } = await axios.post(`${API_BASE}/referrals`, referralData);
        return data;
    },

    async getOnlinePeers() {
        const { data } = await axios.get(`${API_BASE}/peers`);
        return data;
    },

    async updateStatus(status: 'on' | 'off' | 'busy' | 'away') {
        const { data } = await axios.patch(`${API_BASE}/status`, { status });
        return data;
    },

    async searchDirectory(filters: any) {
        const { data } = await axios.get(`${API_BASE}/directory/search`, { params: filters });
        return data;
    }
};
