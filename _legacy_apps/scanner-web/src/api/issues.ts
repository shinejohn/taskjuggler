import api from '@/utils/api'
import type { Issue, UpdateIssueRequest, BulkUpdateIssuesRequest, GenerateFixResponse } from '@/types'

export const issuesApi = {
  getAll: (params?: { site_id?: number; scan_id?: number; category?: string; severity?: string; status?: string }) => 
    api.get<{ data: Issue[] }>('/api/scanner/issues', { params }),
  getById: (id: number) => api.get<{ data: Issue }>(`/api/scanner/issues/${id}`),
  update: (id: number, data: UpdateIssueRequest) => api.put<{ data: Issue }>(`/api/scanner/issues/${id}`, data),
  bulkUpdate: (data: BulkUpdateIssuesRequest) => api.post<{ data: Issue[] }>('/api/scanner/issues/bulk', data),
  generateFix: (id: number) => api.post<{ data: GenerateFixResponse }>(`/api/scanner/issues/${id}/fix`),
}
