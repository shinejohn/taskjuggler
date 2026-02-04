<template>
  <div class="space-y-6">
     <div class="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Pill class="w-8 h-8 text-indigo-600" />
                E-Prescribing (EPCS)
            </h1>
            <p class="text-slate-500 mt-1">Manage prescriptions, refills, and pharmacy communication.</p>
        </div>
        <div class="flex gap-3">
             <div class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <Wifi class="w-4 h-4 text-emerald-500" />
                <span class="text-sm font-bold text-slate-700">Surescripts: Online</span>
             </div>
             <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" /> New Rx
             </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- New Refill Requests -->
        <Card title="Refill Queue" class="lg:col-span-1">
            <template #header>
                <Badge variant="warning">3 Pending</Badge>
            </template>
            <div class="space-y-3">
                <div v-for="req in refillQueue" :key="req.id" class="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer group shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-slate-900">{{ req.patient }}</h4>
                         <span class="text-[10px] font-bold text-slate-400 uppercase">{{ req.source }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-indigo-700 font-bold bg-indigo-50 p-2 rounded-lg mb-3">
                        <Pill class="w-4 h-4" />
                        {{ req.med }}
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Deny</button>
                        <button class="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-md">Approve</button>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Active Prescriptions -->
        <Card title="Recent Activity" class="lg:col-span-2">
             <DataTable :columns="columns" :data="recentScripts">
                <template #cell-status="{ row }">
                     <Badge :variant="row.status === 'Sent' ? 'success' : 'default'">{{ row.status }}</Badge>
                </template>
                <template #cell-pharmacy="{ row }">
                    <div class="flex items-center gap-1.5">
                        <MapPin class="w-3 h-3 text-slate-400" />
                        <span class="text-sm text-slate-600 truncate max-w-[150px]">{{ row.pharmacy }}</span>
                    </div>
                </template>
             </DataTable>
        </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pill, Plus, Wifi, MapPin } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import DataTable from '@/components/ui/DataTable.vue';
import Badge from '@/components/ui/Badge.vue';

const refillQueue = ref([
    { id: 1, patient: 'Sarah Johnson', med: 'Lisinopril 10mg', source: 'CVS Pharmacy' },
    { id: 2, patient: 'Mike Ross', med: 'Adderall XR 20mg', source: 'Surescripts' },
    { id: 3, patient: 'Harvey Specter', med: 'Atorvastatin 40mg', source: 'Pt Portal' },
]);

const columns = [
    { key: 'date', label: 'Date/Time' },
    { key: 'patient', label: 'Patient' },
    { key: 'med', label: 'Medication' },
    { key: 'pharmacy', label: 'Pharmacy' },
    { key: 'status', label: 'Status' },
];

const recentScripts = ref([
    { id: 1, date: 'Today 10:45 AM', patient: 'Sarah Johnson', med: 'Amoxicillin 500mg', pharmacy: 'CVS #4882 - Boston', status: 'Sent' },
    { id: 2, date: 'Today 09:30 AM', patient: 'Jessica Pearson', med: 'Zofran 4mg ODT', pharmacy: 'Walgreens #12 - NYC', status: 'Sent' },
    { id: 3, date: 'Yesterday 4:15 PM', patient: 'Louis Litt', med: 'Xanax 0.5mg', pharmacy: 'Duane Reade', status: 'Pending EPCS' },
]);
</script>
