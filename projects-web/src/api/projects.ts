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
    const { data } = await apiClient.get('/projects', { params })
    return data
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/projects/${id}`)
    return data
  },

  async getMembers(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/members`)
    return data
  },

  async create(projectData: Partial<Project>) {
    const { data } = await apiClient.post('/projects', projectData)
    return data
  },

  async update(id: string, projectData: Partial<Project>) {
    const { data } = await apiClient.put(`/projects/${id}`, projectData)
    return data
  },

  async delete(id: string) {
    await apiClient.delete(`/projects/${id}`)
  },

  async getStats(id: string) {
    const { data } = await apiClient.get(`/projects/${id}/stats`)
    return data
  },

  // Tasks within project (backend may have different structure - Task model links to projects)
  async getTasks(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/tasks`)
    return data
  },

  async addTask(projectId: string, taskData: any) {
    const { data } = await apiClient.post(`/projects/${projectId}/tasks`, taskData)
    return data
  },

  // Milestones - backend Projects module may not have these; will 404 if missing
  async getMilestones(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/milestones`)
    return data
  },

  async createMilestone(projectId: string, milestoneData: Partial<Milestone>) {
    const { data } = await apiClient.post(`/projects/${projectId}/milestones`, milestoneData)
    return data
  },

  async updateMilestone(projectId: string, milestoneId: string, milestoneData: Partial<Milestone>) {
    const { data } = await apiClient.put(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData)
    return data
  },

  async deleteMilestone(projectId: string, milestoneId: string) {
    await apiClient.delete(`/projects/${projectId}/milestones/${milestoneId}`)
  },

  async completeMilestone(projectId: string, milestoneId: string) {
    const { data } = await apiClient.post(`/projects/${projectId}/milestones/${milestoneId}/complete`)
    return data
  },

  async getTimeline(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/timeline`)
    return data
  },

  async getGantt(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/gantt`)
    return data
  },
}

