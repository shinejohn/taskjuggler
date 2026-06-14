<template>
  <div class="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl w-80 md:w-96 fixed right-0 top-0 bottom-0 z-50 transform transition-transform duration-300">
    <!-- Header -->
    <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
          <Bot class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-bold text-slate-800">URPA Assistant</h3>
          <p class="text-xs text-indigo-600 font-medium">Setup Guide</p>
        </div>
      </div>
      <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" class="flex gap-3" :class="{ 'flex-row-reverse': message.role === 'user' }">
        <!-- Avatar -->
        <div v-if="message.role === 'assistant'" class="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
          <Bot class="w-5 h-5 text-indigo-600" />
        </div>
        <div v-else class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
          <User class="w-5 h-5 text-slate-600" />
        </div>

        <!-- Bubble -->
        <div 
          class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed"
          :class="[
            message.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
          ]"
        >
          <p>{{ message.content }}</p>
          
          <!-- Quick Actions (if any) -->
          <div v-if="message.actions" class="mt-3 flex flex-wrap gap-2">
            <button 
              v-for="action in message.actions" 
              :key="action.label"
              @click="handleAction(action)"
              class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="isTyping" class="flex gap-3">
         <div class="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
          <Bot class="w-5 h-5 text-indigo-600" />
        </div>
        <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
          <span class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
          <span class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
          <span class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-slate-200 bg-white">
      <div class="relative">
        <input 
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="Ask for help..."
          class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
        >
        <button
          type="button"
          aria-label="Send message"
          @click="sendMessage"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          :disabled="!inputMessage.trim()"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { Bot, User, Send, X } from 'lucide-vue-next';
import { useOnboardingStore } from '@/stores/onboardingStore';

const props = defineProps<{
  currentStep: string;
}>();

const emit = defineEmits(['close']);
const store = useOnboardingStore();

const inputMessage = ref('');
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

type Message = {
  role: 'assistant' | 'user';
  content: string;
  actions?: { label: string; handler: () => void }[];
};

const messages = ref<Message[]>([]);

// Context-aware greetings
const stepGreetings: Record<string, string> = {
  'welcome': "Hi! I'm URPA. I'm here to help you set up your new medical practice system. Ask me anything as we go!",
  'profile': "Please verify your details. I can help update your specialty or bio if needed.",
  'urpa-setup': "Let's configure my personality. Do you prefer a formal Assistant or a friendly Colleague?",
  'calls-setup': "I can draft a professional voicemail greeting for you. Just tell me your office hours!",
  'business-profile': "We'll set up your basic business profile now. You can add more details later.",
  'complete': "You're all set! Ready to access your dashboard?",
};

// Watch for step changes to trigger new greetings
watch(() => props.currentStep, async (newStep) => {
  const greeting = stepGreetings[newStep];
  if (greeting) {
    isTyping.value = true;
    setTimeout(() => {
      messages.value.push({ role: 'assistant', content: greeting });
      isTyping.value = false;
      scrollToBottom();
    }, 800);
  }
}, { immediate: true });

const handleAction = (action: { label: string; handler: () => void }) => {
  action.handler();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;
  
  const userText = inputMessage.value;
  messages.value.push({ role: 'user', content: userText });
  inputMessage.value = '';
  scrollToBottom();
  
  isTyping.value = true;
  
  // Simulated AI response (Replace with real backend/LLM call later)
  setTimeout(() => {
    const response = generateMockResponse(userText, props.currentStep);
    messages.value.push({ role: 'assistant', content: response.text, actions: response.actions });
    isTyping.value = false;
    scrollToBottom();
  }, 1500);
};

// Simple rule-based responses for prototype
const generateMockResponse = (text: string, step: string) => {
  const lower = text.toLowerCase();
  
  if (step === 'urpa-setup') {
    if (lower.includes('formal')) {
        store.urpaSettings.personality = 'professional';
        return { text: "Got it. I've set my tone to 'Professional'. I'll keep communications concise and formal." };
    }
    if (lower.includes('friend')) {
        store.urpaSettings.personality = 'friendly';
        return { text: "Great! I've set my tone to 'Friendly'. I'll be more conversational and casual." };
    }
  }
  
  if (step === 'calls-setup') {
      if (lower.includes('greeting') || lower.includes('write')) {
          const hours = store.callsSettings.availability.start + ' to ' + store.callsSettings.availability.end;
          const greeting = `You've reached the office of Dr. ${store.profileSettings.lastName}. Our hours are ${hours}. Please leave a message.`;
          return { 
              text: `Here is a draft for you: "${greeting}"`,
              actions: [
                  { label: 'Use this greeting', handler: () => { store.callsSettings.voicemailGreeting = greeting; } }
              ]
          };
      }
  }

  return { text: "That's a great question. For this setup phase, I recommend keeping the defaults, but we can customize strictly later in Settings." };
};

onMounted(() => {
    scrollToBottom();
});
</script>
