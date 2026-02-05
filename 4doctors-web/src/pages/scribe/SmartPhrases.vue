<template>
  <div class="h-[calc(100vh-6rem)] flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between flex-shrink-0">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Smart Phrases</h1>
            <p class="text-slate-500">Manage your AI-enhanced clinical text shortcuts.</p>
        </div>
        <div class="flex gap-3">
             <div class="relative">
                <Search class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Search phrases..." class="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64">
            </div>
            <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2">
                <Plus class="w-4 h-4" /> New Phrase
            </button>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-h-0 grid grid-cols-12 gap-6">
        <!-- Sidebar: Categories -->
        <div class="col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div class="p-4 border-b border-slate-100 bg-slate-50">
                <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">Categories</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1">
                <button v-for="cat in categories" :key="cat.id" 
                    @click="selectedCategory = cat.id"
                    :class="[
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group',
                        selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    ]">
                    <span>{{ cat.name }}</span>
                    <span :class="[
                        'px-2 py-0.5 rounded-full text-xs',
                        selectedCategory === cat.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    ]">{{ cat.count }}</span>
                </button>
            </div>
            <div class="p-3 border-t border-slate-100">
                <button class="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 border border-dashed border-slate-300 rounded-lg hover:border-indigo-300 transition-all flex items-center justify-center gap-2">
                    <Plus class="w-3 h-3" /> Add Category
                </button>
            </div>
        </div>

        <!-- Middle: Phrase List -->
        <div class="col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div class="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">Phrases</h3>
                 <span class="text-xs font-medium text-slate-400">Sorted by Usage</span>
            </div>
            <div class="flex-1 overflow-y-auto">
                <div v-for="phrase in filteredPhrases" :key="phrase.id" 
                    @click="selectedPhrase = phrase"
                    :class="[
                        'p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                        selectedPhrase?.id === phrase.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'
                    ]">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">.{{ phrase.trigger }}</span>
                        <span class="text-xs text-slate-400">{{ phrase.lastUsed }}</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">{{ phrase.title }}</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">{{ phrase.content }}</p>
                </div>
            </div>
        </div>

        <!-- Right: Editor & AI -->
        <div class="col-span-5 flex flex-col gap-4">
            <!-- Editor Card -->
            <Card class="flex-1 flex flex-col min-h-0" :noPadding="true">
                <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <PenTool class="w-4 h-4" />
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900">Editor</h3>
                            <p class="text-xs text-slate-500">Edit phrase content</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                        <button class="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                            Save
                        </button>
                    </div>
                </div>
                
                <div v-if="selectedPhrase" class="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Trigger</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2.5 text-slate-400 font-bold">.</span>
                                <input v-model="selectedPhrase.trigger" type="text" class="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-bold text-indigo-700 focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option>General Medicine</option>
                                <option>Cardiology</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1 h-full flex flex-col">
                        <label class="text-xs font-bold text-slate-500 uppercase flex justify-between">
                            Content
                            <span class="text-xs font-normal text-slate-400">{{ selectedPhrase.content.length }} chars</span>
                        </label>
                        <textarea v-model="selectedPhrase.content" class="flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed resize-none focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"></textarea>
                    </div>
                </div>
                <div v-else class="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
                    <p>Select a phrase to edit</p>
                </div>
            </Card>

            <!-- AI Magic Card -->
            <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white shadow-lg shrink-0">
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles class="w-5 h-5 text-yellow-300" />
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-lg mb-1">AI Enhancement</h3>
                        <p class="text-sm text-indigo-100 mb-3">Improve clarity, tone, or expand brief notes.</p>
                        
                        <div class="grid grid-cols-2 gap-2">
                             <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                <Wand2 class="w-3 h-3" /> Make Professional
                             </button>
                             <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                <Languages class="w-3 h-3" /> Translate to Spanish
                             </button>
                             <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                <Minimize2 class="w-3 h-3" /> Summarize
                             </button>
                             <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                <Maximize2 class="w-3 h-3" /> Expand
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
    Search, Plus, PenTool, Trash2, Sparkles, Wand2, 
    Languages, Minimize2, Maximize2 
} from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
// import Badge from '@/components/ui/Badge.vue';

const categories = [
    { id: 'all', name: 'All Phrases', count: 42 },
    { id: 'gen', name: 'General Medicine', count: 15 },
    { id: 'cardio', name: 'Cardiology', count: 8 },
    { id: 'neuro', name: 'Neurology', count: 5 },
    { id: 'peds', name: 'Pediatrics', count: 12 },
    { id: 'billing', name: 'Billing Codes', count: 2 },
];

const selectedCategory = ref('gen');

const phrases = [
    {
        id: 1,
        trigger: 'normal_exam',
        title: 'Normal Physical Exam',
        category: 'gen',
        lastUsed: '2h ago',
        content: 'General: Well-developed, well-nourished, in no acute distress.\nHEENT: Normocephalic, atraumatic. PERRLA, EOMI. TM intact b/l.\nNeck: Supple, no LAD, no thyromegaly.\nCV: RRR, no m/r/g.\nLungs: CTAB, no wheezes/rhonchi/rales.\nAbd: Soft, NT/ND, +BS.\nExt: No edema, clubbing, cyanosis.'
    },
    {
        id: 2,
        trigger: 'htn_plan',
        title: 'Hypertension Plan',
        category: 'cardio',
        lastUsed: '1d ago',
        content: '1. Continue current antihypertensive regimen.\n2. Monitor BP daily at home.\n3. Low sodium diet (<2g/day) and DASH diet recommended.\n4. Exercise 30min/day, 5 days/week.\n5. Follow up in 3 months with BMP.'
    },
    {
        id: 3,
        trigger: 'uri_advice',
        title: 'URI Supportive Care',
        category: 'gen',
        lastUsed: '4h ago',
        content: 'Supportive care discussed including:\n- Rest and hydration\n- OTC acetaminophen/ibuprofen for fever/pain\n- Saline nasal spray for congestion\n- Honey for cough (if >12mo)\nReturn precautions discussed: worsening fever, difficulty breathing, inability to tolerate liquids.'
    }
];

const selectedPhrase = ref(phrases[0]);

const filteredPhrases = computed(() => {
    return phrases; // Mock filter logick would go here
});

</script>
