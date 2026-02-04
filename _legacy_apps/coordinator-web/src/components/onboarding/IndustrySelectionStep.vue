<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
        Select Your Industry
      </h1>
      <p class="text-lg text-slate-600">
        We'll customize your Coordinator for your business type
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <IndustryCard
        v-for="industry in industries"
        :key="industry.id"
        :id="industry.id"
        :name="industry.name"
        :icon="industry.icon"
        :selected="selectedIndustry === industry.id"
        @select="selectedIndustry = industry.id"
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-10">
      <Button variant="outline" @click="$emit('back')" class="flex items-center gap-2">
        <ArrowLeft :size="18" />
        Back
      </Button>
      <Button
        @click="handleNext"
        :disabled="!selectedIndustry"
        class="bg-[#1B4F72] hover:bg-[#153e5a] flex items-center gap-2"
      >
        Continue
        <ArrowRight :size="18" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Stethoscope,
  PawPrint,
  Droplet,
  Wind,
  Zap,
  UtensilsCrossed,
  Wine,
  PartyPopper,
  Scale,
  Calculator,
  Home,
  Scissors,
  Dumbbell,
  Wrench,
  Briefcase,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
} from 'lucide-vue-next';
import IndustryCard from './IndustryCard.vue';
import { Button } from '@taskjuggler/ui';

const emit = defineEmits<{
  next: [data: { industry: string }];
  back: [];
}>();

const selectedIndustry = ref<string | null>(null);

function handleNext() {
  if (selectedIndustry.value) {
    emit('next', { industry: selectedIndustry.value });
  }
}

const industries = [
  { id: 'dental', name: 'Dental Practice', icon: Stethoscope },
  { id: 'medical', name: 'Medical Office', icon: Stethoscope },
  { id: 'veterinary', name: 'Veterinary Clinic', icon: PawPrint },
  { id: 'plumbing', name: 'Plumbing', icon: Droplet },
  { id: 'hvac', name: 'HVAC', icon: Wind },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'restaurant', name: 'Restaurant', icon: UtensilsCrossed },
  { id: 'bar', name: 'Bar/Nightclub', icon: Wine },
  { id: 'event', name: 'Event Venue', icon: PartyPopper },
  { id: 'law', name: 'Law Firm', icon: Scale },
  { id: 'accounting', name: 'Accounting', icon: Calculator },
  { id: 'realestate', name: 'Real Estate', icon: Home },
  { id: 'salon', name: 'Salon/Spa', icon: Scissors },
  { id: 'fitness', name: 'Fitness/Gym', icon: Dumbbell },
  { id: 'auto', name: 'Auto Shop', icon: Wrench },
  { id: 'professional', name: 'Professional Svcs', icon: Briefcase },
  { id: 'other', name: 'Other', icon: MoreHorizontal },
];
</script>

