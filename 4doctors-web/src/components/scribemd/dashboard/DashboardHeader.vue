<template>
  <header class="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
    <div class="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group">
            <ArrowLeft class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </router-link>
          <div class="h-8 w-[1px] bg-slate-700/50 mx-1"></div>
          <div>
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="bg-emerald-500 p-1 rounded-md">
                <Zap class="w-4 h-4 text-white" />
              </span>
              ScribeMD™
              <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Live</span>
            </h1>
          </div>
        </div>

        <!-- Patient Info -->
        <div class="flex items-center gap-4 px-4 py-2 bg-slate-900/40 rounded-xl border border-slate-700/50">
          <div class="flex items-center gap-2">
            <User class="w-4 h-4 text-slate-400" />
            <span class="text-white font-medium">{{ patientName }}</span>
          </div>
          <div class="w-1 h-1 bg-slate-600 rounded-full"></div>
          <div class="text-sm text-slate-400">{{ patientAge }} {{ patientGender }}</div>
          <div class="w-1 h-1 bg-slate-600 rounded-full"></div>
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
            <Shield class="w-3 h-3" />
            {{ insuranceName }}
          </div>
        </div>
      </div>

      <!-- Recording Status & Timer -->
      <div class="flex items-center gap-6">
        <div v-if="isRecording || isPaused" class="flex items-center gap-6 pr-6 border-r border-slate-700/50">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-3 h-3 rounded-full',
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
            ]"></div>
            <div class="flex flex-col">
              <span :class="[
                'text-[10px] uppercase tracking-tighter font-bold',
                isRecording ? 'text-red-400' : 'text-amber-400'
              ]">
                {{ isRecording ? 'Recording' : 'Paused' }}
              </span>
              <span class="text-white font-mono text-lg leading-none">{{ formattedDuration }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="isRecording"
            type="button"
            aria-label="Pause recording"
            @click="$emit('pause')"
            class="p-2.5 hover:bg-slate-700/50 rounded-xl text-slate-300 transition-colors"
            title="Pause Recording"
          >
            <Pause class="w-5 h-5" />
          </button>
          
          <button
            @click="$emit('toggle-recording')"
            :class="[
              'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-xl',
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 ring-4 ring-red-500/20'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 ring-4 ring-emerald-500/10'
            ]"
          >
            <component :is="isRecording ? Square : Mic" class="w-5 h-5" />
            {{ isRecording ? 'End Recording' : 'Start Visit' }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft, Zap, Mic, Square, User, Shield, Pause, Play } from 'lucide-vue-next';

defineProps<{
  patientName: string;
  patientAge: string;
  patientGender: string;
  insuranceName: string;
  isRecording: boolean;
  isPaused: boolean;
  formattedDuration: string;
}>();

defineEmits(['toggle-recording', 'pause', 'resume']);
</script>
