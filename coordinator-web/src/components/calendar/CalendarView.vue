<template>
  <div class="h-[calc(100vh-200px)] flex flex-col">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Calendar</h1>

      <div class="flex items-center gap-4">
        <div class="flex bg-slate-100 p-1 rounded-lg">
          <button
            v-for="v in ['Day', 'Week', 'Month']"
            :key="v"
            @click="view = v.toLowerCase() as any"
            :class="[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              view === v.toLowerCase()
                ? 'bg-white text-[#1B4F72] shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            {{ v }}
          </button>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Plus :size="18" />
          Manual Appointment
        </button>
      </div>
    </div>

    <div class="flex flex-1 gap-6 overflow-hidden">
      <!-- Left Sidebar -->
      <div class="w-64 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
        <!-- Mini Calendar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-900">{{ currentMonthYear }}</span>
            <div class="flex gap-1">
              <button @click="previousMonth" class="p-1 hover:bg-slate-100 rounded">
                <ChevronLeft :size="16" />
              </button>
              <button @click="nextMonth" class="p-1 hover:bg-slate-100 rounded">
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            <div v-for="d in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="d" class="text-slate-400 font-medium">
              {{ d }}
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-sm">
            <button
              v-for="day in calendarDays"
              :key="day.date"
              @click="selectDate(day.date)"
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-50 relative',
                day.isToday ? 'bg-[#1B4F72] text-white hover:bg-[#1B4F72]' : 'text-slate-700',
                day.isCurrentMonth ? '' : 'text-slate-300',
              ]"
            >
              {{ day.day }}
              <div
                v-if="day.hasAppointments"
                :class="[
                  'absolute bottom-1 w-1 h-1 rounded-full',
                  day.isToday ? 'bg-white' : 'bg-[#1B4F72]',
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Upcoming Today -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
          <h3 class="font-bold text-[#1B4F72] mb-4">Upcoming Today</h3>
          <div class="space-y-3">
            <div
              v-for="appt in todayAppointments"
              :key="appt.id"
              @click="viewAppointment(appt)"
              class="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#1B4F72] transition-colors cursor-pointer"
            >
              <div class="text-xs font-bold text-[#1B4F72] mb-1">
                {{ formatTime(appt.starts_at) }}
              </div>
              <div class="font-medium text-slate-900 text-sm">
                {{ getContactName(appt) }}
              </div>
              <div class="text-xs text-slate-500">
                {{ getAppointmentType(appt) }}
              </div>
            </div>
            <div v-if="todayAppointments.length === 0" class="text-sm text-slate-500 text-center py-4">
              No appointments today
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="space-y-4">
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              By Coordinator
            </h4>
            <div class="space-y-2">
              <label
                v-for="coord in coordinators"
                :key="coord.id"
                class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="coord.id"
                  v-model="selectedCoordinators"
                  class="rounded text-[#1B4F72] focus:ring-[#1B4F72]"
                />
                {{ coord.display_name || coord.role_template?.name || 'N/A' }}
              </label>
            </div>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              By Type
            </h4>
            <div class="space-y-2">
              <label
                v-for="type in appointmentTypes"
                :key="type.id"
                class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="type.id"
                  v-model="selectedTypes"
                  class="rounded text-[#1B4F72] focus:ring-[#1B4F72]"
                />
                {{ type.name }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Calendar -->
      <div class="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <!-- View Header with Navigation -->
        <div class="flex items-center justify-between border-b border-slate-200 p-4">
          <div class="flex items-center gap-4">
            <button @click="navigatePrevious" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft :size="20" />
            </button>
            <h2 class="text-lg font-bold text-[#1B4F72]">{{ currentViewTitle }}</h2>
            <button @click="navigateNext" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight :size="20" />
            </button>
            <button @click="goToToday" class="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Today
            </button>
          </div>
        </div>

        <!-- Day View -->
        <div v-if="view === 'day'" class="flex-1 overflow-y-auto relative">
          <div class="flex min-h-[600px]">
            <!-- Time Column -->
            <div class="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium text-right pr-2 pt-2">
              <div v-for="h in hours" :key="h" class="h-16 -mt-2.5">
                {{ h > 12 ? h - 12 : h }} {{ h >= 12 ? 'PM' : 'AM' }}
              </div>
            </div>

            <!-- Day Column -->
            <div class="flex-1 relative">
              <!-- Horizontal Lines -->
              <div
                v-for="h in hours"
                :key="h"
                class="absolute w-full border-b border-slate-100 h-16"
                :style="{ top: (h - 8) * 64 + 'px' }"
              />

              <!-- Current Time Indicator -->
              <div
                v-if="isCurrentDay"
                class="absolute w-full border-t-2 border-red-500 z-10"
                :style="{ top: currentTimePosition + 'px' }"
              >
                <div class="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
              </div>

              <!-- Appointments -->
              <div
                v-for="appt in dayAppointments"
                :key="appt.id"
                @click="viewAppointment(appt)"
                draggable="true"
                @dragstart="handleDragStart($event, appt)"
                :class="[
                  'absolute left-1 right-1 rounded-md border p-2 text-xs cursor-move hover:shadow-md transition-shadow overflow-hidden',
                  getAppointmentColor(appt),
                ]"
                :style="getDayAppointmentStyle(appt)"
              >
                <div class="font-bold truncate">
                  {{ formatAppointmentTime(appt) }} - {{ getContactName(appt) }}
                </div>
                <div class="truncate opacity-80">{{ getAppointmentType(appt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else-if="view === 'week'" class="flex-1 overflow-y-auto relative">
          <div class="flex min-h-[600px]">
            <!-- Week Header -->
            <div class="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50"></div>
            <div class="flex-1 grid grid-cols-7 border-b border-slate-200">
              <div
                v-for="(day, i) in weekDays"
                :key="day.date"
                :class="[
                  'py-3 text-center border-r border-slate-100 last:border-0',
                  i === 0 ? 'bg-blue-50/30' : '',
                ]"
              >
                <div :class="['text-sm font-medium', i === 0 ? 'text-[#1B4F72] font-bold' : 'text-slate-600']">
                  {{ day.label }}
                </div>
              </div>
            </div>

            <!-- Time Column -->
            <div class="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium text-right pr-2 pt-2">
              <div v-for="h in hours" :key="h" class="h-16 -mt-2.5">
                {{ h > 12 ? h - 12 : h }} {{ h >= 12 ? 'PM' : 'AM' }}
              </div>
            </div>

            <!-- Days Grid -->
            <div class="flex-1 grid grid-cols-7 relative">
              <!-- Horizontal Lines -->
              <div
                v-for="h in hours"
                :key="h"
                class="absolute w-full border-b border-slate-100 h-16"
                :style="{ top: (h - 8) * 64 + 'px' }"
              />

              <!-- Vertical Lines -->
              <div
                v-for="i in 7"
                :key="i"
                class="border-r border-slate-100 h-full relative"
              >
                <!-- Current Time Indicator -->
                <div
                  v-if="i === 1 && isCurrentWeek"
                  class="absolute w-full border-t-2 border-red-500 z-10"
                  :style="{ top: currentTimePosition + 'px' }"
                >
                  <div class="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
                </div>
              </div>

              <!-- Appointments -->
              <div
                v-for="appt in displayedAppointments"
                :key="appt.id"
                @click="viewAppointment(appt)"
                draggable="true"
                @dragstart="handleDragStart($event, appt)"
                :class="[
                  'absolute left-1 right-1 rounded-md border p-2 text-xs cursor-move hover:shadow-md transition-shadow overflow-hidden',
                  getAppointmentColor(appt),
                ]"
                :style="getAppointmentStyle(appt)"
              >
                <div class="font-bold truncate">
                  {{ formatAppointmentTime(appt) }} - {{ getContactName(appt) }}
                </div>
                <div class="truncate opacity-80">{{ getAppointmentType(appt) }}</div>
                <div class="flex items-center gap-1 mt-1 opacity-70">
                  <Calendar :size="10" />
                  {{ getCoordinatorName(appt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Month View -->
        <div v-else-if="view === 'month'" class="flex-1 overflow-y-auto p-4">
          <!-- Month Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="dayName in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="dayName"
              class="text-center text-xs font-semibold text-slate-500 py-2"
            >
              {{ dayName }}
            </div>
          </div>

          <!-- Month Grid -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              @click="selectDate(day.date)"
              @drop="handleDrop($event, day.date)"
              @dragover.prevent
              :class="[
                'min-h-[100px] p-2 border border-slate-200 rounded-lg cursor-pointer transition-colors',
                day.isToday ? 'bg-blue-50 border-[#1B4F72]' : 'bg-white hover:bg-slate-50',
                !day.isCurrentMonth ? 'opacity-40' : '',
              ]"
            >
              <div
                :class="[
                  'text-sm font-medium mb-1',
                  day.isToday ? 'text-[#1B4F72] font-bold' : 'text-slate-700',
                ]"
              >
                {{ day.day }}
              </div>
              <div class="space-y-1">
                <div
                  v-for="appt in getAppointmentsForDate(day.date)"
                  :key="appt.id"
                  @click.stop="viewAppointment(appt)"
                  draggable="true"
                  @dragstart="handleDragStart($event, appt)"
                  :class="[
                    'text-xs p-1 rounded truncate cursor-move',
                    getAppointmentColor(appt),
                  ]"
                >
                  {{ formatAppointmentTime(appt) }} {{ getContactName(appt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <AppointmentModal
      :appointment="selectedAppointment"
      :is-open="showAppointmentModal"
      @close="showAppointmentModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-vue-next';
import AppointmentModal from './AppointmentModal.vue';
import { useAppointmentsStore } from '@/stores/appointments';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';
import type { Appointment } from '@/api/appointments';

const appointmentsStore = useAppointmentsStore();
const coordinatorsStore = useCoordinatorsStore();
const organizationsStore = useOrganizationsStore();

const view = ref<'day' | 'week' | 'month'>('week');
const selectedDate = ref(new Date());
const selectedAppointment = ref<Appointment | null>(null);
const showAppointmentModal = ref(false);
const showCreateModal = ref(false);
const selectedCoordinators = ref<string[]>([]);
const selectedTypes = ref<string[]>([]);

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm

const currentMonthYear = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = date.getTime() === today.getTime();
    const isCurrentMonth = date.getMonth() === month;
    const hasAppointments = appointmentsStore.appointments.some(
      (a) => a.starts_at.startsWith(dateStr)
    );

    days.push({
      date: dateStr,
      day: date.getDate(),
      isToday,
      isCurrentMonth,
      hasAppointments,
    });
  }

  return days;
});

const weekDays = computed(() => {
  const start = new Date(selectedDate.value);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
  start.setDate(diff);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    });
  }
  return days;
});

