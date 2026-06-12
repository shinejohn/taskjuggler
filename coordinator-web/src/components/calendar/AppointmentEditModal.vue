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
        <h2 class="text-xl font-bold text-slate-900">Edit Appointment</h2>
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
          <label for="appt-title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            id="appt-title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="appt-start" class="block text-sm font-medium text-slate-700 mb-1">Starts</label>
            <input
              id="appt-start"
              v-model="form.starts_at"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
            />
          </div>
          <div>
            <label for="appt-end" class="block text-sm font-medium text-slate-700 mb-1">Ends</label>
            <input
              id="appt-end"
              v-model="form.ends_at"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
            />
          </div>
        </div>

        <div>
          <label for="appt-status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            id="appt-status"
            v-model="form.status"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          >
            <option value="scheduled">Scheduled</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <div>
          <label for="appt-notes" class="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            id="appt-notes"
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72]"
          />
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
            class="px-5 py-2 bg-[#1B4F72] hover:bg-[#153e5a] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { X } from 'lucide-vue-next';
import { useAppointmentsStore } from '@/stores/appointments';
import type { Appointment } from '@/api/appointments';

const props = defineProps<{
  appointment: Appointment;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const appointmentsStore = useAppointmentsStore();

const saving = ref(false);
const errorMessage = ref('');

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const form = reactive({
  title: props.appointment.title,
  starts_at: toLocalInput(props.appointment.starts_at),
  ends_at: toLocalInput(props.appointment.ends_at),
  status: props.appointment.status,
  notes: props.appointment.notes ?? '',
});

async function save() {
  saving.value = true;
  errorMessage.value = '';
  try {
    await appointmentsStore.updateAppointment(props.appointment.id, {
      title: form.title,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
      status: form.status,
      notes: form.notes || undefined,
    });
    emit('saved');
  } catch (err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    errorMessage.value = axiosErr.response?.data?.message || 'Failed to update appointment';
  } finally {
    saving.value = false;
  }
}
</script>
