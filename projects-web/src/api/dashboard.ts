import apiClient from './client'

export const dashboardApi = {
  async getStats() {
    const { data } = await apiClient.get('/api/dashboard')
    return data
  },

  async getActivity() {
    const { data } = await apiClient.get('/api/dashboard/activity')
    return data
  },
}

