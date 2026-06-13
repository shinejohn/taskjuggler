<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Appointments</h1>
      <button class="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
        <CalendarPlus class="w-4 h-4" /> Book New
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
      <button 
        @click="activeTab = 'upcoming'"
        :class="`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`"
      >
        Upcoming
      </button>
      <button 
        @click="activeTab = 'past'"
        :class="`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`"
      >
        Past Highlights
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-4">
      <div v-if="filteredAppointments.length === 0" class="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <Calendar class="w-8 h-8" />
        </div>
        <h3 class="font-bold text-slate-900 mb-1">No {{ activeTab }} appointments</h3>
        <p class="text-slate-500 text-sm">Need to see a doctor? You can book a visit in seconds.</p>
      </div>

      <div 
        v-for="appt in filteredAppointments" 
        :key="appt.id"
        class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-200 transition-all group"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-600 border border-slate-100">
              <span class="text-[10px] uppercase font-black">{{ formatDate(appt.start_time, 'MMM') }}</span>
              <span class="text-lg font-bold leading-none">{{ formatDate(appt.start_time, 'DD') }}</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{{ appt.type?.name || 'Standard Consultation' }}</h4>
              <p class="text-sm text-slate-500 flex items-center gap-1">
                <User class="w-3 h-3" /> Dr. {{ appt.provider?.user?.name || 'Healthcare Provider' }}
              </p>
              <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Clock class="w-3 h-3" /> {{ formatDate(appt.start_time, 'h:mm A') }} - {{ formatDate(appt.end_time, 'h:mm A') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <div :class="`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClass(appt.status)}`">
                {{ appt.status }}
             </div>
             <button type="button" aria-label="Appointment options" class="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical class="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';
import { formatDate as formatDateShared } from '@/utils/date';
import { 
  Calendar, CalendarPlus, User, Clock, 
  MoreVertical 
} from 'lucide-vue-next';

const store = usePortalStore();
const { appointments, isLoading } = storeToRefs(store);
const activeTab = ref('upcoming');

const formatDate = (date: string, format: string) => {
  if (!date) return '';
  const d = new Date(date);
  if (format === 'MMM') return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  if (format === 'DD') return d.getDate();
  if (format === 'h:mm A') return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return formatDateShared(date);
};

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s === 'scheduled' || s === 'confirmed') return 'bg-blue-50 text-blue-600';
  if (s === 'completed') return 'bg-emerald-50 text-emerald-600';
  if (s === 'cancelled') return 'bg-red-50 text-red-600';
  return 'bg-slate-50 text-slate-500';
};

const filteredAppointments = computed(() => {
  const now = new Date();
  if (activeTab.value === 'upcoming') {
    return appointments.value.filter(a => new Date(a.start_time) > now);
  }
  return appointments.value.filter(a => new Date(a.start_time) <= now);
});

onMounted(() => {
  store.loadAppointments();
});
</script>
