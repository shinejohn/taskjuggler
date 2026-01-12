import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sitesApi } from '@/api/sites';
import type { Site, CreateSiteRequest, UpdateSiteRequest } from '@/types';

export const useSitesStore = defineStore('sites', () => {
  const sites = ref<Site[]>([]);
  const currentSite = ref<Site | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sitesNeedingAttention = computed(() => 
    sites.value.filter((site: Site) => (site.health_score || 0) < 70)
  );

  async function fetchSites() {
    loading.value = true;
    error.value = null;
    try {
      const response = await sitesApi.getAll();
      sites.value = response.data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch sites';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSite(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await sitesApi.getById(id);
      currentSite.value = response.data.data;
      const index = sites.value.findIndex((s: Site) => s.id === id);
      if (index !== -1) {
        sites.value[index] = response.data.data;
      }
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch site';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createSite(data: CreateSiteRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await sitesApi.create(data);
      sites.value.push(response.data.data);
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create site';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateSite(id: number, data: UpdateSiteRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await sitesApi.update(id, data);
      const index = sites.value.findIndex((s: Site) => s.id === id);
      if (index !== -1) {
        sites.value[index] = response.data.data;
      }
      if (currentSite.value?.id === id) {
        currentSite.value = response.data.data;
      }
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update site';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSite(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await sitesApi.delete(id);
      sites.value = sites.value.filter(s => s.id !== id);
      if (currentSite.value?.id === id) {
        currentSite.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete site';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    sites,
    currentSite,
    loading,
    error,
    sitesNeedingAttention,
    fetchSites,
    fetchSite,
    createSite,
    updateSite,
    deleteSite,
  };
});
