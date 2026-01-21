<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Your 4 Calls
          </h1>
          <p class="text-slate-500 mt-1">Manage your AI assistant team</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Plus :size="18" />
          Hire New 4 Call
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="coordinatorsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading 4 Calls...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="coordinatorsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ coordinatorsStore.error }}
      </div>

      <!-- Coordinators Content -->
      <template v-else>
        <!-- Filters -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div class="relative w-full md:w-96">
            <Search class="absolute left-3 top-2.5 text-slate-400" :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search 4 Calls..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
            />
          </div>

          <div class="flex gap-3 w-full md:w-auto">
            <div class="relative flex-1 md:flex-none">
              <select
                v-model="filterRole"
                class="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
              <Filter class="absolute right-3 top-2.5 text-slate-400 pointer-events-none" :size="16" />
            </div>

            <div class="relative flex-1 md:flex-none">
              <select
                v-model="filterStatus"
                class="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
              <Filter class="absolute right-3 top-2.5 text-slate-400 pointer-events-none" :size="16" />
            </div>
          </div>
        </div>

        <!-- Coordinators Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CoordinatorCard
            v-for="coord in filteredCoordinators"
            :key="coord.id"
            :id="coord.id"
            :name="coord.display_name || coord.role_template?.name || '4 Call'"
            :role="coord.role_template?.name || 'Unknown Role'"
            :status="coord.status === 'active' ? 'active' : 'paused'"
            :price="`$${coord.monthly_price}/mo`"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredCoordinators.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p class="text-slate-500 mb-4">No 4 Calls found</p>
          <button
            @click="showCreateModal = true"
            class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg"
          >
            Hire Your First 4 Call
          </button>
        </div>
      </template>
    </div>

    <!-- Create Coordinator Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showCreateModal = false"
    >
      <div
        class="bg-white rounded-xl p-8 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-2xl font-bold text-[#1B4F72] mb-6">Hire New 4 Call</h3>
        <p class="text-slate-600 mb-6">Select a role template to create a new 4 Call</p>
        <!-- Role selection would go here - simplified for now -->
        <div class="flex gap-3 justify-end">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            @click="handleCreateCoordinator"
            :disabled="creating"
            class="px-4 py-2 bg-[#1B4F72] text-white rounded-lg hover:bg-[#153e5a] disabled:opacity-50"
          >
            {{ creating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Filter, Plus } from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import CoordinatorCard from '@/components/dashboard/CoordinatorCard.vue';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';

const coordinatorsStore = useCoordinatorsStore();
const organizationsStore = useOrganizationsStore();

const searchQuery = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const showCreateModal = ref(false);
const creating = ref(false);

const filteredCoordinators = computed(() => {
  let filtered = coordinatorsStore.coordinators;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(coord =>
      (coord.display_name || '').toLowerCase().includes(query) ||
      (coord.role_template?.name || '').toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    filtered = filtered.filter(coord => coord.status === filterStatus.value);
  }

  return filtered;
});

async function handleCreateCoordinator() {
  // Simplified - would need role/persona selection UI
  creating.value = true;
  try {
    if (!organizationsStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }
    // Placeholder - would need actual role/persona IDs
    await coordinatorsStore.createCoordinator(organizationsStore.currentOrganization.id, {
      role_template_id: '', // Would come from selection
      persona_template_id: '', // Would come from selection
    });
    showCreateModal.value = false;
  } catch (error) {
    console.error('Failed to create coordinator:', error);
  } finally {
    creating.value = false;
  }
}

onMounted(async () => {
  try {
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }
    if (organizationsStore.currentOrganization?.id) {
      await coordinatorsStore.fetchCoordinators();
    }
  } catch (error) {
    console.error('Failed to load coordinators:', error);
  }
});
</script>
