<template>
  <div class="h-full bg-slate-900 text-white p-8 flex flex-col w-64 md:w-80 flex-shrink-0">
    <div class="mb-10">
      <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-2xl mb-4">4</div>
      <h2 class="text-xl font-bold tracking-tight">Onboarding</h2>
      <p class="text-slate-400 text-sm mt-1">Let's get you set up.</p>
    </div>

    <!-- Steps -->
    <div class="space-y-4 flex-1">
      <div v-for="(step, index) in displaySteps" :key="step.key" class="relative pl-8 pb-8 last:pb-0">
        <!-- Connecting Line -->
        <div 
          v-if="index !== displaySteps.length - 1"
          class="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-800"
          :class="{ 'bg-blue-600': isCompleted(step.key) }"
        ></div>

        <!-- Indicator -->
        <div 
          class="absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 z-10"
          :class="[
            currentStep === step.key ? 'border-blue-500 bg-slate-900 text-blue-500' :
            isCompleted(step.key) ? 'border-blue-600 bg-blue-600 text-white' :
            'border-slate-700 bg-slate-900 text-slate-700'
          ]"
        >
          <Check v-if="isCompleted(step.key)" class="w-3.5 h-3.5" />
          <div v-else-if="currentStep === step.key" class="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>

        <!-- Label -->
        <div>
          <h3 
            class="font-bold text-sm transition-colors duration-300"
            :class="[
              currentStep === step.key ? 'text-white' :
              isCompleted(step.key) ? 'text-slate-300' :
              'text-slate-600'
            ]"
          >
            {{ step.label }}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <!-- AI Toggle (Visual Only) -->
    <div class="flex items-center gap-3 p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/30 mt-auto">
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <Bot class="w-4 h-4 text-white" />
      </div>
      <div>
        <p class="text-xs font-bold text-indigo-300">AI Assistant</p>
        <p class="text-[10px] text-indigo-400">Active & Ready</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check, Bot } from 'lucide-vue-next';
import { useOnboardingStore, type OnboardingStep } from '@/stores/onboardingStore';

const store = useOnboardingStore();

const currentStep = computed(() => store.currentStep);

const displaySteps = [
  { key: 'welcome', label: 'Welcome', desc: 'Get started' },
  { key: 'profile', label: 'Personal Profile', desc: 'Verify your details' },
  { key: 'urpa-setup', label: 'AI Configuration', desc: 'Customize URPA' },
  { key: 'calls-setup', label: '4Calls Setup', desc: 'Voicemail & Forwarding' },
  { key: 'business-profile', label: 'Business Profile', desc: 'Practice details' },
  { key: 'complete', label: 'Review', desc: 'Confirm & finish' },
];

const isCompleted = (stepKey: string) => {
  const steps = store.steps;
  const currentIndex = steps.indexOf(store.currentStep);
  const stepIndex = steps.indexOf(stepKey as OnboardingStep);
  return stepIndex < currentIndex;
};
</script>
