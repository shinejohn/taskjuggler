<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Integrations</h1>
        <p class="text-slate-500 mt-1">Connect Coordinator with your favorite tools</p>
      </div>
      <div class="relative w-full sm:w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search integrations..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
        />
      </div>
    </div>

    <!-- Connected Apps -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Connected Apps</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="app in connectedApps"
          :key="app.name"
          class="border-2 border-slate-200 rounded-xl p-4 hover:border-[#1B4F72] transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="text-3xl">{{ app.logo }}</div>
              <div>
                <h3 class="font-semibold text-slate-900">{{ app.name }}</h3>
                <span class="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CheckCircle :size="12" />
                  {{ app.status }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-xs text-slate-500 mb-3">
            <div>Last sync: {{ app.lastSync }}</div>
            <div>Syncing: {{ app.syncing }}</div>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
              <Settings :size="12" />
              Configure
            </button>
            <button class="flex-1 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Integrations -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Available Integrations</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="integration in filteredIntegrations"
          :key="integration.name"
          class="border-2 border-slate-200 rounded-xl p-4 hover:border-[#1B4F72] hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="text-3xl">{{ integration.logo }}</div>
            <span
              v-if="integration.popular"
              class="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium"
            >
              <Star :size="10" fill="currentColor" />
              Popular
            </span>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">{{ integration.name }}</h3>
          <p class="text-xs text-slate-500 mb-4">{{ integration.description }}</p>
          <button class="w-full py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors text-sm">
            Connect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, CheckCircle, Settings, Star } from 'lucide-vue-next';

const searchQuery = ref('');

const connectedApps = ref([
  {
    name: 'Google Calendar',
    logo: '📅',
    status: 'Connected',
    lastSync: '5 minutes ago',
    syncing: 'Appointments',
  },
  {
    name: 'QuickBooks',
    logo: '💰',
    status: 'Connected',
    lastSync: '1 hour ago',
    syncing: 'Invoices',
  },
  {
    name: 'Slack',
    logo: '💬',
    status: 'Connected',
    lastSync: '2 minutes ago',
    syncing: 'Notifications',
  },
]);

const availableIntegrations = ref([
  { name: 'Google Calendar', logo: '📅', description: 'Sync appointments automatically', popular: true },
  { name: 'Microsoft Outlook', logo: '📧', description: 'Sync with Outlook calendar', popular: false },
  { name: 'Salesforce', logo: '☁️', description: 'Sync contacts and leads', popular: true },
  { name: 'HubSpot', logo: '🟠', description: 'CRM and marketing automation', popular: true },
  { name: 'Stripe', logo: '💳', description: 'Accept online payments', popular: true },
  { name: 'Zapier', logo: '⚡', description: 'Connect anything', popular: true },
]);

const filteredIntegrations = computed(() => {
  if (!searchQuery.value) return availableIntegrations.value;
  const query = searchQuery.value.toLowerCase();
  return availableIntegrations.value.filter(
    (i) =>
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query)
  );
});
</script>




