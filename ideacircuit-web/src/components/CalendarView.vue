<template>
  <div class="h-full flex flex-col glass-standard rounded-lg overflow-hidden shadow-1">
    <div class="p-4 border-b border-border flex justify-between items-center glass-subtle">
      <h2 class="text-headline font-semibold text-text-primary">Call Schedule</h2>
      <div class="flex space-x-2">
        <button
          class="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-md flex items-center text-label font-medium min-h-[44px] transition-colors duration-fast"
          aria-label="New call"
        >
          <PlusIcon :size="16" class="mr-1" />
          New Call
        </button>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- Calendar -->
      <div class="w-2/3 p-6 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-title-large font-semibold text-text-primary">{{ formatMonth(currentMonth) }}</h3>
          <div class="flex space-x-2">
            <button
              class="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
              @click="prevMonth"
              aria-label="Previous month"
            >
              <ChevronLeftIcon :size="20" />
            </button>
            <button
              class="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
              @click="nextMonth"
              aria-label="Next month"
            >
              <ChevronRightIcon :size="20" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in weekdays" :key="day" class="text-center py-2 text-label font-medium text-text-secondary">
            {{ day }}
          </div>
          <div
            v-for="(day, index) in monthDays"
            :key="index"
            :class="`h-24 border rounded-lg p-1 transition-colors duration-fast ${
              day
                ? 'cursor-pointer hover:bg-bg-secondary'
                : 'bg-bg-tertiary'
            } ${
              isSelected(day)
                ? 'border-primary bg-primary-light'
                : 'border-border'
            }`"
            @click="day && (selectedDate = day)"
          >
            <template v-if="day">
              <div class="flex justify-between items-center mb-1">
                <span :class="`text-body-small font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday(day)
                    ? 'bg-primary text-white'
                    : isSelected(day)
                      ? 'text-primary'
                      : 'text-text-primary'
                }`">
                  {{ day.getDate() }}
                </span>
                <span v-if="hasEvents(day)" class="w-2 h-2 rounded-full bg-status-completed"></span>
              </div>
              <div class="overflow-hidden space-y-1">
                <div
                  v-for="event in getEventsForDate(day).slice(0, 2)"
                  :key="event.id"
                  class="text-caption p-1 rounded bg-primary-light text-primary truncate"
                >
                  {{ formatTime(event.date) }} {{ event.title }}
                </div>
                <div v-if="getEventsForDate(day).length > 2" class="text-caption text-text-tertiary pl-1">
                  +{{ getEventsForDate(day).length - 2 }} more
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Events for selected date -->
      <div class="w-1/3 border-l border-border p-6 overflow-y-auto bg-bg-secondary">
        <h3 class="text-headline font-semibold mb-4 text-text-primary">
          {{ selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          }) }}
        </h3>

        <div v-if="loading" class="text-center py-8 text-text-secondary text-body-medium">
          Loading...
        </div>
        <div v-else-if="getEventsForDate(selectedDate).length === 0" class="text-center py-8 text-text-secondary">
          <CalendarIcon :size="40" class="mx-auto mb-2 opacity-50" />
          <p class="text-body-medium mb-4">No scheduled calls for this date</p>
          <button
            class="mt-4 px-4 py-2 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center mx-auto hover:bg-primary-hover transition-colors duration-fast"
            aria-label="Schedule a call"
          >
            <PlusIcon :size="16" class="mr-2" />
            Schedule a call
          </button>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="event in getEventsForDate(selectedDate)"
            :key="event.id"
            class="glass-standard rounded-lg p-4 shadow-1"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-title-medium text-text-primary">{{ event.title }}</h4>
              <span class="px-2 py-1 text-label rounded-full bg-status-completed/10 text-status-completed border border-status-completed/30">
                {{ event.type }}
              </span>
            </div>
            <div class="mt-2 space-y-2">
              <div class="flex items-center text-body-small text-text-secondary">
                <ClockIcon :size="14" class="mr-2" />
                {{ formatTime(event.date) }} ({{ event.duration }} min)
              </div>
              <div class="flex items-center text-body-small text-text-secondary">
                <UsersIcon :size="14" class="mr-2" />
                {{ event.participants }} participants
              </div>
            </div>
            <div class="mt-4 flex space-x-2">
              <button
                class="px-3 py-1.5 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-primary-hover transition-colors duration-fast"
                aria-label="Join meeting"
              >
                <VideoIcon :size="14" class="mr-1" />
                Join
              </button>
              <button
                class="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
                aria-label="Edit meeting"
              >
                Edit
              </button>
              <button
                class="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
                aria-label="Cancel meeting"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ClockIcon,
  UsersIcon,
  VideoIcon,
  CalendarIcon
} from 'lucide-vue-next';
import { useAppointmentsStore } from '@/stores/appointments';

interface ScheduledCall {
  id: number;
  title: string;
  date: Date;
  duration: number;
  participants: number;
  type: string;
}

const appointmentsStore = useAppointmentsStore();
const currentMonth = ref(new Date());
const selectedDate = ref(new Date());
const scheduledCalls = ref<ScheduledCall[]>([]);
const loading = ref(true);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayIndex = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
});

const loadScheduledCalls = async () => {
  loading.value = true;
  try {
    await appointmentsStore.fetchAppointments();

    const calls: ScheduledCall[] = appointmentsStore.appointments.map(apt => ({
      id: parseInt(apt.id) || Date.now(),
      title: apt.guest_name || 'Meeting',
      date: new Date(apt.start_time),
      duration: 60,
      participants: 1,
      type: 'video'
    }));

    scheduledCalls.value = calls;
  } catch (error) {
    console.error('Error loading scheduled calls:', error);
    scheduledCalls.value = [];
  } finally {
    loading.value = false;
  }
};

const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
};

const formatMonth = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

const isToday = (date: Date | null) => {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const isSelected = (date: Date | null) => {
  if (!date || !selectedDate.value) return false;
  return date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear();
};

const hasEvents = (date: Date | null) => {
  if (!date) return false;
  return scheduledCalls.value.some(call =>
    call.date.getDate() === date.getDate() &&
    call.date.getMonth() === date.getMonth() &&
    call.date.getFullYear() === date.getFullYear()
  );
};

const getEventsForDate = (date: Date | null) => {
  if (!date) return [];
  return scheduledCalls.value.filter(call =>
    call.date.getDate() === date.getDate() &&
    call.date.getMonth() === date.getMonth() &&
    call.date.getFullYear() === date.getFullYear()
  );
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(currentMonth, () => {
  loadScheduledCalls();
});

onMounted(() => {
  loadScheduledCalls();
});
</script>
