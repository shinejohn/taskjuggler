import { defineStore } from 'pinia';
import { ref } from 'vue';
import { scansApi } from '@/api/scans';
import type { Scan, CreateScanRequest } from '@/types';

export const useScansStore = defineStore('scans', () => {
  const scans = ref<Scan[]>([]);
  const currentScan = ref<Scan | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchScansBySite(siteId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await scansApi.getBySite(siteId);
      scans.value = response.data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch scans';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchScan(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await scansApi.getById(id);
      currentScan.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch scan';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createScan(data: CreateScanRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await scansApi.create(data);
      scans.value.unshift(response.data.data);
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create scan';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function downloadReport(id: number) {
    try {
      const response = await scansApi.getReport(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scan-report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to download report';
      throw err;
    }
  }

  return {
    scans,
    currentScan,
    loading,
    error,
    fetchScansBySite,
    fetchScan,
    createScan,
    downloadReport,
  };
});
