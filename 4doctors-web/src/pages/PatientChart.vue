<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <!-- Header -->
    <header class="mb-6 flex items-center justify-between">
       <div class="flex items-center gap-4">
           <button @click="$router.back()" class="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
               <ArrowLeft class="w-5 h-5" />
           </button>
           <div>
               <h1 v-if="patient" class="text-2xl font-bold text-slate-900">{{ patient.first_name }} {{ patient.last_name }}</h1>
               <div v-if="patient" class="text-sm text-slate-500 flex gap-4">
                   <span>DOB: {{ patient.dob }}</span>
                   <span>Sex: M</span>
                   <span>MRN: #{{ patient.id.substring(0,6) }}</span>
               </div>
           </div>
       </div>
       <div class="flex gap-2">
           <button @click="startScribe(patient?.id)" class="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2">
               <Mic class="w-4 h-4" /> Start Encounter (Scribe)
           </button>
           <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Edit Profile</button>
       </div>
    </header>

    <div v-if="loading || !patient" class="text-center py-12 text-slate-400">Loading chart...</div>
    <div v-else class="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        <!-- Left Column: Summary & Meds -->
        <div class="col-span-12 md:col-span-4 space-y-6">
            <!-- Vitals -->
            <VitalsChart />

            <!-- Medications -->
            <MedicationList :patientId="patient.id" :initialMedications="patient.medications || []" />
            
            <!-- Allergies -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 class="font-semibold text-slate-900 mb-3 flex items-center gap-2"><AlertOctagon class="w-4 h-4 text-slate-400"/> Allergies</h3>
                <div class="text-sm text-slate-500 italic">NKDA (No Known Drug Allergies)</div>
            </div>
        </div>

        <!-- Center Column: Clinical History & Docs -->
        <div class="col-span-12 md:col-span-8 space-y-6">
            <!-- Documents -->
            <DocumentManager />

            <!-- Recent Encounters -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Clinical History</h3>
                    <button class="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <div class="divide-y divide-slate-100">
                     <div v-for="encounter in patient?.encounters" :key="encounter.id" class="p-4 hover:bg-slate-50 transition-colors">
                         <div class="flex justify-between items-start mb-2">
                             <div>
                                 <span class="font-bold text-slate-900">{{ encounter.encounter_date }}</span>
                                 <span class="ml-2 px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 uppercase tracking-wide">{{ encounter.type.replace('_', ' ') }}</span>
                             </div>
                             <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">{{ encounter.status }}</span>
                         </div>
                         <p class="text-slate-600 text-sm mb-2"><span class="font-medium text-slate-700">Chief Complaint:</span> {{ encounter.chief_complaint }}</p>
                         <div class="flex gap-2">
                             <button class="text-xs text-blue-600 border border-blue-200 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">View Note</button>
                             <button @click="generateClaim(encounter.id)" class="text-xs text-slate-600 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">Generate Claim</button>
                         </div>
                     </div>
                     <div v-if="!patient?.encounters?.length" class="p-8 text-center text-slate-400">
                        No clinical history found.
                     </div>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientsService } from '@/services/patients';
import { claimsService } from '@/services/claims';
import { ArrowLeft, Mic, AlertOctagon } from 'lucide-vue-next';
import MedicationList from '@/components/patient/MedicationList.vue';
import VitalsChart from '@/components/patient/VitalsChart.vue';
import DocumentManager from '@/components/patient/DocumentManager.vue';

const route = useRoute();
const router = useRouter();
const patient = ref<any>(null);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const id = route.params.id as string;
        patient.value = await patientsService.getPatient(id);
    } catch (e) {
        console.error('Failed to load chart', e);
    } finally {
        loading.value = false;
    }
});

const startScribe = (id: string) => {
    console.log('Starting Scribe for patient', id);
    router.push('/scribe');
};

const generateClaim = async (encounterId: string) => {
    try {
        if(confirm('Generate claim for this encounter?')) {
             await claimsService.generateClaim(encounterId);
             router.push('/claims');
        }
    } catch (e) {
        alert('Failed to generate claim');
    }
}
</script>
