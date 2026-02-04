<template>
  <div class="space-y-6">
     <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Module Marketplace</h1>
            <p class="text-slate-500">Extend URPA with specialized skills.</p>
        </div>
        <div class="relative">
             <Search class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search modules..." class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="mod in modules" :key="mod.id" class="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <div class="p-3 rounded-xl bg-slate-50" :class="mod.color">
                    <component :is="mod.icon" class="w-8 h-8" />
                </div>
                <button class="px-3 py-1 text-xs font-semibold rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50">
                    Install
                </button>
            </div>
            <h3 class="font-bold text-slate-900 mb-1">{{ mod.name }}</h3>
            <p class="text-sm text-slate-500 mb-4 h-10">{{ mod.description }}</p>
            <div class="flex items-center gap-2 text-xs text-slate-400">
                <Star class="w-4 h-4 text-amber-400 fill-current" />
                <span class="font-medium text-slate-700">{{ mod.rating }}</span>
                <span>({{ mod.reviews }} reviews)</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Star, Stethoscope, Pill, FileText, Brain } from 'lucide-vue-next';

const modules = ref([
    { id: 1, name: 'Cardiology Assistant', description: 'Advanced ECG analysis and guideline lookups.', icon: HeartIcon(), color: 'text-red-600 bg-red-50', rating: 4.9, reviews: 128 },
    { id: 2, name: 'PharmaCheck Pro', description: 'Real-time interaction checker & dosage calc.', icon: Pill, color: 'text-blue-600 bg-blue-50', rating: 4.8, reviews: 342 },
    { id: 3, name: 'Auto-Scribe', description: 'Ambient listening with auto-SOAP generation.', icon: MicIcon(), color: 'text-purple-600 bg-purple-50', rating: 4.7, reviews: 89 },
    { id: 4, name: 'Research Bot', description: 'Summarize PubMed articles instantly.', icon: Brain, color: 'text-emerald-600 bg-emerald-50', rating: 4.5, reviews: 56 },
]);

// Helper to return icon components if needed, or just use direct import in data
function HeartIcon() { return Stethoscope; } // Using Stethoscope as proxy
function MicIcon() { return FileText; } 
</script>
