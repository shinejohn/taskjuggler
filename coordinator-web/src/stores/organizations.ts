import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { organizationsApi, type Organization } from '@/api/organizations';
import { apiCache } from '@/utils/cache';

export const useOrganizationsStore = defineStore('organizations', () => {
  const organizations = ref<Organization[]>([]);
  const currentOrganization = ref<Organization | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const hasOrganizations = computed(() => organizations.value.length > 0);

  async function fetchOrganizations(forceRefresh = false) {
    // Check cache first unless force refresh
    if (!forceRefresh && organizations.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await organizationsApi.getAll();
      organizations.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load organizations';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createOrganization(data: Partial<Organization>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await organizationsApi.create(data);
      organizations.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create organization';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateOrganization(id: string, data: Partial<Organization>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await organizationsApi.update(id, data);
      const index = organizations.value.findIndex(org => org.id === id);
      if (index !== -1) {
        organizations.value[index] = response.data;
      }
      if (currentOrganization.value?.id === id) {
        currentOrganization.value = response.data;
      }
      // Invalidate cache for organizations
      apiCache.invalidate('/coordinator/organizations');
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update organization';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setCurrentOrganization(organization: Organization | null) {
    currentOrganization.value = organization;
  }

  return {
    organizations,
    currentOrganization,
    loading,
    error,
    hasOrganizations,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    setCurrentOrganization,
  };
});

