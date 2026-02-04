<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Schedule</h1>
        <p class="text-slate-500">{{ formattedDate }}</p>
      </div>
      <div class="flex gap-4">
          <router-link to="/dashboard" class="text-sm font-medium text-blue-600 hover:underline flex items-center">Back to Dashboard</router-link>
          <div class="flex bg-white rounded-lg border border-slate-300 overflow-hidden">
              <button class="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-900">Day</button>
              <button class="px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50">Week</button>
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">New Appointment</button>
      </div>
    </header>

    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[700px]">
        <!-- Calendar Header (Days) -->
        <div class="flex border-b border-slate-200">
             <div class="w-20 border-r border-slate-200"></div> <!-- Time Column Header -->
             <div class="flex-1 p-4 text-center">
                 <div class="text-xs text-slate-500 uppercase font-bold">{{ selectedDate.toLocaleDateString('en-US', {weekday: 'short'}) }}</div>
                 <div class="text-2xl font-bold text-slate-900">{{ selectedDate.getDate() }}</div>
             </div>
        </div>

        <!-- Calendar Grid -->
        <div class="flex-1 overflow-y-auto relative">
             <!-- Time Slots -->
             <div v-for="hour in hours" :key="hour" class="flex border-b border-slate-100 h-24">
                 <div class="w-20 border-r border-slate-200 text-xs text-slate-500 p-2 text-right">
                     {{ formatHour(hour) }}
                 </div>
                 <div class="flex-1 relative" @click="handleSlotClick(hour)">
                     <!-- Events will be placed absolutely here -->
                     <template v-for="apt in getAppointmentsForHour(hour)" :key="apt.id">
                        <div 
                            @click.stop="viewChart(apt.patient_id)"
                            class="absolute left-2 right-2 rounded-lg border-l-4 p-2 text-xs cursor-pointer hover:shadow-md transition-shadow z-10"
                            :class="getStatusColor(apt.type)"
                            :style="getEventStyle(apt)"
                        >
                            <div class="font-bold flex justify-between">
                                <span>{{ apt.patient_name }}</span>
                                <span>{{ formatTime(apt.start_time) }} - {{ formatTime(apt.end_time) }}</span>
                            </div>
                            <div>{{ apt.type.replace('_', ' ') }}</div>
                            <div v-if="apt.notes" class="mt-1 opacity-75 truncate">{{ apt.notes }}</div>
                        </div>
                     </template>
                 </div>
             </div>

             <!-- Current Time line (mock) -->
             <div class="absolute left-20 right-0 border-t-2 border-red-400 z-20 pointer-events-none" style="top: 320px;">
                 <div class="absolute -left-2 -top-1.5 w-3 h-3 bg-red-400 rounded-full"></div>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { scheduleService, type Appointment } from '@/services/schedule';

const router = useRouter();
const selectedDate = ref(new Date());
const appointments = ref<Appointment[]>([]);
const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const formattedDate = computed(() => {
    return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

onMounted(async () => {
    appointments.value = await scheduleService.getAppointments(selectedDate.value.toISOString());
});

const formatHour = (h: number) => {
    return new Date(0,0,0, h).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
}

const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
}

const getAppointmentsForHour = (hour: number) => {
    return appointments.value.filter(a => {
        const h = new Date(a.start_time).getHours();
        return h === hour;
    });
}

const getEventStyle = (apt: Appointment) => {
    const start = new Date(apt.start_time);
    const end = new Date(apt.end_time);
    const minutesStart = start.getMinutes();
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    // Determine top offset relative to the hour slot (which is 96px high = h-24)
    // 60 mins = 96px => 1 min = 1.6px
    const top = minutesStart * 1.6;
    const height = durationMinutes * 1.6;
    
    return {
        top: `${top}px`,
        height: `${height}px`
    };
}

const getStatusColor = (type: string) => {
    switch(type) {
        case 'new_patient': return 'bg-purple-100 border-purple-500 text-purple-800';
        case 'follow_up': return 'bg-blue-100 border-blue-500 text-blue-800';
        case 'telehealth': return 'bg-teal-100 border-teal-500 text-teal-800';
        default: return 'bg-slate-100 border-slate-500 text-slate-800';
    }
}

const viewChart = (patientId: string) => {
    router.push(`/patients/${patientId}`);
}

const handleSlotClick = async (hour: number) => {
    // Logic to open booking drawer for this slot
    // For now simple prompt
    const patientName = prompt('Enter Patient Name for ' + formatHour(hour));
    if (patientName) {
        const startTime = new Date(selectedDate.value);
        startTime.setHours(hour, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(30);

        await scheduleService.createAppointment({
            patient_name: patientName,
            patient_id: 'new-id', // would be selected
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            type: 'new_patient',
            status: 'scheduled'
        });
        
        // Refresh
        appointments.value = await scheduleService.getAppointments(selectedDate.value.toISOString());
    }
}
</script>
