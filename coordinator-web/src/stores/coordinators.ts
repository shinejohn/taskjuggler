import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { coordinatorsApi, type Coordinator } from '@/api/coordinators';

export const useCoordinatorsStore = defineStore('coordinators', () => {
  const coordinators = ref<Coordinator[]>([]);
  const currentCoordinator = ref<Coordinator | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeCoordinators = computed(() =>
    coordinators.value.filter(c => c.status === 'active')
  );

  async function fetchCoordinators(orgId?: string) {
    loading.value = true;
    error.value = null;
    try {
      // If orgId not provided, try to get from organizations store
      if (!orgId) {
        const { useOrganizationsStore } = await import('./organizations');
        const orgStore = useOrganizationsStore();
        if (!orgStore.currentOrganization?.id) {
          throw new Error('No organization selected');
        }
        orgId = orgStore.currentOrganization.id;
      }
      const response = await coordinatorsApi.getByOrganization(orgId);
      coordinators.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load coordinators';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCoordinator(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await coordinatorsApi.getById(id);
      currentCoordinator.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load coordinator';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createCoordinator(orgId: string, data: Partial<Coordinator>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await coordinatorsApi.create(orgId, data);
      coordinators.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create coordinator';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCoordinator(id: string, data: Partial<Coordinator>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await coordinatorsApi.update(id, data);
      const index = coordinators.value.findIndex(c => c.id === id);
      if (index !== -1) {
        coordinators.value[index] = response.data;
      }
      if (currentCoordinator.value?.id === id) {
        currentCoordinator.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update coordinator';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCoordinator(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await coordinatorsApi.delete(id);
      coordinators.value = coordinators.value.filter(c => c.id !== id);
      if (currentCoordinator.value?.id === id) {
        currentCoordinator.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete coordinator';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    coordinators,
    currentCoordinator,
    loading,
    error,
    activeCoordinators,
    fetchCoordinators,
    fetchCoordinator,
    createCoordinator,
    updateCoordinator,
    deleteCoordinator,
  };
});

