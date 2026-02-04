import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { sitesApi } from '@/api/sites';
import type { Site, CreateSiteRequest, UpdateSiteRequest } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { useSubscriptionStore } from '@/stores/subscription';

export const useSitesStore = defineStore('sites', () => {
  const authStore = useAuthStore();
  const subscriptionStore = useSubscriptionStore();
  
  const sites = ref<Site[]>([]);
  const currentSite = ref<Site | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sitesNeedingAttention = computed(() => 
    sites.value.filter((site: Site) => (site.health_score || 0) < 70)
  );

  const sitesRemaining = computed(() => {
    const limit = subscriptionStore.limits.sites;
    return Math.max(0, limit - sites.value.length);
  });

  const canAddSite = computed(() => {
    const limit = subscriptionStore.limits.sites;
    return sites.value.length < limit;
  });

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
    if (!canAddSite.value) {
      const limit = subscriptionStore.limits.sites;
      throw new Error(`Site limit reached (${limit} sites). Upgrade to add more sites.`);
    }
    
    loading.value = true;
    error.value = null;
    try {
      // Include team_id if currentTeam exists (API will also use X-Team-ID header)
      const requestData: CreateSiteRequest & { team_id?: number } = {
        ...data,
      };
      
      if (authStore.currentTeam?.id) {
        requestData.team_id = authStore.currentTeam.id;
      }
      
      const response = await sitesApi.create(requestData);
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
    sitesRemaining,
    canAddSite,
    fetchSites,
    fetchSite,
    createSite,
    updateSite,
    deleteSite,
  };
});
