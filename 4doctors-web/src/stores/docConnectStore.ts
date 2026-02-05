import { defineStore } from 'pinia';
import { docConnectService, type Post, type Peer } from '@/services/docConnect';

export const useDocConnectStore = defineStore('docConnect', {
    state: () => ({
        feed: [] as Post[],
        referrals: [] as any[],
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
                console.error('Failed to load online peers', error);
            }
        },

        async createPost(content: string, visibility = 'public', attachments: any[] = []) {
            try {
                const newPost = await docConnectService.createPost({ content, visibility, attachments });
                this.feed.unshift(newPost);
                return newPost;
            } catch (error) {
                console.error('Failed to create post', error);
                throw error;
            }
        },

        async sendReferral(referralData: any) {
            try {
                const referral = await docConnectService.createReferral(referralData);
                this.referrals.push(referral);
                return referral;
            } catch (error) {
                console.error('Failed to send referral', error);
                throw error;
            }
        },

        async changeStatus(status: 'on' | 'off' | 'busy' | 'away') {
            try {
                await docConnectService.updateStatus(status);
                this.currentStatus = status;
            } catch (error) {
                console.error('Failed to update status', error);
            }
        },

        async searchDirectory(filters: any) {
            try {
                const response = await docConnectService.searchDirectory(filters);
                return response;
            } catch (error) {
                console.error('Failed to search directory', error);
                throw error;
            }
        }
    }
});