const filteredAppointments = computed(() => {
  let apps = appointmentsStore.appointments;

  if (selectedCoordinators.value.length > 0) {
    apps = apps.filter((a) => {
      const coordId = (a as any).booked_by_coordinator?.id;
      return coordId && selectedCoordinators.value.includes(coordId);
    });
  }

  if (selectedTypes.value.length > 0) {
    apps = apps.filter((a) => {
      const typeId = (a as any).appointment_type?.id;
      return typeId && selectedTypes.value.includes(typeId);
    });
  }

  return apps;
});

const displayedAppointments = computed(() => {
  const weekStart = weekDays.value[0].date;
  const weekEnd = weekDays.value[6].date;

  return filteredAppointments.value.filter((appt) => {
    const apptDate = appt.starts_at.split('T')[0];
    return apptDate >= weekStart && apptDate <= weekEnd;
  });
});

const dayAppointments = computed(() => {
  const selectedDateStr = selectedDate.value.toISOString().split('T')[0];
  return filteredAppointments.value
    .filter((appt) => appt.starts_at.startsWith(selectedDateStr))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
});

const currentViewTitle = computed(() => {
  if (view.value === 'day') {
    return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  } else if (view.value === 'week') {
    const start = weekDays.value[0].date;
    const end = weekDays.value[6].date;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } else {
    return currentMonthYear.value;
  }
});

