import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { MarketplaceListing, MarketplaceVendor } from '@/types';

export const useMarketplaceStore = defineStore('marketplace', () => {
  const listings = ref<MarketplaceListing[]>([]);
  const vendors = ref<MarketplaceVendor[]>([]);
  const currentListing = ref<MarketplaceListing | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const openListings = computed(() => 
    listings.value.filter(listing => listing.status === 'open')
  );

  async function fetchListings(params: Record<string, any> = {}) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/marketplace/listings', { params });
      const data = response.data;
      listings.value = Array.isArray(data?.data) ? data.data : data ?? [];
      pagination.value = {
        current_page: data?.current_page ?? 1,
        last_page: data?.last_page ?? 1,
        per_page: data?.per_page ?? 20,
        total: data?.total ?? 0,
      };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch listings';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchListing(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/marketplace/listings/${id}`);
      currentListing.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch listing';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createListing(data: Partial<MarketplaceListing>) {
    const response = await api.post('/marketplace/listings', data);
    listings.value.unshift(response.data);
    return response.data;
  }

  async function placeBid(listingId: string, data: { amount: number; message?: string; estimated_completion?: string }) {
    const response = await api.post(`/marketplace/listings/${listingId}/bid`, data);
    if (currentListing.value?.id === listingId) {
      await fetchListing(listingId);
    }
    return response.data;
  }

  async function assignVendor(listingId: string, vendorId: string) {
    const response = await api.post(`/marketplace/listings/${listingId}/assign`, { vendor_id: vendorId });
    if (currentListing.value?.id === listingId) {
      currentListing.value = response.data;
    }
    const index = listings.value.findIndex(l => l.id === listingId);
    if (index !== -1) {
      listings.value[index] = response.data;
    }
    return response.data;
  }

  async function fetchVendors() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/marketplace/vendors');
      const data = response.data;
      vendors.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch vendors';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchVendor(id: string) {
    const response = await api.get(`/marketplace/vendors/${id}`);
    return response.data;
  }

  return {
    listings,
    vendors,
    currentListing,
    loading,
    error,
    pagination,
    openListings,
    fetchListings,
    fetchListing,
    createListing,
    placeBid,
    assignVendor,
    fetchVendors,
    fetchVendor,
  };
});
