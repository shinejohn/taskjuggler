<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Team Members</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Add Team Member
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="teamMembers.length === 0" class="text-center py-8 text-gray-500">
      No team members yet. Add your first team member to get started.
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="member in teamMembers"
        :key="member.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold">{{ member.name }}</h3>
              <span
                v-if="member.user"
                class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
              >
                Has Account
              </span>
              <span
                v-else
                class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
              >
                No Account
              </span>
              <span
                v-if="member.can_receive_tasks"
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
              >
                Can Receive Tasks
              </span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="member.email"><strong>Email:</strong> {{ member.email }}</p>
              <p v-if="member.phone"><strong>Phone:</strong> {{ member.phone }}</p>
              <p v-if="member.role"><strong>Role:</strong> {{ member.role }}</p>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="editMember(member)"
              class="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button
              @click="deleteMember(member.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingMember"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">{{ editingMember ? 'Edit Team Member' : 'Add Team Member' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Name *</label>
            <input
              v-model="memberForm.name"
              type="text"
              required
              class="input"
              placeholder="Team member name"
            />
          </div>

          <div>
            <label class="label">Email</label>
            <input
              v-model="memberForm.email"
              type="email"
              class="input"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="label">Phone</label>
            <input
              v-model="memberForm.phone"
              type="tel"
              class="input"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label class="label">Role</label>
            <input
              v-model="memberForm.role"
              type="text"
              class="input"
              placeholder="e.g., Developer, Manager"
            />
          </div>

          <div class="flex items-center">
            <input
              id="can_receive_tasks"
              v-model="memberForm.can_receive_tasks"
              type="checkbox"
              class="mr-2"
            />
            <label for="can_receive_tasks" class="text-sm text-gray-700">Can receive tasks</label>
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Saving...' : (editingMember ? 'Update' : 'Add') }}
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
import { ref, onMounted } from 'vue'
import { useTeamStore } from '@/stores/team'
import type { TeamMember } from '@/types'

const teamStore = useTeamStore()

const loading = computed(() => teamStore.loading)
const teamMembers = computed(() => teamStore.teamMembers)

const showCreateModal = ref(false)
const editingMember = ref<TeamMember | null>(null)

const memberForm = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  can_receive_tasks: true,
})

onMounted(() => {
  teamStore.fetchTeamMembers()
})

function editMember(member: TeamMember) {
  editingMember.value = member
  memberForm.value = {
    name: member.name,
    email: member.email || '',
    phone: member.phone || '',
    role: member.role || '',
    can_receive_tasks: member.can_receive_tasks,
  }
  showCreateModal.value = true
}

function closeModal() {
  showCreateModal.value = false
  editingMember.value = null
  memberForm.value = {
    name: '',
    email: '',
    phone: '',
    role: '',
    can_receive_tasks: true,
  }
}

async function handleSubmit() {
  try {
    if (editingMember.value) {
      await teamStore.updateTeamMember(editingMember.value.id, memberForm.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Team member updated successfully')
      }
    } else {
      await teamStore.createTeamMember(memberForm.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Team member added successfully')
      }
    }
    closeModal()
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function deleteMember(id: string) {
  if (!confirm('Are you sure you want to delete this team member?')) return
  
  try {
    await teamStore.deleteTeamMember(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Team member deleted successfully')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'TeamPage'
}
</script>
