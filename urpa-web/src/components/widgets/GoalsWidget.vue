<template>
  <div :class="['rounded-xl border backdrop-blur-sm overflow-hidden', cardBorder, cardBg]">
    <div
      @click="isExpanded = !isExpanded"
      class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
    >
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
          <Target class="h-4 w-4" />
        </div>
        <h3 class="text-sm font-semibold text-slate-200">Active Goals</h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
          @click.stop
        >
          <Plus class="h-4 w-4" />
        </button>
        <ChevronUp v-if="isExpanded" class="h-4 w-4 text-slate-500" />
        <ChevronDown v-else class="h-4 w-4 text-slate-500" />
      </div>
    </div>

    <Transition name="expand">
      <div v-if="isExpanded" class="px-4 pb-4 space-y-4">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="group"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-slate-300">
              {{ goal.title }}
            </span>
            <span class="text-xs text-slate-500">
              {{ goal.progress }}%
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
            <div
              :style="{ width: `${goal.progress}%` }"
              :class="['h-full rounded-full transition-all duration-1000', goal.color]"
            />
          </div>
          <div class="mt-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-[10px] text-slate-500">
              Target: {{ goal.target }}
            </span>
            <button class="text-slate-500 hover:text-white">
              <MoreHorizontal class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Target, Plus, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: string;
  color: string;
}

const { theme } = useTheme();

const isExpanded = ref(true);
const goals = ref<Goal[]>([
  {
    id: '1',
    title: 'Q3 Revenue Target',
    progress: 75,
    target: '$1.2M',
    color: 'bg-emerald-500',
  },
  {
    id: '2',
    title: 'Team Hiring',
    progress: 40,
    target: '4/10 Roles',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Product Launch',
    progress: 90,
    target: 'Sept 15',
    color: 'bg-purple-500',
  },
]);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
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

