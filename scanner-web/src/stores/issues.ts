import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { issuesApi } from '@/api/issues';
import type { Issue, UpdateIssueRequest, BulkUpdateIssuesRequest } from '@/types';

export const useIssuesStore = defineStore('issues', () => {
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
      const index = issues.value.findIndex((i: Issue) => i.id === id);
      if (index !== -1) {
        issues.value[index].fix_code = response.data.data.fix_code;
        issues.value[index].fix_explanation = response.data.data.explanation;
        issues.value[index].fix_confidence = response.data.data.confidence;
      }
      if (currentIssue.value?.id === id) {
        currentIssue.value.fix_code = response.data.data.fix_code;
        currentIssue.value.fix_explanation = response.data.data.explanation;
        currentIssue.value.fix_confidence = response.data.data.confidence;
      }
      return response.data.data;
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
  };
});
