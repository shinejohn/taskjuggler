<template>
  <div :class="[cardBg, 'backdrop-blur-sm rounded-xl border overflow-hidden', cardBorder]">
    <!-- Collapsed Header -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      :class="['w-full flex items-center justify-between p-3 transition-colors', theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-purple-50']"
    >
      <div class="flex items-center gap-2">
        <Plus :class="['h-5 w-5', theme === 'dark' ? 'text-teal-400' : 'text-purple-500']" />
        <span :class="['text-sm font-semibold', textPrimary]">
          Quick Action
        </span>
      </div>
      <ChevronDown :class="['h-4 w-4', textSecondary]" />
    </button>

    <!-- Expanded Content -->
    <Transition name="expand">
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="p-4">
          <!-- Header with Action Selector -->
          <div class="flex items-center justify-between mb-3">
            <div class="relative flex-1">
              <button
                @click="showDropdown = !showDropdown"
                :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full max-w-xs', theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200']"
              >
                <component :is="currentAction.icon" :class="['h-5 w-5', color]" />
                <span :class="['text-sm font-semibold', textPrimary]">
                  {{ currentAction.label }}
                </span>
                <ChevronDown :class="['h-4 w-4 ml-auto transition-transform', textSecondary, showDropdown ? 'rotate-180' : '']" />
              </button>

              <!-- Dropdown Menu -->
              <Transition name="dropdown">
                <div v-if="showDropdown" class="fixed inset-0 z-20" @click="showDropdown = false" />
              </Transition>
              <Transition name="dropdown">
                <div
                  v-if="showDropdown"
                  :class="['absolute top-full left-0 mt-2 w-64 z-30 rounded-lg border shadow-xl overflow-hidden', cardBorder, cardBg]"
                >
                  <div class="p-2">
                    <div :class="['text-xs font-semibold px-2 py-1.5 mb-1', textSecondary]">
                      Action Type
                    </div>
                    <button
                      v-for="action in ACTION_TYPES"
                      :key="action.type"
                      @click="activeAction = action.type; showDropdown = false"
                      :class="['w-full flex items-center gap-3 px-4 py-3 transition-colors', activeAction === action.type ? (theme === 'dark' ? 'bg-slate-700/50' : 'bg-purple-50') : (theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50')]"
                    >
                      <component :is="action.icon" :class="['h-5 w-5', theme === 'dark' ? action.colorDark : action.colorLight]" />
                      <span :class="['text-sm font-medium', textPrimary]">
                        {{ action.label }}
                      </span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- AI Assist Toggle -->
            <button
              @click="isAIAssisting = !isAIAssisting"
              :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-all', isAIAssisting ? (theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-purple-100 text-purple-600') : (theme === 'dark' ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100 text-gray-500')]"
            >
              <Sparkles class="h-4 w-4" />
              <span class="text-xs font-medium">AI</span>
            </button>
          </div>

          <!-- Dynamic Form Based on Action Type -->
          <Transition name="fade" mode="out-in">
            <div :key="activeAction" class="space-y-2">
              <!-- Email Form -->
              <template v-if="activeAction === 'email'">
                <input
                  v-model="formData.to"
                  type="text"
                  placeholder="To:"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
                <input
                  v-model="formData.subject"
                  type="text"
                  placeholder="Subject:"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
                <textarea
                  v-model="formData.content"
                  :placeholder="currentAction.placeholder"
                  rows="3"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 resize-none', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
              </template>

              <!-- Text Message Form -->
              <template v-if="activeAction === 'text'">
                <input
                  v-model="formData.to"
                  type="text"
                  placeholder="To:"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
                <textarea
                  v-model="formData.content"
                  :placeholder="currentAction.placeholder"
                  rows="3"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 resize-none', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
              </template>

              <!-- Task Form -->
              <template v-if="activeAction === 'task'">
                <input
                  v-model="formData.content"
                  type="text"
                  :placeholder="currentAction.placeholder"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
                <input
                  v-model="formData.date"
                  type="date"
                  :class="['w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
              </template>

              <!-- Calendar Event Form -->
              <template v-if="activeAction === 'calendar'">
                <input
                  v-model="formData.content"
                  type="text"
                  :placeholder="currentAction.placeholder"
                  :class="['w-full rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                />
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="formData.date"
                    type="date"
                    :class="['w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                  />
                  <input
                    v-model="formData.time"
                    type="time"
                    :class="['w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-500/50']"
                  />
                </div>
              </template>
            </div>
          </Transition>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 mt-3">
            <button
              @click="handleCancel"
              :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            >
              <X class="h-4 w-4" />
            </button>
            <button
              @click="handleSubmit"
              :class="['flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors', theme === 'dark' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-purple-500 hover:bg-purple-600']"
            >
              <Send class="h-4 w-4" />
              <span>
                {{ activeAction === 'email' ? 'Send' : activeAction === 'task' ? 'Create' : activeAction === 'calendar' ? 'Schedule' : 'Send' }}
              </span>
            </button>
          </div>

          <!-- AI Assistance Indicator -->
          <Transition name="expand">
            <div v-if="isAIAssisting" :class="['mt-3 pt-3 border-t', cardBorder]">
              <div class="flex items-center gap-2">
                <Sparkles :class="['h-4 w-4 animate-pulse', theme === 'dark' ? 'text-teal-400' : 'text-purple-500']" />
                <p :class="['text-xs', textSecondary]">
                  AI is helping you craft this {{ activeAction === 'email' ? 'email' : activeAction === 'task' ? 'task' : activeAction === 'calendar' ? 'event' : 'message' }}
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Mail, MessageSquare, CheckSquare, Calendar, Send, X, ChevronDown, Sparkles, Plus } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useActivitiesStore } from '@/stores/activities';
import api from '@/utils/api';

