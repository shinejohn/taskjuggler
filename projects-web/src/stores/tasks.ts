import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksApi, type Task } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref({
    state: null as string | null,
    priority: null as string | null,
    owner_id: null as string | null,
    search: '',
  })

  // Computed
  const pendingTasks = computed(() => tasks.value.filter(t => t.state === 'pending'))
  const activeTasks = computed(() => tasks.value.filter(t => ['accepted', 'in_progress'].includes(t.state)))
  const completedTasks = computed(() => tasks.value.filter(t => t.state === 'completed'))
  const overdueTasks = computed(() => tasks.value.filter(t => t.is_overdue))

  const tasksByState = computed(() => {
    const grouped: Record<string, Task[]> = {}
    for (const task of tasks.value) {
      const state = task.state || 'pending'
      if (!grouped[state]) {
        grouped[state] = []
      }
      grouped[state].push(task)
    }
    return grouped
  })

  // Actions
  async function fetchTasks(projectId: string, params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksApi.list(projectId, { ...filters.value, ...params })
      tasks.value = response.data || response
      return tasks.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(projectId: string, taskId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksApi.get(projectId, taskId)
      currentTask.value = response.data || response
      return currentTask.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTask(projectId: string, taskData: Partial<Task>) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksApi.create(projectId, taskData)
      const newTask = response.data || response
      tasks.value.unshift(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTask(projectId: string, taskId: string, taskData: Partial<Task>) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksApi.update(projectId, taskId, taskData)
      const updatedTask = response.data || response
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) tasks.value[index] = updatedTask
      if (currentTask.value?.id === taskId) currentTask.value = updatedTask
      return updatedTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(projectId: string, taskId: string) {
    loading.value = true
    error.value = null
    try {
      await tasksApi.delete(projectId, taskId)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
      if (currentTask.value?.id === taskId) currentTask.value = null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function transitionTask(projectId: string, taskId: string, action: 'accept' | 'decline' | 'start' | 'complete' | 'cancel', data?: any) {
    loading.value = true
    error.value = null
    try {
      let response
      switch (action) {
        case 'accept':
          response = await tasksApi.accept(projectId, taskId)
          break
        case 'decline':
          response = await tasksApi.decline(projectId, taskId, data.reason)
          break
        case 'start':
          response = await tasksApi.start(projectId, taskId)
          break
        case 'complete':
          response = await tasksApi.complete(projectId, taskId, data?.notes)
          break
        case 'cancel':
          response = await tasksApi.cancel(projectId, taskId, data?.reason)
          break
      }
      const updatedTask = response.data || response
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) tasks.value[index] = updatedTask
      if (currentTask.value?.id === taskId) currentTask.value = updatedTask
      return updatedTask
    } catch (err: any) {
      error.value = err.response?.data?.message || `Failed to ${action} task`
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addMessage(projectId: string, taskId: string, content: string) {
    try {
      await tasksApi.addMessage(projectId, taskId, content)
      await fetchTask(projectId, taskId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add message'
      throw err
    }
  }

  function setFilter(key: string, value: any) {
    filters.value[key as keyof typeof filters.value] = value
  }

  function clearFilters() {
    filters.value = {
      state: null,
      priority: null,
      owner_id: null,
      search: '',
    }
  }

  function reset() {
    tasks.value = []
    currentTask.value = null
    error.value = null
    clearFilters()
  }

  return {
    // State
    tasks,
    currentTask,
    loading,
    error,
    filters,
    // Computed
    pendingTasks,
    activeTasks,
    completedTasks,
    overdueTasks,
    tasksByState,
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    transitionTask,
    addMessage,
    setFilter,
    clearFilters,
    reset,
  }
})

