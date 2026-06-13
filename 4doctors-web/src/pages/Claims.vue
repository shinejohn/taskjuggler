<template>
  <div class="space-y-6">
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Claims Management</h1>
        <p class="text-slate-500">Revenue Cycle & Prior Authorization</p>
      </div>
      <div class="flex items-center gap-3">
        <SearchInput 
          v-model="searchQuery" 
          placeholder="Search claims, patients..."
          @search="handleSearch"
          class="w-64"
        />
        <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md shadow-blue-200">
          <Plus class="w-4 h-4" /> New Claim
        </button>
      </div>
    </header>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="bg-white p-4 rounded-xl border border-slate-200">
        <p class="text-xs text-slate-500 font-medium uppercase">Draft</p>
        <p class="text-2xl font-bold text-slate-700 mt-1">{{ statusCounts.draft }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200">
        <p class="text-xs text-slate-500 font-medium uppercase">Submitted</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ statusCounts.submitted }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200">
        <p class="text-xs text-slate-500 font-medium uppercase">Pending Auth</p>
        <p class="text-2xl font-bold text-amber-600 mt-1">{{ statusCounts.auth_required }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200">
        <p class="text-xs text-slate-500 font-medium uppercase">Paid</p>
        <p class="text-2xl font-bold text-emerald-600 mt-1">{{ statusCounts.paid }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200">
        <p class="text-xs text-slate-500 font-medium uppercase">Denied</p>
        <p class="text-2xl font-bold text-red-600 mt-1">{{ statusCounts.denied }}</p>
      </div>
    </div>

    <!-- Filters -->
    <FilterPanel 
      :activeFilterCount="activeFilterCount" 
      @clear="clearFilters"
    >
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Status</label>
        <select v-model="filters.status" class="w-40 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="auth_required">Pending Auth</option>
          <option value="paid">Paid</option>
          <option value="denied">Denied</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Payer</label>
        <select v-model="filters.payer" class="w-48 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Payers</option>
          <option value="bcbs">Blue Cross Blue Shield</option>
          <option value="aetna">Aetna</option>
          <option value="united">United Healthcare</option>
          <option value="cigna">Cigna</option>
          <option value="medicare">Medicare</option>
          <option value="medicaid">Medicaid</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Date Range</label>
        <select v-model="filters.dateRange" class="w-40 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-400 uppercase">Amount</label>
        <select v-model="filters.amount" class="w-40 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">Any Amount</option>
          <option value="0-100">$0 - $100</option>
          <option value="100-500">$100 - $500</option>
          <option value="500-1000">$500 - $1,000</option>
          <option value="1000+">$1,000+</option>
        </select>
      </div>
    </FilterPanel>

    <!-- Results Summary -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        <span class="font-bold text-slate-700">{{ filteredClaims.length }}</span> claims 
        <span v-if="searchQuery || activeFilterCount > 0">
          (filtered from {{ claims.length }})
        </span>
        <span class="mx-2">•</span>
        Total: <span class="font-bold text-emerald-600">${{ totalBilled.toLocaleString() }}</span>
      </p>
      <button type="button" @click="refreshClaims" class="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1">
        <RefreshCw class="w-3 h-3" /> Sync Status
      </button>
    </div>

    <!-- Load Error -->
    <div v-if="loadError" class="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
      <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-slate-700 mb-1">Couldn't load claims</h3>
      <p class="text-sm text-slate-500 mb-4">Check your connection and try again.</p>
      <button type="button" @click="refreshClaims" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
        Retry
      </button>
    </div>

    <!-- Claims Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-400">Loading claims...</div>
      <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Claim ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CPT Codes</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payer</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="claim in filteredClaims" :key="claim.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-mono text-slate-600">{{ claim.id }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
              {{ claim.service_date }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-slate-900">{{ claim.patient_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span v-for="code in claim.cpt_codes" :key="code" class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                  {{ code }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
              {{ claim.payer || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <span class="text-sm font-bold text-slate-900">${{ claim.total_billed.toFixed(2) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span 
                class="px-2.5 py-1 text-xs font-bold rounded-full capitalize"
                :class="getStatusClass(claim.status)"
              >
                {{ claim.status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button 
                v-if="claim.status === 'draft'"
                @click="submitClaim(claim.id)"
                class="text-blue-600 hover:text-blue-900 font-bold"
              >
                Submit
              </button>
              <button 
                v-else-if="claim.status === 'auth_required'"
                @click="initiateAuth(claim.id)"
                class="text-amber-600 hover:text-amber-900 font-bold flex items-center gap-1"
              >
                <AlertTriangle class="w-3 h-3" /> Request Auth
              </button>
              <button 
                v-else-if="claim.status === 'denied'"
                @click="appealClaim(claim.id)"
                class="text-red-600 hover:text-red-900 font-bold"
              >
                Appeal
              </button>
              <button 
                v-else
                class="text-slate-400 hover:text-slate-600 font-medium"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <div v-if="!loading && filteredClaims.length === 0" class="p-12 text-center">
        <FileText class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-slate-700 mb-1">No claims found</h3>
        <p class="text-sm text-slate-500">Try adjusting your filters or create a new claim</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { claimsService, type Claim } from '@/services/claims';
import { AlertTriangle, Plus, RefreshCw, FileText } from 'lucide-vue-next';
import SearchInput from '@/components/ui/SearchInput.vue';
import FilterPanel from '@/components/ui/FilterPanel.vue';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const claims = ref<Claim[]>([]);
const loading = ref(false);
const searchQuery = ref('');

const filters = reactive({
  status: '',
  payer: '',
  dateRange: '',
  amount: ''
});

onMounted(async () => {
  await refreshClaims();
});

const loadError = ref(false);

const refreshClaims = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    claims.value = await claimsService.getClaims();
  } catch (e) {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
};

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.status) count++;
  if (filters.payer) count++;
  if (filters.dateRange) count++;
  if (filters.amount) count++;
  return count;
});

const statusCounts = computed(() => {
  const counts: Record<string, number> = { draft: 0, submitted: 0, auth_required: 0, paid: 0, denied: 0 };
  claims.value.forEach(c => {
    const status = c.status;
    if (status && counts[status] !== undefined) {
      counts[status] = (counts[status] ?? 0) + 1;
    }
  });
  return counts;
});

const filteredClaims = computed(() => {
  let result = claims.value;
  
  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(c => 
      c.patient_name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.cpt_codes.some(code => code.includes(q))
    );
  }
  
  // Status filter
  if (filters.status) {
    result = result.filter(c => c.status === filters.status);
  }
  
  // Amount filter
  if (filters.amount) {
    const parts = filters.amount.split('-');
    const minVal = parseFloat(parts[0] || '0') || 0;
    const maxVal = parts[1] === '1000+' || !parts[1] ? Infinity : parseFloat(parts[1]) || Infinity;
    result = result.filter(c => {
      if (filters.amount === '1000+') return c.total_billed >= 1000;
      return c.total_billed >= minVal && c.total_billed <= maxVal;
    });
  }
  
  return result;
});

const totalBilled = computed(() => {
  return filteredClaims.value.reduce((sum, c) => sum + c.total_billed, 0);
});

const clearFilters = () => {
  filters.status = '';
  filters.payer = '';
  filters.dateRange = '';
  filters.amount = '';
};

const handleSearch = (_query: string) => {
  // Could trigger API search here for larger datasets
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-slate-100 text-slate-600';
    case 'submitted': return 'bg-blue-100 text-blue-700';
    case 'auth_required': return 'bg-amber-100 text-amber-700';
    case 'paid': return 'bg-emerald-100 text-emerald-700';
    case 'denied': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const submitClaim = async (id: string) => {
  try {
    await claimsService.submitClaim(id);
    toast.success('Claim submitted.');
    await refreshClaims();
  } catch (e) {
    toast.error('Failed to submit claim.');
  }
};

const initiateAuth = (id: string) => {
  toast.info(`Connecting to Payer Portal for Prior Authorization (Claim ${id})...`);
};

const appealClaim = (id: string) => {
  toast.info(`Opening appeal workflow for Claim ${id}...`);
};
</script>
