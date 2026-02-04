<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Teams</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create Team
      </button>
    </div>

    <div v-if="loading && teams.length === 0" class="text-center py-8">Loading...</div>
    <div v-else-if="teams.length === 0" class="text-center py-8 text-gray-500">
      No teams yet. Create your first team to get started.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="team in teams"
        :key="team.id"
        class="card cursor-pointer hover:shadow-lg transition-shadow"
        @click="$router.push(`/teams/${team.id}`)"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold">{{ team.name }}</h3>
          <button
            @click.stop="deleteTeam(team.id)"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
        <p v-if="team.description" class="text-sm text-gray-600 mb-3">{{ team.description }}</p>
        <div class="flex gap-4 text-sm text-gray-500">
          <span>{{ team.members_count || 0 }} members</span>
          <span>{{ team.tasks_count || 0 }} tasks</span>
        </div>
      </div>
    </div>

    <!-- Create Team Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Create Team</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Team Name *</label>
            <input
              v-model="teamForm.name"
              type="text"
              required
              class="input"
              placeholder="My Team"
            />
          </div>

          <div>
            <label class="label">Description</label>
            <textarea
              v-model="teamForm.description"
              class="input"
              rows="3"
              placeholder="Team description..."
            />
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Creating...' : 'Create Team' }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTeamsStore } from '@/stores/teams';

const router = useRouter();
const teamsStore = useTeamsStore();

const teams = computed(() => teamsStore.teams);
const loading = computed(() => teamsStore.loading);

const showCreateModal = ref(false);
const teamForm = ref({
  name: '',
  description: '',
});

onMounted(() => {
  teamsStore.fetchTeams();
});

function closeModal() {
  showCreateModal.value = false;
  teamForm.value = { name: '', description: '' };
}

async function handleSubmit() {
  try {
    const team = await teamsStore.createTeam(teamForm.value);
    if ((window as any).$toast) {
      (window as any).$toast.success('Team created successfully');
    }
    closeModal();
    router.push(`/teams/${team.id}`);
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function deleteTeam(id: string) {
  if (!confirm('Are you sure you want to delete this team?')) return;
  
  try {
    await teamsStore.deleteTeam(id);
    if ((window as any).$toast) {
      (window as any).$toast.success('Team deleted successfully');
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>

<script lang="ts">
import { computed } from 'vue';
export default {
  name: 'TeamsPage'
}
</script>
