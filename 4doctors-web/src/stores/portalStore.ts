import { defineStore } from 'pinia';
import { portalService, type PatientNotification, type VisitItem } from '@/services/portalService';

interface PortalPatient {
    id: string;
    first_name: string;
    last_name: string;
    dob?: string;
    email?: string;
    phone?: string;
}

interface PortalAppointment {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    type?: { name: string };
    provider?: { user?: { name: string } };
    provider_name?: string;
    reason?: string;
    status: string;
}

interface PortalMessage {
    id: string;
    sender_id: string;
    sender_name: string;
    content: string;
    created_at: string;
    is_from_patient: boolean;
}

interface ChatAction {
    label: string;
    action: string;
}

export const usePortalStore = defineStore('portal', {
    state: () => ({
        patient: null as PortalPatient | null,
        notifications: [] as PatientNotification[],
        visitItems: [] as VisitItem[],
        appointments: [] as PortalAppointment[],
        labs: [] as VisitItem[],
        priorAuths: [] as VisitItem[],
        messages: [] as PortalMessage[],
        isLoading: false,
        portalStatus: 'inactive',
        chatHistory: [] as { role: 'user' | 'bot'; text: string; actions?: ChatAction[] }[],
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
                // handled by isLoading state in UI
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
                // silently fail — non-critical
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
                // handled by isLoading state in UI
            } finally {
                this.isLoading = false;
            }
        },

        async loadLabs() {
            this.isLoading = true;
            try {
                this.labs = await portalService.getLabs();
            } catch (error) {
                // handled by isLoading state in UI
            } finally {
                this.isLoading = false;
            }
        },

        async loadPriorAuths() {
            this.isLoading = true;
            try {
                this.priorAuths = await portalService.getPriorAuths();
            } catch (error) {
                // handled by isLoading state in UI
            } finally {
                this.isLoading = false;
            }
        },

        async loadMessages() {
            this.isLoading = true;
            try {
                this.messages = await portalService.getMessages();
            } catch (error) {
                // handled by isLoading state in UI
            } finally {
                this.isLoading = false;
            }
        },

        async sendDirectMessage(recipient_id: string, content: string) {
            try {
                const newMessage = await portalService.sendMessage(recipient_id, content);
                this.messages.unshift(newMessage);
            } catch (error) {
                // silently fail — caller should handle
            }
        }
    }
});
