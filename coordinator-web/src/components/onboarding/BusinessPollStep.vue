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
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800 mb-3">
                What services do you offer?
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="service in serviceOptions"
                  :key="service"
                  @click="toggleService(service)"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium border text-left transition-all',
                    answers.services.includes(service)
                      ? 'bg-[#1B4F72] text-white border-[#1B4F72]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  {{ service }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 2: Hours -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800 mb-3">
                What are your business hours?
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span class="font-medium text-slate-700">Weekdays</span>
                  <span class="text-sm text-slate-500">9:00 AM - 5:00 PM</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span class="font-medium text-slate-700">Weekends</span>
                  <span class="text-sm text-slate-500">Closed</span>
                </div>
              </div>
              <button class="text-sm text-[#1B4F72] font-medium mt-3 hover:underline">
                + Add custom hours
              </button>
            </div>
          </div>
        </div>

        <!-- Question 3: Insurance -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800 mb-3">
                What insurance do you accept?
              </h3>
              <textarea
                v-model="answers.insurance"
                class="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[80px]"
                placeholder="e.g. Delta Dental, Cigna, Aetna, MetLife..."
              />
            </div>
          </div>
        </div>

        <!-- Question 4: Wait Time -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800 mb-3">
                Typical wait time for new patients?
              </h3>
              <select
                v-model="answers.waitTime"
                class="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white"
              >
                <option>Same day</option>
                <option>1-3 days</option>
                <option>1 week</option>
                <option>2-3 weeks</option>
                <option>1 month+</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Question 5: Emergency -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
              5
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-800 mb-3">
                Do you offer emergency services?
              </h3>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="answers.emergency"
                    type="radio"
                    :value="true"
                    class="text-[#1B4F72] focus:ring-[#1B4F72]"
                  />
                  <span>Yes</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="answers.emergency"
                    type="radio"
                    :value="false"
                    class="text-[#1B4F72] focus:ring-[#1B4F72]"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-10">
        <button
          @click="$emit('back')"
          class="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft :size="18" />
          Back
        </button>
        <button
          @click="handleComplete"
          class="px-8 py-3 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          Complete Setup
          <ArrowRight :size="18" />
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';

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
  emergency: false,
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

