<template>
  <div class="min-h-screen w-full bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Progress Header -->
      <div v-if="currentStep < 5" class="mb-8 max-w-3xl mx-auto">
        <div class="flex justify-between items-end mb-2">
          <span class="text-sm font-semibold text-[#1B4F72]">
            Step {{ currentStep }} of {{ totalSteps }}
          </span>
          <span class="text-sm font-medium text-slate-500">
            {{ Math.round((currentStep / totalSteps) * 100) }}% Complete
          </span>
        </div>
        <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#1B4F72] rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 lg:p-12 min-h-[600px]">
        <RoleSelectionStep v-if="currentStep === 1" @next="handleNext" />
        <IndustrySelectionStep v-if="currentStep === 2" @next="handleNext" @back="handleBack" />
        <PersonaCustomizerStep v-if="currentStep === 3" @next="handleNext" @back="handleBack" />
        <BusinessPollStep v-if="currentStep === 4" @next="handleNext" @back="handleBack" />
        <SetupCompleteStep v-if="currentStep === 5" />
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center space-x-6 text-sm text-slate-400">
        <a href="#" class="hover:text-[#1B4F72] transition-colors">
          Privacy Policy
        </a>
        <a href="#" class="hover:text-[#1B4F72] transition-colors">
          Terms of Service
        </a>
        <a href="#" class="hover:text-[#1B4F72] transition-colors">
          Contact Support
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep.vue';
import IndustrySelectionStep from '@/components/onboarding/IndustrySelectionStep.vue';
import PersonaCustomizerStep from '@/components/onboarding/PersonaCustomizerStep.vue';
import BusinessPollStep from '@/components/onboarding/BusinessPollStep.vue';
import SetupCompleteStep from '@/components/onboarding/SetupCompleteStep.vue';
import { onboardingApi } from '@/api/onboarding';
import { useOrganizationsStore } from '@/stores/organizations';

const organizationsStore = useOrganizationsStore();

const currentStep = ref(1);
const totalSteps = 5;

// Onboarding data collection
const onboardingData = ref({
  role_template_id: '',
  persona_template_id: '',
  industry: '',
  organization: {} as any,
  coordinator: {} as any,
  business_info: {} as any,
});

function handleNext(data?: any) {
  // Collect data from each step
  if (data) {
    if (currentStep.value === 1 && data.role_template_id) {
      onboardingData.value.role_template_id = data.role_template_id;
    }
    if (currentStep.value === 2 && data.industry) {
      onboardingData.value.industry = data.industry;
      onboardingData.value.organization.industry = data.industry;
    }
    if (currentStep.value === 3 && data.persona_template_id) {
      onboardingData.value.persona_template_id = data.persona_template_id;
      if (data.coordinator) {
        onboardingData.value.coordinator = { ...onboardingData.value.coordinator, ...data.coordinator };
      }
    }
    if (currentStep.value === 4 && data.business) {
      onboardingData.value.organization = { ...onboardingData.value.organization, ...data.business };
      if (data.services) {
        onboardingData.value.business_info = { ...onboardingData.value.business_info, services: data.services };
      }
    }
  }

  // If moving to final step, complete onboarding
  if (currentStep.value === 4) {
    completeOnboarding();
  } else if (currentStep.value < totalSteps) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function completeOnboarding() {
  try {
    const response = await onboardingApi.complete({
      organization: {
        name: onboardingData.value.organization.name || 'My Business',
        industry: onboardingData.value.industry,
        ...onboardingData.value.organization,
      },
      role_template_id: onboardingData.value.role_template_id,
      persona_template_id: onboardingData.value.persona_template_id,
      coordinator: onboardingData.value.coordinator,
      business_info: onboardingData.value.business_info,
    });

    // Update organizations store
    await organizationsStore.fetchOrganizations();
    if (response.data.organization) {
      organizationsStore.setCurrentOrganization(response.data.organization);
    }

    // Move to completion step
    currentStep.value = 5;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error: any) {
    console.error('Failed to complete onboarding:', error);
    alert(error.response?.data?.message || 'Failed to complete onboarding. Please try again.');
  }
}

function handleBack() {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
</script>

