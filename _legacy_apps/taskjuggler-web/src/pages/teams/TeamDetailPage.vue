<template>
  <div class="p-6">
    <div v-if="loading && !team" class="text-center py-8">Loading...</div>
    <div v-else-if="team" class="space-y-6">
      <!-- Team Header -->
      <div class="card">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ team.name }}</h1>
            <p v-if="team.description" class="text-gray-600">{{ team.description }}</p>
          </div>
          <button @click="showInviteModal = true" class="btn btn-primary">
            Invite Member
          </button>
        </div>
        <div class="flex gap-4 text-sm text-gray-500 mt-4">
          <span>{{ team.members_count || 0 }} members</span>
          <span>{{ team.tasks_count || 0 }} tasks</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Members Tab -->
      <div v-if="activeTab === 'members'" class="card">
        <h2 class="text-lg font-semibold mb-4">Team Members</h2>
        <div v-if="members.length === 0" class="text-center py-8 text-gray-500">
          No members yet. Invite someone to get started.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium">{{ member.name }}</div>
                <div class="text-sm text-gray-500">{{ member.email }}</div>
              </div>
              <span
                v-if="member.is_admin"
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
              >
                Admin
              </span>
            </div>
            <button
              @click="removeMember(member.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Tasks Tab -->
      <div v-if="activeTab === 'tasks'" class="card">
        <h2 class="text-lg font-semibold mb-4">Team Tasks</h2>
        <div v-if="teamTasks.length === 0" class="text-center py-8 text-gray-500">
          No tasks assigned to this team yet.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="task in teamTasks"
            :key="task.id"
            class="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            @click="$router.push(`/tasks/${task.id}`)"
          >
            <div class="font-medium">{{ task.title }}</div>
            <div class="text-sm text-gray-500">{{ task.status }}</div>
          </div>
        </div>
      </div>

      <!-- Invite Modal -->
      <div
        v-if="showInviteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeInviteModal"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">Invite to Team</h2>
            <button @click="closeInviteModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleInvite" class="space-y-4">
            <div>
              <label class="label">Email or Phone *</label>
              <input
                v-model="inviteForm.email"
                type="text"
                class="input"
                placeholder="email@example.com or +1234567890"
              />
            </div>

            <div>
              <label class="label">Name (optional)</label>
              <input
                v-model="inviteForm.name"
                type="text"
                class="input"
                placeholder="John Doe"
              />
            </div>

            <div v-if="inviteUrl" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm font-medium mb-2">Invitation Link:</p>
              <div class="flex gap-2">
                <input
                  :value="inviteUrl"
                  readonly
                  class="input flex-1 text-sm"
                />
                <button
                  type="button"
                  @click="copyInviteUrl"
                  class="btn btn-secondary text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t">
              <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
                {{ loading ? 'Sending...' : 'Send Invitation' }}
              </button>
              <button type="button" @click="closeInviteModal" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTeamsStore } from '@/stores/teams';
import type { Task } from '@/types';

const route = useRoute();
const teamsStore = useTeamsStore();

const team = computed(() => teamsStore.currentTeam);
const members = computed(() => teamsStore.teamMembers);
const loading = computed(() => teamsStore.loading);

const activeTab = ref('members');
const tabs = [
  { id: 'members', label: 'Members' },
  { id: 'tasks', label: 'Tasks' },
];

const showInviteModal = ref(false);
const inviteForm = ref({
  email: '',
  name: '',
});
const inviteUrl = ref('');
const teamTasks = ref<Task[]>([]);

onMounted(async () => {
  const teamId = route.params.id as string;
  await teamsStore.fetchTeam(teamId);
  await teamsStore.fetchTeamMembers(teamId);
  await loadTeamTasks(teamId);
});

async function loadTeamTasks(teamId: string) {
  try {
    const response = await teamsStore.fetchTeamTasks(teamId);
    teamTasks.value = response.data || [];
  } catch (error) {
    // Error handled
  }
}

function closeInviteModal() {
  showInviteModal.value = false;
  inviteForm.value = { email: '', name: '' };
  inviteUrl.value = '';
}

async function handleInvite() {
  if (!team.value) return;
  
  try {
    const invitation = await teamsStore.inviteToTeam(team.value.id, {
      email: inviteForm.value.email.includes('@') ? inviteForm.value.email : undefined,
      phone: !inviteForm.value.email.includes('@') ? inviteForm.value.email : undefined,
      name: inviteForm.value.name || undefined,
    });
    inviteUrl.value = invitation.invite_url;
    if ((window as any).$toast) {
      (window as any).$toast.success('Invitation sent successfully');
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

function copyInviteUrl() {
  navigator.clipboard.writeText(inviteUrl.value);
  if ((window as any).$toast) {
    (window as any).$toast.success('Invitation link copied to clipboard');
  }
}

async function removeMember(userId: string) {
  if (!team.value) return;
  if (!confirm('Are you sure you want to remove this member?')) return;
  
  try {
    await teamsStore.removeMember(team.value.id, userId);
    if ((window as any).$toast) {
      (window as any).$toast.success('Member removed');
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>

<script lang="ts">
export default {
  name: 'TeamDetailPage'
}
</script>
