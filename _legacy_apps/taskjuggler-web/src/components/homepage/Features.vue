<template>
  <section id="features" class="py-16 md:py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Features That Make Task Management Effortless
        </h2>
        <p class="text-xl text-gray-700">
          Task Juggler combines powerful features with intuitive design to
          transform how you collaborate.
        </p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div class="mb-4 bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
            <component :is="feature.icon" class="w-6 h-6 text-blue-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-700">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChatBubbleLeftRightIcon, CalendarIcon, MapPinIcon, BellIcon, CpuChipIcon, UsersIcon } from '@heroicons/vue/24/outline'

const features = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Clear Accountability',
    description: 'Every task has a Requestor and Owner/Do-er with defined roles and expectations.',
  },
  {
    icon: CalendarIcon,
    title: 'Do-er Controls Timeline',
    description: 'Do-ers set their own start dates and completion times for realistic commitments.',
  },
  {
    icon: MapPinIcon,
    title: 'Context-Rich Tasks',
    description: 'Include addresses with maps, phone numbers, and email contacts in every task.',
  },
  {
    icon: BellIcon,
    title: 'Smart Reminders',
    description: 'AI-optimized notifications ensure nothing falls through the cracks.',
  },
  {
    icon: CpuChipIcon,
    title: 'AI-Powered Assistant',
    description: 'Converts emails, texts, and voice messages into structured tasks automatically.',
  },
  {
    icon: UsersIcon,
    title: 'Seamless Collaboration',
    description: 'Send tasks to anyone using just their email or phone number.',
  },
]
</script>

