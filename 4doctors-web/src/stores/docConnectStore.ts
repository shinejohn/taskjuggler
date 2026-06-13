import { defineStore } from 'pinia';
import { docConnectService, type Post, type Peer, type CreateReferralData } from '@/services/docConnect';

interface Referral {
    id: string;
    patient_id: string;
    provider_id: string;
    reason?: string;
    status: string;
    created_at: string;
}

export const useDocConnectStore = defineStore('docConnect', {
    state: () => ({
        feed: [] as Post[],
        referrals: [] as Referral[],
        onlinePeers: [] as Peer[],
        isLoading: false,
        currentStatus: 'off' as 'on' | 'off' | 'busy' | 'away',
    }),

    getters: {
        availablePeers: (state) => state.onlinePeers.filter(p => p.online_status?.status === 'on'),
    },

    actions: {
        async loadFeed(params = {}) {
            this.isLoading = true;
            try {
                const response = await docConnectService.getFeed(params);
                this.feed = response.data;
            } finally {
                this.isLoading = false;
            }
        },

        async loadOnlinePeers() {
            try {
                this.onlinePeers = await docConnectService.getOnlinePeers();
            } catch (error) {
                // silently fail — peers sidebar is non-critical
            }
        },

        async createPost(content: string, visibility = 'public') {
            try {
                const newPost = await docConnectService.createPost({ content, visibility });
                this.feed.unshift(newPost);
                return newPost;
            } catch (error) {
                throw error;
            }
        },

        async sendReferral(referralData: CreateReferralData) {
            try {
                const referral = await docConnectService.createReferral(referralData);
                this.referrals.push(referral);
                return referral;
            } catch (error) {
                throw error;
            }
        },

        async changeStatus(status: 'on' | 'off' | 'busy' | 'away') {
            try {
                await docConnectService.updateStatus(status);
                this.currentStatus = status;
            } catch (error) {
                // silently fail — status update is non-critical
            }
        },

        async searchDirectory(filters: Record<string, string>) {
            try {
                const response = await docConnectService.searchDirectory(filters);
                return response;
            } catch (error) {
                throw error;
            }
        }
    }
});
