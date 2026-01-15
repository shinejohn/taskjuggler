<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Logo Header -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div :class="['flex h-10 w-10 items-center justify-center rounded-xl shadow-lg', logoGradient]">
            <component :is="logoIcon" class="h-6 w-6 text-white" />
          </div>
          <span class="text-3xl font-bold text-white">{{ appName }}</span>
        </div>
        <p :class="['text-sm font-semibold tracking-wide', taglineColor]">
          {{ appTagline }}
        </p>
      </div>

      <!-- Header Card -->
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 shadow-2xl overflow-hidden mb-6">
        <!-- Cover -->
        <div :class="['h-32 relative', coverGradient]">
          <slot name="cover-actions" />
        </div>

        <!-- Profile Info -->
        <div class="px-8 pb-8">
          <div class="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <!-- Profile Image & Avatar -->
            <slot name="profile-images" />

            <!-- Name & Actions -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-white mb-1">
                    {{ userData.name }}
                  </h1>
                  <p class="text-slate-400 mb-2">
                    {{ userData.role }} <span v-if="userData.company">at {{ userData.company }}</span>
                  </p>
                  <slot name="badges" />
                </div>
                <slot name="edit-button" />
              </div>
            </div>
          </div>

          <!-- Stats -->
          <slot name="stats" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Profile Information -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <User class="h-5 w-5" />
                Personal Profile
              </h2>
              <slot name="personal-profile-actions" />
            </div>

            <slot name="personal-profile-fields" />
          </div>

          <!-- Business Profile -->
          <div v-if="showBusinessProfile" class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Building2 class="h-5 w-5" />
                Business Profile
              </h2>
            </div>

            <slot name="business-profile-fields" />
          </div>

          <!-- Additional Sections -->
          <slot name="additional-sections" />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Account Info -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Account</h3>
            <slot name="account-info" />
            <slot name="upgrade-button" />
          </div>

          <!-- Quick Actions -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <slot name="quick-actions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Building2, Command } from 'lucide-vue-next'

export interface ProfilePageTemplateProps {
  appName?: string
  appTagline?: string
  logoIcon?: any
  logoGradient?: string
  taglineColor?: string
  coverGradient?: string
  showBusinessProfile?: boolean
  userData?: {
    name: string
    email?: string
    role?: string
    company?: string
  }
}

withDefaults(defineProps<ProfilePageTemplateProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  coverGradient: 'bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600',
  showBusinessProfile: false,
  userData: () => ({ name: 'User' }),
})
</script>

