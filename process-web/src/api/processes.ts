import apiClient from './client';

export interface Process {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  trigger_type: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessStep {
  id: string;
  process_id: string;
  name: string;
  order: number;
  step_type: string;
  config?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessExecution {
  id: string;
  process_id: string;
  task_id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
}

export const processesApi = {
  async list() {
    const { data } = await apiClient.get('/processes');
    return data;
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/processes/${id}`);
    return data;
  },

  async create(processData: Partial<Process>) {
    const { data } = await apiClient.post('/processes', processData);
    return data;
  },

  async update(id: string, processData: Partial<Process>) {
    const { data } = await apiClient.put(`/processes/${id}`, processData);
    return data;
  },

  async delete(id: string) {
    await apiClient.delete(`/processes/${id}`);
  },

  async publish(id: string) {
    const { data } = await apiClient.post(`/processes/${id}/publish`);
    return data;
  },

  // Steps
  async getSteps(processId: string) {
    const { data } = await apiClient.get(`/processes/${processId}/steps`);
    return data;
  },

  async createStep(processId: string, stepData: Partial<ProcessStep>) {
    const { data } = await apiClient.post(`/processes/${processId}/steps`, stepData);
    return data;
  },

  async updateStep(processId: string, stepId: string, stepData: Partial<ProcessStep>) {
    const { data } = await apiClient.put(`/processes/${processId}/steps/${stepId}`, stepData);
    return data;
  },

  async deleteStep(processId: string, stepId: string) {
    await apiClient.delete(`/processes/${processId}/steps/${stepId}`);
  },

  // Executions
  async execute(processId: string, taskId: string) {
    const { data } = await apiClient.post(`/processes/${processId}/execute`, { task_id: taskId });
    return data;
  },

  async getExecutions(processId: string) {
    const { data } = await apiClient.get(`/processes/${processId}/executions`);
    return data;
  },

  async getAllExecutions() {
    const { data } = await apiClient.get('/processes/executions');
    return data;
  },
};
