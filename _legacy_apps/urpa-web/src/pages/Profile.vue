<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Logo Header -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
            <Command class="h-6 w-6 text-white" />
          </div>
          <span class="text-3xl font-bold text-white">Urpa</span>
        </div>
        <p class="text-teal-400 text-sm font-semibold tracking-wide">
          Your Personal Assistant
        </p>
      </div>

      <!-- Header Card -->
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 shadow-2xl overflow-hidden mb-6">
        <!-- Cover -->
        <div class="h-32 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 relative">
          <button
            @click="handleCoverUpload"
            class="absolute bottom-4 right-4 p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          >
            <Camera class="h-4 w-4" />
          </button>
        </div>

        <!-- Profile Info -->
        <div class="px-8 pb-8">
          <div class="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <!-- Profile Image & Avatar -->
            <div class="flex gap-4">
              <!-- Main Profile Image -->
              <div class="relative group">
                <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 shadow-xl overflow-hidden">
                  <img v-if="profileData.profileImage" :src="profileData.profileImage" alt="Profile" class="w-full h-full object-cover" />
                  <template v-else>{{ profileData.avatarInitials }}</template>
                </div>
                <button
                  @click="handleImageUpload('profile')"
                  class="absolute bottom-2 right-2 p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg"
                >
                  <Camera class="h-4 w-4" />
                </button>
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <Upload class="h-8 w-8 text-white" />
                </div>
              </div>

              <!-- Avatar -->
              <div class="relative group">
                <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-800 shadow-xl">
                  {{ profileData.avatarInitials }}
                </div>
                <button
                  @click="handleImageUpload('avatar')"
                  class="absolute bottom-1 right-1 p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <Camera class="h-3 w-3" />
                </button>
                <p class="text-xs text-slate-400 text-center mt-1">
                  Avatar
                </p>
              </div>
            </div>

            <!-- Name & Actions -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-white mb-1">
                    {{ profileData.name }}
                  </h1>
                  <p class="text-slate-400 mb-2">
                    {{ profileData.role }} at {{ profileData.company }}
                  </p>
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1">
                      <Crown class="h-3 w-3" />
                      {{ userPlan }}
                    </div>
                    <div class="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1">
                      <CheckSquare class="h-3 w-3" />
                      {{ profileData.taskManagerName }}
                    </div>
                  </div>
                </div>
                <button
                  @click="isEditing ? handleSave() : isEditing = true"
                  :class="['flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all', isEditing ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600']"
                >
                  <template v-if="isEditing">
                    <Save class="h-4 w-4" />
                    Save Changes
                  </template>
                  <template v-else>
                    <Edit2 class="h-4 w-4" />
                    Edit Profile
                  </template>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700"
            >
              <component :is="stat.icon" :class="['h-5 w-5', stat.color, 'mb-2']" />
              <p class="text-2xl font-bold text-white mb-1">
                {{ stat.value }}
              </p>
              <p class="text-xs text-slate-400">{{ stat.label }}</p>
            </div>
          </div>
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
              <button
                v-if="isEditing"
                @click="isEditing = false"
                class="text-slate-400 hover:text-white transition-colors"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="space-y-6">
              <!-- Bio -->
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  v-if="isEditing"
                  v-model="profileData.bio"
                  rows="3"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
                <p v-else class="text-slate-300">{{ profileData.bio }}</p>
              </div>

              <!-- Task Manager Name -->
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  <CheckSquare class="inline h-4 w-4 mr-1" />
                  Task Manager Username
                </label>
                <input
                  v-if="isEditing"
                  v-model="profileData.taskManagerName"
                  type="text"
                  placeholder="@username"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <p v-else class="text-slate-300">
                  {{ profileData.taskManagerName }}
                </p>
              </div>

              <!-- Contact Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Mail class="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.email"
                    type="email"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">{{ profileData.email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Phone class="inline h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.phone"
                    type="tel"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">{{ profileData.phone }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <MapPin class="inline h-4 w-4 mr-1" />
                    City, State
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.location"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">{{ profileData.location }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Briefcase class="inline h-4 w-4 mr-1" />
                    Role
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.role"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">{{ profileData.role }}</p>
                </div>
              </div>

              <!-- Physical Address -->
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  <Home class="inline h-4 w-4 mr-1" />
                  Physical Address
                </label>
                <input
                  v-if="isEditing"
                  v-model="profileData.address"
                  type="text"
                  placeholder="Street address, apartment, city, state, zip"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <p v-else class="text-slate-300">{{ profileData.address }}</p>
              </div>
            </div>
          </div>

          <!-- Business Profile -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Building2 class="h-5 w-5" />
                Business Profile
              </h2>
            </div>

            <!-- Business Logo -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-300 mb-3">
                Business Logo
              </label>
              <div class="flex items-center gap-4">
                <div class="relative group">
                  <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-slate-700 shadow-lg overflow-hidden">
                    <img v-if="profileData.business.logo" :src="profileData.business.logo" alt="Business Logo" class="w-full h-full object-cover" />
                    <Building2 v-else class="h-10 w-10" />
                  </div>
                  <button
                    v-if="isEditing"
                    @click="handleImageUpload('businessLogo')"
                    class="absolute bottom-1 right-1 p-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-lg"
                  >
                    <Camera class="h-3 w-3" />
                  </button>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <Upload class="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p class="text-sm text-slate-400">
                    Upload your company logo
                  </p>
                  <p class="text-xs text-slate-500 mt-1">
                    Recommended: 500x500px, PNG or JPG
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    Company Name
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.name"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    Industry
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.industry"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.industry }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    Company Size
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.size"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.size }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    Founded
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.founded"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.founded }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Globe class="inline h-4 w-4 mr-1" />
                    Website
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.website"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <a
                    v-else
                    :href="`https://${profileData.business.website}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    {{ profileData.business.website }}
                  </a>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Mail class="inline h-4 w-4 mr-1" />
                    Business Email
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.email"
                    type="email"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.email }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">
                    <Phone class="inline h-4 w-4 mr-1" />
                    Business Phone
                  </label>
                  <input
                    v-if="isEditing"
                    v-model="profileData.business.phone"
                    type="tel"
                    class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <p v-else class="text-slate-300">
                    {{ profileData.business.phone }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  <Home class="inline h-4 w-4 mr-1" />
                  Business Address
                </label>
                <input
                  v-if="isEditing"
                  v-model="profileData.business.address"
                  type="text"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <p v-else class="text-slate-300">
                  {{ profileData.business.address }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  Company Description
                </label>
                <textarea
                  v-if="isEditing"
                  v-model="profileData.business.description"
                  rows="3"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
                <p v-else class="text-slate-300">
                  {{ profileData.business.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Users class="h-5 w-5" />
                Team Members
              </h2>
              <button
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-semibold"
                @click="showAddMemberModal = true"
              >
                <Plus class="h-4 w-4" />
                Add Member
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="member in teamMembers"
                :key="member.id"
                class="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border-2 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {{ member.avatar }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-white">
                        {{ member.name }}
                      </p>
                      <div
                        v-if="member.isHumanAssistant"
                        class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1"
                      >
                        <UserCheck class="h-3 w-3" />
                        Human Assistant
                      </div>
                    </div>
                    <p class="text-xs text-slate-400">{{ member.role }}</p>
                    <p class="text-xs text-slate-500">{{ member.email }}</p>
                  </div>
                </div>
                <button class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <Edit2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Social Networks -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8">
            <h2 class="text-xl font-bold text-white mb-6">
              Social Networks
            </h2>
            <div class="space-y-4">
              <div v-for="social in socialNetworks" :key="social.key">
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  <component :is="social.icon" :class="['inline h-4 w-4 mr-1', social.color]" />
                  {{ social.label }}
                </label>
                <input
                  v-if="isEditing"
                  v-model="profileData.socialLinks[social.key]"
                  type="text"
                  :placeholder="`${social.label.toLowerCase()}.com/username`"
                  class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <a
                  v-else
                  :href="`https://${profileData.socialLinks[social.key]}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  {{ profileData.socialLinks[social.key] || 'Not set' }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Account Info -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Account</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Member since</span>
                <span class="text-sm font-semibold text-white">
                  {{ profileData.joinDate }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Plan</span>
                <span class="text-sm font-semibold text-purple-400">
                  {{ userPlan }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Status</span>
                <span class="text-sm font-semibold text-green-400">
                  Active
                </span>
              </div>
            </div>
            <button
              class="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              @click="$router.push('/subscribe')"
            >
              Upgrade Plan
            </button>
          </div>

          <!-- Integration Setup Button -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600">
                <Settings class="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Integrations</h3>
                <p class="text-xs text-slate-400">
                  Manage your connections
                </p>
              </div>
            </div>
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              @click="$router.push('/setup-wizard')"
            >
              <Sparkles class="h-5 w-5" />
              Configure Integrations
            </button>
            <p class="text-xs text-slate-400 mt-3 text-center">
              Set up email, contacts, messaging, and more
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6">
            <h3 class="text-lg font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div class="space-y-2">
              <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
                Change Password
              </button>
              <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
                Privacy Settings
              </button>
              <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
                Download Data
              </button>
              <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-red-400 hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import {
  Command,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit2,
  Camera,
  Save,
  X,
  Check,
  Crown,
  Zap,
  Home,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Globe,
  CheckSquare,
  Building2,
  Users,
  Plus,
  UserCheck,
  Upload,
  Settings,
  Sparkles,
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  isHumanAssistant?: boolean;
}

const authStore = useAuthStore();

const isEditing = ref(false);
const showAddMemberModal = ref(false);
const saving = ref(false);

const profileData = reactive({
  name: '',
  email: '',
  phone: '',
  location: '',
  address: '',
  company: '',
  role: '',
  bio: '',
  joinDate: '',
  taskManagerName: '',
  profileImage: '',
  avatarInitials: '',
  socialLinks: {
    linkedin: '',
    twitter: '',
    github: '',
    instagram: '',
    facebook: '',
    website: '',
  } as Record<string, string>,
  business: {
    name: '',
    logo: '',
    industry: '',
    size: '',
    founded: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  },
});

const teamMembers = ref<TeamMember[]>([]);

const userPlan = computed(() => {
  return authStore.user?.plan || 'Professional';
});

const stats = computed(() => [
  {
    label: 'Tasks Completed',
    value: '1,247',
    icon: Check,
    color: 'text-green-400',
  },
  {
    label: 'AI Interactions',
    value: '3,892',
    icon: Zap,
    color: 'text-blue-400',
  },
  {
    label: 'Phone Calls',
    value: '156',
    icon: Phone,
    color: 'text-purple-400',
  },
  {
    label: 'Days Active',
    value: '89',
    icon: Calendar,
    color: 'text-amber-400',
  },
]);

const socialNetworks = computed(() => [
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-500' },
  { key: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-sky-400' },
  { key: 'github', icon: Github, label: 'GitHub', color: 'text-slate-300' },
  { key: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
  { key: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
  { key: 'website', icon: Globe, label: 'Website', color: 'text-teal-400' },
]);

async function loadProfile() {
  try {
    // Load user data
    await authStore.fetchUser();
    if (authStore.user) {
      const user = authStore.user;
      profileData.name = user.name || '';
      profileData.email = user.email || '';
      profileData.phone = user.phone || '';
      profileData.avatarInitials = user.name
        ? user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'UR';
      profileData.joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';
    }

    // TODO: Load URPA user profile if endpoint exists
    // For now, use defaults
    if (!profileData.bio) {
      profileData.bio = 'Passionate about AI and productivity tools. Always looking for ways to optimize workflows and help teams collaborate better.';
    }
    if (!profileData.taskManagerName) {
      profileData.taskManagerName = '@' + (authStore.user?.name?.toLowerCase().replace(/\s+/g, '') || 'user');
    }
  } catch (error) {
    // Handle error
  }
}

async function handleSave() {
  saving.value = true;
  try {
    // Update user via Core API
    await api.put('/auth/user', {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    });

    // TODO: Update URPA user profile if endpoint exists
    // await api.put('/urpa/user-profile', { ...profileData });

    // Refresh user data
    await authStore.fetchUser();
    isEditing.value = false;
  } catch (error: any) {
    // Handle error
    console.error('Failed to save profile:', error);
  } finally {
    saving.value = false;
  }
}

function handleImageUpload(type: 'profile' | 'avatar' | 'businessLogo') {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        // TODO: Upload image to backend and get URL
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);
        
        // For now, create object URL
        const url = URL.createObjectURL(file);
        if (type === 'profile') {
          profileData.profileImage = url;
        } else if (type === 'businessLogo') {
          profileData.business.logo = url;
        }
      } catch (error) {
        // Handle error
      }
    }
  };
  input.click();
}

function handleCoverUpload() {
  handleImageUpload('profile');
}

onMounted(() => {
  loadProfile();
});
</script>
