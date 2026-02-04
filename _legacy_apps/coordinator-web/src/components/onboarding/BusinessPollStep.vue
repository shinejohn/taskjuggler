<template>
  <div class="w-full">
    <div v-if="isSubmitting" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="relative mb-6">
        <div class="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div class="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
          <svg class="h-10 w-10 text-[#1B4F72] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-[#1B4F72] mb-2">
        Setting up your Coordinator...
      </h2>
      <p class="text-slate-500">
        Analyzing your answers and training your assistant.
      </p>
    </div>

    <template v-else>
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
          Tell Us About Your Business
        </h1>
        <p class="text-lg text-slate-600">
          Answer a few quick questions so your Coordinator can help customers accurately
        </p>
      </div>

      <div class="space-y-6 max-w-3xl mx-auto mb-10">
        <!-- Question 1: Services -->
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold text-slate-800 mb-3">
                  What services do you offer?
                </CardTitle>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    v-for="service in serviceOptions"
                    :key="service"
                    @click="toggleService(service)"
                    :variant="answers.services.includes(service) ? 'default' : 'outline'"
                    :class="[
                      'text-left justify-start',
                      answers.services.includes(service)
                        ? 'bg-[#1B4F72] text-white border-[#1B4F72] hover:bg-[#153e5a]'
                        : ''
                    ]"
                  >
                    {{ service }}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Question 2: Hours -->
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold text-slate-800 mb-3">
                  What are your business hours?
                </CardTitle>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card class="bg-slate-50">
                    <CardContent class="p-3">
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-slate-700">Weekdays</span>
                        <span class="text-sm text-slate-500">9:00 AM - 5:00 PM</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card class="bg-slate-50">
                    <CardContent class="p-3">
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-slate-700">Weekends</span>
                        <span class="text-sm text-slate-500">Closed</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Button variant="ghost" class="text-sm text-[#1B4F72] font-medium mt-3 h-auto p-0">
                  + Add custom hours
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Question 3: Insurance -->
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold text-slate-800 mb-3">
                  What insurance do you accept?
                </CardTitle>
                <Textarea
                  v-model="answers.insurance"
                  placeholder="e.g. Delta Dental, Cigna, Aetna, MetLife..."
                  class="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Question 4: Wait Time -->
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold text-slate-800 mb-3">
                  Typical wait time for new patients?
                </CardTitle>
                <Select v-model="answers.waitTime">
                  <SelectTrigger>
                    <SelectValue :placeholder="answers.waitTime || 'Select wait time'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Same day">Same day</SelectItem>
                    <SelectItem value="1-3 days">1-3 days</SelectItem>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2-3 weeks">2-3 weeks</SelectItem>
                    <SelectItem value="1 month+">1 month+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Question 5: Emergency -->
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold text-slate-800 mb-3">
                  Do you offer emergency services?
                </CardTitle>
                <RadioGroup v-model="answers.emergency" class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="true" id="emergency-yes" />
                    <Label for="emergency-yes" class="cursor-pointer">Yes</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="false" id="emergency-no" />
                    <Label for="emergency-no" class="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Navigation Buttons -->
      <CardFooter class="flex justify-between mt-10 px-0">
        <Button variant="outline" @click="$emit('back')" class="flex items-center gap-2">
          <ArrowLeft :size="18" />
          Back
        </Button>
        <Button @click="handleComplete" class="bg-[#1B4F72] hover:bg-[#153e5a] flex items-center gap-2">
          Complete Setup
          <ArrowRight :size="18" />
        </Button>
      </CardFooter>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  Button,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Label,
} from '@taskjuggler/ui';

const emit = defineEmits<{
  next: [data: { business: any; services: string[] }];
  back: [];
}>();

const isSubmitting = ref(false);

const answers = ref({
  services: [] as string[],
  hours: {} as Record<string, any>,
  insurance: '',
  waitTime: '1-3 days',
  emergency: 'false',
  parking: '',
  safety: '',
});

const serviceOptions = [
  'Cleanings',
  'Fillings',
  'Root Canals',
  'Crowns',
  'Whitening',
  'Orthodontics',
  'Implants',
  'Emergency Care',
];

function toggleService(service: string) {
  const index = answers.value.services.indexOf(service);
  if (index > -1) {
    answers.value.services.splice(index, 1);
  } else {
    answers.value.services.push(service);
  }
}

async function handleComplete() {
  isSubmitting.value = true;
  // Emit data to parent
  emit('next', {
    business: {
      business_hours: answers.value.hours,
    },
    services: answers.value.services,
  });
  // Note: Parent will handle API call
  isSubmitting.value = false;
}
</script>

