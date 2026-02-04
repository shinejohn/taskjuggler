<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="bg-white border-b border-slate-200 h-16 flex items-center px-6">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
          4D
        </div>
        <span class="text-xl font-bold text-slate-900">4Doctors</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <span v-if="loading" class="text-xs text-slate-400">Refreshing...</span>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          New Appointment
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">
        Good Morning, {{ profile?.specialty || 'Doctor' }}
      </h1>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Calendar class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Appointments Today</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.appointments_today }}</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-teal-50 rounded-lg text-teal-600">
                <Users class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Total Patients</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.patients_total }}</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
                <CheckSquare class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Pending Tasks</p>
                <p class="text-2xl font-bold text-slate-900">{{ stats.tasks_pending }}</p>
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Upcoming Appointments -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock class="w-5 h-5 text-slate-400" /> Upcoming
          </h2>
          <div v-if="upcomingAppointments.length === 0" class="text-slate-500 text-sm py-4 text-center bg-slate-50 rounded-lg">
            No upcoming appointments.
          </div>
          <div v-else class="space-y-4">
            <div v-for="apt in upcomingAppointments" :key="apt.id" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                        {{ apt.first_name[0] }}{{ apt.last_name[0] }}
                    </div>
                    <div>
                        <p class="font-medium text-slate-900">{{ apt.first_name }} {{ apt.last_name }}</p>
                        <p class="text-xs text-slate-500">{{ new Date(apt.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</p>
                    </div>
                </div>
                <span class="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-600 capitalize">{{ apt.status }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Patients -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users class="w-5 h-5 text-slate-400" /> Recent Patients
          </h2>
           <div v-if="recentPatients.length === 0" class="text-slate-500 text-sm py-4 text-center bg-slate-50 rounded-lg">
            No recent patients found.
          </div>
          <div v-else class="space-y-4">
             <div v-for="patient in recentPatients" :key="patient.id" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                    <p class="font-medium text-slate-900">{{ patient.first_name }} {{ patient.last_name }}</p>
                    <p class="text-xs text-slate-500">Last seen: {{ new Date(patient.created_at).toLocaleDateString() }}</p>
                </div>
                <button class="text-blue-600 text-sm font-medium hover:underline">View Chart</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardService } from '@/services/dashboard';
import { Calendar, Users, CheckSquare, Clock } from 'lucide-vue-next';

const loading = ref(false);
const stats = ref({ appointments_today: 0, patients_total: 0, tasks_pending: 0 });
const upcomingAppointments = ref<any[]>([]);
const recentPatients = ref<any[]>([]);
const profile = ref<any>(null);

onMounted(async () => {
    loading.value = true;
    try {
        const data = await dashboardService.getDashboardData();
        stats.value = data.stats;
        upcomingAppointments.value = data.upcoming_appointments;
        recentPatients.value = data.recent_patients;
        profile.value = data.provider_profile;
    } catch (e) {
        console.error('Failed to load dashboard data', e);
    } finally {
        loading.value = false;
    }
});
</script>
