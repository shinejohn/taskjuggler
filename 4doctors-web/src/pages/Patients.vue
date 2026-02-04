<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Patients</h1>
        <p class="text-slate-500">Manage clinical records and history</p>
      </div>
      <div class="flex gap-4">
          <router-link to="/dashboard" class="text-sm font-medium text-blue-600 hover:underline flex items-center">Back to Dashboard</router-link>
          <button @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Patient
          </button>
      </div>
    </header>

    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Search Bar -->
        <div class="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
            <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search patients by name, DOB, or MRN..." 
                    class="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
            </div>
            <select class="px-4 py-2 rounded-lg border border-slate-300 text-sm">
                <option>All Providers</option>
            </select>
        </div>

        <!-- Table -->
        <div v-if="loading" class="p-12 text-center text-slate-400">Loading patients...</div>
        <table v-else class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">DOB</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Visit</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="patient in patients" :key="patient.id" class="hover:bg-slate-50 cursor-pointer" @click="viewChart(patient.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                          {{ patient.first_name[0] }}{{ patient.last_name[0] }}
                      </div>
                      <div class="text-sm font-medium text-slate-900">{{ patient.first_name }} {{ patient.last_name }}</div>
                  </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ patient.dob || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div class="flex flex-col">
                    <span>{{ patient.email }}</span>
                    <span class="text-xs">{{ patient.phone }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ patient.last_visit || 'No visits yet' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click.stop="viewChart(patient.id)" class="text-blue-600 hover:text-blue-900">Chart</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="!loading && patients.length === 0" class="p-12 text-center text-slate-500">
            No patients found. Add your first patient to get started.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { patientsService, type Patient } from '@/services/patients';
import { Search } from 'lucide-vue-next';

const router = useRouter();
const patients = ref<Patient[]>([]);
const loading = ref(false);
const showAddModal = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        patients.value = await patientsService.getPatients();
    } catch (e) {
        console.error('Failed to load patients', e);
    } finally {
        loading.value = false;
    }
});

const viewChart = (id: string) => {
    router.push(`/patients/${id}`);
};
</script>
