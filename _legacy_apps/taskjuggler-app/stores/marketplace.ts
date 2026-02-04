import { create } from 'zustand';
import api from '../utils/api';
import type { MarketplaceListing, MarketplaceVendor } from '../types';

interface MarketplaceState {
  listings: MarketplaceListing[];
  vendors: MarketplaceVendor[];
  currentListing: MarketplaceListing | null;
  loading: boolean;
  fetchListings: (params?: Record<string, any>) => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  createListing: (data: Partial<MarketplaceListing>) => Promise<MarketplaceListing>;
  placeBid: (listingId: string, data: { amount: number; message?: string; estimated_completion?: string }) => Promise<void>;
  assignVendor: (listingId: string, vendorId: string) => Promise<void>;
  fetchVendors: () => Promise<void>;
  fetchVendor: (id: string) => Promise<MarketplaceVendor>;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  listings: [],
  vendors: [],
  currentListing: null,
  loading: false,

  fetchListings: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/marketplace/listings', { params });
      set({ listings: response.data.data || response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchListing: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/marketplace/listings/${id}`);
      set({ currentListing: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createListing: async (data) => {
    const response = await api.post('/marketplace/listings', data);
    set((state) => ({ listings: [response.data, ...state.listings] }));
    return response.data;
  },

  placeBid: async (listingId: string, data: { amount: number; message?: string; estimated_completion?: string }) => {
    await api.post(`/marketplace/listings/${listingId}/bid`, data);
    // Refresh listing
    const response = await api.get(`/marketplace/listings/${listingId}`);
    set((state) => ({
      currentListing: response.data,
      listings: state.listings.map((l) => (l.id === listingId ? response.data : l)),
    }));
  },

  assignVendor: async (listingId: string, vendorId: string) => {
    const response = await api.post(`/marketplace/listings/${listingId}/assign`, { vendor_id: vendorId });
    set((state) => ({
      currentListing: state.currentListing?.id === listingId ? response.data : state.currentListing,
      listings: state.listings.map((l) => (l.id === listingId ? response.data : l)),
    }));
  },

  fetchVendors: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/marketplace/vendors');
      set({ vendors: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchVendor: async (id: string) => {
    const response = await api.get(`/marketplace/vendors/${id}`);
    return response.data;
  },
}));
