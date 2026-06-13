<template>
  <div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
    <!-- Premium Header -->
    <DashboardHeader
      :patient-name="patientFullName || 'Select Patient'"
      :patient-age="patientAge"
      :patient-gender="patientGender"
      :insurance-name="'Aetna PPO'"
      :is-recording="isRecording"
      :is-paused="isPaused"
      :formatted-duration="formatDuration(recordingDuration)"
      @toggle-recording="toggleRecording"
      @pause="isPaused = true"
      @resume="isPaused = false"
    />

    <!-- Live Transcript Bar -->
    <LiveTranscript :transcript="currentTranscript" />

    <!-- Main Dashboard Grid -->
    <main class="max-w-[1600px] mx-auto px-6 py-8">
      <div class="grid grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Clinical Documentation (SOAP-ish) -->
        <div class="col-span-12 lg:col-span-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Subjective / Symptoms -->
            <DashboardSection
              title="Symptoms & Findings"
              category="symptom"
              :items="symptoms"
              icon="symptom"
              color="emerald"
              @add-item="handleAddItem('symptom', $event)"
              @toggle-item="handleToggleItem"
              @delete-item="handleDeleteItem"
            />

            <!-- Objective / Findings -->
            <DashboardSection
              title="Physical Exam"
              category="finding"
              :items="findings"
              icon="finding"
              color="blue"
              @add-item="handleAddItem('finding', $event)"
              @toggle-item="handleToggleItem"
              @delete-item="handleDeleteItem"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Assessment / Diagnoses -->
            <DashboardSection
              title="Assessment"
              category="assessment"
              :items="assessments"
              icon="assessment"
              color="purple"
              @add-item="handleAddItem('assessment', $event)"
              @toggle-item="handleToggleItem"
              @delete-item="handleDeleteItem"
            />

            <!-- Plan -->
            <DashboardSection
              title="Plan & Counseling"
              category="plan"
              :items="plans"
              icon="plan"
              color="rose"
              @add-item="handleAddItem('plan', $event)"
              @toggle-item="handleToggleItem"
              @delete-item="handleDeleteItem"
            />
          </div>

          <!-- Prior Authorizations (Full Width in Left Col) -->
          <DashboardSection
            v-if="priorAuths.length > 0"
            title="Prior Authorizations"
            category="prior_auth"
            :items="priorAuths"
            icon="prior_auth"
            color="amber"
          />
        </div>

        <!-- Right Column: Action Items & Claims -->
        <div class="col-span-12 lg:col-span-4 space-y-8 sticky top-24">
          
          <!-- Prescriptions -->
          <DashboardSection
            title="Prescriptions"
            category="prescription"
            :items="prescriptions"
            icon="prescription"
            color="blue"
            @add-item="handleAddItem('prescription', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />

          <!-- Orders / Labs / Imaging -->
          <DashboardSection
            title="Orders & Referrals"
            category="order"
            :items="orders"
            icon="order"
            color="purple"
            @add-item="handleAddItem('order', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />

          <!-- Live Claim Component -->
          <ClaimPanel v-if="visit?.claim" :claim="visit.claim" />

          <!-- Approve Button -->
          <div class="pt-4">
            <button
              @click="showApprovalModal = true"
              :disabled="!canApprove"
              class="w-full group relative overflow-hidden px-8 py-5 bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/20 text-white font-black text-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative flex items-center justify-center gap-3">
                <CheckCircle2 class="w-6 h-6" />
                <span>APPROVE & SEND ALL</span>
              </div>
            </button>
            <p class="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold">
              Signs Note • Sends Rx • Submits Claim • Queues Referrals
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Success / Approval Modal -->
    <ApprovalModal
      v-if="showApprovalModal"
      :patient-name="patientFullName"
      current-date="Jan 30, 2026"
      :actions="approvalActions"
      :queued-items="queuedItems"
      @close="showApprovalModal = false"
      @confirm="handleConfirmApproval"
    />

    <!-- Global Loading Overlay -->
    <Transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <Zap class="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 class="mt-8 text-xl font-black text-white uppercase tracking-widest">ScribeMD™</h2>
        <p class="text-slate-400 font-medium mt-2">Processing clinical data...</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CheckCircle2, Zap } from 'lucide-vue-next';

