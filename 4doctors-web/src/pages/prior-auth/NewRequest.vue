<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
            <h1 class="text-2xl font-bold text-slate-900">New Authorization Request</h1>
            <p class="text-slate-500">AI-assisted submission wizard.</p>
        </div>
    </div>

    <!-- Wizard Steps -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Progress Bar -->
        <div class="bg-slate-50 border-b border-slate-100 p-4">
            <div class="flex items-center justify-between max-w-2xl mx-auto">
                <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center relative z-10">
                    <div 
                        :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300', 
                                 currentStep > index + 1 ? 'bg-emerald-500 text-white' : 
                                 currentStep === index + 1 ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-50' : 'bg-slate-200 text-slate-500']"
                    >
                        <Check v-if="currentStep > index + 1" class="w-5 h-5" />
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <span :class="['text-xs font-bold mt-2 uppercase tracking-wider', currentStep === index + 1 ? 'text-blue-600' : 'text-slate-400']">{{ step }}</span>
                </div>
                <!-- Connector Line -->
                <div class="absolute top-8 left-0 w-full h-[2px] bg-slate-100 -z-0"></div> 
            </div>
        </div>

        <div class="p-8 min-h-[400px]">
            <!-- Step 1: Patient Context -->
            <div v-if="currentStep === 1" class="space-y-6 animate-fade-in-up">
                <h3 class="text-lg font-bold text-slate-800 mb-4">Select Patient & Coverage</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">Patient Search</label>
                        <div class="relative">
                            <Search class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                            <input type="text" placeholder="Search by name or MRN..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all">
                        </div>
                    </div>
                    <div class="space-y-2">
                         <label class="text-sm font-bold text-slate-700">Insurance Plan</label>
                         <select class="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" disabled>
                            <option>Select Patient First</option>
                         </select>
                    </div>
                </div>

                <!-- Recent Patients Quick Select -->
                <div class="mt-6">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Patients</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div @click="selectPatient" class="p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">SJ</div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">Sarah Johnson</p>
                                <p class="text-[10px] text-slate-500">BCBS PPO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 2: Service Selection -->
            <div v-if="currentStep === 2" class="space-y-6 animate-fade-in-up">
                <h3 class="text-lg font-bold text-slate-800 mb-4">Procedure / Service Details</h3>
                <div class="space-y-4">
                     <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex justify-between items-start mb-2">
                             <div>
                                <h4 class="font-bold text-slate-900">Sarah Johnson (DOB: 05/12/1984)</h4>
                                <p class="text-sm text-slate-500">Blue Cross Blue Shield • ID: XJ8921002</p>
                             </div>
                             <button class="text-xs text-blue-600 font-bold hover:underline">Change</button>
                        </div>
                     </div>

                     <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">CPT / HCPCS Code</label>
                        <input type="text" placeholder="e.g. 73721 (MRI Knee)" class="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                     </div>
                     
                     <div class="space-y-2">
                        <label class="text-sm font-bold text-slate-700">Diagnosis (ICD-10)</label>
                        <input type="text" placeholder="Search diagnoses..." class="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                     </div>
                </div>
            </div>

            <!-- Step 3: AI Evidence Analysis -->
            <div v-if="currentStep === 3" class="space-y-6 animate-fade-in-up">
                <div class="flex items-center gap-3 mb-6">
                    <div class="p-2 bg-purple-100 rounded-lg">
                        <Sparkles class="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">AI Coverage Analysis</h3>
                        <p class="text-sm text-slate-500">Reviewing clinical notes against payer guidelines...</p>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span class="text-sm font-bold text-slate-700">Required criteria for CPT 73721 (MRI Knee)</span>
                        <Badge variant="purple">BCBS Policy #RAD-022</Badge>
                    </div>
                    <div class="divide-y divide-slate-100">
                        <div class="p-4 flex gap-3">
                            <CheckCircle2 class="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div>
                                <p class="text-sm font-medium text-slate-900">Recent X-Ray completed (within 6 weeks)</p>
                                <p class="text-xs text-slate-500 mt-1">Found in note dated 01/10/2026: "X-ray shows no fracture, mild degeneration."</p>
                            </div>
                        </div>
                        <div class="p-4 flex gap-3">
                            <CheckCircle2 class="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div>
                                <p class="text-sm font-medium text-slate-900">Failure of conservative therapy (> 4 weeks)</p>
                                <p class="text-xs text-slate-500 mt-1">Found in note dated 12/15/2025: "Patient completed 6 weeks of PT with no relief."</p>
                            </div>
                        </div>
                        <div class="p-4 flex gap-3 bg-red-50/50">
                            <AlertCircle class="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <p class="text-sm font-medium text-red-900">Knee Instability Documented</p>
                                <p class="text-xs text-red-700 mt-1">Not explicitly found in recent notes. Please attest or attach addendum.</p>
                                <button class="mt-2 text-xs font-bold text-blue-600 hover:underline">+ Add Clinical Note</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Review & Submit -->
            <div v-if="currentStep === 4" class="text-center space-y-6 animate-fade-in-up">
                <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap class="w-10 h-10 text-emerald-600" />
                </div>
                <h3 class="text-2xl font-bold text-slate-900">Ready to Submit</h3>
                <p class="text-slate-500 max-w-md mx-auto">
                    AI predicts a <strong class="text-emerald-600">92% chance of instant approval</strong> based on the provided evidence.
                </p>

                <div class="bg-slate-50 rounded-xl p-6 max-w-md mx-auto text-left space-y-3 border border-slate-200">
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Information Delivery</span>
                        <span class="font-bold text-slate-900">Electronic (X12 278)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Estimated Decision</span>
                        <span class="font-bold text-slate-900">Real-time (< 1 min)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
            <button 
                v-if="currentStep > 1" 
                @click="currentStep--" 
                class="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
            >
                Back
            </button>
            <div v-else></div> <!-- Spacer -->

            <button 
                v-if="currentStep < 4" 
                @click="currentStep++" 
                class="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg transition-all"
            >
                Next Step
            </button>
            <button 
                v-else 
                @click="$router.push('/prior-auth')" 
                class="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg transition-all flex items-center gap-2"
            >
                <Send class="w-4 h-4" /> Submit Request
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, Search, Check, CheckCircle2, AlertCircle, Sparkles, Zap, Send } from 'lucide-vue-next';
import Badge from '@/components/ui/Badge.vue';

const currentStep = ref(1);
const steps = ['Patient', 'Services', 'Evidence', 'Submit'];

const selectPatient = () => {
    // Mock selection
    currentStep.value = 2;
}
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
