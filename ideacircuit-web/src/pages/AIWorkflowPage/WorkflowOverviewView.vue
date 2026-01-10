<template>
  <div class="h-full flex flex-col">
    <!-- Instructions -->
    <div class="bg-purple-50 border-b border-purple-200 p-4">
      <div class="flex items-start space-x-3">
        <BarChart3Icon :size="24" class="text-purple-600 mt-0.5" />
        <div>
          <h2 class="text-lg font-semibold text-purple-900">Design Your AI Workflow</h2>
          <p class="text-sm text-purple-700 mt-1">
            Describe your workflow requirements and let AI create a solution.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Workflow Type Selection -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Workflow Type</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="type in workflowTypes"
              :key="type.id"
              @click="selectedType = type.id"
              :class="`p-4 border rounded-lg text-left transition-all ${
                selectedType === type.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`"
            >
              <div class="flex items-start space-x-3">
                <div :class="selectedType === type.id ? 'text-purple-600' : 'text-gray-500'">
                  <BarChart3Icon :size="20" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ type.label }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ type.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Intent Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Workflow Requirements</h3>
          <Textarea
            v-model="intent"
            placeholder="Describe your workflow requirements... For example: 'I need to process customer data, train a recommendation model, and deploy it to production'"
            class="w-full h-32"
          />
          <div class="mt-2 text-sm text-gray-600">
            Be specific about data sources, processing steps, and expected outputs.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <Button
            variant="secondary"
            @click="$emit('start-workflow')"
            class="min-h-[44px]"
          >
            <BarChart3Icon :size="16" class="mr-2" />
            <span>Start Basic Workflow</span>
          </Button>
          
          <Button
            @click="handleSubmit"
            :disabled="!intent.trim()"
            class="min-h-[44px]"
          >
            <BotIcon :size="16" class="mr-2" />
            <span>Create AI Solution</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BarChart3Icon, BotIcon } from 'lucide-vue-next';
import { Textarea, Button } from '@/components/ui';

const intent = ref('');
const selectedType = ref('');

const workflowTypes = [
  { id: 'data-pipeline', label: 'Data Pipeline', description: 'Process and analyze data streams' },
  { id: 'ml-training', label: 'ML Training', description: 'Train machine learning models' },
  { id: 'automation', label: 'Process Automation', description: 'Automate business processes' },
  { id: 'integration', label: 'System Integration', description: 'Connect different systems' },
  { id: 'custom', label: 'Custom Workflow', description: 'Define your own workflow' }
];

const handleSubmit = () => {
  if (!intent.value.trim()) return;
  
  const fullIntent = selectedType.value
    ? `[${selectedType.value}] ${intent.value}`
    : intent.value;
  
  emit('intent-submit', fullIntent);
};

const emit = defineEmits<{
  'intent-submit': [intent: string];
  'start-workflow': [];
}>();
</script>