// Components
import DashboardHeader from '@/components/scribemd/dashboard/DashboardHeader.vue';
import LiveTranscript from '@/components/scribemd/dashboard/LiveTranscript.vue';
import DashboardSection from '@/components/scribemd/dashboard/sections/DashboardSection.vue';
import ClaimPanel from '@/components/scribemd/dashboard/sections/ClaimPanel.vue';
import ApprovalModal from '@/components/scribemd/dashboard/ApprovalModal.vue';

// Logic / Stores
import { useDashboardStore, type ItemCategory } from '@/stores/scribemd/dashboardStore';
import { useLiveDashboard } from '@/composables/scribemd/useLiveDashboard';
import { useDashboardItems } from '@/composables/scribemd/useDashboardItems';
import { useVisitApproval } from '@/composables/scribemd/useVisitApproval';
import { useWebSocketStream } from '@/composables/scribemd/useWebSocketStream';
import { useAudioCapture } from '@/composables/scribemd/useAudioCapture';

const route = useRoute();
const router = useRouter();
const store = useDashboardStore();

const { 
  visit,
  symptoms,
  findings,
  assessments,
  plans,
  prescriptions,
  orders,
  priorAuths,
  patientFullName,
  isRecording,
  currentTranscript,
  recordingDuration,
  isLoading,
  canApprove
} = storeToRefs(store);

const isPaused = ref(false);
const showApprovalModal = ref(false);

const {
  loadVisit,
  createVisit,
  startRecordingTimer,
  stopRecording: stopTimer,
  formatDuration,
} = useLiveDashboard();

const { addItem, toggleItem, deleteItem } = useDashboardItems();
const { approveVisit } = useVisitApproval();

// Patient computed properties
const patientAge = computed(() => visit.value?.patient?.dob ? '58' : '58'); // Simplified for now
const patientGender = computed(() => 'M');

// Mock data items for approval summary
const approvalActions = computed(() => [
  { label: 'Aspirin 81mg', details: 'Sent to CVS Pharmacy #4521', status: 'COMPLETE' },
  { label: 'Lipid Panel', details: 'Ordered at Quest Diagnostics', status: 'COMPLETE' },
  { label: 'Professional Claim', details: 'Submitted to Availity', status: 'COMPLETE' },
  { label: 'Clinical Note', details: 'Signed and added to chart', status: 'COMPLETE' },
]);

const queuedItems = computed(() => [
  { label: 'Prior Auth (Stress Echo)', details: 'Sent to PA Team queue' },
  { label: 'Follow-up (2 weeks)', details: 'Sent to Front Desk scheduling' },
]);

// Phase 2: Live Streaming
const visitId = computed(() => visit.value?.id || '');
const { connect: connectWS, disconnect: disconnectWS } = useWebSocketStream(visitId.value);
const { toggleRecording: toggleAudio } = useAudioCapture({
  visitId: visitId.value,
  onTranscriptUpdate: (text) => {
    store.updateTranscript(text);
  },
  onError: () => { /* audio errors handled by UI state */ }
});

// Cleanup on unmount
onUnmounted(() => {
  disconnectWS();
});

// Initialize visit
onMounted(async () => {
  const vid = route.params.id as string;
  const patientId = route.query.patient_id as string;

  if (vid) {
    await loadVisit(vid);
    connectWS();
  } else if (patientId) {
    const newVisit = await createVisit(patientId);
    router.replace({ params: { id: newVisit.id } });
    connectWS();
  }
});

// Toggle recording
async function toggleRecording() {
  const newState = await toggleAudio();
  if (newState) {
    startRecordingTimer();
    isPaused.value = false;
  } else {
    stopTimer();
  }
}

// Handlers
const handleAddItem = async (category: string, data: Record<string, unknown>) => {
  await addItem(category as ItemCategory, data);
};

const handleToggleItem = async (itemId: string) => {
  await toggleItem(itemId);
};

const handleDeleteItem = async (itemId: string) => {
  await deleteItem(itemId);
};

const handleConfirmApproval = async () => {
  try {
    await approveVisit();
    showApprovalModal.value = false;
    router.push('/dashboard');
  } catch (err) {
    // approval error — UI stays on current page for retry
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
