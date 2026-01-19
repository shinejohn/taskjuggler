<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div :class="['absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse', primaryGlow]" />
      <div :class="['absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse', secondaryGlow]" style="animation-delay: 1s" />
    </div>

    <!-- Logo Section -->
    <div v-if="showLogo" class="absolute top-8 left-8 z-10">
      <div class="flex items-center gap-3">
        <div :class="['flex h-10 w-10 items-center justify-center rounded-xl shadow-lg', logoGradient]">
          <component :is="logoIcon" class="h-6 w-6 text-white" />
        </div>
        <span class="text-2xl font-bold text-white">{{ appName }}</span>
      </div>
    </div>

    <!-- Content Slot -->
    <div class="relative w-full max-w-md z-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Command } from 'lucide-vue-next'

export interface AuthLayoutProps {
  appName?: string
  logoIcon?: any
  logoGradient?: string
  primaryGlow?: string
  secondaryGlow?: string
  showLogo?: boolean
}

withDefaults(defineProps<AuthLayoutProps>(), {
  appName: 'App',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  primaryGlow: 'bg-teal-500/10',
  secondaryGlow: 'bg-blue-500/10',
  showLogo: true,
})
</script>



