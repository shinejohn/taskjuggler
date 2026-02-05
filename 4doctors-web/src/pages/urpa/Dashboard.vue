<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div class="relative z-10">
            <h1 class="text-3xl font-bold mb-2">Good morning, Dr. Shine</h1>
            <p class="text-purple-100 opacity-90 text-lg">You have 3 priority tasks and 12 appointments today.</p>
            
            <button class="mt-6 flex items-center gap-2 bg-white text-purple-600 px-6 py-2.5 rounded-full font-semibold hover:bg-purple-50 transition-colors shadow-md">
                <Mic class="w-5 h-5" />
                "Hey URPA, what's next?"
            </button>
        </div>
        <Bot class="w-32 h-32 absolute -right-4 -bottom-4 text-white opacity-20 transform rotate-12" />
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Today's Schedule -->
        <div class="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-purple-500" /> Today's Agenda
            </h2>
            <div class="space-y-4">
                 <div class="flex gap-4 p-3 bg-slate-50 rounded-lg border-l-4 border-purple-500">
                    <div class="text-center w-16">
                        <span class="block text-xl font-bold text-slate-900">9:00</span>
                        <span class="text-xs text-slate-500">AM</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-900">New Patient Consult</h3>
                        <p class="text-sm text-slate-600">Sarah Johnson • Cardiology</p>
                    </div>
                 </div>
                 <div class="flex gap-4 p-3 bg-white rounded-lg border border-slate-200">
                    <div class="text-center w-16">
                        <span class="block text-xl font-bold text-slate-400">9:30</span>
                        <span class="text-xs text-slate-400">AM</span>
                    </div>
                    <div>
                        <h3 class="font-medium text-slate-500">Follow-up</h3>
                        <p class="text-sm text-slate-400">Mike Ross • Review Labs</p>
                    </div>
                 </div>
            </div>
        </div>

        <!-- Quick AI Commands -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
             <!-- Quick Actions -->
             <div>
                <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Command class="w-5 h-5 text-purple-500" /> Quick Actions
                </h2>
                <div class="space-y-2">
                    <button class="w-full text-left p-3 rounded-lg hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-colors flex items-center gap-3">
                        <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Mail class="w-4 h-4" />
                        </div>
                        <span class="text-sm font-medium text-slate-700">Draft referral letter</span>
                    </button>
                     <button class="w-full text-left p-3 rounded-lg hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-colors flex items-center gap-3">
                        <div class="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Phone class="w-4 h-4" />
                        </div>
                        <span class="text-sm font-medium text-slate-700">Call patient back</span>
                    </button>
                </div>
            </div>

            <!-- Workflows -->
            <div class="pt-6 border-t border-slate-100">
                <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <GitBranch class="w-5 h-5 text-purple-500" /> Active Workflows
                </h2>
                <div class="space-y-3">
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm group-hover:text-purple-700">New Patient Onboarding</h4>
                            <p class="text-xs text-slate-500">Trigger: Registration</p>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                     <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm group-hover:text-purple-700">Abnormal Lab Alert</h4>
                            <p class="text-xs text-slate-500">Trigger: HL7 Result</p>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    
                    <button @click="$router.push('/urpa/builder')" class="w-full py-3 bg-purple-50 text-purple-600 font-bold text-sm rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 border-dashed flex items-center justify-center gap-2">
                        <GitBranch class="w-4 h-4" /> Build Automation
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot, Mic, Calendar, Command, Mail, Phone, GitBranch } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { aiService } from '@/services/ai';

onMounted(async () => {
    try {
        // Demonstrate AI Integration: Fetch active projects/workflows
        const projects = await aiService.listProjects({ limit: 5 });
        console.log('AI-Powered Project List:', projects);
    } catch (e) {
        console.error('AI Integration Error:', e);
    }
});

</script>
