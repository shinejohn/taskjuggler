<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Claims Management</h1>
        <p class="text-slate-500">Revenue Cycle & Prior Authorization</p>
      </div>
      <router-link to="/dashboard" class="text-sm font-medium text-blue-600 hover:underline">Back to Dashboard</router-link>
    </header>

    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <h2 class="font-semibold text-slate-900">Active Claims</h2>
           <div class="flex gap-2">
             <button class="px-3 py-1 text-xs font-medium bg-white border border-slate-300 rounded shadow-sm">Filter: All</button>
             <button class="px-3 py-1 text-xs font-medium bg-blue-600 text-white border border-blue-600 rounded shadow-sm">Sync Status</button>
           </div>
        </div>
        
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CPT Codes</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="claim in claims" :key="claim.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ claim.service_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {{ claim.patient_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <span v-for="code in claim.cpt_codes" :key="code" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 mr-1">
                  {{ code }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                ${{ claim.total_billed.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-yellow-100 text-yellow-800': claim.status === 'auth_required',
                        'bg-green-100 text-green-800': claim.status === 'paid',
                        'bg-blue-100 text-blue-800': claim.status === 'submitted',
                        'bg-slate-100 text-slate-800': claim.status === 'draft',
                    }"
                >
                  {{ claim.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                    v-if="claim.status === 'draft'"
                    @click="submitClaim(claim.id)"
                    class="text-blue-600 hover:text-blue-900"
                >
                    Submit
                </button>
                 <button 
                    v-else-if="claim.status === 'auth_required'"
                    @click="initiateAuth(claim.id)"
                    class="text-amber-600 hover:text-amber-900 flex items-center justify-end gap-1"
                >
                    <AlertTriangle class="w-4 h-4" /> Request Auth
                </button>
                <span v-else class="text-slate-400">View</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="claims.length === 0" class="p-12 text-center text-slate-500">
            No active claims found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { claimsService, type Claim } from '@/services/claims';
import { AlertTriangle } from 'lucide-vue-next';

const claims = ref<Claim[]>([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        claims.value = await claimsService.getClaims();
    } catch (e) {
        console.error('Failed to load claims', e);
    } finally {
        loading.value = false;
    }
});

const submitClaim = async (id: string) => {
    try {
        await claimsService.submitClaim(id);
        alert('Claim submitted!');
        // Refresh list
    } catch (e) {
        alert('Failed to submit claim');
    }
};

const initiateAuth = (id: string) => {
    alert(`Connecting to Payer Portal for Prior Authorization (Claim ${id})...`);
};
</script>
