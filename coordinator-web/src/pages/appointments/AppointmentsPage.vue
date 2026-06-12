<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Appointments
          </h1>
          <p class="text-slate-500 mt-1">Manage your calendar and appointments</p>
        </div>
      </div>

      <!-- Calendar View Toggle -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div class="flex gap-2">
          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              viewMode === 'list' ? 'bg-[#1B4F72] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            ]"
            @click="viewMode = 'list'"
          >
            List View
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              viewMode === 'calendar' ? 'bg-[#1B4F72] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            ]"
            @click="viewMode = 'calendar'"
          >
            Calendar View
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="appointmentsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading appointments...</p>
      </div>

      <!-- Calendar View -->
      <CalendarView v-else-if="viewMode === 'calendar'" />

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th class="px-6 py-3">Date/Time</th>
                <th class="px-6 py-3">Contact</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3">4 Call</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="appt in appointmentsStore.appointments"
                :key="appt.id"
                class="hover:bg-slate-50 transition-colors cursor-pointer"
                @click="viewAppointment(appt)"
              >
                <td class="px-6 py-4">
                  <div class="font-medium text-slate-900">
                    {{ formatDateTime(appt.starts_at) }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ formatDuration(appt.starts_at, appt.ends_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-900">
                  {{ getContactName(appt) }}
                </td>
                <td class="px-6 py-4 text-slate-600">
                  {{ (appt as any).appointment_type?.name || appt.title }}
                </td>
                <td class="px-6 py-4 text-slate-600">
                  {{ getCoordinatorName(appt) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(appt.status)
                    ]"
                  >
                    {{ appt.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right" @click.stop>
                  <button
                    @click.stop="viewAppointment(appt)"
                    class="p-1 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100"
                  >
                    <MoreVertical :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="appointmentsStore.appointments.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                  No appointments found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Appointment Modal -->
    <AppointmentModal
      :appointment="selectedAppointment"
      :is-open="showAppointmentModal"
      @close="showAppointmentModal = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MoreVertical } from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppointmentModal from '@/components/calendar/AppointmentModal.vue';
import CalendarView from '@/components/calendar/CalendarView.vue';
import { useAppointmentsStore } from '@/stores/appointments';
import { useOrganizationsStore } from '@/stores/organizations';
import type { Appointment } from '@/api/appointments';
import { formatDateTime, formatDurationBetween } from '@/utils/format';
import { getAppointmentStatusClass } from '@/utils/status';
import { getContactName as getContactNameUtil, getCoordinatorName as getCoordinatorNameUtil } from '@/utils/contact';

const appointmentsStore = useAppointmentsStore();
const organizationsStore = useOrganizationsStore();

const viewMode = ref<'list' | 'calendar'>('list');

// Use utility functions for formatting
const formatDuration = formatDurationBetween;
const getStatusClass = getAppointmentStatusClass;
const getContactName = (appt: Appointment) => getContactNameUtil(appt);
const getCoordinatorName = (appt: Appointment) => getCoordinatorNameUtil(appt, 'N/A');

const selectedAppointment = ref<Appointment | null>(null);
const showAppointmentModal = ref(false);

function viewAppointment(appt: Appointment) {
  selectedAppointment.value = appt;
  showAppointmentModal.value = true;
}

onMounted(async () => {
  try {
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }
    if (organizationsStore.currentOrganization?.id) {
      await appointmentsStore.fetchAppointments();
    }
  } catch (error) {
    console.error('Failed to load appointments:', error);
  }
});
</script>
