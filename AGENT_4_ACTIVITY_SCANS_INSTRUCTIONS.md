# Agent 4: Activity Logging & Scans Instructions
## Scanner Platform Integration - Parallel Stream 3

**Priority:** 🟢 MEDIUM - Can run parallel after Agent 1  
**Estimated Time:** 1-2 hours  
**Depends On:** Agent 1 (auth store, types, API client)

---

## OBJECTIVE

Implement activity logging and update scans store:
- Activity logger utility
- Activity logging in scans store
- Team context in scans
- Notification integration

---

## PREREQUISITES

✅ Agent 1 must be complete (types, auth store, API client)

---

## TASKS

### Task 4.1: Create Activity Logger

**File:** `scanner-web/src/utils/activity.ts` (NEW)

**Requirements:**
1. Create activity logger utility
2. Log function that posts to `/api/activity`
3. Convenience methods for common actions
4. Error handling (don't break app if logging fails)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 5.1

**Key Implementation:**
```typescript
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
```

---

### Task 4.2: Update Scans Store

**File:** `scanner-web/src/stores/scans.ts` (MODIFY)

**Requirements:**
1. Import activityLogger
2. Import notificationsStore
3. Add activity logging to scan lifecycle
4. Add notification on scan complete
5. Update scan types with team_id

**Key Changes:**
```typescript
import { activityLogger } from '@/utils/activity'
import { useNotificationsStore } from '@/stores/notifications'

export const useScansStore = defineStore('scans', () => {
  const notificationsStore = useNotificationsStore()
  
  async function createScan(data: CreateScanRequest) {
    // ... existing code ...
    const scan = response.data.data
    
    // Log activity
    await activityLogger.scanStarted(scan.id, data.site_id)
    
    return scan
  }
  
  async function updateScanStatus(scanId: number, status: string) {
    // ... existing code ...
    
    if (status === 'completed') {
      await activityLogger.scanCompleted(
        scanId,
        scan.health_score,
        scan.issue_count
      )
      
      // Send notification
      await notificationsStore.notifyScanComplete(scanId, {
        health_score: scan.health_score,
        issue_count: scan.issue_count,
        site_name: scan.site?.name || 'Unknown',
      })
    }
  }
})
```

---

### Task 4.3: Update Dashboard Store

**File:** `scanner-web/src/stores/dashboard.ts` (MODIFY)

**Requirements:**
1. Add team context filtering
2. Update stats to be team-scoped
3. Add usage stats integration
4. Import usageStore

**Key Changes:**
```typescript
import { useUsageStore } from '@/stores/usage'
import { useAuthStore } from '@/stores/auth'

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()
  const usageStore = useUsageStore()
  
  async function fetchDashboard() {
    // API automatically filters by team via X-Team-ID header
    const response = await api.get('/api/scanner/dashboard')
    // ... update stats
  }
})
```

---

## DELIVERABLES

1. ✅ `src/utils/activity.ts` - New file
2. ✅ `src/stores/scans.ts` - Updated with activity logging
3. ✅ `src/stores/dashboard.ts` - Updated with team context

---

## TESTING CHECKLIST

- [ ] Activity logger doesn't break app on error
- [ ] Activity logged for scan start
- [ ] Activity logged for scan complete
- [ ] Notification sent on scan complete
- [ ] Dashboard filters by team
- [ ] Usage stats integrated

---

## COMMON PITFALLS

1. **Activity API might not exist** - Handle gracefully
2. **Don't await activity logging** - Can be fire-and-forget
3. **Check scan exists** - Before logging completion

---

## DEPENDENCIES

- Agent 1: auth store, types, API client
- Agent 3: notifications store (for scan complete notifications)

---

## COMPLETION CRITERIA

✅ Activity logger functional  
✅ Scans store logs activities  
✅ Dashboard store team-scoped  
✅ Notifications sent on scan complete  

