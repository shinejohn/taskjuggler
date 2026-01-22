import { defineStore } from 'pinia';
import { ref } from 'vue';
import { campaignsApi, type Campaign, type CampaignFilters } from '@/api/campaigns';
import { useOrganizationsStore } from './organizations';

export const useCampaignsStore = defineStore('campaigns', () => {
  const campaigns = ref<Campaign[]>([]);
  const currentCampaign = ref<Campaign | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const perPage = ref(15);

  async function fetchCampaigns(filters?: CampaignFilters) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.getAll(orgId, {
        ...filters,
        page: filters?.page || page.value,
        per_page: filters?.per_page || perPage.value,
      });
      const data = (response.data as any).data || response.data;
      campaigns.value = Array.isArray(data) ? data : data.data;
      total.value = (response.data as any).total || (data.meta ? data.meta.total : data.length);
      page.value = (response.data as any).page || (data.meta ? data.meta.current_page : page.value);
      perPage.value = (response.data as any).per_page || (data.meta ? data.meta.per_page : perPage.value);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load campaigns';
      // Error logging removed - handled by error interceptor
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCampaign(id: string) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.getById(orgId, id);
      const data = (response.data as any).data || response.data;
      currentCampaign.value = data;
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load campaign';
      // Error handled by error interceptor
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createCampaign(data: Partial<Campaign>) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.create(orgId, data);
      const result = (response.data as any).data || response.data;
      campaigns.value.push(result);
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create campaign';
      console.error('Campaign creation error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCampaign(id: string, data: Partial<Campaign>) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.update(orgId, id, data);
      const result = (response.data as any).data || response.data;
      const index = campaigns.value.findIndex(c => c.id === id);
      if (index !== -1) {
        campaigns.value[index] = result;
      }
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = result;
      }
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update campaign';
      console.error('Campaign update error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCampaign(id: string) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      await campaignsApi.delete(orgId, id);
      campaigns.value = campaigns.value.filter(c => c.id !== id);
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete campaign';
      console.error('Campaign deletion error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startCampaign(id: string) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.start(orgId, id);
      const result = (response.data as any).data || response.data;
      const index = campaigns.value.findIndex(c => c.id === id);
      if (index !== -1) {
        campaigns.value[index] = result;
      }
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to start campaign';
      console.error('Campaign start error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function pauseCampaign(id: string) {
    loading.value = true;
    error.value = null;
    const orgStore = useOrganizationsStore();
    const orgId = orgStore.currentOrganization?.id;

    if (!orgId) {
      error.value = 'No organization selected.';
      loading.value = false;
      return;
    }

    try {
      const response = await campaignsApi.pause(orgId, id);
      const result = (response.data as any).data || response.data;
      const index = campaigns.value.findIndex(c => c.id === id);
      if (index !== -1) {
        campaigns.value[index] = result;
      }
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to pause campaign';
      console.error('Campaign pause error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  const filteredCampaigns = (status?: string) => {
    if (!status || status === 'all') return campaigns.value;
    return campaigns.value.filter(c => c.status === status);
  };

  return {
    campaigns,
    currentCampaign,
    loading,
    error,
    total,
    page,
    perPage,
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
    filteredCampaigns,
  };
});

