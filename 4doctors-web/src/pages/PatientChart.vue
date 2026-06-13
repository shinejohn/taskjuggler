<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <!-- Header -->
    <header class="mb-6 flex items-center justify-between">
       <div class="flex items-center gap-4">
           <button type="button" aria-label="Go back" @click="$router.back()" class="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
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

    <div v-if="loadError" class="text-center py-12">
        <p class="text-slate-600 font-medium mb-4">Couldn't load this patient chart.</p>
        <button type="button" @click="loadChart" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Retry</button>
    </div>
    <div v-else-if="loading || !patient" class="text-center py-12 text-slate-400">Loading chart...</div>
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

            <!-- Clinical History Tabs -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-2 border-b border-slate-200 bg-slate-50 flex gap-2">
                    <button 
                        @click="activeHistoryTab = 'local'"
                        :class="`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeHistoryTab === 'local' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`"
                    >
                        Local History
                    </button>
                    <button 
                        @click="activeHistoryTab = 'network'"
                        :class="`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeHistoryTab === 'network' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`"
                    >
                        Network History (Federated)
                    </button>
                </div>

                <!-- Local History -->
                <div v-if="activeHistoryTab === 'local'" class="divide-y divide-slate-100">
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
                         No local clinical history found.
                      </div>
                </div>

                <!-- Network History -->
                <div v-else class="divide-y divide-slate-100">
                    <div class="p-4 bg-indigo-50/50 flex items-center gap-3">
                         <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                         <span class="text-xs font-bold text-indigo-700 uppercase">Live Network Feed via Universal Consent</span>
                    </div>
                    <div v-for="encounter in patient?.network_history" :key="encounter.id" class="p-4 hover:bg-slate-50 transition-colors">
                          <div class="flex justify-between items-start mb-2">
                              <div>
                                  <span class="font-bold text-slate-900">{{ encounter.encounter_date }}</span>
                                  <span class="ml-2 px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 uppercase font-black uppercase tracking-wide">{{ encounter.organization_name }}</span>
                              </div>
                          </div>
                          <p class="text-slate-600 text-sm mb-2"><span class="font-medium text-slate-700">Diagnosis:</span> {{ encounter.chief_complaint }}</p>
                          <div class="flex gap-2">
                              <button class="text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">Request External Note</button>
                          </div>
                      </div>
                      <div v-if="!patient?.network_history?.length" class="p-8 text-center text-slate-400">
                         No external records shared across the network.
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
import type { PatientChartData } from '@/services/patients';
import { claimsService } from '@/services/claims';
import { ArrowLeft, Mic, AlertOctagon } from 'lucide-vue-next';
import MedicationList from '@/components/patient/MedicationList.vue';
import VitalsChart from '@/components/patient/VitalsChart.vue';
import DocumentManager from '@/components/patient/DocumentManager.vue';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';

const toast = useToast();
const { confirm } = useConfirm();

const route = useRoute();
const router = useRouter();
const patient = ref<PatientChartData | null>(null);
const loading = ref(false);
const activeHistoryTab = ref('local');

const loadError = ref(false);

const loadChart = async () => {
    loading.value = true;
    loadError.value = false;
    try {
        const id = route.params.id as string;
        patient.value = await patientsService.getPatient(id);
    } catch (e) {
        loadError.value = true;
    } finally {
        loading.value = false;
    }
};

onMounted(loadChart);

const startScribe = (id?: string) => {
    router.push(id ? { path: '/scribe', query: { patient: id } } : '/scribe');
};

const generateClaim = async (encounterId: string) => {
    const confirmed = await confirm({
        title: 'Generate Claim',
        message: 'Generate a claim for this encounter?',
        confirmLabel: 'Generate',
    });
    if (!confirmed) return;
    try {
        await claimsService.generateClaim(encounterId);
        router.push('/claims');
    } catch (e) {
        toast.error('Failed to generate claim.');
    }
}
</script>
