<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Referrals & Care Coordination</h1>
        <p class="text-slate-500 mt-1">Manage incoming and outgoing patient transfers.</p>
      </div>
      <router-link to="/docconnect" class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2">
         <Plus class="w-4 h-4" /> New Referral
      </router-link>
    </header>

    <div class="flex items-center gap-2 border-b border-slate-200">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="currentTab = tab.id"
        :class="`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-2 px-1.5 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Referrals List -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div v-if="referrals.length === 0" class="p-20 text-center">
        <p class="text-slate-400">No referrals in this folder.</p>
      </div>
      
      <table v-else class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{{ currentTab === 'incoming' ? 'Referring Provider' : 'Receiving Provider' }}</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialty / Reason</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="ref in referrals" :key="ref.id" class="hover:bg-slate-50/50 transition-colors group cursor-pointer">
             <td class="px-6 py-4">
               <p class="font-bold text-slate-900 mb-0.5">{{ ref.patient.first_name }} {{ ref.patient.last_name }}</p>
               <p class="text-xs text-slate-400">DOB: {{ ref.patient.dob || '01/01/1980' }}</p>
             </td>
             <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100" class="w-8 h-8 rounded-full bg-slate-100" />
                  <div>
                    <p class="text-sm font-bold text-slate-900">Dr. {{ ref.provider?.user?.last_name || 'Unknown' }}</p>
                    <p class="text-xs text-slate-400">{{ ref.provider?.specialty || 'General' }}</p>
                  </div>
                </div>
             </td>
             <td class="px-6 py-4">
               <p class="text-sm font-medium text-slate-700">{{ ref.specialty_requested }}</p>
               <p class="text-xs text-slate-400 truncate max-w-[200px]">{{ ref.clinical_reason }}</p>
             </td>
             <td class="px-6 py-4 text-sm text-slate-500">
               {{ new Date(ref.created_at).toLocaleDateString() }}
               <div v-if="ref.urgency === 'stat'" class="text-xs font-bold text-rose-600 uppercase mt-1">S T A T</div>
             </td>
             <td class="px-6 py-4">
               <span :class="`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(ref.status)}`">
                 {{ ref.status }}
               </span>
               <div v-if="ref.requires_prior_auth" class="mt-2 text-[10px] font-bold text-amber-600 flex items-center gap-1">
                 <ShieldCheck class="w-3 h-3" /> PA Req
               </div>
             </td>
             <td class="px-6 py-4 text-right">
               <button class="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                 <ChevronRight class="w-4 h-4" />
               </button>
             </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, ShieldCheck, ChevronRight } from 'lucide-vue-next';

const currentTab = ref('incoming');

const tabs = [
  { id: 'incoming', label: 'Incoming Needs Action', count: 4 },
  { id: 'outgoing', label: 'Outgoing & Tracking', count: 12 },
  { id: 'history', label: 'Completed History' }
];

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    'sent': 'bg-blue-100 text-blue-700',
    'viewed': 'bg-purple-100 text-purple-700',
    'accepted': 'bg-emerald-100 text-emerald-700',
    'scheduled': 'bg-green-100 text-green-700',
    'completed': 'bg-slate-100 text-slate-600',
    'declined': 'bg-rose-100 text-rose-700'
  };
  return map[status] || 'bg-slate-100 text-slate-500';
};

// Mock Data for now - would connect to store in next iteration
const referrals = computed(() => {
  return [
    {
      id: '1',
      patient: { first_name: 'Marcus', last_name: 'Johnson', dob: '05/12/1982' },
      provider: { user: { last_name: 'Chen' }, specialty: 'Cardiology' },
      specialty_requested: 'Cardiology',
      clinical_reason: 'Eval for new onset atrial fibrillation.',
      created_at: '2026-02-01',
      urgency: 'routine',
      status: 'sent',
      requires_prior_auth: true
    },
    {
      id: '2',
      patient: { first_name: 'Sarah', last_name: 'Connor', dob: '02/28/1990' },
      provider: { user: { last_name: 'Reese' }, specialty: 'Orthopedics' },
      specialty_requested: 'Orthopedics',
      clinical_reason: 'Possible meniscus tear left knee.',
      created_at: '2026-01-29',
      urgency: 'urgent',
      status: 'accepted',
      requires_prior_auth: true
    }
  ];
});
</script>
