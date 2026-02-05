import { defineStore } from 'pinia';
import { portalService, type PatientNotification, type VisitItem } from '@/services/portalService';

export const usePortalStore = defineStore('portal', {
    state: () => ({
        patient: null as any,
        notifications: [] as PatientNotification[],
        visitItems: [] as VisitItem[],
        appointments: [] as any[],
        labs: [] as VisitItem[],
        priorAuths: [] as VisitItem[],
        messages: [] as any[],
        isLoading: false,
        portalStatus: 'inactive',
        chatHistory: [] as { role: 'user' | 'bot', text: string, actions?: any[] }[],
    }),

    getters: {
        unreadNotificationsCount: (state) => state.notifications.filter(n => !n.is_read).length,
    },

    actions: {
        async loadDashboard() {
            this.isLoading = true;
            try {
                const data = await portalService.getDashboard();
                this.patient = data.patient;
                this.notifications = data.recent_notifications;
                this.visitItems = data.recent_visit_items;
                this.portalStatus = data.status;
            } catch (error) {
                console.error('Failed to load portal dashboard', error);
            } finally {
                this.isLoading = false;
            }
        },

        async markAsRead(notificationId: string) {
            try {
                await portalService.markNotificationRead(notificationId);
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.is_read = true;
                }
            } catch (error) {
                console.error('Failed to mark notification as read', error);
            }
        },

        async sendMessage(text: string) {
            this.chatHistory.push({ role: 'user', text });
            try {
                const response = await portalService.chat(text);
                this.chatHistory.push({
                    role: 'bot',
                    text: response.reply,
                    actions: response.suggested_actions
                });
            } catch (error) {
                this.chatHistory.push({
                    role: 'bot',
                    text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
                });
            }
        },

        async loadAppointments() {
            this.isLoading = true;
            try {
                this.appointments = await portalService.getAppointments();
            } catch (error) {
                console.error('Failed to load appointments', error);
            } finally {
                this.isLoading = false;
            }
        },

        async loadLabs() {
            this.isLoading = true;
            try {
                this.labs = await portalService.getLabs();
            } catch (error) {
                console.error('Failed to load labs', error);
            } finally {
                this.isLoading = false;
            }
        },

        async loadPriorAuths() {
            this.isLoading = true;
            try {
                this.priorAuths = await portalService.getPriorAuths();
            } catch (error) {
                console.error('Failed to load prior auths', error);
            } finally {
                this.isLoading = false;
            }
        },

        async loadMessages() {
            this.isLoading = true;
            try {
                this.messages = await portalService.getMessages();
            } catch (error) {
                console.error('Failed to load messages', error);
            } finally {
                this.isLoading = false;
            }
        },

        async sendDirectMessage(recipient_id: string, content: string) {
            try {
                const newMessage = await portalService.sendMessage(recipient_id, content);
                this.messages.unshift(newMessage);
            } catch (error) {
                console.error('Failed to send direct message', error);
            }
        }
    }
});
