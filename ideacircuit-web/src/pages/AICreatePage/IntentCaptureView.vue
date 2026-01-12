<template>
  <div class="h-full flex flex-col">
    <!-- Instructions -->
    <div class="bg-blue-50 border-b border-blue-200 p-4">
      <div class="flex items-start space-x-3">
        <BrainIcon :size="24" class="text-blue-600 mt-0.5" />
        <div>
          <h2 class="text-lg font-semibold text-blue-900">Define Your Solution Intent</h2>
          <p class="text-sm text-blue-700 mt-1">
            Describe what you want to accomplish. The AI system will map your needs to the appropriate bots and workflows.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Category Selection -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Solution Category</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="`p-4 border rounded-lg text-left transition-all ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`"
            >
              <div class="flex items-start space-x-3">
                <div :class="selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'">
                  <component :is="category.icon" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ category.label }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Intent Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Describe Your Intent</h3>
          <Textarea
            v-model="intent"
            placeholder="Describe what you want to accomplish... For example: 'I need to qualify leads for our new product launch and generate proposals for qualified prospects'"
            class="w-full h-32"
          />
          <div class="mt-2 text-sm text-gray-600">
            Be specific about your goals, target audience, and expected outcomes.
          </div>
        </div>

        <!-- Context Information -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Context Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-sm font-medium text-gray-700">User ID</div>
              <div class="text-sm text-gray-600">{{ userId }}</div>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-sm font-medium text-gray-700">Meeting ID</div>
              <div class="text-sm text-gray-600">{{ meetingId || 'Not specified' }}</div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <Button
            @click="handleSubmit"
            :disabled="!intent.trim() || isSubmitting"
            class="min-h-[44px]"
          >
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <BrainIcon v-else :size="16" class="mr-2" />
            <span>{{ isSubmitting ? 'Analyzing...' : 'Generate Solution' }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  BrainIcon,
  TargetIcon,
  UsersIcon,
  FileTextIcon,
  CheckCircleIcon,
  BarChart3Icon,
  SettingsIcon
} from 'lucide-vue-next';
import { Textarea, Button, Card } from '@/components/ui';

const props = defineProps<{
  userId: string;
  meetingId?: string;
}>();

const emit = defineEmits<{
  'intent-submit': [intent: string];
}>();

const intent = ref('');
const selectedCategory = ref('');
const isSubmitting = ref(false);

const categories = [
  { id: 'sales', label: 'Sales & Discovery', icon: TargetIcon, description: 'Qualify leads, generate proposals, sales processes' },
  { id: 'meeting', label: 'Meeting Facilitation', icon: UsersIcon, description: 'Guide meetings, manage agendas, facilitate discussions' },
  { id: 'presentation', label: 'Presentations', icon: FileTextIcon, description: 'Create presentations, handle Q&A, interactive demos' },
  { id: 'productivity', label: 'Productivity', icon: CheckCircleIcon, description: 'Note-taking, action items, task management' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3Icon, description: 'Data analysis, insights, performance metrics' },
  { id: 'custom', label: 'Custom Solution', icon: SettingsIcon, description: 'Define your own specific requirements' }
];

const handleSubmit = async () => {
  if (!intent.value.trim()) return;

  isSubmitting.value = true;
  try {
    const fullIntent = selectedCategory.value
      ? `[${selectedCategory.value}] ${intent.value}`
      : intent.value;

    emit('intent-submit', fullIntent);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

