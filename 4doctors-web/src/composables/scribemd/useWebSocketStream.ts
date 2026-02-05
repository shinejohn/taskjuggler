import { ref, onUnmounted, watch } from 'vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useDashboardStore, type DashboardItem } from '@/stores/scribemd/dashboardStore';

// Extend Window interface for Pusher
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'pusher'>;
    }
}

// Initialize Pusher and Echo (ensure only done once)
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    if (!window.Echo) {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY || '',
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
            forceTLS: true,
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
            },
        });
    }
}

export interface TranscriptUpdate {
    text: string;
    timestamp: number;
    is_final: boolean;
}

export interface VisitStatus {
    status: string;
    metadata?: Record<string, unknown>;
}

/**
 * Composable for real-time WebSocket communication with the ScribeMD backend.
 * Listens for:
 * - Transcript updates (speech-to-text results)
 * - Dashboard item extractions (AI-detected items)
 * - Visit status changes
 */
export function useWebSocketStream(visitId: string) {
    const store = useDashboardStore();

    const isConnected = ref(false);
    const connectionError = ref<string | null>(null);
    const lastTranscript = ref<TranscriptUpdate | null>(null);

    let channel: ReturnType<Echo<'pusher'>['private']> | null = null;

    /**
     * Connect to the visit's private channel
     */
    function connect() {
        if (!window.Echo || !visitId) {
            connectionError.value = 'Echo not initialized or no visit ID';
            return;
        }

        try {
            channel = window.Echo.private(`scribemd.visit.${visitId}`);

            // Listen for transcript updates (real-time speech-to-text)
            channel.listen('.transcript.updated', (data: TranscriptUpdate) => {
                lastTranscript.value = data;
                if (data.is_final) {
                    // Update the store with finalized transcript
                    store.updateTranscript(
                        store.currentTranscript + ' ' + data.text
                    );
                }
            });

            // Listen for AI-extracted dashboard items
            channel.listen('.item.extracted', (data: { item: DashboardItem }) => {
                // Add the new item to the store
                store.addItem(data.item);
            });

            // Listen for visit status changes
            channel.listen('.visit.status', (data: VisitStatus) => {
                if (data.status === 'review') {
                    store.setStatus('review');
                } else if (data.status === 'approved') {
                    store.setStatus('approved');
                }
            });

            // Track connection state
            channel.subscribed(() => {
                isConnected.value = true;
                connectionError.value = null;
            });

            channel.error((error: Error) => {
                isConnected.value = false;
                connectionError.value = error.message || 'Connection error';
            });

        } catch (err) {
            connectionError.value = err instanceof Error ? err.message : 'Failed to connect';
        }
    }

    /**
     * Disconnect from the channel
     */
    function disconnect() {
        if (channel && window.Echo) {
            window.Echo.leave(`scribemd.visit.${visitId}`);
            channel = null;
            isConnected.value = false;
        }
    }

    // Auto-connect when visitId changes
    watch(() => visitId, (newId) => {
        if (newId) {
            disconnect();
            connect();
        }
    }, { immediate: true });

    // Cleanup on unmount
    onUnmounted(() => {
        disconnect();
    });

    return {
        isConnected,
        connectionError,
        lastTranscript,
        connect,
        disconnect,
    };
}
