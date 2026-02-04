<template>
  <DashboardLayout>
    <div class="flex gap-6 min-h-[calc(100vh-200px)]">
      <!-- Left Sidebar -->
      <div class="w-64 flex-shrink-0">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-2 sticky top-6">
          <nav class="space-y-1">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                activeSection === section.id
                  ? 'bg-blue-50 text-[#1B4F72]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ]"
            >
              <component :is="section.icon" :size="18" />
              {{ section.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Business Profile -->
        <BusinessProfile v-if="activeSection === 'business'" />

        <!-- Phone Numbers -->
        <PhoneNumbers v-if="activeSection === 'phone'" />

        <!-- Integrations -->
        <Integrations v-if="activeSection === 'integrations'" />

        <!-- Team Members -->
        <TeamMembers v-if="activeSection === 'team'" />

        <!-- Security -->
        <Security v-if="activeSection === 'security'" />

        <!-- API Access -->
        <ApiAccess v-if="activeSection === 'api'" />

        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-[#1B4F72] mb-1">General Settings</h2>
            <p class="text-slate-500">Manage your account and default settings</p>
          </div>

          <!-- Account Information -->
          <section class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Account Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  :value="organization?.name || ''"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Account Email
                </label>
                <input
                  type="email"
                  :value="user?.email || ''"
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Timezone
                </label>
                <select class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
            </div>
            <button class="px-4 py-2 bg-[#1B4F72] text-white font-medium rounded-lg hover:bg-[#153e5a] transition-colors flex items-center gap-2">
              <Save :size="16" />
              Save Changes
            </button>
          </section>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-[#1B4F72] mb-1">Notifications</h2>
            <p class="text-slate-500">Manage how you receive updates</p>
          </div>

          <section class="space-y-4">
            <div
              v-for="notif in notificationSettings"
              :key="notif.key"
              class="flex justify-between items-start p-4 border border-slate-200 rounded-lg"
            >
              <div class="flex-1">
                <h4 class="font-medium text-slate-900 mb-1">{{ notif.label }}</h4>
                <p class="text-sm text-slate-500">{{ notif.desc }}</p>
              </div>
              <button
                @click="toggleNotification(notif.key)"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0',
                  getNotificationValue(notif.key) ? 'bg-[#1B4F72]' : 'bg-slate-200',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    getNotificationValue(notif.key) ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  User,
  Building2,
  Phone,
  Bell,
  Plug,
  Users,
  Shield,
  Code,
  Save,
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BusinessProfile from '@/components/settings/BusinessProfile.vue';
import PhoneNumbers from '@/components/settings/PhoneNumbers.vue';
import Integrations from '@/components/settings/Integrations.vue';
import TeamMembers from '@/components/settings/TeamMembers.vue';
import Security from '@/components/settings/Security.vue';
import ApiAccess from '@/components/settings/ApiAccess.vue';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationsStore } from '@/stores/organizations';

const authStore = useAuthStore();
const organizationsStore = useOrganizationsStore();

const activeSection = ref('general');

const sections = [
  { id: 'general', label: 'General', icon: User },
  { id: 'business', label: 'Business Profile', icon: Building2 },
  { id: 'phone', label: 'Phone Numbers', icon: Phone },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Access', icon: Code },
];

interface NotificationSettings {
  dailySummary: boolean;
  callTransferred: boolean;
  missedCalls: boolean;
  weeklyReport: boolean;
}

const notifications = ref<NotificationSettings>({
  dailySummary: true,
  callTransferred: true,
  missedCalls: false,
  weeklyReport: true,
});

const notificationSettings = [
  {
    key: 'dailySummary',
    label: 'Email me daily summary',
    desc: 'Receive a daily digest of activity',
  },
  {
    key: 'callTransferred',
    label: 'Email me when call transferred',
    desc: 'Get notified when a call is transferred to you',
  },
  {
    key: 'missedCalls',
    label: 'SMS me for missed calls',
    desc: "Text notification for calls that weren't answered",
  },
  {
    key: 'weeklyReport',
    label: 'Weekly performance report',
    desc: 'Comprehensive weekly analytics report',
  },
];

const user = computed(() => authStore.user);
const organization = computed(() => organizationsStore.currentOrganization);

function getNotificationValue(key: string): boolean {
  const notificationKey = key as keyof NotificationSettings;
  return notifications.value[notificationKey];
}

function toggleNotification(key: string) {
  const notificationKey = key as keyof NotificationSettings;
  notifications.value[notificationKey] = !notifications.value[notificationKey];
}

onMounted(async () => {
  if (!organizationsStore.currentOrganization) {
    await organizationsStore.fetchOrganizations();
    if (organizationsStore.organizations.length > 0) {
      organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
    }
  }
});
</script>
