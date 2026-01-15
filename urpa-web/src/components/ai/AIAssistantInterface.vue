<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
    <!-- Header / Top Bar -->
    <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-slate-900/80 to-transparent">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
          <div class="h-4 w-4 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
        </div>
        <div>
          <h2 class="text-sm font-semibold text-white tracking-wide">
            URPA ASSISTANT
          </h2>
          <StatusIndicator :status="status" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Persona Mode Selector -->
        <div class="relative">
          <button
            @click="showPersonaMenu = !showPersonaMenu"
            :class="['flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-lg', currentPersona.color]"
          >
            <component :is="currentPersona.icon" />
            <span>{{ currentPersona.label }}</span>
          </button>

          <Transition name="dropdown">
            <div v-if="showPersonaMenu" class="fixed inset-0 z-30" @click="showPersonaMenu = false" />
          </Transition>
          <Transition name="dropdown">
            <div
              v-if="showPersonaMenu"
              class="absolute right-0 top-full mt-2 w-56 z-40 rounded-xl border border-slate-700 bg-slate-800 shadow-xl shadow-black/50 overflow-hidden"
            >
              <div class="p-2">
                <div class="text-xs font-semibold text-slate-400 px-2 py-1.5 mb-1">
                  Persona Mode
                </div>
                <button
                  v-for="persona in PERSONAS"
                  :key="persona.id"
                  @click="activePersona = persona.id; showPersonaMenu = false"
                  :class="['w-full flex items-start gap-2.5 p-2.5 rounded-lg transition-colors', activePersona === persona.id ? 'bg-slate-700/50' : 'hover:bg-slate-700/30']"
                >
                  <div :class="['p-1.5 rounded-md bg-gradient-to-br flex-shrink-0 mt-0.5 text-white', persona.color]">
                    <component :is="persona.icon" />
                  </div>
                  <div class="flex-1 text-left">
                    <div class="text-sm font-medium text-white">
                      {{ persona.label }}
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      {{ persona.description }}
                    </div>
                  </div>
                  <div v-if="activePersona === persona.id" class="h-2 w-2 rounded-full bg-teal-500 flex-shrink-0 mt-2" />
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <div class="px-2 py-1 rounded bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono">
          {{ formatDuration(sessionDuration) }}
        </div>
        <button class="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <Maximize2 class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Main Visualizer Area -->
    <div class="relative flex-1 flex items-center justify-center w-full bg-slate-950 overflow-hidden">
      <!-- Background Grid Effect -->
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: radial-gradient(circle at center, #1e293b 1px, transparent 1px); background-size: 24px 24px;"
      />

      <!-- Central AI Visualization -->
      <div class="relative z-10 flex items-center justify-center">
        <!-- Core Circle -->
        <div
          :class="['h-32 w-32 rounded-full bg-slate-900 border border-teal-500/30 flex items-center justify-center relative', status === 'speaking' ? 'animate-pulse' : '']"
          :style="status === 'speaking' ? 'box-shadow: 0 0 50px rgba(20, 184, 166, 0.4)' : 'box-shadow: 0 0 20px rgba(20, 184, 166, 0.1)'"
        >
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/10 to-blue-500/10" />

          <!-- Center Icon/Graphic -->
          <div :class="['h-16 w-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg shadow-teal-500/20 text-white', currentPersona.color]">
            <svg viewBox="0 0 24 24" class="h-8 w-8 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Live Transcript Overlay -->
      <Transition name="fade">
        <div v-if="transcript" class="absolute bottom-24 left-0 right-0 flex justify-center px-8">
          <div class="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl shadow-xl max-w-lg text-center">
            <p class="text-slate-200 font-medium text-lg leading-relaxed">
              "{{ transcript }}"
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Bottom Controls Bar -->
    <div class="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 p-4">
      <div class="flex items-center justify-between max-w-3xl mx-auto">
        <div class="flex items-center gap-2">
          <button class="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <MessageSquare class="h-5 w-5" />
          </button>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="isMuted = !isMuted"
            :class="['p-4 rounded-full transition-all', isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700']"
          >
            <MicOff v-if="isMuted" class="h-5 w-5" />
            <Mic v-else class="h-5 w-5" />
          </button>

          <button
            @click="isVideoOn = !isVideoOn"
            :class="['p-4 rounded-full transition-all', !isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700']"
          >
            <VideoOff v-if="!isVideoOn" class="h-5 w-5" />
            <Video v-else class="h-5 w-5" />
          </button>

          <button class="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
            <PhoneOff class="h-5 w-5" />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button class="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <MoreVertical class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Mic, MicOff, Video, VideoOff, MoreVertical, PhoneOff, Maximize2, MessageSquare, Briefcase, Lightbulb, BarChart3, Smile } from 'lucide-vue-next';
import StatusIndicator, { type AIStatus } from '@/components/ui/StatusIndicator.vue';

type PersonaMode = 'professional' | 'creative' | 'analytical' | 'casual';

interface Persona {
  id: PersonaMode;
  label: string;
  icon: any;
  color: string;
  description: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'professional',
    label: 'Professional',
    icon: Briefcase,
    color: 'from-slate-500 to-slate-600',
    description: 'Formal, efficient, business-focused',
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500',
    description: 'Innovative, brainstorming, imaginative',
  },
  {
    id: 'analytical',
    label: 'Analytical',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    description: 'Data-driven, detailed, precise',
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: Smile,
    color: 'from-green-500 to-teal-500',
    description: 'Friendly, conversational, relaxed',
  },
];

const status = ref<AIStatus>('idle');
const isMuted = ref(false);
const isVideoOn = ref(true);
const transcript = ref<string>('');
const activePersona = ref<PersonaMode>('professional');
const showPersonaMenu = ref(false);
const sessionDuration = ref(0);

const currentPersona = computed(() => PERSONAS.find(p => p.id === activePersona.value)!);

let statusInterval: ReturnType<typeof setInterval> | null = null;
let durationInterval: ReturnType<typeof setInterval> | null = null;

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

onMounted(() => {
  // Simulate AI behavior
  statusInterval = setInterval(() => {
    const states: AIStatus[] = ['idle', 'listening', 'thinking', 'speaking'];
    const randomIndex = Math.floor(Math.random() * states.length);
    const randomState = states[randomIndex];
    if (randomState) {
      status.value = randomState;
      if (randomState === 'speaking') {
        transcript.value = "I've updated your calendar for the Tokyo trip and sent the confirmation emails.";
      } else if (randomState === 'listening') {
        transcript.value = 'Listening...';
      } else {
        transcript.value = '';
      }
    }
  }, 5000);

  // Update session duration
  durationInterval = setInterval(() => {
    sessionDuration.value++;
  }, 1000);
});

onUnmounted(() => {
  if (statusInterval) clearInterval(statusInterval);
  if (durationInterval) clearInterval(durationInterval);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>

