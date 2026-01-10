<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 p-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">AI Workflow</h1>
          <p class="text-sm text-gray-600">Design and execute AI-powered workflows</p>
        </div>
        <div class="flex items-center space-x-4">
          <NavigationMenu />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <WorkflowOverviewView
        v-if="currentView === 'overview'"
        @intent-submit="handleIntentSubmit"
        @start-workflow="currentView = 'workflow'"
      />
      
      <AISolutionBuilder
        v-else-if="currentView === 'ai-builder'"
        :user-intent="userIntent"
        meeting-id="workflow-session"
        user-id="current-user"
        @solution-complete="handleSolutionComplete"
      />
      
      <WorkflowExecutionView
        v-else-if="currentView === 'workflow'"
        :solution="currentSolution"
        @back-to-setup="currentView = 'overview'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import AISolutionBuilder from '@/components/AISolutionBuilder.vue';
import WorkflowOverviewView from './AIWorkflowPage/WorkflowOverviewView.vue';
import WorkflowExecutionView from './AIWorkflowPage/WorkflowExecutionView.vue';

const currentView = ref<'overview' | 'ai-builder' | 'workflow'>('overview');
const userIntent = ref('');
const currentSolution = ref<any>(null);

const handleIntentSubmit = (intent: string) => {
  userIntent.value = intent;
  currentView.value = 'ai-builder';
};

const handleSolutionComplete = (solution: any) => {
  currentSolution.value = solution;
  currentView.value = 'workflow';
};
</script>

