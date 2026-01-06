<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Campaigns
          </h1>
          <p class="text-slate-500 mt-1">
            Automated outreach powered by your Coordinators
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Plus :size="18" />
          Create Campaign
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="border-b border-slate-200">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
              activeTab === tab.id
                ? 'border-[#1B4F72] text-[#1B4F72]'
                : 'border-transparent text-slate-500 hover:text-[#1B4F72] hover:border-slate-300'
            ]"
          >
            {{ tab.label }}
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-blue-100 text-[#1B4F72]'
                  : 'bg-slate-100 text-slate-500'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="campaignsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading campaigns...</p>
      </div>

      <!-- Campaign Cards Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="campaign in filteredCampaigns"
          :key="campaign.id"
          class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <!-- Card Header -->
          <div class="p-6 border-b border-slate-100">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ campaign.name }}</h3>
                <p class="text-sm text-slate-500">{{ campaign.type }}</p>
                <div v-if="campaign.coordinator" class="flex items-center gap-2 mt-2">
                  <div class="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-xs font-bold">
                    {{ campaign.coordinator.display_name?.charAt(0) || 'C' }}
                  </div>
                  <span class="text-xs text-slate-500">{{ campaign.coordinator.display_name }}</span>
                </div>
              </div>
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                  getStatusClass(campaign.status)
                ]"
              >
                {{ campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) }}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            <div v-if="campaign.status === 'running'" class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-600">Progress</span>
                  <span class="font-medium text-slate-900">
                    {{ campaign.contacts_processed || 0 }} / {{ campaign.target_count || 0 }}
                  </span>
                </div>
                <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#1B4F72] rounded-full transition-all"
                    :style="{
                      width: `${((campaign.contacts_processed || 0) / (campaign.target_count || 1)) * 100}%`
                    }"
                  />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-lg font-bold text-slate-900">{{ campaign.answer_rate || 0 }}%</div>
                  <div class="text-xs text-slate-500">Answer Rate</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-green-600">{{ campaign.confirmation_rate || 0 }}%</div>
                  <div class="text-xs text-slate-500">Confirmed</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-amber-600">{{ campaign.appointments_rescheduled || 0 }}</div>
                  <div class="text-xs text-slate-500">Rescheduled</div>
                </div>
              </div>
            </div>

            <div v-else-if="campaign.status === 'completed'" class="space-y-3">
              <div class="text-sm text-slate-600">
                <div class="font-medium text-slate-900 mb-2">Final Results</div>
                <div>Contacted: {{ campaign.contacts_contacted || 0 }}</div>
                <div>Answered: {{ campaign.contacts_answered || 0 }}</div>
                <div>Appointments: {{ campaign.appointments_booked || 0 }}</div>
              </div>
            </div>

            <div v-else-if="campaign.status === 'scheduled'" class="text-sm text-slate-600">
              <div class="font-medium text-slate-900 mb-1">Starts</div>
              <div>{{ campaign.scheduled_start_at ? new Date(campaign.scheduled_start_at).toLocaleString() : 'Not set' }}</div>
              <div class="mt-2">Target: {{ campaign.target_count || 0 }} contacts</div>
            </div>

            <div v-else class="text-sm text-slate-500">
              Last edited {{ campaign.updated_at ? new Date(campaign.updated_at).toLocaleDateString() : 'Never' }}
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                v-if="campaign.status === 'running'"
                @click="pauseCampaign(campaign)"
                class="flex-1 py-2 px-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Pause :size="16" />
                Pause
              </button>
              <button
                v-if="campaign.status === 'draft'"
                @click="editCampaign(campaign)"
                class="flex-1 py-2 px-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Edit :size="16" />
                Edit
              </button>
              <button
                @click="viewCampaign(campaign)"
                class="flex-1 py-2 px-3 bg-[#1B4F72] text-white font-medium rounded-lg hover:bg-[#153e5a] transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCampaigns.length === 0" class="lg:col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
          <p class="text-slate-500 mb-4">No campaigns found</p>
          <button
            @click="showCreateModal = true"
            class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg"
          >
            Create Your First Campaign
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Pause, Edit } from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useCampaignsStore } from '@/stores/campaigns';
import { useOrganizationsStore } from '@/stores/organizations';
import type { Campaign } from '@/api/campaigns';
import { getCampaignStatusClass } from '@/utils/status';

const campaignsStore = useCampaignsStore();
const organizationsStore = useOrganizationsStore();

const activeTab = ref('all');
const showCreateModal = ref(false);

const tabs = computed(() => {
  const all = campaignsStore.campaigns.length;
  const active = campaignsStore.campaigns.filter(c => c.status === 'running').length;
  const scheduled = campaignsStore.campaigns.filter(c => c.status === 'scheduled').length;
  const completed = campaignsStore.campaigns.filter(c => c.status === 'completed').length;
  const drafts = campaignsStore.campaigns.filter(c => c.status === 'draft').length;

  return [
    { id: 'all', label: 'All', count: all },
    { id: 'running', label: 'Active', count: active },
    { id: 'scheduled', label: 'Scheduled', count: scheduled },
    { id: 'completed', label: 'Completed', count: completed },
    { id: 'draft', label: 'Drafts', count: drafts },
  ];
});

const filteredCampaigns = computed(() => {
  return campaignsStore.filteredCampaigns(activeTab.value === 'all' ? undefined : activeTab.value);
});

watch(activeTab, async (newTab) => {
  if (organizationsStore.currentOrganization) {
    await campaignsStore.fetchCampaigns(
      newTab === 'all' ? {} : { status: newTab }
    );
  }
});

// Use utility function for status classes
const getStatusClass = getCampaignStatusClass;

async function pauseCampaign(campaign: Campaign) {
  try {
    await campaignsStore.pauseCampaign(campaign.id);
  } catch (error) {
    console.error('Failed to pause campaign:', error);
  }
}

function editCampaign(_campaign: Campaign) {
  // TODO: Implement edit modal
  // const selectedCampaign = ref<Campaign | null>(null);
  // const showEditModal = ref(false);
}

function viewCampaign(_campaign: Campaign) {
  // TODO: Navigate to campaign detail page
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  // router.push(`/campaigns/${campaign.id}`);
}

onMounted(async () => {
  if (!organizationsStore.currentOrganization) {
    await organizationsStore.fetchOrganizations();
    if (organizationsStore.organizations.length > 0) {
      organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
    }
  }
  if (organizationsStore.currentOrganization) {
    await campaignsStore.fetchCampaigns();
  }
});
</script>

