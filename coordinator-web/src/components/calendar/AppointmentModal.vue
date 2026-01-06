<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-50 transition-opacity"
    @click="$emit('close')"
  />

  <!-- Modal -->
  <div
    v-if="isOpen && appointment"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg pointer-events-auto">
      <!-- Header -->
      <div class="flex justify-between items-start p-6 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(appointment.status)
              ]"
            >
              {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B4F72] text-xs font-medium">
              {{ getAppointmentType(appointment) }}
            </span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">
            {{ getContactName(appointment) }}
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Time -->
        <div class="flex items-center gap-3 text-lg">
          <div class="p-2 bg-slate-100 rounded-lg text-slate-500">
            <Clock :size="20" />
          </div>
          <div>
            <div class="font-bold text-slate-900">
              {{ formatTime(appointment.starts_at) }} - {{ formatTime(appointment.ends_at) }}
            </div>
            <div class="text-sm text-slate-500">
              {{ formatDate(appointment.starts_at) }}
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Phone :size="16" class="text-slate-400" />
              <span class="font-medium text-slate-700">
                {{ getContactPhone(appointment) }}
              </span>
            </div>
            <button class="text-xs font-medium text-[#1B4F72] hover:underline">
              Call
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Mail :size="16" class="text-slate-400" />
              <span class="font-medium text-slate-700">
                {{ getContactEmail(appointment) }}
              </span>
            </div>
            <button class="text-xs font-medium text-[#1B4F72] hover:underline">
              Email
            </button>
          </div>
        </div>

        <!-- Coordinator & Booking Info -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
              {{ getCoordinatorInitial(appointment) }}
            </div>
            <div>
              <div class="text-slate-500 text-xs">Booked by</div>
              <div class="font-medium text-slate-900">
                {{ getCoordinatorName(appointment) }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-slate-500 text-xs">Booked on</div>
            <div class="font-medium text-slate-900">
              {{ formatDate(appointment.created_at) }}
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="appointment.description">
          <h3 class="text-sm font-bold text-slate-900 mb-2">Description</h3>
          <p class="text-sm text-slate-700">{{ appointment.description }}</p>
        </div>

        <!-- Notes -->
        <div v-if="appointment.notes">
          <h3 class="text-sm font-bold text-slate-900 mb-2">Notes</h3>
          <p class="text-sm text-slate-700">{{ appointment.notes }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-slate-100">
          <button
            v-if="appointment.status !== 'cancelled'"
            @click="handleCancel"
            class="flex-1 py-2.5 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel Appointment
          </button>
          <button
            @click="handleEdit"
            class="flex-1 py-2.5 bg-[#1B4F72] text-white font-medium rounded-lg hover:bg-[#153e5a] transition-colors"
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Clock, Phone, Mail } from 'lucide-vue-next';
import type { Appointment } from '@/api/appointments';

interface Props {
  appointment: Appointment | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
  cancel: [appointment: Appointment];
  edit: [appointment: Appointment];
}>();

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getContactName(appointment: Appointment): string {
  if ((appointment as any).contact) {
    const contact = (appointment as any).contact;
    return `${contact.first_name} ${contact.last_name || ''}`.trim() || 'Unknown';
  }
  return 'Unknown';
}

function getContactPhone(appointment: Appointment): string {
  if ((appointment as any).contact) {
    return (appointment as any).contact.phone || '(555) 234-5678';
  }
  return '(555) 234-5678';
}

function getContactEmail(appointment: Appointment): string {
  if ((appointment as any).contact) {
    return (appointment as any).contact.email || 'email@example.com';
  }
  return 'email@example.com';
}

function getCoordinatorName(appointment: Appointment): string {
  if ((appointment as any).coordinator) {
    return (appointment as any).coordinator.display_name || 'Coordinator';
  }
  return 'N/A';
}

function getCoordinatorInitial(appointment: Appointment): string {
  return getCoordinatorName(appointment).charAt(0).toUpperCase();
}

function getAppointmentType(appointment: Appointment): string {
  if ((appointment as any).appointment_type) {
    return (appointment as any).appointment_type.name;
  }
  return appointment.title || 'Appointment';
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-slate-100 text-slate-600',
  };
  return statusMap[status] || 'bg-slate-100 text-slate-600';
}

function handleCancel() {
  if (props.appointment) {
    // emit('cancel', props.appointment);
  }
}

function handleEdit() {
  if (props.appointment) {
    // emit('edit', props.appointment);
  }
}
</script>

