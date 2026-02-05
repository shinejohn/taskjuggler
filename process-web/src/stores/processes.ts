import { defineStore } from 'pinia';
import { ref } from 'vue';
import { processesApi, type Process, type ProcessStep, type ProcessExecution } from '@/api/processes';

export const useProcessesStore = defineStore('processes', () => {
  const processes = ref<Process[]>([]);
  const currentProcess = ref<Process | null>(null);
  const currentSteps = ref<ProcessStep[]>([]);
  const executions = ref<ProcessExecution[]>([]);
  const loading = ref(false);

  async function fetchProcesses() {
    loading.value = true;
    try {
      const response = await processesApi.list();
      processes.value = response.data || response;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProcess(id: string) {
    loading.value = true;
    try {
      const response = await processesApi.get(id);
      currentProcess.value = response.data || response;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSteps(processId: string) {
    loading.value = true;
    try {
      const response = await processesApi.getSteps(processId);
      currentSteps.value = response.data || response;
    } finally {
      loading.value = false;
    }
  }

  async function createProcess(data: Partial<Process>) {
    const response = await processesApi.create(data);
    const newProcess = response.data || response;
    processes.value.unshift(newProcess);
    return newProcess;
  }

  async function updateProcess(id: string, data: Partial<Process>) {
    const response = await processesApi.update(id, data);
    const updatedProcess = response.data || response;
    const index = processes.value.findIndex((p: Process) => p.id === id);
    if (index !== -1) processes.value[index] = updatedProcess;
    if (currentProcess.value?.id === id) currentProcess.value = updatedProcess;
    return updatedProcess;
  }

  async function deleteProcess(id: string) {
    await processesApi.delete(id);
    processes.value = processes.value.filter((p: Process) => p.id !== id);
    if (currentProcess.value?.id === id) {
      currentProcess.value = null;
      currentSteps.value = [];
    }
  }

  async function publishProcess(id: string) {
    const response = await processesApi.publish(id);
    const updatedProcess = response.data || response;
    const index = processes.value.findIndex((p: Process) => p.id === id);
    if (index !== -1) processes.value[index] = updatedProcess;
    if (currentProcess.value?.id === id) currentProcess.value = updatedProcess;
    return updatedProcess;
  }

  async function createStep(processId: string, stepData: Partial<ProcessStep>) {
    const response = await processesApi.createStep(processId, stepData);
    const newStep = response.data || response;
    currentSteps.value.push(newStep);
    currentSteps.value.sort((a: ProcessStep, b: ProcessStep) => a.order - b.order);
    return newStep;
  }

  async function updateStep(processId: string, stepId: string, stepData: Partial<ProcessStep>) {
    const response = await processesApi.updateStep(processId, stepId, stepData);
    const updatedStep = response.data || response;
    const index = currentSteps.value.findIndex((s: ProcessStep) => s.id === stepId);
    if (index !== -1) currentSteps.value[index] = updatedStep;
    currentSteps.value.sort((a: ProcessStep, b: ProcessStep) => a.order - b.order);
    return updatedStep;
  }

  async function deleteStep(processId: string, stepId: string) {
    await processesApi.deleteStep(processId, stepId);
    currentSteps.value = currentSteps.value.filter((s: ProcessStep) => s.id !== stepId);
  }

  async function fetchExecutions(processId?: string) {
    loading.value = true;
    try {
      const response = processId 
        ? await processesApi.getExecutions(processId)
        : await processesApi.getAllExecutions();
      executions.value = response.data || response;
    } finally {
      loading.value = false;
    }
  }

  async function executeProcess(processId: string, taskId: string) {
    const response = await processesApi.execute(processId, taskId);
    return response.data || response;
  }

  return {
    processes,
    currentProcess,
    currentSteps,
    executions,
    loading,
    fetchProcesses,
    fetchProcess,
    fetchSteps,
    createProcess,
    updateProcess,
    deleteProcess,
    publishProcess,
    createStep,
    updateStep,
    deleteStep,
    fetchExecutions,
    executeProcess,
  };
});
