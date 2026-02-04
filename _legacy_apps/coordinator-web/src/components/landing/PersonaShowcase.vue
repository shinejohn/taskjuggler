<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
          Meet Your New Team Members
        </h2>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          AI assistants with real personalities and specific jobs
        </p>
      </div>

      <!-- Persona Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="(persona, i) in personas"
          :key="i"
          class="bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-[#1B4F72] hover:shadow-xl transition-all duration-300 group"
        >
          <!-- Avatar -->
          <div
            :class="[
              'w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300',
              persona.gradient
            ]"
          >
            {{ persona.emoji }}
          </div>

          <!-- Greeting -->
          <div class="bg-slate-50 rounded-lg px-3 py-2 mb-4 inline-block">
            <p class="text-sm font-medium text-slate-700">
              {{ persona.greeting }}
            </p>
          </div>

          <!-- Name & Role -->
          <h3 class="text-xl font-bold text-slate-900 mb-1">
            {{ persona.name }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span>{{ persona.role }}</span>
            <span class="text-slate-300">•</span>
            <span class="font-semibold text-[#1B4F72]">
              {{ persona.price }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-600 mb-4 leading-relaxed">
            {{ persona.description }}
          </p>

          <!-- Stat Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {{ persona.stat }}
          </div>
        </div>
      </div>

      <!-- View All Link -->
      <div class="text-center">
        <a href="#roles" class="inline-flex items-center gap-2 text-[#1B4F72] font-semibold hover:gap-3 transition-all">
          View all 10+ roles
          <ArrowRight :size="20" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';

const personas = [
  {
    name: 'Sally',
    role: 'Receptionist',
    price: '$49/mo',
    emoji: '👩‍💼',
    greeting: "Hi, I'm Sally!",
    description: 'I answer your calls 24/7, take messages, and route inquiries to the right person.',
    stat: 'Never miss a call again',
    gradient: 'from-pink-100 to-purple-100',
  },
  {
    name: 'Ed',
    role: 'Appointment Scheduler',
    price: '$59/mo',
    emoji: '👨‍💼',
    greeting: "Hello, I'm Ed!",
    description: 'I book appointments, manage your calendar, and send confirmations automatically.',
    stat: 'Reduce no-shows by 40%',
    gradient: 'from-blue-100 to-cyan-100',
  },
  {
    name: 'Marcus',
    role: 'Bill Collector',
    price: '$69/mo',
    emoji: '👨‍💼',
    greeting: 'This is Marcus.',
    description: 'I follow up on overdue invoices professionally, so you get paid faster.',
    stat: 'Recover 25% more AR',
    gradient: 'from-green-100 to-emerald-100',
  },
  {
    name: 'Jody',
    role: 'Hostess',
    price: '$49/mo',
    emoji: '👩‍💼',
    greeting: "Welcome! I'm Jody!",
    description: 'I take reservations, confirm bookings, and keep your tables full.',
    stat: 'Fill more tables',
    gradient: 'from-amber-100 to-orange-100',
  },
];
</script>




