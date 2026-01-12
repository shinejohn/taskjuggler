<template>
  <div :class="['flex flex-col backdrop-blur-sm rounded-xl border-2 overflow-hidden shadow-lg', cardBg, cardBorder]">
    <!-- Header -->
    <div
      @click="isExpanded = !isExpanded"
      :class="['flex items-center justify-between p-4 cursor-pointer transition-colors border-b-2', headerBg, cardBorder, theme === 'dark' ? 'hover:bg-slate-800/70' : 'hover:from-purple-300 hover:to-pink-300']"
    >
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-teal-500/10 text-teal-400' : 'bg-purple-300 text-purple-900']">
          <Bot class="h-5 w-5" />
        </div>
        <div>
          <h3 :class="['text-base font-bold', textPrimary]">AI Tasks</h3>
          <p v-if="!isExpanded" :class="['text-xs font-semibold', textSecondary]">
            {{ completedCount }} done · {{ inProgressCount }} in progress
          </p>
        </div>
      </div>
      <ChevronUp v-if="isExpanded" :class="['h-5 w-5', textSecondary]" />
      <ChevronDown v-else :class="['h-5 w-5', textSecondary]" />
    </div>

    <!-- Tasks List -->
    <Transition name="expand">
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="p-4 space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
          <div
            v-for="(task, index) in tasks"
            :key="task.id"
            :class="['flex items-start gap-3 p-3 rounded-lg border-2 border-l-4 transition-colors cursor-pointer', itemBorder, getStatusColor(task.status), itemBg]"
          >
            <div class="mt-0.5">
              <component :is="getStatusIcon(task.status)" />
            </div>
            <div class="flex-1 min-w-0">
              <p :class="['text-sm font-bold leading-snug', textPrimary]">
                {{ task.title }}
              </p>
              <p :class="['text-xs font-semibold mt-1', textSecondary]">
                {{ task.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bot, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useAiStore } from '@/stores/ai';
import type { AITask } from '@/types/ai';

const { theme } = useTheme();
const aiStore = useAiStore();

const isExpanded = ref(false);
const tasks = ref<AITask[]>([]);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/95');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-r from-purple-200 to-pink-200');
const itemBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-gray-200 hover:bg-gray-300');
const itemBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-500' : 'text-gray-700');

const completedCount = computed(() => tasks.value.filter(t => t.status === 'completed').length);
const inProgressCount = computed(() => tasks.value.filter(t => t.status === 'in-progress').length);

function getStatusIcon(status: AITask['status']) {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'in-progress':
      return Clock;
    case 'pending':
      return AlertCircle;
  }
}

function getStatusColor(status: AITask['status']) {
  switch (status) {
    case 'completed':
      return 'border-l-green-500';
    case 'in-progress':
      return 'border-l-amber-500';
    case 'pending':
      return theme.value === 'dark' ? 'border-l-slate-500' : 'border-l-gray-500';
  }
}

onMounted(async () => {
  try {
    const { useAiStore } = await import('@/stores/ai');
    const aiStore = useAiStore();
    await aiStore.fetchTasks();
    
    // Map AI tasks to component format
    tasks.value = aiStore.tasks.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      time: task.time || 'Recently',
    }));
  } catch (error) {
    // Silently fail - tasks widget is optional
  }
});
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
</style>

