<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
            <Activity class="w-4 h-4 text-slate-400"/> Vitals History
        </h3>
        <button class="text-xs font-medium text-slate-500 hover:text-slate-700">View Graph</button>
    </div>

    <div class="space-y-4">
        <div v-for="(reading, i) in history" :key="i" class="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
            <span class="text-slate-500 w-24">{{ reading.date }}</span>
            <div class="flex gap-6">
                <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-400 font-medium">BP</span>
                    <span class="font-bold text-slate-900">{{ reading.bp }}</span>
                </div>
                 <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-400 font-medium">HR</span>
                    <span class="font-bold text-slate-900">{{ reading.hr }}</span>
                </div>
                 <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-400 font-medium">Temp</span>
                    <span class="font-bold text-slate-900">{{ reading.temp }}</span>
                </div>
                 <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-400 font-medium">Wt</span>
                    <span class="font-bold text-slate-900">{{ reading.weight }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Activity } from 'lucide-vue-next';

const history = ref([
    { date: 'Jan 24, 2026', bp: '120/80', hr: 72, temp: 98.6, weight: '180 lbs' },
    { date: 'Dec 15, 2025', bp: '122/82', hr: 75, temp: 98.4, weight: '182 lbs' },
    { date: 'Nov 01, 2025', bp: '118/79', hr: 70, temp: 98.7, weight: '179 lbs' },
]);
</script>
