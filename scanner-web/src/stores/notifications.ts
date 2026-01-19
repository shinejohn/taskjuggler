import { defineStore } from 'pinia';
import api from '@/utils/api';

export const useNotificationsStore = defineStore('notifications', () => {
  
  async function notifyScanComplete(scanId: number, results: {
    health_score: number;
    issue_count: number;
    site_name: string;
  }) {
    try {
      await api.post('/api/notifications', {
        type: 'scanner.scan_complete',
        title: `Scan Complete: ${results.site_name}`,
        message: `Health Score: ${results.health_score}/100 | ${results.issue_count} issues found`,
        data: {
          scan_id: scanId,
          health_score: results.health_score,
          issue_count: results.issue_count,
        },
        channels: ['in_app', 'email'],
      });
    } catch (error: any) {
      // Handle 404 gracefully if notification API doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('Notification API endpoint not available yet');
        return;
      }
      throw error;
    }
  }

  async function notifyCriticalIssues(siteId: number, issues: any[]) {
    if (issues.length === 0) return;

    try {
      await api.post('/api/notifications', {
        type: 'scanner.critical_issues',
        title: `Critical Issues Detected`,
        message: `${issues.length} critical accessibility issues require immediate attention`,
        data: {
          site_id: siteId,
          issue_ids: issues.map(i => i.id),
        },
        channels: ['in_app', 'email', 'slack'],
        priority: 'high',
      });
    } catch (error: any) {
      // Handle 404 gracefully if notification API doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('Notification API endpoint not available yet');
        return;
      }
      throw error;
    }
  }

  async function notifyTeam(teamId: number, message: {
    title: string;
    body: string;
    type: string;
    data?: any;
  }) {
    try {
      await api.post(`/api/teams/${teamId}/notifications`, message);
    } catch (error: any) {
      // Handle 404 gracefully if notification API doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('Team notification API endpoint not available yet');
        return;
      }
      throw error;
    }
  }

  return {
    notifyScanComplete,
    notifyCriticalIssues,
    notifyTeam,
  };
});



