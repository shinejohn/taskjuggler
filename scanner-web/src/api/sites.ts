import api from '@/utils/api'
import type { Site, CreateSiteRequest, UpdateSiteRequest } from '@/types'

export const sitesApi = {
  getAll: () => api.get<{ data: Site[] }>('/scanner/sites'),
  getById: (id: number) => api.get<{ data: Site }>(`/scanner/sites/${id}`),
  create: (data: CreateSiteRequest) => api.post<{ data: Site }>('/scanner/sites', data),
  update: (id: number, data: UpdateSiteRequest) => api.put<{ data: Site }>(`/scanner/sites/${id}`, data),
  delete: (id: number) => api.delete(`/scanner/sites/${id}`),
}
