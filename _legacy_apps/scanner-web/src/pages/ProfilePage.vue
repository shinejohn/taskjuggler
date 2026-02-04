<template>
  <ProfilePageTemplate
    app-name="Scanner"
    app-tagline="Website Health Monitoring"
    :logo-icon="ScanSearch"
    logo-gradient="bg-gradient-to-br from-green-500 to-teal-600 shadow-green-500/20"
    tagline-color="text-green-400"
    cover-gradient="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600"
    :user-data="userData"
    :show-business-profile="false"
  >
    <template #profile-images>
      <div class="flex gap-4">
        <div class="relative group">
          <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 shadow-xl overflow-hidden">
            <img v-if="profileData.profileImage" :src="profileData.profileImage" alt="Profile" class="w-full h-full object-cover" />
            <template v-else>{{ profileData.avatarInitials }}</template>
          </div>
          <button
            v-if="isEditing"
            @click="handleImageUpload('profile')"
            class="absolute bottom-2 right-2 p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg"
          >
            <Camera class="h-4 w-4" />
          </button>
        </div>
      </div>
    </template>

    <template #badges>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1">
          <Crown class="h-3 w-3" />
          {{ subscriptionStore.plan }}
        </div>
      </div>
    </template>

    <template #edit-button>
      <button
        @click="isEditing ? handleSave() : isEditing = true"
        :class="['flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all', isEditing ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600']"
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

    <template #stats>
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
    </template>

    <template #personal-profile-fields>
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
            class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          />
          <p v-else class="text-slate-300">{{ profileData.bio || 'No bio yet' }}</p>
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
              class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors"
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
              class="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <p v-else class="text-slate-300">{{ profileData.phone || 'Not set' }}</p>
          </div>
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
          <span class="text-sm font-semibold text-green-400">
            {{ subscriptionStore.plan }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Status</span>
          <span class="text-sm font-semibold text-green-400">
            Active
          </span>
        </div>
      </div>
    </template>

    <template #upgrade-button>
      <button
        class="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        @click="$router.push('/subscribe')"
      >
        Upgrade Plan
      </button>
    </template>

    <template #quick-actions>
      <div class="space-y-2">
        <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
          Change Password
        </button>
        <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 transition-colors">
          Privacy Settings
        </button>
        <button class="w-full text-left px-4 py-2 rounded-lg bg-slate-900/50 text-red-400 hover:bg-red-500/20 transition-colors">
          Delete Account
        </button>
      </div>
    </template>
  </ProfilePageTemplate>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  ScanSearch,
  Mail,
  Phone,
  Edit2,
  Camera,
  Save,
  Crown,
  CheckSquare,
  Globe,
} from 'lucide-vue-next'
// @ts-ignore
import ProfilePageTemplate from '@taskjuggler/ui/templates/auth/ProfilePageTemplate.vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import api from '@/utils/api'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const isEditing = ref(false)
const saving = ref(false)

const profileData = reactive({
  name: '',
  email: '',
  phone: '',
  bio: '',
  joinDate: '',
  profileImage: '',
  avatarInitials: '',
})

const userData = computed(() => ({
  name: profileData.name || authStore.user?.name || 'User',
  email: profileData.email || authStore.user?.email || '',
  role: 'Scanner User',
  company: '',
}))

const stats = computed(() => [
  {
    label: 'Sites Monitored',
    value: '0',
    icon: Globe,
    color: 'text-green-400',
  },
  {
    label: 'Scans Completed',
    value: '0',
    icon: CheckSquare,
    color: 'text-teal-400',
  },
])

async function loadProfile() {
  try {
    await authStore.fetchUser()
    if (authStore.user) {
      const user = authStore.user
      profileData.name = user.name || ''
      profileData.email = user.email || ''
      profileData.phone = (user as any).phone || ''
      profileData.avatarInitials = user.name
        ? user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'SC'
      profileData.joinDate = (user as any).created_at
        ? new Date((user as any).created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently'
    }
  } catch (error) {
    // Handle error
  }
}

async function handleSave() {
  saving.value = true
  try {
    await api.put('/auth/user', {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    })
    await authStore.fetchUser()
    isEditing.value = false
  } catch (error: any) {
    console.error('Failed to save profile:', error)
  } finally {
    saving.value = false
  }
}

function handleImageUpload(type: 'profile') {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)
        
        // For now, create object URL
        const url = URL.createObjectURL(file)
        if (type === 'profile') {
          profileData.profileImage = url
        }
      } catch (error) {
        // Handle error
      }
    }
  }
  input.click()
}

onMounted(() => {
  loadProfile()
})
</script>

