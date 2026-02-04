<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 p-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create AI Solution</h1>
          <p class="text-sm text-gray-600">Map user needs to AI orchestrator APIs</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600">Meeting: {{ meetingId || 'Not specified' }}</div>
          <div class="text-sm text-gray-600">User: {{ userId }}</div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="mt-4 flex items-center space-x-4">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
        >
          <div :class="`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            step.active ? 'bg-blue-100 text-blue-800' : 'text-gray-500'
          }`">
            <component :is="getViewIcon(step.id)" />
            <span class="text-sm font-medium">{{ step.label }}</span>
          </div>
          <ArrowRightIcon v-if="index < 2" :size="16" class="text-gray-400 mx-2" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <IntentCaptureView
        v-if="currentView === 'intent'"
        @intent-submit="handleIntentSubmit"
        :user-id="userId"
        :meeting-id="meetingId"
      />
      
      <AISolutionBuilder
        v-else-if="currentView === 'solution'"
        :user-intent="userIntent"
        :meeting-id="meetingId"
        :user-id="userId"
        @solution-complete="handleSolutionComplete"
      />
      
      <ExecutionView
        v-else-if="currentView === 'execution' && currentSolution"
        :solution="currentSolution"
        :user-id="userId"
        :meeting-id="meetingId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  BrainIcon,
  WorkflowIcon,
  PlayIcon,
  ArrowRightIcon
} from 'lucide-vue-next';
import AISolutionBuilder from '@/components/AISolutionBuilder.vue';
import IntentCaptureView from './AICreatePage/IntentCaptureView.vue';
import ExecutionView from './AICreatePage/ExecutionView.vue';

interface Props {
  userId: string;
  meetingId?: string;
}

const props = defineProps<Props>();

const currentView = ref<'intent' | 'solution' | 'execution'>('intent');
const userIntent = ref('');
const currentSolution = ref<any>(null);

const steps = computed(() => [
  { id: 'intent', label: 'Define Intent', active: currentView.value === 'intent' },
  { id: 'solution', label: 'Generate Solution', active: currentView.value === 'solution' },
  { id: 'execution', label: 'Execute Solution', active: currentView.value === 'execution' }
]);

const handleIntentSubmit = (intent: string) => {
  userIntent.value = intent;
  currentView.value = 'solution';
};

const handleSolutionComplete = (solution: any) => {
  currentSolution.value = solution;
  currentView.value = 'execution';
};

const getViewIcon = (view: string) => {
  switch (view) {
    case 'intent':
      return BrainIcon;
    case 'solution':
      return WorkflowIcon;
    case 'execution':
      return PlayIcon;
    default:
      return BrainIcon;
  }
};
</script>

