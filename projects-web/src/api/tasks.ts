import apiClient from './client'

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  state: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  source_channel: 'web' | 'mobile' | 'email' | 'sms' | 'voice' | 'slack'
  due_date: string | null
  started_at: string | null
  completed_at: string | null
  estimated_hours: number | null
  actual_hours: number
  overdue_risk_score: number | null
  is_overdue: boolean
  tags: string[] | null
  requestor?: {
    id: string
    name: string
    email: string
  }
  owner?: {
    id: string
    name: string
    email: string
  }
  ai_suggestions?: any
}

export const tasksApi = {
  async list(projectId: string, params?: any) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/tasks`, { params })
    return data
  },

  async get(projectId: string, taskId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/tasks/${taskId}`)
    return data
  },

  async create(projectId: string, taskData: Partial<Task>) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks`, taskData)
    return data
  },

  async update(projectId: string, taskId: string, taskData: Partial<Task>) {
    const { data } = await apiClient.put(`/api/projects/${projectId}/tasks/${taskId}`, taskData)
    return data
  },

  async delete(projectId: string, taskId: string) {
    await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`)
  },

  // State transitions
  async accept(projectId: string, taskId: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/accept`)
    return data
  },

  async decline(projectId: string, taskId: string, reason: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/decline`, { reason })
    return data
  },

  async start(projectId: string, taskId: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/start`)
    return data
  },

  async complete(projectId: string, taskId: string, notes?: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/complete`, { notes })
    return data
  },

  async cancel(projectId: string, taskId: string, reason?: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/cancel`, { reason })
    return data
  },

  // Messages
  async getMessages(projectId: string, taskId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/tasks/${taskId}/messages`)
    return data
  },

  async addMessage(projectId: string, taskId: string, content: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks/${taskId}/messages`, { content })
    return data
  },

  // Cross-project
  async myTasks() {
    const { data } = await apiClient.get('/api/my/tasks')
    return data
  },

  async myRequests() {
    const { data } = await apiClient.get('/api/my/requests')
    return data
  },
}

