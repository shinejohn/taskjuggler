<template>
  <div class="bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
    <div class="max-w-[1600px] mx-auto flex items-start gap-4">
      <div class="mt-1">
        <div class="p-2 bg-emerald-500/10 rounded-lg">
          <Mic class="w-4 h-4 text-emerald-400" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Transcript</span>
          <div class="flex gap-1">
            <div class="w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
        <p class="text-slate-300 text-lg leading-relaxed italic">
          <span v-if="!transcript" class="text-slate-500">AI listening... describe symptoms or plan to populate dashboard</span>
          <span v-else>
            "{{ transcript }}"
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic } from 'lucide-vue-next';

defineProps<{
  transcript: string;
}>();
</script>
