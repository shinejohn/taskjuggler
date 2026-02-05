<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Schedule</h1>
        <p class="text-slate-500">{{ formattedDate }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search patient or appointment..." 
            class="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <!-- Calendar Type Filter -->
        <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button 
            v-for="calType in calendarTypes" :key="calType.id"
            @click="activeCalendar = calType.id"
            :class="['px-3 py-1.5 text-xs font-bold rounded-md transition-colors', 
                     activeCalendar === calType.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
          >
            {{ calType.label }}
          </button>
        </div>

        <!-- View Toggle -->
        <div class="flex bg-white rounded-lg border border-slate-200 overflow-hidden">
          <button 
            v-for="v in views" :key="v"
            @click="currentView = v"
            :class="['px-3 py-1.5 text-sm font-medium transition-colors', 
                     currentView === v ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50']"
          >
            {{ v }}
          </button>
        </div>

        <!-- New Appointment -->
        <button 
          @click="openNewAppointment()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md shadow-blue-200"
        >
          <Plus class="w-4 h-4" /> New Appointment
        </button>
      </div>
    </header>

    <!-- Navigation + Mini Calendar -->
    <div class="flex gap-6">
      <!-- Mini Month Picker (sidebar) -->
      <div class="w-72 bg-white rounded-xl border border-slate-200 p-4 hidden lg:block">
        <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" class="p-1 hover:bg-slate-100 rounded"><ChevronLeft class="w-4 h-4" /></button>
          <span class="text-sm font-bold text-slate-900">{{ monthYearLabel }}</span>
          <button @click="nextMonth" class="p-1 hover:bg-slate-100 rounded"><ChevronRight class="w-4 h-4" /></button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
          <div v-for="d in ['S','M','T','W','T','F','S']" :key="d">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <button 
            v-for="day in calendarDays" :key="day.date.toISOString()"
            @click="selectDate(day.date)"
            :class="['w-8 h-8 text-xs rounded-full transition-all', 
                     day.isToday ? 'bg-blue-600 text-white font-bold' : '',
                     day.isSelected && !day.isToday ? 'bg-blue-100 text-blue-700 font-bold' : '',
                     !day.isCurrentMonth ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100',
                     day.hasAppointments && !day.isToday && !day.isSelected ? 'underline underline-offset-4 decoration-blue-400' : '']"
          >
            {{ day.date.getDate() }}
          </button>
        </div>

        <!-- Quick Filters -->
        <div class="mt-6 space-y-2">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Access</h4>
          <button 
            @click="goToToday"
            class="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Jump to Today
          </button>
          <div class="relative">
            <CalendarSearch class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="dateSearch"
              type="date"
              class="w-full pl-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none"
              @change="jumpToDate"
            >
          </div>
        </div>

        <!-- Availability Summary -->
        <div class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <h4 class="text-xs font-bold text-emerald-800 mb-2">Today's Availability</h4>
          <div class="space-y-1 text-xs text-emerald-700">
            <div class="flex justify-between"><span>Open Slots</span><span class="font-bold">4</span></div>
            <div class="flex justify-between"><span>Booked</span><span class="font-bold">8</span></div>
            <div class="flex justify-between"><span>Blocked</span><span class="font-bold">1</span></div>
          </div>
        </div>
      </div>

      <!-- Main Calendar View -->
      <div class="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <!-- Day View -->
        <template v-if="currentView === 'Day'">
          <div class="flex border-b border-slate-200">
            <div class="w-20 border-r border-slate-200"></div>
            <div class="flex-1 p-4 text-center">
              <div class="text-xs text-slate-500 uppercase font-bold">{{ selectedDate.toLocaleDateString('en-US', {weekday: 'short'}) }}</div>
              <div class="text-2xl font-bold text-slate-900">{{ selectedDate.getDate() }}</div>
            </div>
          </div>
          <div class="h-[600px] overflow-y-auto relative">
            <div v-for="hour in hours" :key="hour" class="flex border-b border-slate-100 h-24">
              <div class="w-20 border-r border-slate-200 text-xs text-slate-500 p-2 text-right">{{ formatHour(hour) }}</div>
              <div class="flex-1 relative hover:bg-blue-50/30 cursor-pointer" @click="openNewAppointment(hour)">
                <template v-for="apt in getAppointmentsForHour(hour)" :key="apt.id">
                  <div 
                    @click.stop="viewAppointment(apt)"
                    class="absolute left-2 right-2 rounded-lg border-l-4 p-2 text-xs cursor-pointer hover:shadow-md transition-shadow z-10"
                    :class="getStatusColor(apt.type)"
                    :style="getEventStyle(apt)"
                  >
                    <div class="font-bold flex justify-between">
                      <span>{{ apt.patient_name }}</span>
                      <span>{{ formatTime(apt.start_time) }}</span>
                    </div>
                    <div>{{ apt.type.replace('_', ' ') }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>

        <!-- Week View -->
        <template v-else-if="currentView === 'Week'">
          <div class="flex border-b border-slate-200">
            <div class="w-16 border-r border-slate-200"></div>
            <div v-for="day in weekDays" :key="day.toISOString()" class="flex-1 p-3 text-center border-r border-slate-100 last:border-r-0">
              <div class="text-[10px] text-slate-400 uppercase font-bold">{{ day.toLocaleDateString('en-US', {weekday: 'short'}) }}</div>
              <div :class="['text-lg font-bold', isToday(day) ? 'text-blue-600' : 'text-slate-900']">{{ day.getDate() }}</div>
            </div>
          </div>
          <div class="h-[550px] overflow-y-auto">
            <div v-for="hour in hours" :key="hour" class="flex border-b border-slate-50 h-16">
              <div class="w-16 border-r border-slate-100 text-[10px] text-slate-400 p-1 text-right">{{ formatHour(hour) }}</div>
              <div v-for="day in weekDays" :key="day.toISOString()" class="flex-1 border-r border-slate-50 last:border-r-0 hover:bg-blue-50/20 relative">
                <!-- Week view appointments would render here -->
              </div>
            </div>
          </div>
        </template>

        <!-- Month View -->
        <template v-else-if="currentView === 'Month'">
          <div class="grid grid-cols-7 border-b border-slate-200">
            <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d" class="p-3 text-center text-xs font-bold text-slate-500 uppercase border-r border-slate-100 last:border-r-0">
              {{ d }}
            </div>
          </div>
          <div class="grid grid-cols-7 h-[550px]">
            <div 
              v-for="day in monthCalendarDays" :key="day.date.toISOString()"
              :class="['p-2 border-r border-b border-slate-100 min-h-[90px] cursor-pointer hover:bg-slate-50 transition-colors',
                       !day.isCurrentMonth ? 'bg-slate-50/50' : '']"
              @click="selectDate(day.date); currentView = 'Day'"
            >
              <div :class="['text-sm font-medium mb-1', day.isToday ? 'text-blue-600 font-bold' : !day.isCurrentMonth ? 'text-slate-300' : 'text-slate-700']">
                {{ day.date.getDate() }}
              </div>
              <div v-if="day.appointments.length > 0" class="space-y-1">
                <div 
                  v-for="apt in day.appointments.slice(0, 2)" :key="apt.id"
                  class="text-[10px] px-1.5 py-0.5 rounded truncate"
                  :class="getStatusColor(apt.type)"
                >
                  {{ apt.patient_name }}
                </div>
                <div v-if="day.appointments.length > 2" class="text-[10px] text-slate-400 font-medium">
                  +{{ day.appointments.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- New Appointment Modal -->
    <Modal v-model="showNewAppointmentModal" title="New Appointment" maxWidth="lg">
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Patient</label>
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="newApt.patient_name"
                type="text" 
                placeholder="Search or enter name..." 
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Appointment Type</label>
            <select v-model="newApt.type" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
              <option value="new_patient">New Patient</option>
              <option value="follow_up">Follow Up</option>
              <option value="telehealth">Telehealth</option>
              <option value="procedure">Procedure</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Date</label>
            <input 
              v-model="newApt.date"
              type="date" 
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Start Time</label>
            <select v-model="newApt.startTime" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Duration</label>
            <select v-model="newApt.duration" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Notes</label>
          <textarea 
            v-model="newApt.notes"
            rows="3" 
            placeholder="Appointment notes or reason for visit..."
            class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Calendar Type -->
        <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="newApt.calendarType" value="business" class="w-4 h-4 text-blue-600">
            <span class="text-sm font-medium text-slate-700">Business Calendar</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="newApt.calendarType" value="personal" class="w-4 h-4 text-blue-600">
            <span class="text-sm font-medium text-slate-700">Personal Calendar</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button @click="showNewAppointmentModal = false" class="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          Cancel
        </button>
        <button @click="createAppointment" class="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2">
          <Calendar class="w-4 h-4" /> Schedule
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Plus, ChevronLeft, ChevronRight, Calendar, CalendarSearch } from 'lucide-vue-next';
import { scheduleService, type Appointment } from '@/services/schedule';
import Modal from '@/components/ui/Modal.vue';

const router = useRouter();
const selectedDate = ref(new Date());
const currentMonth = ref(new Date());
const appointments = ref<Appointment[]>([]);
const searchQuery = ref('');
const dateSearch = ref('');
const currentView = ref<'Day' | 'Week' | 'Month'>('Day');
const activeCalendar = ref<'all' | 'business' | 'personal'>('all');
const showNewAppointmentModal = ref(false);

const views: ('Day' | 'Week' | 'Month')[] = ['Day', 'Week', 'Month'];
const calendarTypes: { id: 'all' | 'business' | 'personal'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'personal', label: 'Personal' }
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
});

