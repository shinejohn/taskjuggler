import api from '@/utils/api'
import type { Scan, CreateScanRequest } from '@/types'

export const scansApi = {
  getBySite: (siteId: number) => api.get<{ data: Scan[] }>(`/scanner/sites/${siteId}/scans`),
  getById: (id: number) => api.get<{ data: Scan }>(`/scanner/scans/${id}`),
  create: (data: CreateScanRequest) => api.post<{ data: Scan }>('/scanner/sites/' + data.site_id + '/scan', data),
  getReport: (id: number) => api.get(`/scanner/scans/${id}/report`, { responseType: 'blob' }),
  compare: (siteId: number, scanId1: number, scanId2: number) => 
    api.get<{ data: { changes: any[] } }>(`/scanner/sites/${siteId}/compare?scan1=${scanId1}&scan2=${scanId2}`),
}