type ActionType = 'email' | 'text' | 'task' | 'calendar';

interface ActionConfig {
  type: ActionType;
  label: string;
  icon: any;
  colorDark: string;
  colorLight: string;
  placeholder: string;
}

const ACTION_TYPES: ActionConfig[] = [
  {
    type: 'email',
    label: 'Compose Email',
    icon: Mail,
    colorDark: 'text-blue-400',
    colorLight: 'text-blue-600',
    placeholder: 'Draft your email...',
  },
  {
    type: 'text',
    label: 'Send Message',
    icon: MessageSquare,
    colorDark: 'text-green-400',
    colorLight: 'text-green-600',
    placeholder: 'Type your message...',
  },
  {
    type: 'task',
    label: 'Create Task',
    icon: CheckSquare,
    colorDark: 'text-amber-400',
    colorLight: 'text-amber-600',
    placeholder: 'What needs to be done?',
  },
  {
    type: 'calendar',
    label: 'Schedule Event',
    icon: Calendar,
    colorDark: 'text-purple-400',
    colorLight: 'text-purple-600',
    placeholder: 'Event title...',
  },
];

const { theme } = useTheme();
const activitiesStore = useActivitiesStore();

const isExpanded = ref(false);
const activeAction = ref<ActionType>('email');
const showDropdown = ref(false);
const isAIAssisting = ref(true);
const formData = ref({
  to: '',
  subject: '',
  content: '',
  date: '',
  time: '',
});

const currentAction = computed(() => ACTION_TYPES.find(a => a.type === activeAction.value)!);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
const inputBg = computed(() => theme.value === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-purple-200');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-white' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');
const color = computed(() => theme.value === 'dark' ? currentAction.value.colorDark : currentAction.value.colorLight);

async function handleSubmit() {
  try {
    if (activeAction.value === 'email') {
      // Send email via API
      await api.post('/urpa/activities', {
        activity_type: 'email',
        title: formData.value.subject || 'Email',
        description: formData.value.content,
        to: formData.value.to,
        activity_timestamp: new Date().toISOString(),
      });
    } else if (activeAction.value === 'text') {
      // Send text message via API
      await api.post('/urpa/activities', {
        activity_type: 'text',
        title: 'Text Message',
        description: formData.value.content,
        to: formData.value.to,
        activity_timestamp: new Date().toISOString(),
      });
    } else if (activeAction.value === 'task') {
      // Create task via API
      await api.post('/urpa/ai/tasks', {
        title: formData.value.content,
        description: formData.value.content,
        due_at: formData.value.date || null,
        status: 'pending',
      });
    } else if (activeAction.value === 'calendar') {
      // Create calendar event via API
      await api.post('/urpa/activities', {
        activity_type: 'calendar',
        title: formData.value.content,
        description: formData.value.content,
        activity_timestamp: formData.value.date && formData.value.time 
          ? `${formData.value.date}T${formData.value.time}:00`
          : new Date().toISOString(),
      });
    }

    // Also create activity record
    await activitiesStore.createActivity({
      activity_type: activeAction.value,
      title: formData.value.subject || formData.value.content,
      description: formData.value.content,
      activity_timestamp: new Date().toISOString(),
    });
    
    formData.value = {
      to: '',
      subject: '',
      content: '',
      date: '',
      time: '',
    };
    isExpanded.value = false;
  } catch (error) {
    // Error handled by store
  }
}

function handleCancel() {
  formData.value = {
    to: '',
    subject: '',
    content: '',
    date: '',
    time: '',
  };
  isExpanded.value = false;
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

