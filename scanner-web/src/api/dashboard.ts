import api from '@/utils/api'
import type { DashboardStats } from '@/types'

export const dashboardApi = {
  getStats: () => api.get<{ data: DashboardStats }>('/scanner/dashboard'),
}
