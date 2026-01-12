<template>
  <div class="flex items-center justify-center min-h-[400px] p-8">
    <div class="text-center max-w-md">
      <!-- Illustration -->
      <div
        :class="[
          'inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-in zoom-in duration-500',
          config.bgColor
        ]"
      >
        <component :is="config.icon" :size="48" :class="config.iconColor" :stroke-width="1.5" />
      </div>

      <!-- Content -->
      <h3 class="text-2xl font-bold text-slate-900 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {{ config.title }}
      </h3>
      <p class="text-slate-500 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        {{ config.subtitle }}
      </p>

      <!-- Tip -->
      <Alert v-if="config.tip" class="mb-6 animate-in fade-in duration-500 delay-300">
        <AlertDescription class="inline-flex items-center gap-2">
          <span class="text-lg">💡</span>
          {{ config.tip }}
        </AlertDescription>
      </Alert>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <Button
          v-if="config.primaryCTA"
          @click="$emit('primaryAction')"
          variant="default"
          class="bg-[#1B4F72] hover:bg-[#153e5a]"
        >
          {{ config.primaryCTA }}
        </Button>
        <Button
          v-if="config.secondaryCTA"
          @click="$emit('secondaryAction')"
          variant="ghost"
          class="flex items-center gap-2"
        >
          <Play v-if="variant === 'coordinators'" :size="16" />
          {{ config.secondaryCTA }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Alert, AlertDescription, Button } from '@taskjuggler/ui';
import { Users, Contact, Phone, Calendar, Megaphone, Search, Play } from 'lucide-vue-next';

interface Props {
  variant: 'coordinators' | 'contacts' | 'calls' | 'appointments' | 'campaigns' | 'search';
}

const props = defineProps<Props>();

defineEmits<{
  primaryAction: [];
  secondaryAction: [];
}>();

const emptyStateConfig = {
  coordinators: {
    icon: Users,
    title: 'Hire your first Coordinator',
    subtitle: 'AI assistants that answer calls, book appointments, and grow your business',
    primaryCTA: 'Get Started',
    secondaryCTA: 'Watch demo',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  contacts: {
    icon: Contact,
    title: 'Add your first contact',
    subtitle: 'Import your customer list or add contacts manually',
    primaryCTA: 'Import Contacts',
    secondaryCTA: 'Add manually',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  calls: {
    icon: Phone,
    title: 'No calls yet',
    subtitle: 'Once you forward your phone to your Coordinator, calls will appear here',
    primaryCTA: 'View setup instructions',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  appointments: {
    icon: Calendar,
    title: 'No appointments scheduled',
    subtitle: "When your Coordinators book appointments, they'll show up here",
    tip: 'Tip: Make sure your availability is set up',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  campaigns: {
    icon: Megaphone,
    title: 'Create your first campaign',
    subtitle: 'Reach out to customers automatically with outbound calls',
    primaryCTA: 'Create Campaign',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  search: {
    icon: Search,
    title: 'No results found',
    subtitle: 'Try adjusting your search or filters',
    primaryCTA: 'Clear filters',
    iconColor: 'text-slate-400',
    bgColor: 'bg-slate-50',
  },
};

const config = computed(() => emptyStateConfig[props.variant]);
</script>



