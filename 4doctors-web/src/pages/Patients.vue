<template>
  <div class="space-y-6">
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Patients</h1>
        <p class="text-slate-500">Manage clinical records and history</p>
      </div>
      <div class="flex items-center gap-3">
        <SearchInput 
          v-model="searchQuery" 
          placeholder="Search patients..."
          @search="handleSearch"
          class="w-64"
        />
        <button @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md shadow-blue-200">
          <UserPlus class="w-4 h-4" /> Add Patient
        </button>
      </div>
    </header>

    <!-- Filters -->
    <FilterPanel 
      :activeFilterCount="activeFilterCount" 
      @clear="clearFilters"
    >
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Status</label>
        <select v-model="filters.status" class="w-40 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Insurance</label>
        <select v-model="filters.insurance" class="w-48 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Insurance</option>
          <option value="bcbs">Blue Cross Blue Shield</option>
          <option value="aetna">Aetna</option>
          <option value="united">United Healthcare</option>
          <option value="cigna">Cigna</option>
          <option value="medicare">Medicare</option>
          <option value="medicaid">Medicaid</option>
          <option value="self-pay">Self Pay</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Last Visit</label>
        <select v-model="filters.lastVisit" class="w-44 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">Any Time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="never">No visits yet</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Provider</label>
        <select v-model="filters.provider" class="w-48 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Providers</option>
          <option value="dr-smith">Dr. Smith</option>
          <option value="dr-johnson">Dr. Johnson</option>
          <option value="dr-williams">Dr. Williams</option>
        </select>
      </div>
    </FilterPanel>

    <!-- Results Summary -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        Showing <span class="font-bold text-slate-700">{{ filteredPatients.length }}</span> 
        of <span class="font-bold text-slate-700">{{ patients.length }}</span> patients
      </p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          aria-label="Table view"
          :aria-pressed="viewMode === 'table'"
          :class="['p-2 rounded-lg transition-colors', viewMode === 'table' ? 'bg-slate-200' : 'hover:bg-slate-100']"
          @click="viewMode = 'table'"
        >
          <List class="w-4 h-4 text-slate-600" />
        </button>
        <button
          type="button"
          aria-label="Card view"
          :aria-pressed="viewMode === 'cards'"
          :class="['p-2 rounded-lg transition-colors', viewMode === 'cards' ? 'bg-slate-200' : 'hover:bg-slate-100']"
          @click="viewMode = 'cards'"
        >
          <LayoutGrid class="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>

    <!-- Load Error -->
    <div v-if="loadError" class="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
      <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-slate-700 mb-1">Couldn't load patients</h3>
      <p class="text-sm text-slate-500 mb-4">Check your connection and try again.</p>
      <button type="button" @click="loadPatients" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
        Retry
      </button>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-400">Loading patients...</div>
      <table v-else class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">DOB / Age</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Insurance</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Visit</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-slate-50 cursor-pointer" @click="viewChart(patient.id)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                  {{ getInitials(patient) }}
                </div>
                <div>
                  <div class="text-sm font-medium text-slate-900">{{ patient.first_name }} {{ patient.last_name }}</div>
                  <div class="text-xs text-slate-400 font-mono">MRN: {{ patient.mrn || patient.id.slice(0,8) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-700">{{ formatDate(patient.dob) }}</div>
              <div class="text-xs text-slate-400">{{ calculateAge(patient.dob) }} yrs</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-600">{{ maskPhone(patient.phone) }}</div>
              <div class="text-xs text-slate-400 truncate max-w-[150px]">{{ maskEmail(patient.email) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-slate-600">{{ patient.insurance || 'Self Pay' }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
              {{ patient.last_visit || 'No visits yet' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2 py-1 text-xs font-bold rounded-full', 
                            patient.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']">
                {{ patient.status || 'Active' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click.stop="viewChart(patient.id)" class="text-blue-600 hover:text-blue-900 font-bold">View Chart</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="!loading && filteredPatients.length === 0" class="p-12 text-center">
        <Users class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-slate-700 mb-1">No patients found</h3>
        <p class="text-sm text-slate-500">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Card View -->
    <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="patient in filteredPatients" :key="patient.id"
        @click="viewChart(patient.id)"
        class="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
            {{ getInitials(patient) }}
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-slate-900">{{ patient.first_name }} {{ patient.last_name }}</h4>
            <p class="text-xs text-slate-400 font-mono">MRN: {{ patient.mrn || patient.id.slice(0,8) }}</p>
          </div>
          <span :class="['px-2 py-1 text-[10px] font-bold rounded-full', 
                        patient.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']">
            {{ patient.status || 'Active' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p class="text-slate-400">DOB</p>
            <p class="font-medium text-slate-700">{{ formatDate(patient.dob) }}</p>
          </div>
          <div>
            <p class="text-slate-400">Age</p>
            <p class="font-medium text-slate-700">{{ calculateAge(patient.dob) }} yrs</p>
          </div>
          <div>
            <p class="text-slate-400">Phone</p>
            <p class="font-medium text-slate-700">{{ maskPhone(patient.phone) }}</p>
          </div>
          <div>
            <p class="text-slate-400">Last Visit</p>
            <p class="font-medium text-slate-700">{{ patient.last_visit || 'None' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { patientsService, type Patient } from '@/services/patients';
import { UserPlus, Users, List, LayoutGrid, AlertTriangle } from 'lucide-vue-next';
import SearchInput from '@/components/ui/SearchInput.vue';
import FilterPanel from '@/components/ui/FilterPanel.vue';
import { maskPhone, maskEmail } from '@/utils/phi';

const router = useRouter();
const patients = ref<Patient[]>([]);
const loading = ref(false);
const showAddModal = ref(false);
const searchQuery = ref('');
const viewMode = ref<'table' | 'cards'>('table');

const filters = reactive({
  status: '',
  insurance: '',
  lastVisit: '',
  provider: ''
});

const loadError = ref(false);

const loadPatients = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    patients.value = await patientsService.getPatients();
  } catch (e) {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(loadPatients);

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.status) count++;
  if (filters.insurance) count++;
  if (filters.lastVisit) count++;
  if (filters.provider) count++;
  return count;
});

const filteredPatients = computed(() => {
  let result = patients.value;
  
  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.mrn?.toLowerCase().includes(q)
    );
  }
  
  // Status filter
  if (filters.status) {
    result = result.filter(p => (p.status || 'active') === filters.status);
  }
  
  // More filters would be implemented similarly
  
  return result;
});

const clearFilters = () => {
  filters.status = '';
  filters.insurance = '';
  filters.lastVisit = '';
  filters.provider = '';
};

const handleSearch = (_query: string) => {
  // Could trigger API search here for larger datasets
};

const viewChart = (id: string) => {
  router.push(`/patients/${id}`);
};

const getInitials = (patient: Patient) => {
  const first = patient.first_name?.[0] || '';
  const last = patient.last_name?.[0] || '';
  return (first + last).toUpperCase();
};

const formatDate = (dob: string | undefined) => {
  if (!dob) return 'N/A';
  return new Date(dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const calculateAge = (dob: string | undefined) => {
  if (!dob) return '--';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
</script>
