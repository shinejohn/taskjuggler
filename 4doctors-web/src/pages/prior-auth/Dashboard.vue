<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Shield class="w-8 h-8 text-blue-600" />
                Prior Authorization Engine
            </h1>
            <p class="text-slate-500 mt-1">AI-driven coverage determination and automated submission.</p>
        </div>
        <div class="flex gap-3">
             <div class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <Zap class="w-4 h-4 text-amber-500" />
                <span class="text-sm font-bold text-slate-700">Auto-Approval Rate: 84%</span>
             </div>
             <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" /> New Auth Request
             </button>
        </div>
    </header>

    <!-- Stats Review -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
                <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-bold text-slate-900">12</span>
                    <span class="text-xs text-slate-400">requests</span>
                </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100">
                <Clock class="w-6 h-6 text-blue-600" />
            </div>
        </div>
        
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved (MTD)</p>
                 <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-bold text-slate-900">148</span>
                    <span class="text-xs text-emerald-600 font-bold">+15%</span>
                </div>
            </div>
             <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100">
                <CheckCircle2 class="w-6 h-6 text-emerald-600" />
            </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-red-300 transition-colors">
             <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Action Required</p>
                 <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-bold text-slate-900">3</span>
                    <span class="text-xs text-red-500 font-bold">Denials</span>
                </div>
            </div>
            <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                <AlertCircle class="w-6 h-6 text-red-600" />
            </div>
        </div>
    </div>

    <!-- Auth Request Queue -->
     <Card title="Active Authorizations">
        <template #header>
            <div class="flex gap-2">
                <button class="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200">Filter</button>
            </div>
        </template>
        <DataTable :columns="columns" :data="requests">
             <template #cell-status="{ row }">
                <Badge :variant="getStatusVariant(row.status)">{{ row.status }}</Badge>
             </template>
             <template #cell-type="{ row }">
                <div class="flex items-center gap-2">
                    <component :is="getTypeIcon(row.type)" class="w-4 h-4 text-slate-400" />
                    <span class="text-sm text-slate-700">{{ row.type }}</span>
                </div>
             </template>
             <template #cell-probability="{ row }">
                <div class="w-full bg-slate-100 rounded-full h-2 max-w-[100px] overflow-hidden">
                    <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${row.probability}%`"></div>
                </div>
                <span class="text-[10px] text-slate-500 mt-1 block">{{ row.probability }}% Success</span>
             </template>
              <template #actions>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-bold">View</button>
            </template>
        </DataTable>
     </Card>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
    Shield, Plus, Zap, Clock, CheckCircle2, AlertCircle, 
    Pill, Microscope, FileText 
} from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import DataTable from '@/components/ui/DataTable.vue';
import Badge from '@/components/ui/Badge.vue';

const columns = [
    { key: 'id', label: 'Auth ID' },
    { key: 'patient', label: 'Patient' },
    { key: 'item', label: 'Service / Medication' },
    { key: 'payer', label: 'Payer' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'probability', label: 'AI Confidence' },
];

const requests = ref([
    { id: 'AUTH-8921', patient: 'Sarah Johnson', item: 'MRI Brain w/ Contrast', payer: 'Blue Cross PPO', type: 'Radiology', status: 'Pending', probability: 92 },
    { id: 'AUTH-8922', patient: 'Michael Ross', item: 'Entresto 97/103mg', payer: 'United Healthcare', type: 'Medication', status: 'Approved', probability: 99 },
    { id: 'AUTH-8925', patient: 'Harvey Specter', item: 'Echocardiogram', payer: 'Aetna Select', type: 'Radiology', status: 'Denied/Appeal', probability: 45 },
    { id: 'AUTH-8928', patient: 'Donna Paulsen', item: 'Physical Therapy (12 sessions)', payer: 'Cigna', type: 'Service', status: 'Submitted', probability: 88 },
]);

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Approved': return 'success';
        case 'Pending': return 'warning';
        case 'Denied/Appeal': return 'danger';
        case 'Submitted': return 'info';
        default: return 'default';
    }
}

const getTypeIcon = (type: string) => {
     switch (type) {
        case 'Medication': return Pill;
        case 'Radiology': return Microscope;
        default: return FileText;
    }
}
</script>
