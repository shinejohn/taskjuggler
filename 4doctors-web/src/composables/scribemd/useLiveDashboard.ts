import { ref, onMounted, onUnmounted } from 'vue';
import { useDashboardStore, type Visit } from '@/stores/scribemd/dashboardStore';
import { scribeService } from '@/services/scribe';

/**
 * Main composable for managing the ScribeMD Live Dashboard
 * Handles visit lifecycle, API calls, and state synchronization
 */
export function useLiveDashboard(visitId?: string) {
    const store = useDashboardStore();
    const recordingTimer = ref<ReturnType<typeof setInterval> | null>(null);

    // Load visit data
    async function loadVisit(id: string) {
        store.setLoading(true);
        store.setError(null);
        try {
            const visit = await scribeService.getVisit(id);
            store.setVisit(visit);
        } catch (err) {
            store.setError(err instanceof Error ? err.message : 'Failed to load visit');
            throw err;
        } finally {
            store.setLoading(false);
        }
    }

    // Create new visit
    async function createVisit(patientId: string, appointmentId?: string): Promise<Visit> {
        store.setLoading(true);
        store.setError(null);
        try {
            const visit = await scribeService.createVisit(patientId, appointmentId);
            store.setVisit(visit);
            return visit;
        } catch (err) {
            store.setError(err instanceof Error ? err.message : 'Failed to create visit');
            throw err;
        } finally {
            store.setLoading(false);
        }
    }

    // Start recording timer
    function startRecordingTimer() {
        store.startRecording();
        recordingTimer.value = setInterval(() => {
            store.incrementDuration();
        }, 1000);
    }

    // Stop recording
    async function stopRecording() {
        if (recordingTimer.value) {
            clearInterval(recordingTimer.value);
            recordingTimer.value = null;
        }
        store.stopRecording();

        if (store.visit?.id) {
            try {
                const visit = await scribeService.stopVisitRecording(store.visit.id);
                store.setVisit(visit);
            } catch (err) {
                store.setError(err instanceof Error ? err.message : 'Failed to stop recording');
            }
        }
    }

    // Approve and route
    async function approveVisit(options: {
        sign_note?: boolean;
        send_prescriptions?: boolean;
        send_orders?: boolean;
        queue_prior_auths?: boolean;
        submit_claim?: boolean;
        schedule_follow_ups?: boolean;
        send_instructions?: boolean;
    } = {}) {
        if (!store.visit?.id) return;

        store.setLoading(true);
        try {
            const result = await scribeService.approveVisit(store.visit.id, options);
            store.setStatus('approved');
            return result;
        } catch (err) {
            store.setError(err instanceof Error ? err.message : 'Failed to approve visit');
            throw err;
        } finally {
            store.setLoading(false);
        }
    }

    // Format recording duration
    function formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Lifecycle
    onMounted(() => {
        if (visitId) {
            loadVisit(visitId);
        }
    });

    onUnmounted(() => {
        if (recordingTimer.value) {
            clearInterval(recordingTimer.value);
        }
        store.clearVisit();
    });

    return {
        // Store refs (reactive)
        visit: store.visit,
        isLoading: store.isLoading,
        error: store.error,
        isRecording: store.isRecording,
        recordingDuration: store.recordingDuration,
        currentTranscript: store.currentTranscript,

        // Computed
        patientFullName: store.patientFullName,
        canApprove: store.canApprove,
        acceptedItemsCount: store.acceptedItemsCount,
        totalItemsCount: store.totalItemsCount,

        // Category getters
        symptoms: store.symptoms,
        findings: store.findings,
        assessments: store.assessments,
        plans: store.plans,
        prescriptions: store.prescriptions,
        orders: store.orders,
        priorAuths: store.priorAuths,
        diagnosisCodes: store.diagnosisCodes,
        procedureCodes: store.procedureCodes,
        followUps: store.followUps,
        instructions: store.instructions,

        // Actions
        loadVisit,
        createVisit,
        startRecordingTimer,
        stopRecording,
        approveVisit,
        formatDuration,
    };
}
