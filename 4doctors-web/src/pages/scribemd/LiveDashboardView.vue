<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header -->
    <header class="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/dashboard" class="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5 text-slate-400" />
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
              <Zap class="w-5 h-5 text-emerald-400" />
              ScribeMD Live
            </h1>
            <p class="text-sm text-slate-400">{{ patientFullName || 'Select a patient' }}</p>
          </div>
        </div>

        <!-- Recording Status -->
        <div class="flex items-center gap-4">
          <div v-if="isRecording" class="flex items-center gap-3 px-4 py-2 bg-red-500/20 rounded-full border border-red-400/30">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-red-300 font-medium">{{ formatDuration(recordingDuration) }}</span>
          </div>

          <button
            @click="toggleRecording"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg',
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
            ]"
          >
            <component :is="isRecording ? Square : Mic" class="w-5 h-5" />
            {{ isRecording ? 'Stop' : 'Start Recording' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-12 gap-6">
        <!-- Left: Clinical Panel -->
        <div class="col-span-8 space-y-6">
          <!-- Subjective Section -->
          <DashboardSection
            title="Subjective"
            :items="symptoms"
            category="symptom"
            icon="MessageCircle"
            @add-item="handleAddItem('symptom', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />

          <!-- Objective Section -->
          <DashboardSection
            title="Objective"
            :items="findings"
            category="finding"
            icon="Search"
            @add-item="handleAddItem('finding', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />

          <!-- Assessment Section -->
          <DashboardSection
            title="Assessment"
            :items="diagnosisCodes"
            category="diagnosis_code"
            icon="ClipboardList"
            @add-item="handleAddItem('diagnosis_code', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />

          <!-- Plan Section -->
          <DashboardSection
            title="Plan"
            :items="plans"
            category="plan"
            icon="FileText"
            @add-item="handleAddItem('plan', $event)"
            @toggle-item="handleToggleItem"
            @delete-item="handleDeleteItem"
          />
        </div>

        <!-- Right: Actions Panel -->
        <div class="col-span-4 space-y-6">
          <!-- Prescriptions -->
          <ActionPanel
            title="Prescriptions"
            :items="prescriptions"
            icon="Pill"
            color="blue"
            empty-text="No prescriptions yet"
            @toggle-item="handleToggleItem"
          />

          <!-- Orders -->
          <ActionPanel
            title="Orders"
            :items="orders"
            icon="FlaskConical"
            color="purple"
            empty-text="No orders yet"
            @toggle-item="handleToggleItem"
          />

          <!-- Prior Auths -->
          <ActionPanel
            title="Prior Authorizations"
            :items="priorAuths"
            icon="Shield"
            color="amber"
            empty-text="No prior auths needed"
            @toggle-item="handleToggleItem"
          />

          <!-- Claim Summary -->
          <ClaimPanel v-if="visit?.claim" :claim="visit.claim" />

          <!-- Approve Button -->
          <button
            v-if="canApprove"
            @click="showApprovalModal = true"
            class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle class="w-5 h-5" />
            Approve & Route ({{ acceptedItemsCount }} items)
          </button>
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <ApprovalModal
      v-if="showApprovalModal"
      @close="showApprovalModal = false"
      @approve="handleApprove"
    />

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="flex flex-col items-center gap-4">
        <Loader2 class="w-12 h-12 text-emerald-400 animate-spin" />
        <p class="text-white font-medium">Processing...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { 
  ArrowLeft, 
  Zap, 
  Mic, 
  Square, 
  CheckCircle,
  Loader2 
} from 'lucide-vue-next';
import { useDashboardStore } from '@/stores/scribemd/dashboardStore';
import { useLiveDashboard } from '@/composables/scribemd/useLiveDashboard';
import { useDashboardItems } from '@/composables/scribemd/useDashboardItems';
import { useVisitApproval } from '@/composables/scribemd/useVisitApproval';
import { useWebSocketStream } from '@/composables/scribemd/useWebSocketStream';
import { useAudioCapture } from '@/composables/scribemd/useAudioCapture';
import DashboardSection from './components/DashboardSection.vue';
import ActionPanel from './components/ActionPanel.vue';
import ClaimPanel from './components/ClaimPanel.vue';
import ApprovalModal from './components/ApprovalModal.vue';

const route = useRoute();
const router = useRouter();
const store = useDashboardStore();

const { 
  visit,
  symptoms,
  findings,
  diagnosisCodes,
  plans,
  prescriptions,
  orders,
  priorAuths,
  patientFullName,
  isRecording,
  recordingDuration,
  isLoading,
  acceptedItemsCount,
  canApprove
} = storeToRefs(store);

const {
  loadVisit,
  createVisit,
  startRecordingTimer,
  stopRecording: stopTimer,
  formatDuration,
} = useLiveDashboard();

const { addItem, toggleItem, deleteItem } = useDashboardItems();
const { approveVisit } = useVisitApproval();

// Phase 2: Live Streaming
const visitId = computed(() => visit.value?.id || '');
const { connect: connectWS, disconnect: disconnectWS } = useWebSocketStream(visitId.value);
const { toggleRecording: toggleAudio, stopRecording: _stopAudio } = useAudioCapture({
  visitId: visitId.value,
  onTranscriptUpdate: (_text, _isFinal) => {
    // Transcript is handled by WebSocket for real-time display, 
    // but we can also handle local feedback here if needed
  },
  onError: (err) => console.error('Audio capture error:', err)
});

const showApprovalModal = ref(false);

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
  } else {
    stopTimer();
  }
}

// Add item handler
async function handleAddItem(category: string, data: Record<string, unknown>) {
  try {
    await addItem(category as 'symptom' | 'finding' | 'diagnosis_code' | 'plan', data);
  } catch (err) {
    console.error('Failed to add item:', err);
  }
}

// Toggle item handler
async function handleToggleItem(itemId: string) {
  try {
    await toggleItem(itemId);
  } catch (err) {
    console.error('Failed to toggle item:', err);
  }
}

// Delete item handler
async function handleDeleteItem(itemId: string) {
  try {
    await deleteItem(itemId);
  } catch (err) {
    console.error('Failed to delete item:', err);
  }
}

// Approval handler
async function handleApprove(_options: Record<string, boolean>) {
  try {
    await approveVisit();
    showApprovalModal.value = false;
    router.push('/dashboard');
  } catch (err) {
    console.error('Failed to approve visit:', err);
  }
}
</script>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
