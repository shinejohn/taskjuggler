<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 z-50 transition-opacity"
    @click="$emit('close')"
  />

  <!-- Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-start p-6 border-b border-slate-100">
        <div>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-2',
              getCampaignStatusClass(campaign.status)
            ]"
          >
            {{ campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) }}
          </span>
          <h2 class="text-2xl font-bold text-slate-900">{{ campaign.name }}</h2>
          <p class="text-sm text-slate-500">{{ campaign.type }}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <p v-if="campaign.description" class="text-slate-600">{{ campaign.description }}</p>

        <div class="space-y-2 text-sm text-slate-600">
          <div v-if="campaign.coordinator" class="flex justify-between">
            <span>AI Coordinator</span>
            <span class="font-medium text-slate-900">{{ campaign.coordinator.display_name }}</span>
          </div>
          <div v-if="campaign.scheduled_start_at" class="flex justify-between">
            <span>Scheduled Start</span>
            <span class="font-medium text-slate-900">{{ new Date(campaign.scheduled_start_at).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between">
            <span>Target Contacts</span>
            <span class="font-medium text-slate-900">{{ campaign.target_count || 0 }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <div class="text-lg font-bold text-slate-900">{{ campaign.contacts_contacted || 0 }}</div>
            <div class="text-xs text-slate-500">Contacted</div>
          </div>
          <div>
            <div class="text-lg font-bold text-slate-900">{{ campaign.contacts_answered || 0 }}</div>
            <div class="text-xs text-slate-500">Answered</div>
          </div>
          <div>
            <div class="text-lg font-bold text-green-600">{{ campaign.appointments_booked || 0 }}</div>
            <div class="text-xs text-slate-500">Booked</div>
          </div>
          <div>
            <div class="text-lg font-bold text-slate-900">{{ campaign.answer_rate || 0 }}%</div>
            <div class="text-xs text-slate-500">Answer Rate</div>
          </div>
          <div>
            <div class="text-lg font-bold text-green-600">{{ campaign.confirmation_rate || 0 }}%</div>
            <div class="text-xs text-slate-500">Confirmed</div>
          </div>
          <div>
            <div class="text-lg font-bold text-amber-600">{{ campaign.appointments_rescheduled || 0 }}</div>
            <div class="text-xs text-slate-500">Rescheduled</div>
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-slate-100">
          <button
            v-if="['draft', 'scheduled', 'paused'].includes(campaign.status)"
            type="button"
            :disabled="busy"
            @click="start"
            class="flex-1 py-2 px-3 bg-[#1B4F72] hover:bg-[#153e5a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Play :size="16" />
            Start
          </button>
          <button
            v-if="campaign.status === 'running'"
            type="button"
            :disabled="busy"
            @click="pause"
            class="flex-1 py-2 px-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Pause :size="16" />
            Pause
          </button>
          <button
            v-if="campaign.status === 'draft'"
            type="button"
            @click="$emit('edit', campaign)"
            class="flex-1 py-2 px-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit :size="16" />
            Edit
          </button>
          <button
            v-if="['draft', 'scheduled', 'completed', 'cancelled'].includes(campaign.status)"
            type="button"
            :disabled="busy"
            @click="remove"
            class="py-2 px-3 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 :size="16" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Play, Pause, Edit, Trash2 } from 'lucide-vue-next';
import { useCampaignsStore } from '@/stores/campaigns';
import type { Campaign } from '@/api/campaigns';
import { getCampaignStatusClass } from '@/utils/status';

const props = defineProps<{
  campaign: Campaign;
}>();

const emit = defineEmits<{
  close: [];
  edit: [campaign: Campaign];
}>();

const campaignsStore = useCampaignsStore();
const busy = ref(false);
const errorMessage = ref('');

async function run(action: () => Promise<unknown>) {
  busy.value = true;
  errorMessage.value = '';
  try {
    await action();
  } catch (err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    errorMessage.value = axiosErr.response?.data?.message || 'Action failed';
  } finally {
    busy.value = false;
  }
}

function start() {
  run(() => campaignsStore.startCampaign(props.campaign.id));
}

function pause() {
  run(() => campaignsStore.pauseCampaign(props.campaign.id));
}

function remove() {
  if (!window.confirm(`Delete campaign "${props.campaign.name}"?`)) return;
  run(async () => {
    await campaignsStore.deleteCampaign(props.campaign.id);
    emit('close');
  });
}
</script>
