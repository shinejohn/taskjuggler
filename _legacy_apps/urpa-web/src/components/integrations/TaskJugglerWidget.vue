<template>
  <div :class="['rounded-xl border-2 backdrop-blur-sm overflow-hidden shadow-lg', cardBg, cardBorder]">
    <div :class="['p-4 border-b-2', cardBorder, headerBg]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-200 text-purple-900']">
            <CheckSquare class="h-5 w-5" />
          </div>
          <div>
            <h3 :class="['text-base font-bold', textPrimary]">TaskJuggler</h3>
            <p :class="['text-xs', textSecondary]">
              {{ linked ? 'Connected' : 'Not connected' }}
            </p>
          </div>
        </div>
        <div :class="['h-2 w-2 rounded-full', linked ? 'bg-green-500' : 'bg-gray-500']" />
      </div>

      <button
        v-if="!linked"
        @click="handleLink"
        :class="['w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors', theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600']"
      >
        Connect TaskJuggler
      </button>
      <div v-else class="space-y-2">
        <div class="flex items-center justify-between">
          <span :class="['text-sm', textSecondary]">Tasks synced</span>
          <span :class="['text-sm font-bold', textPrimary]">{{ syncedTasksCount }}</span>
        </div>
        <button
          @click="handleSync"
          :disabled="syncing"
          :class="['w-full px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50', theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          {{ syncing ? 'Syncing...' : 'Sync Now' }}
        </button>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div v-if="linked && recentTasks.length > 0" class="p-4 space-y-2 max-h-[200px] overflow-y-auto">
      <h4 :class="['text-sm font-semibold mb-2', textPrimary]">Recent Tasks</h4>
      <div
        v-for="task in recentTasks"
        :key="task.id"
        :class="['p-2 rounded-lg border', theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-200']"
      >
        <p :class="['text-sm font-medium', textPrimary]">{{ task.title }}</p>
        <p :class="['text-xs mt-1', textSecondary]">{{ task.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CheckSquare } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useTaskJugglerStore } from '@/stores/taskjuggler';

const { theme } = useTheme();
const taskJugglerStore = useTaskJugglerStore();

const syncing = ref(false);
const recentTasks = ref<any[]>([]);

const linked = computed(() => taskJugglerStore.linked);
const syncedTasksCount = computed(() => taskJugglerStore.tasks.length);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-purple-50/50');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-800');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');

async function handleLink() {
  // TODO: Open TaskJuggler link modal with user selection
  // For now, prompt for TaskJuggler user ID
  const taskjugglerUserId = prompt('Enter your TaskJuggler user ID:');
  if (taskjugglerUserId) {
    try {
      await taskJugglerStore.linkAccount({
        taskjuggler_user_id: taskjugglerUserId,
        sync_tasks: true,
        sync_projects: false,
        auto_create_tasks: true,
      });
    } catch (error) {
      // Error handled by store
    }
  }
}

async function handleSync() {
  syncing.value = true;
  try {
    await taskJugglerStore.sync();
  } catch (error) {
    // Error handled by store
  } finally {
    syncing.value = false;
  }
}

onMounted(async () => {
  await taskJugglerStore.checkStatus();
});
</script>

