<template>
  <div :class="['flex flex-col backdrop-blur-sm rounded-xl border overflow-hidden', cardBg, cardBorder]">
    <!-- Header -->
    <div :class="['flex items-center justify-between p-4 border-b', cardBorder, headerBg]">
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-teal-500/10 text-teal-400' : 'bg-purple-100 text-purple-600']">
          <div :class="['h-4 w-4 rounded-full', theme === 'dark' ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]']" />
        </div>
        <div>
          <h3 :class="['text-base font-bold', textPrimary]">URPA</h3>
          <StatusIndicator :status="status" />
        </div>
      </div>

      <!-- Mode Toggle -->
      <div :class="['flex gap-1 p-1 rounded-lg', theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100']">
        <button
          @click="interfaceMode = 'mic'"
          :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', interfaceMode === 'mic' ? (theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white') : [textSecondary, buttonHover]]"
        >
          <Mic class="h-3.5 w-3.5" />
        </button>
        <button
          @click="interfaceMode = 'persona'"
          :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', interfaceMode === 'persona' ? (theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white') : [textSecondary, buttonHover]]"
        >
          <User class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- Visualization Area -->
    <div :class="['p-4 border-b', cardBorder]">
      <Transition name="fade" mode="out-in">
        <div v-if="interfaceMode === 'mic'" key="mic" class="flex flex-col items-center justify-center py-6">
          <!-- Mic Visualization -->
          <div class="relative mb-4">
            <div
              :class="['h-24 w-24 rounded-full flex items-center justify-center', theme === 'dark' ? 'bg-slate-900 border border-teal-500/30' : 'bg-white border-2 border-purple-300', status === 'speaking' ? 'animate-pulse' : '']"
              :style="status === 'speaking' ? (theme === 'dark' ? 'box-shadow: 0 0 30px rgba(20, 184, 166, 0.4)' : 'box-shadow: 0 0 30px rgba(168, 85, 247, 0.4)') : ''"
            >
              <div :class="['h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center', currentPersona.color]">
                <Mic class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <!-- Mode Selector Button -->
          <div class="relative">
            <button
              @click="showModeSelector = !showModeSelector"
              :class="['flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r text-white font-semibold text-sm shadow-lg transition-all', currentPersona.color]"
            >
              <component :is="currentPersona.icon" />
              <span>{{ currentPersona.label }} Mode</span>
              <ChevronDown :class="['h-4 w-4 transition-transform', showModeSelector ? 'rotate-180' : '']" />
            </button>

            <!-- Mode Selector Dropdown -->
            <Transition name="dropdown">
              <div v-if="showModeSelector" class="fixed inset-0 z-10" @click="showModeSelector = false" />
            </Transition>
            <Transition name="dropdown">
              <div
                v-if="showModeSelector"
                :class="['absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-20 rounded-xl border-2 shadow-2xl overflow-hidden', theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300']"
              >
                <button
                  v-for="persona in PERSONAS"
                  :key="persona.id"
                  @click="activePersona = persona.id; showModeSelector = false"
                  :class="['w-full flex items-center gap-3 px-4 py-3 transition-all', activePersona === persona.id ? `bg-gradient-to-r ${persona.color} text-white` : (theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-700')]"
                >
                  <div :class="['p-2 rounded-lg', activePersona === persona.id ? 'bg-white/20' : (theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')]">
                    <component :is="persona.icon" />
                  </div>
                  <div class="flex-1 text-left">
                    <p class="text-sm font-bold">{{ persona.label }}</p>
                    <p :class="['text-xs', activePersona === persona.id ? 'text-white/80' : textSecondary]">
                      {{ persona.description }}
                    </p>
                  </div>
                </button>
              </div>
            </Transition>
          </div>
        </div>
        <div v-else key="persona" class="flex flex-col items-center gap-3 py-4">
          <!-- Persona Avatar -->
          <div
            v-if="activePersona === 'professional'"
            class="relative h-24 w-24 rounded-full shadow-lg ring-4 ring-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
              alt="User profile"
              class="h-full w-full rounded-full object-cover"
            />
            <div :class="['absolute inset-0 rounded-full bg-gradient-to-br opacity-20', currentPersona.color]" />
          </div>
          <div v-else :class="['h-24 w-24 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg', currentPersona.color]">
            <User class="h-12 w-12 text-white" />
          </div>

          <!-- Mode Selector Button -->
          <div class="relative">
            <button
              @click="showModeSelector = !showModeSelector"
              :class="['flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r text-white font-semibold text-sm shadow-lg transition-all', currentPersona.color]"
            >
              <component :is="currentPersona.icon" />
              <span>{{ currentPersona.label }} Mode</span>
              <ChevronDown :class="['h-4 w-4 transition-transform', showModeSelector ? 'rotate-180' : '']" />
            </button>

            <!-- Mode Selector Dropdown -->
            <Transition name="dropdown">
              <div v-if="showModeSelector" class="fixed inset-0 z-10" @click="showModeSelector = false" />
            </Transition>
            <Transition name="dropdown">
              <div
                v-if="showModeSelector"
                :class="['absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-20 rounded-xl border-2 shadow-2xl overflow-hidden', theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300']"
              >
                <button
                  v-for="persona in PERSONAS"
                  :key="persona.id"
                  @click="activePersona = persona.id; showModeSelector = false"
                  :class="['w-full flex items-center gap-3 px-4 py-3 transition-all', activePersona === persona.id ? `bg-gradient-to-r ${persona.color} text-white` : (theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-700')]"
                >
                  <div :class="['p-2 rounded-lg', activePersona === persona.id ? 'bg-white/20' : (theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')]">
                    <component :is="persona.icon" />
                  </div>
                  <div class="flex-1 text-left">
                    <p class="text-sm font-bold">{{ persona.label }}</p>
                    <p :class="['text-xs', activePersona === persona.id ? 'text-white/80' : textSecondary]">
                      {{ persona.description }}
                    </p>
                  </div>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col min-h-[200px]">
      <div :class="['flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar', theme === 'dark' ? 'bg-slate-900/30' : 'bg-gray-50/50']">
        <div
          v-for="(msg, idx) in chatHistory"
          :key="idx"
          :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div :class="['max-w-[80%] rounded-lg px-3 py-2', msg.role === 'user' ? (theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white') : (theme === 'dark' ? 'bg-slate-700/50 text-slate-200' : 'bg-white text-gray-800 border border-purple-200')]">
            <p class="text-sm leading-relaxed">{{ msg.message }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div :class="['p-3 border-t', cardBorder, headerBg]">
        <div class="flex gap-2">
          <input
            v-model="chatMessage"
            type="text"
            placeholder="Type a message..."
            :class="['flex-1 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', theme === 'dark' ? 'bg-slate-900/50 border border-slate-700 text-white focus:ring-teal-500/50' : 'bg-white border border-purple-200 text-gray-900 focus:ring-purple-500/50']"
            @keypress.enter="handleSendMessage"
          />
          <button
            @click="handleSendMessage"
            :class="['px-4 py-2 rounded-lg text-white transition-colors', theme === 'dark' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-purple-500 hover:bg-purple-600']"
          >
            <Send class="h-4 w-4" />
          </button>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-2 mt-3">
          <button
            @click="isMuted = !isMuted"
            :class="['p-2 rounded-full transition-all', isMuted ? 'bg-red-500/20 text-red-500' : [buttonBg, textSecondary, buttonHover]]"
          >
            <MicOff v-if="isMuted" class="h-4 w-4" />
            <Mic v-else class="h-4 w-4" />
          </button>

          <button
            @click="isVideoOn = !isVideoOn"
            :class="['p-2 rounded-full transition-all', !isVideoOn ? 'bg-red-500/20 text-red-500' : [buttonBg, textSecondary, buttonHover]]"
          >
            <VideoOff v-if="!isVideoOn" class="h-4 w-4" />
            <Video v-else class="h-4 w-4" />
          </button>

          <button class="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
            <PhoneOff class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Briefcase, Lightbulb, BarChart3, Smile, User, ChevronDown } from 'lucide-vue-next';
