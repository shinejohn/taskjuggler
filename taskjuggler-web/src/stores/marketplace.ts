import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { MarketplaceListing, MarketplaceVendor } from '@/types';

export const useMarketplaceStore = defineStore('marketplace', () => {
  const listings = ref<MarketplaceListing[]>([]);
  const vendors = ref<MarketplaceVendor[]>([]);
  const currentListing = ref<MarketplaceListing | null>(null);
  const loading = ref(false);
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
    try {
      const response = await api.get('/marketplace/listings', { params });
      listings.value = response.data.data;
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      };
    } finally {
      loading.value = false;
    }
  }

  async function fetchListing(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/marketplace/listings/${id}`);
      currentListing.value = response.data;
      return response.data;
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
    try {
      const response = await api.get('/marketplace/vendors');
      vendors.value = response.data;
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
