<template>
  <div :class="['rounded-xl border-2 backdrop-blur-sm overflow-hidden shadow-lg', cardBg, cardBorder]">
    <div :class="['p-4 border-b-2', cardBorder, headerBg]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-200 text-pink-900']">
            <FileText class="h-5 w-5" />
          </div>
          <div>
            <h3 :class="['text-base font-bold', textPrimary]">Fibonacci Publishing</h3>
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
        :class="['w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors', theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600']"
      >
        Connect Publishing
      </button>
      <div v-else class="space-y-2">
        <div class="flex items-center justify-between">
          <span :class="['text-sm', textSecondary]">Active projects</span>
          <span :class="['text-sm font-bold', textPrimary]">{{ projectsCount }}</span>
        </div>
        <button
          @click="showCreateModal = true"
          :class="['w-full px-4 py-2 rounded-lg font-semibold transition-colors', theme === 'dark' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-pink-500 text-white hover:bg-pink-600']"
        >
          Create Content Request
        </button>
      </div>
    </div>

    <!-- Recent Projects -->
    <div v-if="linked && recentProjects.length > 0" class="p-4 space-y-2 max-h-[200px] overflow-y-auto">
      <h4 :class="['text-sm font-semibold mb-2', textPrimary]">Recent Projects</h4>
      <div
        v-for="project in recentProjects"
        :key="project.id"
        :class="['p-2 rounded-lg border', theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-200']"
      >
        <p :class="['text-sm font-medium', textPrimary]">{{ project.topic }}</p>
        <p :class="['text-xs mt-1', textSecondary]">{{ project.type }} • {{ project.status }}</p>
      </div>
    </div>
  </div>

  <!-- Create Content Request Modal -->
  <Modal :model-value="showCreateModal" @update:model-value="showCreateModal = $event" @close="showCreateModal = false">
    <div class="p-6">
      <h3 :class="['text-xl font-bold mb-4', textPrimary]">Create Content Request</h3>
      <div class="space-y-4">
        <div>
          <label :class="['block text-sm font-semibold mb-2', textPrimary]">Type</label>
          <select
            v-model="contentRequest.type"
            :class="['w-full rounded-lg px-3 py-2 border', theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900']"
          >
            <option value="blog">Blog Post</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="ad">Advertisement</option>
          </select>
        </div>
        <div>
          <label :class="['block text-sm font-semibold mb-2', textPrimary]">Topic</label>
          <input
            v-model="contentRequest.topic"
            type="text"
            placeholder="What content do you need?"
            :class="['w-full rounded-lg px-3 py-2 border', theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900']"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="showCreateModal = false"
            :class="['flex-1 px-4 py-2 rounded-lg font-semibold transition-colors', theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            Cancel
          </button>
          <button
            @click="handleCreateRequest"
            :class="['flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors', theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600']"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FileText } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useFibonacciStore } from '@/stores/fibonacci';
import Modal from '@/components/ui/Modal.vue';

const { theme } = useTheme();
const fibonacciStore = useFibonacciStore();

const showCreateModal = ref(false);
const recentProjects = ref<any[]>([]);
const contentRequest = ref({
  type: 'blog',
  topic: '',
});

const linked = computed(() => fibonacciStore.publishingLinked);
const projectsCount = computed(() => fibonacciStore.projects.length);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-pink-50/50');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-800');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');

async function handleLink() {
  // TODO: Open Fibonacci Publishing link modal with team selection
  // For now, prompt for team ID
  const teamId = prompt('Enter your Fibonacci Publishing team ID:');
  if (teamId) {
    try {
      await fibonacciStore.linkPublishing(teamId);
      await fibonacciStore.fetchProjects(teamId);
      recentProjects.value = fibonacciStore.projects.slice(0, 5);
    } catch (error) {
      // Error handled by store
    }
  }
}

async function handleCreateRequest() {
  if (!contentRequest.value.topic.trim()) {
    return;
  }
  try {
    const teamId = fibonacciStore.link?.fibonacci_team_id;
    if (!teamId) {
      alert('Please link your Publishing account first');
      return;
    }
    await fibonacciStore.createContentRequest(teamId, contentRequest.value);
    recentProjects.value = fibonacciStore.projects.slice(0, 5);
    showCreateModal.value = false;
    contentRequest.value = { type: 'blog', topic: '' };
  } catch (error) {
    // Error handled by store
  }
}

onMounted(async () => {
  await fibonacciStore.checkStatus();
  if (fibonacciStore.link?.fibonacci_team_id) {
    await fibonacciStore.fetchProjects(fibonacciStore.link.fibonacci_team_id);
    recentProjects.value = fibonacciStore.projects.slice(0, 5);
  }
});
</script>

