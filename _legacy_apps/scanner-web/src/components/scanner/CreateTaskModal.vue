<template>
  <Modal
    :is-open="isOpen"
    title="Create Task from Issue"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="create-task-form">
      <div>
        <Label for="project">Project</Label>
        <select
          id="project"
          v-model="form.project_id"
          class="create-task-select"
        >
          <option :value="undefined">Select a project...</option>
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>

      <div>
        <Label for="assignee">Assignee</Label>
        <select
          id="assignee"
          v-model="form.assignee_id"
          class="create-task-select"
        >
          <option :value="undefined">Unassigned</option>
          <option
            v-for="assignee in assignees"
            :key="assignee.id"
            :value="assignee.id"
          >
            {{ assignee.name }}
          </option>
        </select>
      </div>

      <div>
        <Label for="priority">Priority</Label>
        <select
          id="priority"
          v-model="form.priority"
          class="create-task-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <Label for="due-date">Due Date</Label>
        <Input
          id="due-date"
          v-model="form.due_date"
          type="date"
          class="create-task-input"
        />
      </div>

      <div class="create-task-issue-preview">
        <h4 class="create-task-preview-title">Issue Details</h4>
        <div class="create-task-preview-content">
          <p class="create-task-preview-title-text">
            <strong>{{ issue.title }}</strong>
          </p>
          <p class="create-task-preview-message">{{ issue.message }}</p>
          <div class="create-task-preview-meta">
            <span class="create-task-preview-badge">{{ issue.severity }}</span>
            <span class="create-task-preview-badge">{{ issue.category }}</span>
          </div>
          <p v-if="issue.page_url" class="create-task-preview-url">
            <strong>Page:</strong> {{ issue.page_url }}
          </p>
        </div>
      </div>
    </form>
    <template #footer>
      <Button variant="ghost" @click="handleClose">Cancel</Button>
      <Button @click="handleSubmit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Task' }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import { Input, Label, Button } from '@taskjuggler/ui';
import { useTasksStore } from '@/stores/tasks';
import type { Issue } from '@/types';

interface Props {
  isOpen: boolean;
  issue: Issue;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  created: [task: any];
}>();

const tasksStore = useTasksStore();
const loading = ref(false);

const form = reactive({
  project_id: undefined as number | undefined,
  assignee_id: undefined as number | undefined,
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  due_date: undefined as string | undefined,
});

// Mock data for projects and assignees - these should be fetched from API in production
const projects = ref<Array<{ id: number; name: string }>>([]);
const assignees = ref<Array<{ id: number; name: string }>>([]);

onMounted(async () => {
  // Fetch projects and assignees from API
  // Note: These endpoints may not exist yet - gracefully handle 404s
  try {
    const api = (await import('@/utils/api')).default;
    try {
      const projectsResponse = await api.get('/api/projects');
      projects.value = projectsResponse.data.data || [];
    } catch (error: any) {
      // Projects API may not exist yet - that's okay, form still works
      if (error.response?.status !== 404) {
        console.warn('Failed to fetch projects:', error);
      }
    }
    
    try {
      const assigneesResponse = await api.get('/api/users');
      assignees.value = assigneesResponse.data.data || [];
    } catch (error: any) {
      // Users API may not exist yet - that's okay, form still works
      if (error.response?.status !== 404) {
        console.warn('Failed to fetch assignees:', error);
      }
    }
  } catch (error) {
    // API import failed - that's okay, form still works without these
    console.warn('Failed to load API client:', error);
  }
});

const handleClose = () => {
  emit('close');
  // Reset form
  form.project_id = undefined;
  form.assignee_id = undefined;
  form.priority = 'medium';
  form.due_date = undefined;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const task = await tasksStore.createTaskFromIssue(props.issue, {
      project_id: form.project_id,
      assignee_id: form.assignee_id,
      priority: form.priority,
      due_date: form.due_date,
    });
    emit('created', task);
    handleClose();
  } catch (error: any) {
    console.error('Failed to create task:', error);
    // Show error message to user
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create task. Please try again.';
    alert(errorMessage); // TODO: Replace with proper toast/notification component when available
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-task-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.create-task-select {
  width: 100%;
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--color-text-primary);
}

.create-task-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.create-task-input {
  width: 100%;
}

.create-task-issue-preview {
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.create-task-preview-title {
  font-size: var(--font-title-small);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
}

.create-task-preview-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.create-task-preview-title-text {
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
  margin: 0;
}

.create-task-preview-message {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  margin: 0;
}

.create-task-preview-meta {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.create-task-preview-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-label);
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.create-task-preview-url {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  margin: var(--space-2) 0 0 0;
  word-break: break-all;
}
</style>

