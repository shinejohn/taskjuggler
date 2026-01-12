<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
        Customize Your Assistant
      </h1>
      <p class="text-lg text-slate-600">
        Give your coordinator a personality and identity
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8">
      <!-- Left Side: Form -->
      <div class="flex-1 space-y-8">
        <!-- Section 1: Identity -->
        <Card class="space-y-4">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                1
              </span>
              Assistant Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Name</Label>
                <Input
                  v-model="formData.name"
                  type="text"
                  placeholder="e.g., Sally, Ed, Marcus"
                />
              </div>

              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Gender</Label>
                <div class="flex gap-2">
                  <Select v-model="formData.gender" class="flex-1">
                    <SelectTrigger>
                      <SelectValue :placeholder="formData.gender || 'Select gender'" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    class="text-[#1B4F72] hover:bg-blue-50"
                    title="Preview Voice"
                  >
                    <Play :size="20" fill="currentColor" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Section 2: Personality -->
        <Card class="space-y-4">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                2
              </span>
              Personality & Tone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="option in personalityOptions"
                  :key="option.value"
                  @click="formData.personality = option.value"
                  :variant="formData.personality === option.value ? 'default' : 'outline'"
                  :class="[
                    'rounded-full',
                    formData.personality === option.value
                      ? 'bg-[#1B4F72] text-white border-[#1B4F72] hover:bg-[#153e5a]'
                      : ''
                  ]"
                >
                  {{ option.label }}
                </Button>
              </div>

              <div class="space-y-2 pt-2">
                <div class="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <span>Relaxed</span>
                  <span>Moderate</span>
                  <span>Energetic</span>
                </div>
                <input
                  v-model.number="paceValue"
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B4F72]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Section 3: Business -->
        <Card class="space-y-4">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                3
              </span>
              Your Business
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="relative">
                <Building2 class="absolute left-3 top-2.5 text-slate-400 z-10" :size="18" />
                <Input
                  v-model="formData.businessName"
                  type="text"
                  placeholder="Business Name (Required)"
                  class="pl-10"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="relative">
                  <Phone class="absolute left-3 top-2.5 text-slate-400 z-10" :size="18" />
                  <Input
                    v-model="formData.phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    class="pl-10"
                  />
                </div>
                <div class="relative">
                  <Mail class="absolute left-3 top-2.5 text-slate-400 z-10" :size="18" />
                  <Input
                    v-model="formData.email"
                    type="email"
                    placeholder="email@business.com"
                    class="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Side: Preview -->
      <div class="w-full lg:w-[40%]">
        <div class="sticky top-8">
          <div class="bg-gradient-to-br from-[#1B4F72] to-[#0F2F44] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <h4 class="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
              Live Preview
            </h4>

            <div class="flex flex-col items-center text-center space-y-6 relative z-10">
              <div class="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                <User :size="32" />
              </div>
              <div>
                <h3 class="text-xl font-bold mb-1">
                  {{ formData.name || 'Your Coordinator' }}
                </h3>
                <p class="text-blue-200 text-sm">
                  {{ formData.businessName || 'Your Business' }}
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full text-left">
                <p class="text-sm text-white/90 italic">
                  "{{ previewGreeting }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <CardFooter class="flex justify-between mt-10 px-0">
      <Button variant="outline" @click="$emit('back')" class="flex items-center gap-2">
        <ArrowLeft :size="18" />
        Back
      </Button>
      <Button
        @click="handleNext"
        :disabled="!formData.businessName.trim() || !selectedPersona"
        class="bg-[#1B4F72] hover:bg-[#153e5a] flex items-center gap-2"
      >
        Continue
        <ArrowRight :size="18" />
      </Button>
    </CardFooter>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Play,
  User,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  ArrowRight,
} from 'lucide-vue-next';
import { onboardingApi, type PersonaTemplate } from '@/api/onboarding';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@taskjuggler/ui';

const emit = defineEmits<{
  next: [data: { persona_template_id: string; coordinator: any }];
  back: [];
}>();

const formData = ref({
  name: '',
  gender: 'female',
  personality: 'friendly',
  pace: 'moderate',
  businessName: '',
  phone: '',
  email: '',
});

const selectedPersona = ref<string | null>(null);
const personaTemplates = ref<PersonaTemplate[]>([]);
const loading = ref(true);

function handleNext() {
  if (selectedPersona.value) {
    emit('next', {
      persona_template_id: selectedPersona.value,
      coordinator: {
        display_name: formData.value.name || undefined,
        custom_greeting: previewGreeting.value,
        custom_prompts: {
          personality: formData.value.personality,
          pace: formData.value.pace,
        },
      },
    });
  }
}

const paceValue = computed({
  get: () => {
    if (formData.value.pace === 'relaxed') return 1;
    if (formData.value.pace === 'moderate') return 2;
    return 3;
  },
  set: (val: number) => {
    if (val === 1) formData.value.pace = 'relaxed';
    else if (val === 2) formData.value.pace = 'moderate';
    else formData.value.pace = 'energetic';
  },
});

const personalityOptions = [
  { value: 'friendly', label: 'Friendly & Warm' },
  { value: 'professional', label: 'Professional & Formal' },
  { value: 'efficient', label: 'Efficient & Direct' },
];

const previewGreeting = computed(() => {
  const name = formData.value.name || 'Your Coordinator';
  const business = formData.value.businessName || 'Your Business';
  return `Hi, I'm ${name}! Thanks for calling ${business}. How can I help you today?`;
});

onMounted(async () => {
  try {
    const response = await onboardingApi.getPersonaTemplates();
    personaTemplates.value = response.data;
    // Select first persona template by default if available
    if (personaTemplates.value.length > 0 && !selectedPersona.value) {
      selectedPersona.value = personaTemplates.value[0].id;
    }
  } catch (error) {
    console.error('Failed to load persona templates:', error);
  } finally {
    loading.value = false;
  }
});
</script>

