<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="bg-white border-b border-slate-200 h-16 flex items-center px-6">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
          FD
        </div>
        <span class="text-xl font-bold text-slate-900">Front Desk</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          Check-in Patient
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-900">
            Front Desk Overview
        </h1>
        <div class="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock class="w-4 h-4" />
            <span>{{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}</span>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Calendar class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Today's Visits</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.appointments_today }}</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                <UserCheck class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Checked In</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.checked_in }}</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-orange-50 rounded-lg text-orange-600">
                <Clock class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">In Waiting Room</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.waiting }}</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
                <FileText class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Pending Forms</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.pending_forms }}</p>
            </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Appointment Queue / Calendar Focus -->
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 class="font-bold text-slate-900 flex items-center gap-2">
                        <Users class="w-5 h-5 text-blue-500" /> Active Patient Queue
                    </h2>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Today</button>
                        <button class="px-3 py-1 text-xs font-semibold rounded-full hover:bg-slate-100 text-slate-500">Tomorrow</button>
                    </div>
                </div>

                <div class="divide-y divide-slate-50">
                    <div v-if="upcomingAppointments.length === 0" class="p-12 text-center">
                        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar class="w-8 h-8 text-slate-300" />
                        </div>
                        <p class="text-slate-500">No appointments scheduled for today yet.</p>
                    </div>
                    <div v-for="apt in upcomingAppointments" :key="apt.id" class="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="text-center min-w-[70px]">
                                <p class="text-base font-black text-slate-900">{{ new Date(apt.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</p>
                            </div>
                            <div class="h-10 w-px bg-slate-200"></div>
                            <div>
                                <p class="font-bold text-slate-900">{{ apt.first_name }} {{ apt.last_name }}</p>
                                <p class="text-sm text-slate-500">Primary Care • Dr. Richards</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', 
                                apt.status === 'checked-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700']">
                                {{ apt.status || 'Confirmed' }}
                            </span>
                            <button class="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                                <MoreHorizontal class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-4 bg-slate-50 text-center">
                    <button class="text-sm font-bold text-blue-600 hover:text-blue-700">View Full Schedule</button>
                </div>
            </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <UserPlus class="w-5 h-5 text-emerald-500" /> Desk Actions
                </h3>
                <div class="space-y-3">
                    <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all text-left group">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-white text-blue-600 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <CreditCard class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-sm font-bold">Quick Check-in</p>
                                <p class="text-[10px] text-slate-500">Scan ID & Collect Copay</p>
                            </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-white text-emerald-600 rounded-lg shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <FileText class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-sm font-bold">Forms & Paperwork</p>
                                <p class="text-[10px] text-slate-500">E-Sign management</p>
                            </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-purple-50 hover:border-purple-200 transition-all text-left group">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-white text-purple-600 rounded-lg shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Calendar class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-sm font-bold">Reschedule</p>
                                <p class="text-[10px] text-slate-500">Modify existing bookings</p>
                            </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>

            <div class="bg-slate-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
                <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <h3 class="font-bold text-sm uppercase tracking-widest text-slate-400">AI Receptionist Live</h3>
                    </div>
                    <p class="text-2xl font-black mb-1">24 Active Calls</p>
                    <p class="text-xs text-slate-400 mb-6">Automated scheduling in progress...</p>
                    
                    <button class="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors">
                        Enter Command Center
                    </button>
                </div>
                <!-- Abstract visual element -->
                <Activity class="absolute -right-6 -bottom-6 w-32 h-32 text-blue-500/10" />
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardService } from '@/services/dashboard';
import { 
    Calendar, Users, UserCheck, Clock, FileText, 
    MoreHorizontal, CreditCard, ChevronRight, Activity,
    UserPlus
} from 'lucide-vue-next';

const loading = ref(false);
const stats = ref({ 
    appointments_today: 0, 
    checked_in: 8, 
    waiting: 2, 
    pending_forms: 4 
});
const upcomingAppointments = ref<any[]>([]);

onMounted(async () => {
    loading.value = true;
    try {
        const data = await dashboardService.getDashboardData();
        stats.value.appointments_today = data.stats.appointments_today;
        upcomingAppointments.value = data.upcoming_appointments;
    } catch (e) {
        console.error('Failed to load dashboard data', e);
    } finally {
        loading.value = false;
    }
});
</script>
