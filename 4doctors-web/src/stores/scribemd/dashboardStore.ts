import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Types for ScribeMD Live Dashboard
 */
export interface DashboardItem {
    id: string;
    visit_id: string;
    category: string;
    item_data: Record<string, unknown>;
    source: 'ai' | 'manual';
    source_text?: string;
    ai_confidence?: number;
    is_accepted: boolean;
    is_modified: boolean;
    execution_status?: string;
    executed_at?: string;
    routed_to?: string;
    display_order: number;
}

export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob?: string;
}

export interface Provider {
    id: string;
    name: string;
    specialty?: string;
}

export interface Claim {
    id: string;
    visit_id: string;
    diagnoses: Array<{ code: string; description: string; is_primary?: boolean }>;
    procedures: Array<{ code: string; description: string; units?: number; modifiers?: string[] }>;
    primary_diagnosis?: string;
    em_level?: number;
    em_method?: 'mdm' | 'time';
    estimated_reimbursement?: number;
    denial_risk_score?: number;
    validation_flags: string[];
    documentation_complete: boolean;
}

export interface Note {
    id: string;
    visit_id: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan_text?: string;
    full_note?: string;
    is_signed: boolean;
    signed_at?: string;
}

export interface Visit {
    id: string;
    status: 'in_progress' | 'review' | 'approved' | 'sent';
    recording_started_at?: string;
    recording_ended_at?: string;
    duration_seconds?: number;
    approved_at?: string;
    full_transcript?: string;
    patient: Patient | null;
    provider: Provider | null;
    items: Record<string, DashboardItem[]>;
    claim: Claim | null;
    note: Note | null;
    created_at: string;
    updated_at: string;
}

export type ItemCategory =
    | 'symptom'
    | 'finding'
    | 'assessment'
    | 'plan'
    | 'prescription'
    | 'order'
    | 'prior_auth'
    | 'diagnosis_code'
    | 'procedure_code'
    | 'follow_up'
    | 'instruction';

/**
 * ScribeMD Dashboard Store
 * Central state management for the live visit dashboard
 */
export const useDashboardStore = defineStore('scribemd-dashboard', () => {
    // State
    const visit = ref<Visit | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const isRecording = ref(false);
    const currentTranscript = ref('');
    const recordingDuration = ref(0);

    // Getters
    const symptoms = computed(() => visit.value?.items?.symptom ?? []);
    const findings = computed(() => visit.value?.items?.finding ?? []);
    const assessments = computed(() => visit.value?.items?.assessment ?? []);
    const plans = computed(() => visit.value?.items?.plan ?? []);
    const prescriptions = computed(() => visit.value?.items?.prescription ?? []);
    const orders = computed(() => visit.value?.items?.order ?? []);
    const priorAuths = computed(() => visit.value?.items?.prior_auth ?? []);
    const diagnosisCodes = computed(() => visit.value?.items?.diagnosis_code ?? []);
    const procedureCodes = computed(() => visit.value?.items?.procedure_code ?? []);
    const followUps = computed(() => visit.value?.items?.follow_up ?? []);
    const instructions = computed(() => visit.value?.items?.instruction ?? []);

    const acceptedItemsCount = computed(() => {
        if (!visit.value?.items) return 0;
        return Object.values(visit.value.items)
            .flat()
            .filter(item => item.is_accepted).length;
    });

    const totalItemsCount = computed(() => {
        if (!visit.value?.items) return 0;
        return Object.values(visit.value.items).flat().length;
    });

    const patientFullName = computed(() => {
        if (!visit.value?.patient) return '';
        return `${visit.value.patient.first_name} ${visit.value.patient.last_name}`;
    });

    const canApprove = computed(() => {
        return visit.value?.status === 'review' && acceptedItemsCount.value > 0;
    });

    // Actions
    function setVisit(data: Visit) {
        visit.value = data;
        isRecording.value = data.status === 'in_progress' && !data.recording_ended_at;
        if (data.duration_seconds) {
            recordingDuration.value = data.duration_seconds;
        }
    }

    function clearVisit() {
        visit.value = null;
        isRecording.value = false;
        currentTranscript.value = '';
        recordingDuration.value = 0;
        error.value = null;
    }

    function setLoading(loading: boolean) {
        isLoading.value = loading;
    }

    function setError(err: string | null) {
        error.value = err;
    }

    function addItem(item: DashboardItem) {
        if (!visit.value) return;
        const category = item.category;
        if (!visit.value.items[category]) {
            visit.value.items[category] = [];
        }
        visit.value.items[category].push(item);
    }

    function updateItem(itemId: string, updates: Partial<DashboardItem>) {
        if (!visit.value?.items) return;
        for (const category of Object.keys(visit.value.items)) {
            const categoryItems = visit.value.items[category];
            if (!categoryItems) continue;
            const index = categoryItems.findIndex(i => i.id === itemId);
            if (index !== -1) {
                const existingItem = categoryItems[index];
                categoryItems[index] = {
                    ...existingItem,
                    ...updates,
                } as DashboardItem;
                break;
            }
        }
    }

    function removeItem(itemId: string) {
        if (!visit.value?.items) return;
        for (const category of Object.keys(visit.value.items)) {
            const categoryItems = visit.value.items[category];
            if (!categoryItems) continue;
            const index = categoryItems.findIndex(i => i.id === itemId);
            if (index !== -1) {
                categoryItems.splice(index, 1);
                break;
            }
        }
    }

    function toggleItemAcceptance(itemId: string) {
        if (!visit.value?.items) return;
        for (const category of Object.keys(visit.value.items)) {
            const categoryItems = visit.value.items[category];
            if (!categoryItems) continue;
            const item = categoryItems.find(i => i.id === itemId);
            if (item) {
                item.is_accepted = !item.is_accepted;
                break;
            }
        }
    }

    function updateClaim(updates: Partial<Claim>) {
        if (!visit.value?.claim) return;
        visit.value.claim = { ...visit.value.claim, ...updates };
    }

    function updateNote(updates: Partial<Note>) {
        if (!visit.value?.note) return;
        visit.value.note = { ...visit.value.note, ...updates };
    }

    function setStatus(status: Visit['status']) {
        if (!visit.value) return;
        visit.value.status = status;
    }

    function startRecording() {
        isRecording.value = true;
        recordingDuration.value = 0;
    }

    function stopRecording() {
        isRecording.value = false;
    }

    function updateTranscript(text: string) {
        currentTranscript.value = text;
    }

    function incrementDuration() {
        recordingDuration.value++;
    }

    return {
        // State
        visit,
        isLoading,
        error,
        isRecording,
        currentTranscript,
        recordingDuration,

        // Getters
        symptoms,
        findings,
        assessments,
        plans,
        prescriptions,
        orders,
        priorAuths,
        diagnosisCodes,
        procedureCodes,
        followUps,
        instructions,
        acceptedItemsCount,
        totalItemsCount,
        patientFullName,
        canApprove,

        // Actions
        setVisit,
        clearVisit,
        setLoading,
        setError,
        addItem,
        updateItem,
        removeItem,
        toggleItemAcceptance,
        updateClaim,
        updateNote,
        setStatus,
        startRecording,
        stopRecording,
        updateTranscript,
        incrementDuration,
    };
});
