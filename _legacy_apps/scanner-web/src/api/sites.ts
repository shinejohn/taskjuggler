import api from '@/utils/api'
import type { Site, CreateSiteRequest, UpdateSiteRequest } from '@/types'

export const sitesApi = {
  getAll: () => api.get<{ data: Site[] }>('/api/scanner/sites'),
  getById: (id: number) => api.get<{ data: Site }>(`/api/scanner/sites/${id}`),
  create: (data: CreateSiteRequest) => api.post<{ data: Site }>('/api/scanner/sites', data),
  update: (id: number, data: UpdateSiteRequest) => api.put<{ data: Site }>(`/api/scanner/sites/${id}`, data),
  delete: (id: number) => api.delete(`/api/scanner/sites/${id}`),
}
