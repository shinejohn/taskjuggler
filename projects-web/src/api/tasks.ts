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
    const { data } = await apiClient.get('/tasks', {
      params: { ...params, project_id: projectId },
    })
    return data
  },

  async get(_projectId: string, taskId: string) {
    const { data } = await apiClient.get(`/tasks/${taskId}`)
    return data
  },

  async create(projectId: string, taskData: Partial<Task>) {
    const { data } = await apiClient.post('/tasks', {
      ...taskData,
      project_id: projectId,
    })
    return data
  },

  async update(_projectId: string, taskId: string, taskData: Partial<Task>) {
    const { data } = await apiClient.put(`/tasks/${taskId}`, taskData)
    return data
  },

  async delete(_projectId: string, taskId: string) {
    await apiClient.delete(`/tasks/${taskId}`)
  },

  async accept(_projectId: string, taskId: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/accept`)
    return data
  },

  async decline(_projectId: string, taskId: string, reason: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/decline`, { reason })
    return data
  },

  async start(_projectId: string, taskId: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/start`)
    return data
  },

  async complete(_projectId: string, taskId: string, notes?: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/complete`, { notes })
    return data
  },

  async cancel(_projectId: string, taskId: string, reason?: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/cancel`, { reason })
    return data
  },

  async getMessages(_projectId: string, taskId: string) {
    const { data } = await apiClient.get(`/tasks/${taskId}/messages`)
    return data
  },

  async addMessage(_projectId: string, taskId: string, content: string) {
    const { data } = await apiClient.post(`/tasks/${taskId}/messages`, { content })
    return data
  },

  async myTasks() {
    const { data } = await apiClient.get('/my/tasks')
    return data
  },

  async myRequests() {
    const { data } = await apiClient.get('/my/requests')
    return data
  },
}

