import { defineStore } from 'pinia';
import { ref } from 'vue';
import { scansApi } from '@/api/scans';
import type { Scan, CreateScanRequest } from '@/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { activityLogger } from '@/utils/activity';
import { useNotificationsStore } from '@/stores/notifications';

export const useScansStore = defineStore('scans', () => {
  const scans = ref<Scan[]>([]);
  const currentScan = ref<Scan | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notificationsStore = useNotificationsStore();

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
      const scan = response.data.data;
      const previousScan = currentScan.value;
      currentScan.value = scan;
      
      // Check if scan status changed to completed
      if (scan.status === 'completed' && previousScan?.status !== 'completed') {
        // Log activity (fire-and-forget, don't await)
        activityLogger.scanCompleted(
          scan.id,
          scan.health_score,
          scan.issue_count
        ).catch(() => {
          // Error already handled in activityLogger
        });
        
        // Send notification (fire-and-forget, don't await)
        notificationsStore.notifyScanComplete(scan.id, {
          health_score: scan.health_score,
          issue_count: scan.issue_count,
          site_name: scan.site?.name || 'Unknown',
        }).catch(() => {
          // Error already handled in notificationsStore
        });
      }
      
      return scan;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch scan';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateScanStatus(scanId: number, status: string) {
    try {
      // Fetch the latest scan data
      const scan = await fetchScan(scanId);
      
      if (status === 'completed' && scan) {
        // Log activity (fire-and-forget, don't await)
        activityLogger.scanCompleted(
          scanId,
          scan.health_score,
          scan.issue_count
        ).catch(() => {
          // Error already handled in activityLogger
        });
        
        // Send notification (fire-and-forget, don't await)
        notificationsStore.notifyScanComplete(scanId, {
          health_score: scan.health_score,
          issue_count: scan.issue_count,
          site_name: scan.site?.name || 'Unknown',
        }).catch(() => {
          // Error already handled in notificationsStore
        });
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update scan status';
      throw err;
    }
  }

  async function createScan(data: CreateScanRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await scansApi.create(data);
      const scan = response.data.data;
      scans.value.unshift(scan);
      
      // Log activity (fire-and-forget, don't await)
      activityLogger.scanStarted(scan.id, data.site_id).catch(() => {
        // Error already handled in activityLogger
      });
      
      return scan;
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
    updateScanStatus,
    downloadReport,
  };
});
