import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { issuesApi } from '@/api/issues';
import { useTasksStore } from '@/stores/tasks';
import type { Issue, UpdateIssueRequest, BulkUpdateIssuesRequest } from '@/types';

export const useIssuesStore = defineStore('issues', () => {
  const tasksStore = useTasksStore();
  const issues = ref<Issue[]>([]);
  const currentIssue = ref<Issue | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<{
    site_id?: number;
    scan_id?: number;
    category?: string;
    severity?: string;
    status?: string;
  }>({});

  const criticalIssues = computed(() => 
    issues.value.filter((i: Issue) => i.severity === 'critical')
  );

  const openIssues = computed(() => 
    issues.value.filter((i: Issue) => i.status === 'open')
  );

  async function fetchIssues(params?: typeof filters.value) {
    loading.value = true;
    error.value = null;
    try {
      const response = await issuesApi.getAll(params || filters.value);
      issues.value = response.data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch issues';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchIssue(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await issuesApi.getById(id);
      currentIssue.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch issue';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateIssue(id: number, data: UpdateIssueRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await issuesApi.update(id, data);
      const index = issues.value.findIndex((i: Issue) => i.id === id);
      if (index !== -1) {
        issues.value[index] = response.data.data;
      }
      if (currentIssue.value?.id === id) {
        currentIssue.value = response.data.data;
      }
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update issue';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function bulkUpdateIssues(data: BulkUpdateIssuesRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await issuesApi.bulkUpdate(data);
      data.issue_ids.forEach((id: number) => {
        const index = issues.value.findIndex((i: Issue) => i.id === id);
        if (index !== -1) {
          const updated = response.data.data.find((i: Issue) => i.id === id);
          if (updated) {
            issues.value[index] = updated;
          }
        }
      });
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk update issues';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function generateFix(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await issuesApi.generateFix(id);
      const fixData = response.data?.data;
      if (!fixData) {
        throw new Error('No fix data received');
      }
      const index = issues.value.findIndex((i: Issue) => i.id === id);
      if (index !== -1 && issues.value[index]) {
        issues.value[index].fix_code = fixData.fix_code;
        issues.value[index].fix_explanation = fixData.explanation;
        issues.value[index].fix_confidence = fixData.confidence;
      }
      if (currentIssue.value?.id === id) {
        currentIssue.value.fix_code = fixData.fix_code;
        currentIssue.value.fix_explanation = fixData.explanation;
        currentIssue.value.fix_confidence = fixData.confidence;
      }
      return fixData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate fix';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setFilters(newFilters: typeof filters.value) {
    filters.value = { ...filters.value, ...newFilters };
  }

  async function createTaskFromIssue(issueId: number, options?: {
    assignee_id?: number;
    project_id?: number;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    const issue = issues.value.find(i => i.id === issueId);
    if (!issue) throw new Error('Issue not found');
    
    const task = await tasksStore.createTaskFromIssue(issue, options);
    
    // Update issue with task_id
    const index = issues.value.findIndex(i => i.id === issueId);
    if (index !== -1 && issues.value[index]) {
      issues.value[index].task_id = task.id;
    }
    
    if (currentIssue.value?.id === issueId && currentIssue.value) {
      currentIssue.value.task_id = task.id;
    }
    
    return task;
  }

  async function createTasksFromIssues(issueIds: number[], options?: {
    project_id?: number;
    assignee_id?: number;
  }) {
    const selectedIssues = issues.value.filter(i => issueIds.includes(i.id));
    if (selectedIssues.length === 0) throw new Error('No issues found');
    
    const tasks = await tasksStore.createTasksFromIssues(selectedIssues, options);
    
    // Update issues with task_ids
    tasks.forEach((task: any) => {
      const issueId = task.metadata?.issue_id;
      if (issueId) {
        const index = issues.value.findIndex(i => i.id === issueId);
        if (index !== -1 && issues.value[index]) {
          issues.value[index].task_id = task.id;
        }
        if (currentIssue.value?.id === issueId && currentIssue.value) {
          currentIssue.value.task_id = task.id;
        }
      }
    });
    
    return tasks;
  }

  return {
    issues,
    currentIssue,
    loading,
    error,
    filters,
    criticalIssues,
    openIssues,
    fetchIssues,
    fetchIssue,
    updateIssue,
    bulkUpdateIssues,
    generateFix,
    setFilters,
    createTaskFromIssue,
    createTasksFromIssues,
  };
});
