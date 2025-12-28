import api from '@/utils/api'
import type { Issue, UpdateIssueRequest, BulkUpdateIssuesRequest, GenerateFixResponse } from '@/types'

export const issuesApi = {
  getAll: (params?: { site_id?: number; scan_id?: number; category?: string; severity?: string; status?: string }) => 
    api.get<{ data: Issue[] }>('/scanner/issues', { params }),
  getById: (id: number) => api.get<{ data: Issue }>(`/scanner/issues/${id}`),
  update: (id: number, data: UpdateIssueRequest) => api.put<{ data: Issue }>(`/scanner/issues/${id}`, data),
  bulkUpdate: (data: BulkUpdateIssuesRequest) => api.post<{ data: Issue[] }>('/scanner/issues/bulk', data),
  generateFix: (id: number) => api.post<{ data: GenerateFixResponse }>(`/scanner/issues/${id}/fix`),
}
