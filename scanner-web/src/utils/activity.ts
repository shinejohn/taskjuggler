import api from '@/utils/api'

export const activityLogger = {
  async log(action: string, details: Record<string, any>) {
    try {
      await api.post('/api/activity', {
        app: 'scanner',
        action,
        details,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      // Don't break app if logging fails - just log to console
      console.error('Failed to log activity:', error)
    }
  },

  siteCreated: (site: any) => 
    activityLogger.log('site.created', { site_id: site.id, site_name: site.name, url: site.url }),
  
  siteDeleted: (siteId: number) => 
    activityLogger.log('site.deleted', { site_id: siteId }),
  
  scanStarted: (scanId: number, siteId: number) => 
    activityLogger.log('scan.started', { scan_id: scanId, site_id: siteId }),
  
  scanCompleted: (scanId: number, healthScore: number, issueCount: number) => 
    activityLogger.log('scan.completed', { scan_id: scanId, health_score: healthScore, issue_count: issueCount }),
  
  fixGenerated: (issueId: number) => 
    activityLogger.log('fix.generated', { issue_id: issueId }),
  
  taskCreated: (issueId: number, taskId: number) => 
    activityLogger.log('task.created', { issue_id: issueId, task_id: taskId }),
  
  issueStatusChanged: (issueId: number, oldStatus: string, newStatus: string) => 
    activityLogger.log('issue.status_changed', { issue_id: issueId, old_status: oldStatus, new_status: newStatus }),
}

