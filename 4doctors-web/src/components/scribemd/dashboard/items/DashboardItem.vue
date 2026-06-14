<template>
  <div
    class="group relative flex items-start gap-3 p-4 rounded-xl transition-all duration-300 border"
    :class="[
      isAccepted
        ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 shadow-lg'
        : 'bg-slate-900/40 border-slate-800/50 opacity-60 hover:opacity-80',
      isNew ? 'ring-2 ring-emerald-500/50 animate-pulse-subtle' : ''
    ]"
  >
    <!-- Toggle Checkbox -->
    <button
      @click="$emit('toggle')"
      class="mt-1 flex-shrink-0"
    >
      <div
        class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
        :class="[
          isAccepted
            ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20'
            : 'border-slate-600 hover:border-slate-500'
        ]"
      >
        <Check v-if="isAccepted" class="w-3 h-3 text-white stroke-[3px]" />
      </div>
    </button>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <slot name="title">
          <p class="text-white font-medium truncate">{{ title }}</p>
        </slot>
        <span v-if="isNew" class="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter bg-emerald-500/10 px-1.5 rounded">New</span>
      </div>
      
      <slot name="subtitle">
        <p v-if="subtitle" class="text-slate-400 text-sm mt-0.5">{{ subtitle }}</p>
      </slot>

      <div class="flex items-center gap-3 mt-2">
        <!-- Source Badge -->
        <div v-if="source === 'ai'" class="flex items-center gap-1.5 py-0.5 px-2 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Sparkles class="w-3 h-3 text-amber-500" />
          <span class="text-[10px] font-bold text-amber-500/80 uppercase tracking-tight">AI Detected</span>
        </div>
        <div v-else class="flex items-center gap-1.5 py-0.5 px-2 rounded-full bg-slate-700/30 border border-slate-600/30">
          <User class="w-3 h-3 text-slate-400" />
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Manual</span>
        </div>

        <!-- Confidence (if AI) -->
        <div v-if="source === 'ai' && confidence !== undefined" class="text-[10px] text-slate-500 font-medium">
          {{ Math.round(confidence * 100) }}% confidence
        </div>

        <!-- Warning Badge -->
        <div v-if="hasWarning" class="flex items-center gap-1.5 py-0.5 px-2 rounded-full bg-rose-500/10 border border-rose-500/20 animate-pulse">
          <AlertCircle class="w-3 h-3 text-rose-500" />
          <span class="text-[10px] font-bold text-rose-500 uppercase tracking-tight">{{ warningText }}</span>
        </div>
      </div>
    </div>

    <!-- Hover Actions -->
    <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click="$emit('edit')"
        class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <Edit2 class="w-3.5 h-3.5" />
      </button>
      <button
        @click="$emit('delete')"
        class="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Sparkles, User, AlertCircle, Edit2, Trash2 } from 'lucide-vue-next';

defineProps<{
  title?: string;
  subtitle?: string;
  isAccepted: boolean;
  isNew?: boolean;
  source: 'ai' | 'manual';
  confidence?: number;
  hasWarning?: boolean;
  warningText?: string;
}>();

defineEmits(['toggle', 'edit', 'delete']);
</script>

<style scoped>
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.95; transform: scale(1.01); }
}
.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite ease-in-out;
}
</style>
