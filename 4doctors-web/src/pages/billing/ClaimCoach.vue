<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">ClaimCoach AI</h1>
        <p class="text-slate-500">Autonomous coding audit and optimization.</p>
      </div>
      <div class="flex gap-3">
        <div class="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-bold text-blue-900">+12% Revenue Opportunity</span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Coding Queue -->
      <div class="lg:col-span-1 space-y-4">
        <div class="flex items-center justify-between px-2">
            <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Audit Queue ({{ queue.length }})</h2>
            <button class="text-blue-600 text-xs font-bold hover:underline">Batch Approve</button>
        </div>
        <div v-for="item in queue" :key="item.id" 
            @click="selectedItem = item"
            :class="['p-4 rounded-xl border cursor-pointer transition-all', 
                     selectedItem?.id === item.id ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200']">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-slate-900 text-sm">{{ item.patient }}</h3>
                <Badge :variant="item.urgency === 'high' ? 'danger' : 'warning'">{{ item.status }}</Badge>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-500 mb-3 font-mono">
                <span>DOS: {{ item.dos }}</span>
                <span>•</span>
                <span>{{ item.provider }}</span>
            </div>
            <div class="flex gap-1 overflow-hidden">
                <span v-for="c in item.codes" :key="c" class="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">{{ c }}</span>
            </div>
        </div>
      </div>

      <!-- Right: Detailed Audit & Optimization -->
      <div v-if="selectedItem" class="lg:col-span-2 space-y-6">
        <Card :title="`Audit: ${selectedItem.patient}`">
            <template #header>
                 <div class="flex gap-2">
                     <button class="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ExternalLink class="w-4 h-4" /></button>
                 </div>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Current vs Recommended -->
                <div class="space-y-4">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Coding Comparison</h4>
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div class="text-[10px] font-bold text-slate-400 mb-2">PROVIDER SUBMISSION</div>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-sm font-mono font-bold">99213</span>
                            <span class="text-sm text-slate-900">$128.00</span>
                        </div>
                        <div class="text-[10px] font-bold text-blue-600 mb-2">AI OPTIMIZATION (RECOMMENDED)</div>
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-mono font-bold text-blue-900">99214</span>
                                <ArrowRight class="w-3 h-3 text-blue-400" />
                            </div>
                            <span class="text-sm font-bold text-blue-900">$185.00</span>
                        </div>
                        <p class="text-[10px] text-blue-600 leading-tight bg-blue-50 p-2 rounded-lg border border-blue-100">
                            <strong>Rationale:</strong> Clinical documentation supports Level 4 based on 3+ stable chronic conditions and moderate risk of complications (HCC score active).
                        </p>
                    </div>
                </div>

                <!-- Validation Issues -->
                <div class="space-y-4">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Alerts ({{ selectedItem.alerts.length }})</h4>
                    <div v-for="alert in selectedItem.alerts" :key="alert.id" class="p-4 rounded-xl border flex gap-3"
                        :class="alert.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'">
                        <AlertTriangle :class="['w-5 h-5 flex-shrink-0', alert.type === 'error' ? 'text-red-500' : 'text-amber-500']" />
                        <div>
                            <h5 :class="['text-xs font-bold', alert.type === 'error' ? 'text-red-900' : 'text-amber-900']">{{ alert.title }}</h5>
                            <p :class="['text-[10px] leading-tight mt-0.5', alert.type === 'error' ? 'text-red-700' : 'text-amber-700']">{{ alert.desc }}</p>
                        </div>
                    </div>
                    <div v-if="selectedItem.alerts.length === 0" class="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-100">
                        <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p class="text-xs font-bold text-emerald-900">Clean Claim Ready</p>
                        <p class="text-[10px] text-emerald-700 uppercase tracking-widest mt-1">Passing all scrubbers</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <button class="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg">Ignore Suggestions</button>
                    <button class="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Zap class="w-4 h-4 text-amber-400" /> Apply Fix & Submit
                    </button>
                </div>
            </template>
        </Card>

        <!-- Clinical Evidence (Note Preview) -->
        <Card title="Encounter Documentation Evidence">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 font-serif text-sm text-slate-700 leading-relaxed italic space-y-4">
                <p>"Patient presented for follow up of HTN, DM2, and newly diagnosed CKD Stage 3. BP today 142/88. Lab review shows GFR decline from 65 to 58..."</p>
                <div class="flex gap-2">
                    <span class="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">HTN</span>
                    <span class="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">DM2</span>
                    <span class="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded">CKD STAGE 3 (HCC)</span>
                </div>
            </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { TrendingUp, ArrowRight, AlertTriangle, ExternalLink, Zap, CheckCircle2 } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Badge from '@/components/ui/Badge.vue';

interface Alert {
  id: number;
  type: 'warning' | 'error';
  title: string;
  desc: string;
}

interface QueueItem {
  id: number;
  patient: string;
  status: string;
  urgency: 'high' | 'low' | 'medium';
  dos: string;
  provider: string;
  codes: string[];
  alerts: Alert[];
}

const queue: Ref<QueueItem[]> = ref([
    { id: 1, patient: 'Sarah Johnson', status: 'Audit Req', urgency: 'high', dos: '2026-01-24', provider: 'Dr. John Shine', codes: ['99213', 'I10', 'I95.1'], alerts: [{ id: 1, type: 'warning', title: 'Optimization Opportunity', desc: 'MDM supports 99214 (+ $57.00 revenue)' }] },
    { id: 2, patient: 'Mike Ross', status: 'Ready', urgency: 'low', dos: '2026-01-24', provider: 'Sarah Nurse', codes: ['99214', 'I11.0', 'E11.9'], alerts: [] },
    { id: 3, patient: 'Harvey Specter', status: 'Incomplete', urgency: 'medium', dos: '2026-01-23', provider: 'Dr. John Shine', codes: ['99212', 'M54.5'], alerts: [{ id: 2, type: 'error', title: 'Missing Modifier', desc: 'CPT 20610 requires modifier 50 for bilateral (+$112.00)' }] },
]);

const selectedItem = ref<QueueItem | null>(null);

onMounted(() => {
    if (queue.value.length > 0) {
        selectedItem.value = queue.value[0] || null;
    }
});
</script>
