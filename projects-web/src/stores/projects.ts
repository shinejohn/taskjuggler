import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsApi, type Project, type Milestone } from '@/api/projects'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)

  const activeProjects = computed(() => projects.value.filter((p: Project) => p.status === 'active'))
  const completedProjects = computed(() => projects.value.filter((p: Project) => p.status === 'completed'))

  async function fetchProjects() {
    loading.value = true
    try {
      const response = await projectsApi.list()
      projects.value = response.data || response
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string) {
    loading.value = true
    try {
      const response = await projectsApi.get(id)
      currentProject.value = response.data || response
      return currentProject.value
    } catch (error) {
      console.error('Failed to fetch project:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: Partial<Project>) {
    try {
      const response = await projectsApi.create(data)
      const newProject = response.data || response
      projects.value.unshift(newProject)
      return newProject
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }

  async function updateProject(id: string, data: Partial<Project>) {
    try {
      const response = await projectsApi.update(id, data)
      const updatedProject = response.data || response
      const index = projects.value.findIndex((p: Project) => p.id === id)
      if (index !== -1) projects.value[index] = updatedProject
      if (currentProject.value?.id === id) currentProject.value = updatedProject
      return updatedProject
    } catch (error) {
      console.error('Failed to update project:', error)
      throw error
    }
  }

  async function deleteProject(id: string) {
    try {
      await projectsApi.delete(id)
      projects.value = projects.value.filter((p: Project) => p.id !== id)
      if (currentProject.value?.id === id) currentProject.value = null
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    }
  }

  // Milestones
  async function fetchMilestones(projectId: string) {
    try {
      const response = await projectsApi.getMilestones(projectId)
      return response.data || response
    } catch (error) {
      console.error('Failed to fetch milestones:', error)
      throw error
    }
  }

  async function addMilestone(projectId: string, data: Partial<Milestone>) {
    try {
      const response = await projectsApi.createMilestone(projectId, data)
      const newMilestone = response.data || response
      if (currentProject.value?.id === projectId) {
        if (!currentProject.value.milestones) {
          currentProject.value.milestones = []
        }
        currentProject.value.milestones.push(newMilestone)
      }
      return newMilestone
    } catch (error) {
      console.error('Failed to create milestone:', error)
      throw error
    }
  }

  async function updateMilestone(projectId: string, milestoneId: string, data: Partial<Milestone>) {
    try {
      const response = await projectsApi.updateMilestone(projectId, milestoneId, data)
      return response.data || response
    } catch (error) {
      console.error('Failed to update milestone:', error)
      throw error
    }
  }

  async function deleteMilestone(projectId: string, milestoneId: string) {
    try {
      await projectsApi.deleteMilestone(projectId, milestoneId)
      if (currentProject.value?.id === projectId && currentProject.value.milestones) {
        currentProject.value.milestones = currentProject.value.milestones.filter(
          (m: Milestone) => m.id !== milestoneId
        )
      }
    } catch (error) {
      console.error('Failed to delete milestone:', error)
      throw error
    }
  }

  async function completeMilestone(projectId: string, milestoneId: string) {
    try {
      const response = await projectsApi.completeMilestone(projectId, milestoneId)
      return response.data || response
    } catch (error) {
      console.error('Failed to complete milestone:', error)
      throw error
    }
  }

  // Tasks
  async function fetchTasks(projectId: string) {
    try {
      const response = await projectsApi.getTasks(projectId)
      return response.data || response
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      throw error
    }
  }

  async function addTask(projectId: string, taskData: any) {
    try {
      const response = await projectsApi.addTask(projectId, taskData)
      return response.data || response
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  }

  return {
    projects,
    currentProject,
    loading,
    activeProjects,
    completedProjects,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
    fetchTasks,
    addTask,
  }
})