const isCurrentDay = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const selectedDateStr = selectedDate.value.toISOString().split('T')[0];
  return today === selectedDateStr;
});

const draggedAppointment = ref<Appointment | null>(null);

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return filteredAppointments.value
    .filter((a) => a.starts_at.startsWith(today))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, 5);
});

const coordinators = computed(() => coordinatorsStore.coordinators);
const appointmentTypes = computed<Array<{ id: string; name: string }>>(() => {
  // Would come from API - for now return empty array
  // Type is explicitly defined to avoid 'never' type inference
  return [] as Array<{ id: string; name: string }>;
});

const isCurrentWeek = computed(() => {
  const today = new Date();
  const weekStart = new Date(weekDays.value[0].date);
  const weekEnd = new Date(weekDays.value[6].date);
  return today >= weekStart && today <= weekEnd;
});

const currentTimePosition = computed(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 8 * 60; // 8am
  return ((totalMinutes - startMinutes) / 60) * 64;
});

function selectDate(date: string) {
  selectedDate.value = new Date(date);
}

function previousMonth() {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  selectedDate.value = newDate;
}

function nextMonth() {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  selectedDate.value = newDate;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatAppointmentTime(appt: Appointment): string {
  const start = new Date(appt.starts_at);
  const hour = start.getHours();
  const minute = start.getMinutes();
  const displayHour = hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function getContactName(appt: Appointment): string {
  if ((appt as any).contact) {
    const contact = (appt as any).contact;
    return `${contact.first_name} ${contact.last_name || ''}`.trim() || 'Unknown';
  }
  return 'Unknown';
}

function getCoordinatorName(appt: Appointment): string {
  if ((appt as any).booked_by_coordinator) {
    return (appt as any).booked_by_coordinator.display_name || 'Coordinator';
  }
  return 'N/A';
}

function getAppointmentType(appt: Appointment): string {
  if ((appt as any).appointment_type) {
    return (appt as any).appointment_type.name;
  }
  return appt.title || 'Appointment';
}

function getAppointmentColor(appt: Appointment): string {
  const status = appt.status.toLowerCase();
  if (status === 'confirmed') return 'bg-blue-100 border-blue-200 text-blue-800';
  if (status === 'pending' || status === 'scheduled') return 'bg-purple-100 border-purple-200 text-purple-800';
  if (status === 'cancelled') return 'bg-slate-100 border-slate-200 text-slate-600';
  return 'bg-amber-100 border-amber-200 text-amber-800';
}

function getAppointmentStyle(appt: Appointment) {
  const start = new Date(appt.starts_at);
  const end = new Date(appt.ends_at);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours

  const dayOfWeek = start.getDay();
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday = 7

  return {
    top: (startHour - 8) * 64 + 'px',
    height: duration * 64 + 'px',
    gridColumnStart: adjustedDay,
    gridColumnEnd: adjustedDay + 1,
  };
}

function viewAppointment(appt: Appointment) {
  selectedAppointment.value = appt;
  showAppointmentModal.value = true;
}

function getAppointmentsForDate(date: string): Appointment[] {
  return filteredAppointments.value
    .filter((appt) => appt.starts_at.startsWith(date))
    .slice(0, 3); // Limit to 3 for month view
}

function getDayAppointmentStyle(appt: Appointment) {
  const start = new Date(appt.starts_at);
  const end = new Date(appt.ends_at);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours

  return {
    top: (startHour - 8) * 64 + 'px',
    height: duration * 64 + 'px',
  };
}

function navigatePrevious() {
  const newDate = new Date(selectedDate.value);
  if (view.value === 'day') {
    newDate.setDate(newDate.getDate() - 1);
  } else if (view.value === 'week') {
    newDate.setDate(newDate.getDate() - 7);
  } else {
    newDate.setMonth(newDate.getMonth() - 1);
  }
  selectedDate.value = newDate;
}

function navigateNext() {
  const newDate = new Date(selectedDate.value);
  if (view.value === 'day') {
    newDate.setDate(newDate.getDate() + 1);
  } else if (view.value === 'week') {
    newDate.setDate(newDate.getDate() + 7);
  } else {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  selectedDate.value = newDate;
}

function goToToday() {
  selectedDate.value = new Date();
}

function handleDragStart(event: DragEvent, appt: Appointment) {
  draggedAppointment.value = appt;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', appt.id);
  }
}

async function handleDrop(event: DragEvent, targetDate: string) {
  event.preventDefault();
  if (!draggedAppointment.value) return;

  const targetDateTime = new Date(targetDate);
  const originalStart = new Date(draggedAppointment.value.starts_at);
  const originalEnd = new Date(draggedAppointment.value.ends_at);
  const duration = originalEnd.getTime() - originalStart.getTime();

  // Calculate new start time (preserve time of day if possible)
  const newStart = new Date(targetDateTime);
  newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);
  const newEnd = new Date(newStart.getTime() + duration);

  try {
    await appointmentsStore.updateAppointment(draggedAppointment.value.id, {
      starts_at: newStart.toISOString(),
      ends_at: newEnd.toISOString(),
    });
    draggedAppointment.value = null;
  } catch (error) {
    console.error('Failed to update appointment:', error);
  }
}

onMounted(async () => {
  if (!organizationsStore.currentOrganization) {
    await organizationsStore.fetchOrganizations();
    if (organizationsStore.organizations.length > 0) {
      organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
    }
  }
  if (organizationsStore.currentOrganization) {
    await appointmentsStore.fetchAppointments();
    await coordinatorsStore.fetchCoordinators(organizationsStore.currentOrganization.id);
  }
});
</script>

