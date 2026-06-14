import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './auth';

export type OnboardingStep = 'welcome' | 'profile' | 'urpa-setup' | 'calls-setup' | 'business-profile' | 'complete';

export const useOnboardingStore = defineStore('onboarding', () => {
    const currentStep = ref<OnboardingStep>('welcome');
    const router = useRouter();
    const authStore = useAuthStore();

    // Progress tracking
    const steps: OnboardingStep[] = ['welcome', 'profile', 'urpa-setup', 'calls-setup', 'business-profile', 'complete'];

    const progress = computed(() => {
        const currentIndex = steps.indexOf(currentStep.value);
        return Math.round(((currentIndex + 1) / steps.length) * 100);
    });

    // Settings State
    const profileSettings = ref({
        firstName: authStore.user?.name.split(' ')[0] || '',
        lastName: authStore.user?.name.split(' ').slice(1).join(' ') || '',
        role: authStore.user?.role || '',
        specialty: '',
        phone: '',
    });

    const urpaSettings = ref({
        voice: 'alloy',
        personality: 'professional',
        proactiveCheckins: true,
        checkinTime: '08:00',
    });

    const callsSettings = ref({
        voicemailGreeting: '',
        forwardingNumber: '',
        availability: {
            start: '09:00',
            end: '17:00'
        }
    });

    // Actions
    function nextStep() {
        const currentIndex = steps.indexOf(currentStep.value);
        if (currentIndex < steps.length - 1) {
            currentStep.value = steps[currentIndex + 1]!;
        }
    }

    function previousStep() {
        const currentIndex = steps.indexOf(currentStep.value);
        if (currentIndex > 0) {
            currentStep.value = steps[currentIndex - 1]!;
        }
    }

    function setStep(step: OnboardingStep) {
        currentStep.value = step;
    }

    async function completeOnboarding() {
        // TODO: Save profile/urpa/calls settings to backend when API is available
        // await api.post('/onboarding/complete');

        return true;
    }

    return {
        currentStep,
        progress,
        steps,
        profileSettings,
        urpaSettings,
        callsSettings,
        nextStep,
        previousStep,
        setStep,
        completeOnboarding
    };
});
