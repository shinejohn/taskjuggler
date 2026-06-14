<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/80">
    <div class="bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
      <!-- Header -->
      <div class="px-8 py-6 bg-emerald-500 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-white/20 rounded-2xl">
            <CheckCircle2 class="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-white">Visit Complete</h2>
            <p class="text-emerald-100 font-medium">{{ patientName }} • {{ currentDate }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-white/60 hover:text-white transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <!-- Automatic Actions -->
        <div>
          <h3 class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Finalizing & Routing</h3>
          <div class="space-y-3">
            <div v-for="action in actions" :key="action.label" class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <Check class="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{{ action.label }}</span>
                <span class="text-xs text-slate-500">{{ action.details }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ action.status }}</span>
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Queued Actions -->
        <div v-if="queuedItems.length > 0">
          <h3 class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Queued for Back-Office</h3>
          <div class="space-y-3">
            <div v-for="item in queuedItems" :key="item.label" class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="p-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <Clock class="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span class="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{{ item.label }}</span>
                <span class="text-xs text-slate-500">{{ item.details }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">In Queue</span>
                <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Patient -->
        <div class="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-white border-2 border-slate-600">
              LC
            </div>
            <div>
              <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Next Patient</span>
              <h4 class="text-lg font-bold text-white leading-tight">Linda Chen</h4>
              <p class="text-sm text-slate-400">10:00 AM • Diabetes Follow-up</p>
            </div>
          </div>
          <button type="button" aria-label="Go to next patient" class="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-xl transition-colors">
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>

        <!-- Final Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="$emit('close')"
            class="flex-1 px-6 py-4 rounded-2xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all"
          >
            Review Again
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-[2] px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 text-white font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            CONFIRM & SEND ALL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, X, Check, Clock, ChevronRight } from 'lucide-vue-next';

defineProps<{
  patientName: string;
  currentDate: string;
  actions: Array<{ label: string; details: string; status: string }>;
  queuedItems: Array<{ label: string; details: string }>;
}>();

defineEmits(['close', 'confirm']);
</script>
