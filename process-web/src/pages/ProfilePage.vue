<template>
  <ProfilePageTemplate
    app-name="Process"
    app-tagline="Workflow Automation"
    :logo-icon="Workflow"
    logo-gradient="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
    tagline-color="text-cyan-400"
    cover-gradient="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600"
    :user-data="userData"
    :show-business-profile="false"
  >
    <template #profile-images>
      <div class="flex gap-4">
        <div class="relative group">
          <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 shadow-xl overflow-hidden">
            <img v-if="profileData.profileImage" :src="profileData.profileImage" alt="Profile" class="w-full h-full object-cover" />
            <template v-else>{{ profileData.avatarInitials }}</template>
          </div>
          <button
            v-if="isEditing"
            @click="handleImageUpload"
            class="absolute bottom-2 right-2 p-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-lg"
          >
            <Camera class="h-4 w-4" />
          </button>
        </div>
      </div>
    </template>

    <template #edit-button>
      <button
        @click="isEditing ? handleSave() : isEditing = true"
        :class="['flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all', isEditing ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600']"
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
    </template>

    <template #personal-profile-fields>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2">
            Full Name
          </label>
          <input
            v-if="isEditing"
            v-model="profileData.name"
            type="text"
            class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <p v-else class="text-slate-300">{{ profileData.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2">
            <Mail class="inline h-4 w-4 mr-1" />
            Email
          </label>
          <input
            v-if="isEditing"
            v-model="profileData.email"
            type="email"
            class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <p v-else class="text-slate-300">{{ profileData.email }}</p>
        </div>
      </div>
    </template>

    <template #account-info>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Member since</span>
          <span class="text-sm font-semibold text-white">
            {{ profileData.joinDate }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Plan</span>
          <span class="text-sm font-semibold text-cyan-400">
            {{ authStore.user?.plan || 'free' }}
          </span>
        </div>
      </div>
    </template>

    <template #upgrade-button>
      <button
        class="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        @click="$router.push('/subscribe')"
      >
        Manage Subscription
      </button>
    </template>

    <template #quick-actions>
      <div class="space-y-2">
        <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
          Change Password
        </button>
        <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-red-400 hover:bg-red-500/20 transition-colors">
          Delete Account
        </button>
      </div>
    </template>
  </ProfilePageTemplate>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue'
import { Mail, Camera, Edit2, Save, Workflow } from 'lucide-vue-next'
import ProfilePageTemplate from '../../../shared-ui/src/templates/auth/ProfilePageTemplate.vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/client'

const authStore = useAuthStore()
const isEditing = ref(false)

const profileData = reactive({
  name: '',
  email: '',
  joinDate: '',
  profileImage: '',
  avatarInitials: '',
})

const userData = computed(() => ({
  name: profileData.name || authStore.user?.name || 'User',
  email: profileData.email || authStore.user?.email || '',
  role: 'Process User',
  company: '',
}))

async function loadProfile() {
  await authStore.fetchUser()
  if (authStore.user) {
    const user = authStore.user
    profileData.name = user.name || ''
    profileData.email = user.email || ''
    profileData.avatarInitials = user.name
      ? user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'PR'
    profileData.joinDate = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently'
  }
}

async function handleSave() {
  await apiClient.put('/auth/user', {
    name: profileData.name,
    email: profileData.email,
  })
  await authStore.fetchUser()
  isEditing.value = false
}

function handleImageUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      profileData.profileImage = url
    }
  }
  input.click()
}

onMounted(() => {
  loadProfile()
})
</script>
