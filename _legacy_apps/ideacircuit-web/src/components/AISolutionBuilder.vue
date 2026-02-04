<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold text-gray-900">AI Solution Builder</h1>
          <p class="text-sm text-gray-600">Map user needs to AI orchestrator APIs</p>
        </div>
        <div class="flex space-x-2">
          <button
            v-if="currentSolution && currentSolution.status === 'draft'"
            @click="executeSolution"
            :disabled="!meetingId"
            class="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <PlayIcon :size="16" />
            <span>Execute Solution</span>
          </button>
          <button class="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            <DownloadIcon :size="16" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Analysis Progress -->
    <div v-if="isAnalyzing" class="p-4 bg-blue-50 border-b border-blue-200">
      <div class="flex items-center space-x-3">
        <RefreshCwIcon :size="20" class="text-blue-600 animate-spin" />
        <div class="flex-1">
          <div class="flex justify-between text-sm text-blue-800 mb-1">
            <span>Analyzing user intent...</span>
            <span>{{ analysisProgress }}%</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${analysisProgress}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="currentSolution" class="space-y-6">
        <!-- Solution Overview -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ currentSolution.name }}</h2>
              <p class="text-sm text-gray-600">{{ currentSolution.description }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Estimated Time</div>
              <div class="text-lg font-bold text-gray-900">
                {{ Math.round(currentSolution.estimated_completion_time / 60) }} min
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span class="flex items-center">
              <BotIcon :size="16" class="mr-1" />
              {{ currentSolution.selected_bots.length }} bots
            </span>
            <span class="flex items-center">
              <WorkflowIcon :size="16" class="mr-1" />
              {{ currentSolution.workflow_steps.length }} steps
            </span>
            <span class="flex items-center">
              <TargetIcon :size="16" class="mr-1" />
              {{ currentSolution.requirements.length }} requirements
            </span>
          </div>
        </div>

        <!-- Requirements -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">User Requirements</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="req in currentSolution.requirements"
              :key="req.id"
              class="border rounded-lg p-3 bg-white"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-900">{{ req.description }}</h4>
                  <p class="text-sm text-gray-600 capitalize">{{ req.category }}</p>
                </div>
                <span :class="`px-2 py-1 rounded-full text-xs font-medium ${
                  req.priority === 'high' ? 'bg-red-100 text-red-800' :
                  req.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`">
                  {{ req.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Bots -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Selected AI Bots</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="bot in currentSolution.selected_bots"
              :key="bot.id"
              class="border rounded-lg p-3 bg-white"
            >
              <div class="flex items-start space-x-3">
                <component :is="getBotIcon(bot.category)" />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ bot.name }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ bot.description }}</p>
                  <div class="mt-2">
                    <div class="text-xs text-gray-500 mb-1">Capabilities:</div>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="(cap, index) in bot.capabilities"
                        :key="index"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {{ cap }}
                      </span>
                    </div>
                  </div>
                  <div v-if="bot.polly_enabled" class="mt-2 text-xs text-green-600">
                    ✓ Voice enabled ({{ bot.polly_voice }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Workflow Steps -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Execution Plan</h3>
          <div class="space-y-3">
            <div
              v-for="(step, index) in currentSolution.workflow_steps"
              :key="step.id"
              :class="`border rounded-lg p-4 transition-all ${
                step.status === 'running' ? 'border-blue-400 bg-blue-50' :
                step.status === 'completed' ? 'border-green-400 bg-green-50' :
                step.status === 'error' ? 'border-red-400 bg-red-50' :
                'border-gray-300 bg-white'
              }`"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ step.name }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ step.description }}</p>
                    </div>
                    <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`">
                      {{ step.status }}
                    </span>
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    <span class="font-medium">Bot:</span> {{ step.bot_id }} |
                    <span class="font-medium ml-2">Action:</span> {{ step.action }}
                  </div>
                  <div v-if="step.result" class="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <div class="font-medium text-gray-700">Execution Result:</div>
                    <pre class="text-xs text-gray-600 mt-1">{{ JSON.stringify(step.result, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <BrainIcon :size="48" class="text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Solution Generated</h3>
          <p class="text-gray-600">Enter a user intent to generate an AI solution</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, h } from 'vue';
import {
  BotIcon,
  WorkflowIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlayIcon,
  SettingsIcon,
  BrainIcon,
  ZapIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  TargetIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  EyeIcon,
  DownloadIcon
} from 'lucide-vue-next';
import api from '@/services/api';

interface BotCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  polly_enabled: boolean;
  polly_voice?: string;
  estimated_duration: number;
}

interface UserRequirement {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'mapped' | 'implemented';
  mapped_bots: string[];
  mapped_workflows: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  bot_id: string;
  action: string;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: any;
}

interface SolutionPlan {
  id: string;
  name: string;
  description: string;
  requirements: UserRequirement[];
  selected_bots: BotCapability[];
  workflow_steps: WorkflowStep[];
  estimated_completion_time: number;
  status: 'draft' | 'ready' | 'executing' | 'completed';
  execution_id?: string;
}

interface Props {
  userIntent: string;
  meetingId?: string;
  userId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'solution-complete': [solution: SolutionPlan];
}>();

const availableBots = ref<BotCapability[]>([]);
const currentSolution = ref<SolutionPlan | null>(null);
const isAnalyzing = ref(false);
const analysisProgress = ref(0);
const executionStatus = ref<'idle' | 'executing' | 'completed'>('idle');

const loadAvailableBots = async () => {
  try {
    const bots: BotCapability[] = [
      {
        id: 'meeting-facilitator',
        name: 'Meeting Facilitator Bot',
        description: 'Orchestrates meeting flow and guides participants with voice interaction',
        category: 'orchestration',
        capabilities: ['orchestrate', 'speak', 'facilitate'],
        polly_enabled: true,
        polly_voice: 'Joanna',
        estimated_duration: 300
      },
      {
        id: 'sales-discovery',
        name: 'Sales Discovery Bot',
        description: 'Qualifies leads and asks discovery questions with voice interaction',
        category: 'sales',
        capabilities: ['qualify', 'question', 'speak'],
        polly_enabled: true,
        polly_voice: 'Matthew',
        estimated_duration: 600
      },
      {
        id: 'presenter',
        name: 'AI Presenter Bot',
        description: 'Presents content and handles Q&A with voice interaction',
        category: 'presentation',
        capabilities: ['present', 'speak', 'interactive'],
        polly_enabled: true,
        polly_voice: 'Joanna',
        estimated_duration: 900
      },
      {
        id: 'notes',
        name: 'Notes Bot',
        description: 'Captures and organizes meeting notes',
        category: 'productivity',
        capabilities: ['capture', 'organize', 'summarize'],
        polly_enabled: false,
        estimated_duration: 180
      },
      {
        id: 'analytics',
        name: 'Analytics Bot',
        description: 'Analyzes meeting data and generates insights',
        category: 'analytics',
        capabilities: ['analyze', 'metrics', 'insights'],
        polly_enabled: false,
        estimated_duration: 240
      },
      {
        id: 'proposals',
        name: 'Proposals Bot',
        description: 'Generates business proposals',
        category: 'sales',
        capabilities: ['generate', 'format', 'export'],
        polly_enabled: false,
        estimated_duration: 300
      }
    ];
    availableBots.value = bots;
  } catch (error) {
    console.error('Failed to load available bots:', error);
  }
};

const analyzeUserIntent = async (intent: string) => {
  isAnalyzing.value = true;
  analysisProgress.value = 0;

  try {
    const analysisSteps = [
      'Parsing user requirements...',
      'Matching capabilities to available bots...',
      'Designing workflow sequence...',
      'Validating solution completeness...',
      'Generating execution plan...'
    ];

    for (let i = 0; i < analysisSteps.length; i++) {
      analysisProgress.value = (i + 1) * 20;
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const solution = await generateSolutionFromIntent(intent);
    currentSolution.value = solution;
  } catch (error) {
    console.error('Error analyzing user intent:', error);
  } finally {
    isAnalyzing.value = false;
  }
};

const generateSolutionFromIntent = async (intent: string): Promise<SolutionPlan> => {
  const requirements = parseRequirementsFromIntent(intent);
  const selectedBots = matchBotsToRequirements(requirements);
  const workflowSteps = generateWorkflowSteps(selectedBots, requirements);

  return {
    id: `solution-${Date.now()}`,
    name: `Solution for: ${intent.substring(0, 50)}...`,
    description: `Automated solution using AI bots for: ${intent}`,
    requirements,
    selected_bots: selectedBots,
    workflow_steps: workflowSteps,
    estimated_completion_time: calculateTotalTime(workflowSteps),
    status: 'draft'
  };
};

const parseRequirementsFromIntent = (intent: string): UserRequirement[] => {
  const requirements: UserRequirement[] = [];
  const intentLower = intent.toLowerCase();

  if (intentLower.includes('sales') || intentLower.includes('qualify') || intentLower.includes('prospect')) {
    requirements.push({
      id: 'sales-qualification',
      description: 'Qualify leads and gather prospect information',
      category: 'sales',
      priority: 'high',
      status: 'pending',
      mapped_bots: ['sales-discovery'],
      mapped_workflows: ['sales-discovery-workflow']
    });
  }

  if (intentLower.includes('meeting') || intentLower.includes('facilitate') || intentLower.includes('guide')) {
    requirements.push({
      id: 'meeting-facilitation',
      description: 'Facilitate meeting flow and guide participants',
      category: 'orchestration',
      priority: 'high',
      status: 'pending',
      mapped_bots: ['meeting-facilitator'],
      mapped_workflows: ['meeting-facilitation-workflow']
    });
  }

  if (intentLower.includes('present') || intentLower.includes('demo') || intentLower.includes('show')) {
    requirements.push({
      id: 'presentation',
      description: 'Present content and handle interactive Q&A',
      category: 'presentation',
      priority: 'medium',
      status: 'pending',
      mapped_bots: ['presenter'],
      mapped_workflows: ['presentation-workflow']
    });
  }

  if (intentLower.includes('notes') || intentLower.includes('capture') || intentLower.includes('record')) {
    requirements.push({
      id: 'note-capture',
      description: 'Capture and organize meeting notes and action items',
      category: 'productivity',
      priority: 'medium',
      status: 'pending',
      mapped_bots: ['notes'],
      mapped_workflows: ['notes-extraction-workflow']
    });
  }

  if (intentLower.includes('analyze') || intentLower.includes('insights') || intentLower.includes('metrics')) {
    requirements.push({
      id: 'analytics',
      description: 'Analyze meeting data and generate insights',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      mapped_bots: ['analytics'],
      mapped_workflows: ['analytics-workflow']
    });
  }

  if (intentLower.includes('proposal') || intentLower.includes('quote') || intentLower.includes('estimate')) {
    requirements.push({
      id: 'proposal-generation',
      description: 'Generate business proposals and quotes',
      category: 'sales',
      priority: 'high',
      status: 'pending',
      mapped_bots: ['proposals'],
      mapped_workflows: ['proposal-workflow']
    });
  }

  return requirements;
};

const matchBotsToRequirements = (requirements: UserRequirement[]): BotCapability[] => {
  const selectedBotIds = new Set<string>();
  requirements.forEach(req => {
    req.mapped_bots.forEach(botId => selectedBotIds.add(botId));
  });
  return availableBots.value.filter(bot => selectedBotIds.has(bot.id));
};

const generateWorkflowSteps = (bots: BotCapability[], requirements: UserRequirement[]): WorkflowStep[] => {
  const steps: WorkflowStep[] = [];
  let stepId = 1;

  bots.forEach(bot => {
    const botRequirements = requirements.filter(req => req.mapped_bots.includes(bot.id));
    botRequirements.forEach(req => {
      steps.push({
        id: `step-${stepId++}`,
        name: `${bot.name} - ${req.description}`,
        description: `Execute ${bot.name} for ${req.description}`,
        bot_id: bot.id,
        action: 'execute_ai_workflow',
        dependencies: [],
        status: 'pending'
      });
    });
  });

  return steps;
};

const calculateTotalTime = (steps: WorkflowStep[]): number => {
  return steps.reduce((total, step) => {
    const bot = availableBots.value.find(b => b.id === step.bot_id);
    return total + (bot?.estimated_duration || 0);
  }, 0);
};

const executeSolution = async () => {
  if (!currentSolution.value || !props.meetingId) return;

  executionStatus.value = 'executing';
  currentSolution.value = { ...currentSolution.value, status: 'executing' };

  try {
    for (let i = 0; i < currentSolution.value.workflow_steps.length; i++) {
      const step = currentSolution.value.workflow_steps[i];
      
      if (currentSolution.value) {
        const updatedSteps = [...currentSolution.value.workflow_steps];
        updatedSteps[i] = { ...step, status: 'running' };
        currentSolution.value = { ...currentSolution.value, workflow_steps: updatedSteps };
      }

      const result = await executeAIStep(step, props.meetingId!, props.userId);
      
      if (currentSolution.value) {
        const updatedSteps = [...currentSolution.value.workflow_steps];
        updatedSteps[i] = {
          ...step,
          status: result.success ? 'completed' : 'error',
          result: result
        };
        currentSolution.value = { ...currentSolution.value, workflow_steps: updatedSteps };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (currentSolution.value) {
      currentSolution.value = { ...currentSolution.value, status: 'completed' };
      executionStatus.value = 'completed';
      emit('solution-complete', currentSolution.value);
    }
  } catch (error) {
    console.error('Error executing solution:', error);
    executionStatus.value = 'idle';
  }
};

const executeAIStep = async (step: WorkflowStep, meetingId: string, userId: string) => {
  try {
    const bot = availableBots.value.find(b => b.id === step.bot_id);
    if (!bot) throw new Error(`Bot ${step.bot_id} not found`);
    
    const payload = {
      action: 'execute_ai_workflow',
      meeting_id: meetingId,
      user_id: userId,
      bot_id: bot.id,
      input_data: {
        step_id: step.id,
        step_description: step.description,
        bot_capabilities: bot.capabilities
      }
    };

    const response = await api.post(`/ideacircuit/ai/bots/${bot.id}/execute`, payload);
    const responseData = response.data as any;
    
    return {
      success: responseData.success || false,
      execution_id: responseData.execution_id || `exec-${Date.now()}`,
      result: responseData.result || {}
    };
  } catch (error: any) {
    console.error(`Error executing step ${step.id}:`, error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

const getBotIcon = (category: string) => {
  switch (category) {
    case 'orchestration':
      return h(WorkflowIcon, { size: 20, class: 'text-blue-500' });
    case 'sales':
      return h(TargetIcon, { size: 20, class: 'text-green-500' });
    case 'presentation':
      return h(FileTextIcon, { size: 20, class: 'text-purple-500' });
    case 'productivity':
      return h(CheckCircleIcon, { size: 20, class: 'text-orange-500' });
    case 'analytics':
      return h(BarChart3Icon, { size: 20, class: 'text-red-500' });
    default:
      return h(BotIcon, { size: 20, class: 'text-gray-500' });
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'running':
      return 'text-blue-600 bg-blue-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

watch(() => props.userIntent, (intent) => {
  if (intent) {
    analyzeUserIntent(intent);
  }
});

onMounted(() => {
  loadAvailableBots();
  if (props.userIntent) {
    analyzeUserIntent(props.userIntent);
  }
});
</script>

