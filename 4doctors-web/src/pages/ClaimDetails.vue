<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-6 flex items-center justify-between">
       <div class="flex items-center gap-4">
           <button @click="$router.back()" class="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
               <ArrowLeft class="w-5 h-5" />
           </button>
           <div>
               <h1 class="text-2xl font-bold text-slate-900">Claim #{{ id.substring(0,8) }}</h1>
               <div class="text-sm text-slate-500 flex gap-4">
                   <span>Patient: {{ claim?.patient_name }}</span>
                   <span>Service Date: {{ claim?.service_date }}</span>
               </div>
           </div>
       </div>
       <div class="flex gap-2">
           <button class="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Print UB-04</button>
           <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Submit to Payer</button>
       </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-slate-400">Loading claim details...</div>
    <div v-else class="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
        <!-- Main Content -->
        <div class="col-span-8 space-y-6">
             <!-- Claim Lines -->
             <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div class="p-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">Service Lines</div>
                 <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">CPT</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Charge</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="line in claim?.lines" :key="line.id">
                            <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ line.cpt }}</td>
                            <td class="px-6 py-4 text-sm text-slate-900">{{ line.description }}</td>
                            <td class="px-6 py-4 text-sm text-slate-900 text-right">${{ line.charge.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="bg-slate-50 font-bold">
                        <tr>
                            <td colspan="2" class="px-6 py-4 text-right">Total Billed</td>
                            <td class="px-6 py-4 text-right">${{ claim?.total_billed.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                 </table>
             </div>
             
             <!-- Payer Info -->
             <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 class="font-bold text-slate-900 mb-4">Insurance Information</h3>
                 <div class="grid grid-cols-2 gap-4 text-sm">
                     <div>
                         <span class="block text-slate-500 text-xs">Primary Payer</span>
                         <span class="font-medium">Blue Cross Blue Shield</span>
                     </div>
                     <div>
                         <span class="block text-slate-500 text-xs">Payer ID</span>
                         <span class="font-medium">00940</span>
                     </div>
                     <div>
                         <span class="block text-slate-500 text-xs">Policy #</span>
                         <span class="font-medium">XJ8923982</span>
                     </div>
                     <div>
                         <span class="block text-slate-500 text-xs">Group #</span>
                         <span class="font-medium">99342</span>
                     </div>
                 </div>
             </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-4 space-y-6">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div class="mb-4">
                    <span class="block text-slate-500 text-xs mb-1">Current Status</span>
                    <span 
                        class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize"
                        :class="getStatusColor(claim?.status)"
                    >
                        {{ claim?.status.replace('_', ' ') }}
                    </span>
                </div>
                
                <div v-if="claim?.status === 'auth_required'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-4">
                    <AlertTriangle class="w-4 h-4 inline mr-1" /> This claim requires Prior Authorization for CPT 70450.
                    <button class="mt-2 text-xs font-bold underline">Initiate Request</button>
                </div>

                <div class="space-y-4 pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-3 text-sm text-slate-600">
                        <div class="w-2 h-2 rounded-full bg-slate-300"></div> Created Jan 24, 10:00 AM
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, AlertTriangle } from 'lucide-vue-next';

const route = useRoute();
const id = route.params.id as string;
const loading = ref(false);
const claim = ref<any>(null);

onMounted(async () => {
    loading.value = true;
    // Mock fetch
    setTimeout(() => {
        claim.value = {
            id: id,
            patient_name: 'John Doe',
            service_date: '2026-01-24',
            total_billed: 395.00,
            status: 'auth_required',
            lines: [
                { id: '1', cpt: '99213', description: 'Office Visit Level 3', charge: 120.00 },
                { id: '2', cpt: '70450', description: 'CT Head w/o Contrast', charge: 275.00 }
            ]
        };
        loading.value = false;
    }, 500);
});

const getStatusColor = (status: string) => {
    switch(status) {
        case 'auth_required': return 'bg-yellow-100 text-yellow-800';
        case 'paid': return 'bg-green-100 text-green-800';
        case 'submitted': return 'bg-blue-100 text-blue-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}
</script>