const newApt = reactive({
  patient_name: '',
  type: 'follow_up',
  date: '',
  startTime: '9:00 AM',
  duration: '30',
  notes: '',
  calendarType: 'business'
});

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const monthYearLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const days = [];
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  
  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false, isToday: false, isSelected: false, hasAppointments: false });
  }
  
  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const today = new Date();
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.value.toDateString(),
      hasAppointments: Math.random() > 0.7 // Mock
    });
  }
  
  return days;
});

const monthCalendarDays = computed(() => {
  const days = [];
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const today = new Date();
  
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false, isToday: false, appointments: [] });
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const dayAppts = appointments.value.filter(a => new Date(a.start_time).toDateString() === d.toDateString());
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: d.toDateString() === today.toDateString(),
      appointments: dayAppts
    });
  }
  
  // Fill to complete 6 rows
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false, isToday: false, appointments: [] });
  }
  
  return days;
});

const weekDays = computed(() => {
  const days = [];
  const start = new Date(selectedDate.value);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
});

const filteredAppointments = computed(() => {
  let filtered = appointments.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(a => a.patient_name.toLowerCase().includes(q));
  }
  return filtered;
});

onMounted(async () => {
  appointments.value = await scheduleService.getAppointments(selectedDate.value.toISOString());
});

watch(selectedDate, async () => {
  appointments.value = await scheduleService.getAppointments(selectedDate.value.toISOString());
});

