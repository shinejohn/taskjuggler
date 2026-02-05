<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
        <button @click="$router.back()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
            <h1 class="text-2xl font-bold text-slate-900">New Prescription</h1>
            <p class="text-slate-500">e-Prescribe with automated safety checks.</p>
        </div>
    </div>

    <!-- Rx Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Patient & Med Selection -->
        <div class="lg:col-span-2 space-y-6">
            <Card title="Prescription Details">
                <div class="space-y-6">
                    <!-- Patient Search -->
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">Patient</label>
                        <div class="relative">
                            <Search class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input type="text" placeholder="Search patient..." class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all font-medium" value="Sarah Johnson">
                        </div>
                        <div class="flex gap-2 text-xs text-slate-500 pl-1">
                            <span>DOB: 05/12/1984</span>
                            <span>•</span>
                            <span class="text-red-500 font-bold">Allergies: Penicillin, Latex</span>
                        </div>
                    </div>

                    <!-- Medication Search -->
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">Medication</label>
                        <div class="relative">
                            <Pill class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input v-model="medicationQuery" type="text" placeholder="Search drug name..." class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                        </div>
                    </div>

                    <!-- Sig / Instructions -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700">Dosage</label>
                            <input type="text" placeholder="e.g. 10mg" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700">Quantity</label>
                            <input type="text" placeholder="#30" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                        </div>
                        <div class="col-span-2 space-y-2">
                            <label class="text-sm font-bold text-slate-700">Sig (Instructions)</label>
                            <textarea placeholder="e.g. Take 1 tablet by mouth daily" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg h-24 resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Pharmacy">
                 <div class="p-4 border border-indigo-100 bg-indigo-50 rounded-lg flex items-start gap-3">
                    <MapPin class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div class="flex-1">
                        <h4 class="font-bold text-indigo-900">CVS Pharmacy #4882</h4>
                        <p class="text-sm text-indigo-700">123 Main St, Boston, MA 02116</p>
                        <p class="text-xs text-indigo-600 mt-1">Tel: (617) 555-0123</p>
                    </div>
                    <button class="text-xs font-bold text-indigo-600 hover:underline">Change</button>
                 </div>
            </Card>
        </div>

        <!-- Right Column: Safety Checks -->
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-100">
                     <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert class="w-5 h-5 text-orange-500" />
                        Safety Checks
                     </h3>
                </div>
                <div class="p-4 space-y-4">
                    <!-- Interaction Alert -->
                    <div v-if="medicationQuery.toLowerCase().includes('war')" class="animate-pulse bg-red-50 border border-red-100 rounded-lg p-3">
                         <div class="flex gap-2">
                            <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <h4 class="text-sm font-bold text-red-800">Severe Interaction</h4>
                                <p class="text-xs text-red-700 leading-relaxed mt-1">
                                    <strong>Warfarin</strong> interacts with <strong>Aspirin</strong> (Active List). Increases bleeding risk significantly.
                                </p>
                            </div>
                         </div>
                    </div>

                    <!-- Allergy Alert -->
                     <div v-if="medicationQuery.toLowerCase().includes('cill')" class="bg-red-50 border border-red-100 rounded-lg p-3">
                         <div class="flex gap-2">
                            <AlertOctagon class="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <h4 class="text-sm font-bold text-red-800">Allergy Warning</h4>
                                <p class="text-xs text-red-700 leading-relaxed mt-1">
                                    Patient has a documented allergy to <strong>Penicillin</strong>.
                                </p>
                            </div>
                         </div>
                    </div>

                    <!-- Success State if no alerts -->
                    <div v-if="!hasAlerts" class="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle2 class="w-12 h-12 text-emerald-500 mb-2" />
                        <h4 class="font-bold text-slate-900">No Interactions Found</h4>
                        <p class="text-xs text-slate-500">Checked against 14 active meds.</p>
                    </div>
                </div>
            </div>

            <!-- Formulary Info -->
             <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Formulary Status (BCBS)</h4>
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    <span class="text-sm font-bold text-slate-700">Tier 1 - Preferred Generic</span>
                </div>
                <p class="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                    Est. Copay: <strong>$10.00</strong>
                </p>
            </div>

            <button class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                <Send class="w-4 h-4" /> Sign & Send Rx
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
    ArrowLeft, Search, Pill, MapPin, ShieldAlert, AlertTriangle, 
    AlertOctagon, CheckCircle2, Send 
} from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
// import Badge from '@/components/ui/Badge.vue';

const medicationQuery = ref('');

const hasAlerts = computed(() => {
    const q = medicationQuery.value.toLowerCase();
    return q.includes('war') || q.includes('cill');
});
</script>