import StatusIndicator, { type AIStatus } from '@/components/ui/StatusIndicator.vue';
import { useTheme } from '@/composables/useTheme';
import { useAiStore } from '@/stores/ai';

type PersonaMode = 'professional' | 'creative' | 'analytical' | 'casual';
type InterfaceMode = 'mic' | 'persona';

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
    description: 'Your AI Assistant',
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500',
    description: 'Innovative & Imaginative',
  },
  {
    id: 'analytical',
    label: 'Analytical',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    description: 'Data-Driven Insights',
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: Smile,
    color: 'from-green-500 to-teal-500',
    description: 'Friendly & Relaxed',
  },
];

const { theme } = useTheme();
const aiStore = useAiStore();

const status = ref<AIStatus>('idle');
const isMuted = ref(false);
const isVideoOn = ref(true);
const activePersona = ref<PersonaMode>('professional');
const interfaceMode = ref<InterfaceMode>('mic');
const showModeSelector = ref(false);
const chatMessage = ref('');
const chatHistory = ref<Array<{ role: 'user' | 'ai'; message: string }>>([
  { role: 'ai', message: 'How can I help you today?' },
]);

const currentPersona = computed(() => PERSONAS.find(p => p.id === activePersona.value)!);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-purple-50/50');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-800');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');
const buttonBg = computed(() => theme.value === 'dark' ? 'bg-slate-700/50' : 'bg-purple-100');
const buttonHover = computed(() => theme.value === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-purple-200');

async function handleSendMessage() {
  if (!chatMessage.value.trim()) return;

  const message = chatMessage.value;
  chatMessage.value = '';

  chatHistory.value.push({
    role: 'user',
    message,
  });

  try {
    // Create session if needed
    if (!aiStore.currentSession) {
      await aiStore.createSession('chat', activePersona.value);
    }

    if (aiStore.currentSession) {
      const response = await aiStore.sendMessage(aiStore.currentSession.id, message);
      chatHistory.value.push({
        role: 'ai',
        message: response.ai_message.content || "I'm working on that for you!",
      });
    }
  } catch (error) {
    chatHistory.value.push({
      role: 'ai',
      message: "I'm sorry, I encountered an error. Please try again.",
    });
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

