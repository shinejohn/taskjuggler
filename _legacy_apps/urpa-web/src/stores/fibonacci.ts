import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { FibonacciLink } from '@/types/integration';

export const useFibonacciStore = defineStore('fibonacci', () => {
  const crmLinked = ref(false);
  const publishingLinked = ref(false);
  const link = ref<FibonacciLink | null>(null);
  const faqs = ref<any[]>([]);
  const projects = ref<any[]>([]);
  const businessInfo = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function checkStatus() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/integrations/fibonacci/status');
      const data = response.data.data || response.data;
      crmLinked.value = data.crm_linked || false;
      publishingLinked.value = data.publishing_linked || false;
      link.value = data.link || null;
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to check status';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function linkCRM(businessId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/integrations/fibonacci/crm/link', {
        business_id: businessId,
      });
      const result = response.data.data || response.data;
      crmLinked.value = true;
      link.value = result;
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to link CRM';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function linkPublishing(teamId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/integrations/fibonacci/publishing/link', {
        team_id: teamId,
      });
      const result = response.data.data || response.data;
      publishingLinked.value = true;
      link.value = result;
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to link Publishing';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFAQs(businessId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/urpa/integrations/fibonacci/crm/business/${businessId}/faqs`);
      faqs.value = response.data.data || response.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load FAQs';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function syncFAQs(businessId: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.post(`/urpa/integrations/fibonacci/crm/business/${businessId}/sync-faqs`);
      await fetchFAQs(businessId);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to sync FAQs';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProjects(teamId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/urpa/integrations/fibonacci/publishing/teams/${teamId}/projects`);
      projects.value = response.data.data || response.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load projects';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createContentRequest(teamId: string, data: {
    type: string;
    topic: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/urpa/integrations/fibonacci/publishing/teams/${teamId}/projects`, data);
      const result = response.data.data || response.data;
      projects.value.unshift(result);
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create content request';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchBusinessInfo(businessId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/urpa/integrations/fibonacci/crm/business/${businessId}`);
      const data = response.data.data || response.data;
      businessInfo.value = data;
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load business info';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    crmLinked,
    publishingLinked,
    link,
    faqs,
    projects,
    businessInfo,
    loading,
    error,
    checkStatus,
    linkCRM,
    linkPublishing,
    fetchFAQs,
    syncFAQs,
    fetchProjects,
    createContentRequest,
    fetchBusinessInfo,
  };
});

