import { ref, computed } from 'vue';
import { useDashboardStore } from '@/stores/scribemd/dashboardStore';
import { scribeService } from '@/services/scribe';

export interface ApprovalOptions {
    sign_note: boolean;
    send_prescriptions: boolean;
    send_orders: boolean;
    queue_prior_auths: boolean;
    submit_claim: boolean;
    schedule_follow_ups: boolean;
    send_instructions: boolean;
}

export interface RoutingResult {
    prescriptions: Array<{ item_id: string; drug: string; status: string; destination: string }>;
    orders: Array<{ item_id: string; order: string; type: string; status: string }>;
    prior_auths: Array<{ item_id: string; procedure: string; status: string; destination: string }>;
    claim: { status: string; clearinghouse: string; tracking_id: string } | null;
    note: { status: string; signed_by: string; signed_at: string } | null;
    follow_ups: Array<{ item_id: string; timeframe: string; status: string; destination: string }>;
    instructions: Array<{ item_id: string; status: string; destination: string }>;
}

/**
 * Composable for managing the visit approval workflow
 */
export function useVisitApproval() {
    const store = useDashboardStore();

    const isApproving = ref(false);
    const approvalResult = ref<RoutingResult | null>(null);
    const approvalError = ref<string | null>(null);

    // Default options
    const options = ref<ApprovalOptions>({
        sign_note: true,
        send_prescriptions: true,
        send_orders: true,
        queue_prior_auths: true,
        submit_claim: false, // Usually reviewed first
        schedule_follow_ups: true,
        send_instructions: true,
    });

    // Summary of what will be routed
    const routingSummary = computed(() => {
        const summary: Record<string, number> = {};

        if (store.prescriptions.filter(i => i.is_accepted).length > 0 && options.value.send_prescriptions) {
            summary.prescriptions = store.prescriptions.filter(i => i.is_accepted).length;
        }
        if (store.orders.filter(i => i.is_accepted).length > 0 && options.value.send_orders) {
            summary.orders = store.orders.filter(i => i.is_accepted).length;
        }
        if (store.priorAuths.filter(i => i.is_accepted).length > 0 && options.value.queue_prior_auths) {
            summary.prior_auths = store.priorAuths.filter(i => i.is_accepted).length;
        }
        if (store.followUps.filter(i => i.is_accepted).length > 0 && options.value.schedule_follow_ups) {
            summary.follow_ups = store.followUps.filter(i => i.is_accepted).length;
        }
        if (store.instructions.filter(i => i.is_accepted).length > 0 && options.value.send_instructions) {
            summary.instructions = store.instructions.filter(i => i.is_accepted).length;
        }
        if (options.value.sign_note) {
            summary.note = 1;
        }
        if (options.value.submit_claim && store.visit?.claim) {
            summary.claim = 1;
        }

        return summary;
    });

    // Can approve check
    const canApprove = computed(() => {
        return store.visit?.status === 'review' &&
            store.acceptedItemsCount > 0 &&
            !isApproving.value;
    });

    // Approve visit
    async function approveVisit(): Promise<RoutingResult> {
        if (!store.visit?.id) {
            throw new Error('No active visit');
        }

        isApproving.value = true;
        approvalError.value = null;

        try {
            const result = await scribeService.approveVisit(store.visit.id, options.value);
            approvalResult.value = result.routing_results;
            store.setStatus('approved');
            return result.routing_results;
        } catch (err) {
            approvalError.value = err instanceof Error ? err.message : 'Failed to approve visit';
            throw err;
        } finally {
            isApproving.value = false;
        }
    }

    // Update single option
    function setOption<K extends keyof ApprovalOptions>(key: K, value: boolean) {
        options.value[key] = value;
    }

    // Reset all options to defaults
    function resetOptions() {
        options.value = {
            sign_note: true,
            send_prescriptions: true,
            send_orders: true,
            queue_prior_auths: true,
            submit_claim: false,
            schedule_follow_ups: true,
            send_instructions: true,
        };
    }

    return {
        options,
        isApproving,
        approvalResult,
        approvalError,
        routingSummary,
        canApprove,
        approveVisit,
        setOption,
        resetOptions,
    };
}
