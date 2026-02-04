<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Create New Task</h1>
      <router-link to="/tasks" class="text-gray-600 hover:text-gray-900">Cancel</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="card space-y-6">
      <div>
        <label for="title" class="label">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="input"
          placeholder="Task title"
        />
      </div>

      <div>
        <label for="description" class="label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="input"
          placeholder="Task description"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="priority" class="label">Priority</label>
          <select id="priority" v-model="form.priority" class="input">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label for="due_date" class="label">Due Date</label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            class="input"
          />
        </div>
      </div>

      <div>
        <label for="team_member_id" class="label">Assign to Team Member</label>
        <select id="team_member_id" v-model="form.team_member_id" class="input">
          <option value="">None</option>
          <option v-for="member in teamMembers" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="tags" class="label">Tags (comma-separated)</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          class="input"
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary flex-1"
        >
          {{ loading ? 'Creating...' : 'Create Task' }}
        </button>
        <router-link to="/tasks" class="btn btn-secondary">
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useTeamStore } from '@/stores/team'

const router = useRouter()
const tasksStore = useTasksStore()
const teamStore = useTeamStore()

const loading = ref(false)
const form = ref({
  title: '',
  description: '',
  priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
  due_date: '',
  team_member_id: '',
  tags: [] as string[],
})
const tagsInput = ref('')

const teamMembers = computed(() => teamStore.teamMembers)

onMounted(async () => {
  await teamStore.fetchTeamMembers()
})

async function handleSubmit() {
  loading.value = true
  try {
    const taskData: any = {
      title: form.value.title,
      description: form.value.description || undefined,
      priority: form.value.priority,
      team_member_id: form.value.team_member_id || undefined,
      tags: tagsInput.value
        ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
        : undefined,
    }

    if (form.value.due_date) {
      taskData.due_date = form.value.due_date
    }

    await tasksStore.createTask(taskData)
    
    if ((window as any).$toast) {
      (window as any).$toast.success('Task created successfully')
    }
    
    router.push('/tasks')
  } catch (error) {
    // Error handled by API interceptor
  } finally {
    loading.value = false
  }
}
</script>