const selectDate = (date: Date) => {
  selectedDate.value = new Date(date);
  // Sync currentMonth with selected date so the mini calendar stays in sync
  if (date.getMonth() !== currentMonth.value.getMonth() || date.getFullYear() !== currentMonth.value.getFullYear()) {
    currentMonth.value = new Date(date.getFullYear(), date.getMonth(), 1);
  }
};

const goToToday = () => {
  selectedDate.value = new Date();
  currentMonth.value = new Date();
};

const jumpToDate = () => {
  if (dateSearch.value) {
    const d = new Date(dateSearch.value);
    selectedDate.value = d;
    currentMonth.value = new Date(d.getFullYear(), d.getMonth(), 1);
  }
};

const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
};

const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

const formatHour = (h: number) => new Date(0, 0, 0, h).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const getAppointmentsForHour = (hour: number) => {
  return filteredAppointments.value.filter(a => {
    const h = new Date(a.start_time).getHours();
    return h === hour;
  });
};

const getEventStyle = (apt: Appointment) => {
  const start = new Date(apt.start_time);
  const end = new Date(apt.end_time);
  const minutesStart = start.getMinutes();
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const top = minutesStart * 1.6;
  const height = Math.max(durationMinutes * 1.6, 30);
  return { top: `${top}px`, height: `${height}px` };
};

const getStatusColor = (type: string) => {
  switch (type) {
    case 'new_patient': return 'bg-purple-100 border-purple-500 text-purple-800';
    case 'follow_up': return 'bg-blue-100 border-blue-500 text-blue-800';
    case 'telehealth': return 'bg-teal-100 border-teal-500 text-teal-800';
    case 'procedure': return 'bg-amber-100 border-amber-500 text-amber-800';
    case 'urgent': return 'bg-red-100 border-red-500 text-red-800';
    default: return 'bg-slate-100 border-slate-500 text-slate-800';
  }
};

const openNewAppointment = (hour?: number) => {
  const dateStr = selectedDate.value.toISOString().split('T')[0] || '';
  newApt.date = dateStr;
  if (hour) {
    newApt.startTime = formatHour(hour);
  }
  showNewAppointmentModal.value = true;
};

const createAppointment = async () => {
  // In production: API call
  showNewAppointmentModal.value = false;
  alert(`Appointment scheduled for ${newApt.patient_name} on ${newApt.date} at ${newApt.startTime}`);
  // Refresh
  appointments.value = await scheduleService.getAppointments(selectedDate.value.toISOString());
};

const viewAppointment = (apt: Appointment) => {
  router.push(`/patients/${apt.patient_id}`);
};
</script>
