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
      <div class="flex justify-between items-center p-6 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-900">
          {{ campaign ? 'Edit Campaign' : 'Create Campaign' }}
        </h2>
        <button
          type="button"
          aria-label="Close"
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="save" class="p-6 space-y-4">
        <div>
          <label for="campaign-name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            id="campaign-name"
            v-model="form.name"
            type="text"
            required
            maxlength="255"
            placeholder="e.g. October Appointment Reminders"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          />
        </div>

        <div>
          <label for="campaign-type" class="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            id="campaign-type"
            v-model="form.type"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          >
            <option value="Appointment Reminders">Appointment Reminders</option>
            <option value="Follow-up Calls">Follow-up Calls</option>
            <option value="Outreach">Outreach</option>
            <option value="Reactivation">Reactivation</option>
          </select>
        </div>

        <div>
          <label for="campaign-description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            id="campaign-description"
            v-model="form.description"
            rows="3"
            placeholder="What should this campaign accomplish?"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          />
        </div>

        <div>
          <label for="campaign-coordinator" class="block text-sm font-medium text-slate-700 mb-1">AI Coordinator</label>
          <select
            id="campaign-coordinator"
            v-model="form.coordinator_id"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          >
            <option value="">Unassigned</option>
            <option v-for="coord in coordinatorsStore.coordinators" :key="coord.id" :value="coord.id">
              {{ coord.display_name || coord.role_template?.name || 'AI Coordinator' }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="campaign-target-count" class="block text-sm font-medium text-slate-700 mb-1">Target Contacts</label>
            <input
              id="campaign-target-count"
              v-model.number="form.target_count"
              type="number"
              min="1"
              placeholder="100"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
            />
          </div>
          <div>
            <label for="campaign-start" class="block text-sm font-medium text-slate-700 mb-1">Scheduled Start</label>
            <input
              id="campaign-start"
              v-model="form.scheduled_start_at"
              type="datetime-local"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {{ saving ? 'Saving...' : campaign ? 'Save Changes' : 'Create Campaign' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import { useCampaignsStore } from '@/stores/campaigns';
import { useCoordinatorsStore } from '@/stores/coordinators';
import type { Campaign } from '@/api/campaigns';

const props = defineProps<{
  campaign?: Campaign | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [campaign: Campaign];
}>();

const campaignsStore = useCampaignsStore();
const coordinatorsStore = useCoordinatorsStore();

const saving = ref(false);
const errorMessage = ref('');

interface CampaignForm {
  name: string;
  type: string;
  description: string;
  coordinator_id: string;
  target_count: number | null;
  scheduled_start_at: string;
}

function toLocalInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const form = reactive<CampaignForm>({
  name: props.campaign?.name ?? '',
  type: props.campaign?.type ?? 'Appointment Reminders',
  description: props.campaign?.description ?? '',
  coordinator_id: props.campaign?.coordinator_id ?? '',
  target_count: props.campaign?.target_count ?? null,
  scheduled_start_at: toLocalInput(props.campaign?.scheduled_start_at),
});

async function save() {
  saving.value = true;
  errorMessage.value = '';
  const payload: Partial<Campaign> = {
    name: form.name,
    type: form.type,
    description: form.description || undefined,
    coordinator_id: form.coordinator_id || undefined,
    target_count: form.target_count || undefined,
    scheduled_start_at: form.scheduled_start_at
      ? new Date(form.scheduled_start_at).toISOString()
      : undefined,
  };
  try {
    const result = props.campaign
      ? await campaignsStore.updateCampaign(props.campaign.id, payload)
      : await campaignsStore.createCampaign(payload);
    if (result) {
      emit('saved', result);
    }
  } catch (err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    errorMessage.value = axiosErr.response?.data?.message || 'Failed to save campaign';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  if (coordinatorsStore.coordinators.length === 0) {
    coordinatorsStore.fetchCoordinators().catch(() => {
      // Coordinator list is optional for the form; selection stays empty
    });
  }
});
</script>
