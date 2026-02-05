import apiClient from './client'

export interface Project {
  id: string
  name: string
  slug: string
  code?: string
  description: string | null
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  start_date: string | null
  target_end_date: string | null
  progress_percentage: number
  health_status: 'on_track' | 'at_risk' | 'behind' | 'completed'
  budget: number | null
  budget_spent: number
  methodology?: string
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  description: string | null
  target_date: string
  due_date?: string
  status: 'pending' | 'in_progress' | 'completed' | 'missed'
  order?: number
  is_critical?: boolean
  completed_date?: string | null
}

export const projectsApi = {
  async list(params?: any) {
    const { data } = await apiClient.get('/api/projects', { params })
    return data
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/api/projects/${id}`)
    return data
  },

  async getMembers(projectId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/members`)
    return data
  },

  async create(projectData: Partial<Project>) {
    const { data } = await apiClient.post('/api/projects', projectData)
    return data
  },

  async update(id: string, projectData: Partial<Project>) {
    const { data } = await apiClient.put(`/api/projects/${id}`, projectData)
    return data
  },

  async delete(id: string) {
    await apiClient.delete(`/api/projects/${id}`)
  },

  async getStats(id: string) {
    const { data } = await apiClient.get(`/api/projects/${id}/stats`)
    return data
  },

  // Tasks within project
  async getTasks(projectId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/tasks`)
    return data
  },

  async addTask(projectId: string, taskData: any) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/tasks`, taskData)
    return data
  },

  // Milestones (Note: These endpoints may need to be added to the backend)
  async getMilestones(projectId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/milestones`)
    return data
  },

  async createMilestone(projectId: string, milestoneData: Partial<Milestone>) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/milestones`, milestoneData)
    return data
  },

  async updateMilestone(projectId: string, milestoneId: string, milestoneData: Partial<Milestone>) {
    const { data } = await apiClient.put(`/api/projects/${projectId}/milestones/${milestoneId}`, milestoneData)
    return data
  },

  async deleteMilestone(projectId: string, milestoneId: string) {
    await apiClient.delete(`/api/projects/${projectId}/milestones/${milestoneId}`)
  },

  async completeMilestone(projectId: string, milestoneId: string) {
    const { data } = await apiClient.post(`/api/projects/${projectId}/milestones/${milestoneId}/complete`)
    return data
  },

  // Timeline / Gantt (Note: These endpoints may need to be added to the backend)
  async getTimeline(projectId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/timeline`)
    return data
  },

  async getGantt(projectId: string) {
    const { data } = await apiClient.get(`/api/projects/${projectId}/gantt`)
    return data
  },
}

