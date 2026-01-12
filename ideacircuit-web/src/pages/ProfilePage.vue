<template>
  <div class="flex flex-col h-screen bg-bg-secondary">
    <!-- Header -->
    <div class="glass-subtle border-b border-border p-4 flex justify-between items-center">
      <h1 class="text-headline font-semibold text-text-primary">My Profile</h1>
      <div class="flex space-x-2 items-center">
        <button
          class="p-2 rounded-full hover:bg-bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
          aria-label="Notifications"
        >
          <BellIcon :size="20" class="text-text-secondary" />
        </button>
        <NavigationMenu />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Sidebar -->
          <div class="md:w-64">
            <div class="glass-standard rounded-lg overflow-hidden shadow-1 sticky top-8">
              <div class="p-6 text-center">
                <div class="relative inline-block">
                  <img
                    :src="userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}&background=007AFF&color=fff`"
                    alt="Profile"
                    class="h-24 w-24 rounded-full mx-auto object-cover"
                  />
                  <button
                    class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-primary-hover transition-colors duration-fast"
                    aria-label="Change profile picture"
                  >
                    <CameraIcon :size="16" />
                  </button>
                </div>
                <h2 class="mt-4 text-title-large font-semibold text-text-primary">
                  {{ userData.firstName }} {{ userData.lastName }}
                </h2>
                <p class="text-text-secondary text-body-small">
                  {{ userData.role }} {{ userData.company ? `at ${userData.company}` : '' }}
                </p>
              </div>
              <div class="border-t border-border">
                <nav class="flex flex-col">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                      activeTab === tab.id
                        ? 'bg-primary-light text-primary border-l-4 border-primary'
                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                    }`"
                  >
                    <component :is="tab.icon" :size="18" class="mr-3" />
                    {{ tab.label }}
                  </button>
                </nav>
              </div>
              <div class="p-6 border-t border-border">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-1 text-label font-medium text-white bg-destructive hover:bg-destructive/90 min-h-[44px] transition-colors duration-fast"
                >
                  <LogOutIcon :size="16" class="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="flex-1">
            <ProfileTab
              v-if="activeTab === 'profile'"
              :user-data="userData"
              :form-data="formData"
              :is-editing="isEditing"
              @update:form-data="formData = $event"
              @save="handleSave"
              @cancel="handleCancel"
              @edit="isEditing = true"
            />
            <FilesTab v-else-if="activeTab === 'files'" />
            <ActivityTab
              v-else-if="activeTab === 'activity'"
              :loading="loading"
              :activity-data="activityData"
            />
            <SettingsTab v-else-if="activeTab === 'settings'" />
            <SecurityTab v-else-if="activeTab === 'security'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserIcon,
  SettingsIcon,
  BellIcon,
  KeyIcon,
  LogOutIcon,
  CameraIcon,
  FolderIcon,
  ClockIcon
} from 'lucide-vue-next';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import ProfileTab from './ProfilePage/ProfileTab.vue';
import FilesTab from './ProfilePage/FilesTab.vue';
import ActivityTab from './ProfilePage/ActivityTab.vue';
import SettingsTab from './ProfilePage/SettingsTab.vue';
import SecurityTab from './ProfilePage/SecurityTab.vue';

interface ActivityItem {
  id: number;
  type: 'call' | 'file';
  title: string;
  date: string;
  duration?: string;
}

const router = useRouter();
const { user, logout } = useAuth();
const authStore = useAuthStore();
const activeTab = ref('profile');
const isEditing = ref(false);
const loading = ref(true);
const activityData = ref<ActivityItem[]>([]);

const storeUser = computed(() => authStore.user);

const userData = ref({
  firstName: storeUser.value?.name?.split(' ')[0] || '',
  lastName: storeUser.value?.name?.split(' ').slice(1).join(' ') || '',
  email: storeUser.value?.email || '',
  phone: '',
  company: '',
  role: '',
  location: '',
  timezone: 'UTC',
  bio: '',
  profilePicture: ''
});

const formData = ref({ ...userData.value });

const tabs = [
  { id: 'profile', label: 'Profile Information', icon: UserIcon },
  { id: 'files', label: 'My Files', icon: FolderIcon },
  { id: 'activity', label: 'Recent Activity', icon: ClockIcon },
  { id: 'settings', label: 'Account Settings', icon: SettingsIcon },
  { id: 'security', label: 'Security', icon: KeyIcon }
];

const loadUserProfile = async () => {
  if (!user.value) return;

  try {
    const response = await api.get('/ideacircuit/user/profile');
    const profile = response.data.data || response.data;

    if (profile) {
      const nameParts = (profile.name || storeUser.value?.name || '').split(' ');
      userData.value = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || storeUser.value?.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        role: profile.role || '',
        location: profile.location || '',
        timezone: profile.timezone || 'UTC',
        bio: profile.bio || '',
        profilePicture: profile.profile_picture || ''
      };
      formData.value = { ...userData.value };
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
};

const loadActivity = async () => {
  loading.value = true;
  try {
    const response = await api.get('/ideacircuit/user/activity');
    const activities = response.data.data || response.data;
    activityData.value = Array.isArray(activities) ? activities : [];
  } catch (error) {
    console.error('Error loading activity:', error);
    activityData.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  try {
    await api.put('/ideacircuit/user/profile', {
      name: `${formData.value.firstName} ${formData.value.lastName}`.trim(),
      email: formData.value.email,
      phone: formData.value.phone,
      company: formData.value.company,
      role: formData.value.role,
      location: formData.value.location,
      timezone: formData.value.timezone,
      bio: formData.value.bio
    });
    userData.value = { ...formData.value };
    isEditing.value = false;
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

const handleCancel = () => {
  formData.value = { ...userData.value };
  isEditing.value = false;
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

onMounted(() => {
  loadUserProfile();
  loadActivity();
});
</script>

