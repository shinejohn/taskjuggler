# Agent 3: Task & Notification Integration Instructions
## Scanner Platform Integration - Parallel Stream 2

**Priority:** 🟢 HIGH - Can run parallel after Agent 1  
**Estimated Time:** 2-3 hours  
**Depends On:** Agent 1 (auth store, types, API client)

---

## OBJECTIVE

Implement task creation from issues and notification system:
- Tasks store for creating tasks from issues
- Notifications store for sending notifications
- Task creation modal component
- Integration with issues store

---

## PREREQUISITES

✅ Agent 1 must be complete (types, auth store, API client)

---

## TASKS

### Task 3.1: Create Tasks Store

**File:** `scanner-web/src/stores/tasks.ts` (NEW)

**Requirements:**
1. Create task from single issue (createTaskFromIssue)
2. Bulk create tasks from multiple issues (createTasksFromIssues)
3. Build task description from issue data (buildTaskDescription)
4. Map severity to priority (mapSeverityToPriority)
5. Include issue metadata in task

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 4.1

**Key Implementation:**
```typescript
import { defineStore } from 'pinia'
import api from '@/utils/api'
import type { Issue } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  
  async function createTaskFromIssue(issue: Issue, options?: {
    assignee_id?: number
    project_id?: number
    due_date?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
  }) {
    const taskData = {
      title: `Fix: ${issue.title}`,
      description: buildTaskDescription(issue),
      type: 'bug',
      priority: mapSeverityToPriority(issue.severity),
      labels: ['accessibility', 'scanner-generated'],
      metadata: {
        source: 'scanner',
        issue_id: issue.id,
        scan_id: issue.scan_id,
        site_id: issue.site_id,
        category: issue.category,
        wcag_criteria: issue.wcag_criteria,
      },
      ...options,
    }

    const response = await api.post('/api/tasks', taskData)
    return response.data.data
  }

  async function createTasksFromIssues(issues: Issue[], options?: {
    project_id?: number
    assignee_id?: number
  }) {
    const tasks = issues.map(issue => ({
      title: `Fix: ${issue.title}`,
      description: buildTaskDescription(issue),
      type: 'bug',
      priority: mapSeverityToPriority(issue.severity),
      labels: ['accessibility', 'scanner-generated'],
      metadata: {
        source: 'scanner',
        issue_id: issue.id,
        scan_id: issue.scan_id,
        site_id: issue.site_id,
      },
      ...options,
    }))

    const response = await api.post('/api/tasks/bulk', { tasks })
    return response.data.data
  }

  function buildTaskDescription(issue: Issue): string {
    let description = `## Issue Details\n\n`
    description += `**Category:** ${issue.category}\n`
    description += `**Severity:** ${issue.severity}\n`
    description += `**Page:** ${issue.page_url}\n\n`
    description += `## Problem\n\n${issue.message}\n\n`
    
    if (issue.selector) {
      description += `**Selector:** \`${issue.selector}\`\n\n`
    }
    
    if (issue.html_context) {
      description += `## HTML Context\n\n\`\`\`html\n${issue.html_context}\n\`\`\`\n\n`
    }
    
    if (issue.wcag_criteria?.length) {
      description += `## WCAG Criteria\n\n${issue.wcag_criteria.join(', ')}\n\n`
    }
    
    if (issue.fix_code) {
      description += `## Suggested Fix\n\n\`\`\`html\n${issue.fix_code}\n\`\`\`\n\n`
      if (issue.fix_explanation) {
        description += `**Explanation:** ${issue.fix_explanation}\n`
      }
    }
    
    return description
  }

  function mapSeverityToPriority(severity: string): string {
    const map: Record<string, string> = {
      critical: 'urgent',
      serious: 'high',
      moderate: 'medium',
      minor: 'low',
    }
    return map[severity] ?? 'medium'
  }

  return {
    createTaskFromIssue,
    createTasksFromIssues,
  }
})
```

---

### Task 3.2: Create Notifications Store

**File:** `scanner-web/src/stores/notifications.ts` (NEW)

**Requirements:**
1. Send notification when scan completes (notifyScanComplete)
2. Send notification for critical issues (notifyCriticalIssues)
3. Send team notification (notifyTeam)
4. Support multiple channels (in_app, email, slack)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 4.2

**Key Implementation:**
```typescript
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useNotificationsStore = defineStore('notifications', () => {
  
  async function notifyScanComplete(scanId: number, results: {
    health_score: number
    issue_count: number
    site_name: string
  }) {
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
    })
  }

  async function notifyCriticalIssues(siteId: number, issues: any[]) {
    if (issues.length === 0) return

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
    })
  }

  async function notifyTeam(teamId: number, message: {
    title: string
    body: string
    type: string
    data?: any
  }) {
    await api.post(`/api/teams/${teamId}/notifications`, message)
  }

  return {
    notifyScanComplete,
    notifyCriticalIssues,
    notifyTeam,
  }
})
```

---

### Task 3.3: Update Issues Store

**File:** `scanner-web/src/stores/issues.ts` (MODIFY)

**Requirements:**
1. Import tasksStore
2. Add method to create task from issue
3. Update issue with task_id when task created
4. Add bulk task creation method

**Key Changes:**
```typescript
import { useTasksStore } from '@/stores/tasks'

export const useIssuesStore = defineStore('issues', () => {
  const tasksStore = useTasksStore()
  
  async function createTaskFromIssue(issueId: number, options?: any) {
    const issue = issues.value.find(i => i.id === issueId)
    if (!issue) throw new Error('Issue not found')
    
    const task = await tasksStore.createTaskFromIssue(issue, options)
    
    // Update issue with task_id
    const index = issues.value.findIndex(i => i.id === issueId)
    if (index !== -1) {
      issues.value[index].task_id = task.id
    }
    
    return task
  }
  
  // ... rest of store
})
```

---

### Task 3.4: Create Task Modal Component

**File:** `scanner-web/src/components/scanner/CreateTaskModal.vue` (NEW)

**Requirements:**
1. Form for creating task from issue
2. Fields: project selection, assignee selection, priority, due date
3. Show issue details preview
4. Submit handler calls tasksStore.createTaskFromIssue
5. Emit events: @close, @created
6. Use design system components (Modal, Button, Input, Select)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 4.3

**Key Implementation:**
```vue
<template>
  <Modal :is-open="isOpen" title="Create Task from Issue" @close="$emit('close')">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Project</label>
        <Select v-model="form.project_id" :options="projects" />
      </div>
      
      <div class="form-group">
        <label>Assignee</label>
        <Select v-model="form.assignee_id" :options="assignees" />
      </div>
      
      <div class="form-group">
        <label>Priority</label>
        <Select v-model="form.priority" :options="priorityOptions" />
      </div>
      
      <div class="form-group">
        <label>Due Date</label>
        <Input type="date" v-model="form.due_date" />
      </div>
      
      <div class="issue-preview">
        <h4>Issue Details</h4>
        <p><strong>{{ issue.title }}</strong></p>
        <p>{{ issue.message }}</p>
      </div>
      
      <div class="modal-actions">
        <Button variant="ghost" @click="$emit('close')">Cancel</Button>
        <Button type="submit" :loading="loading">Create Task</Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import type { Issue } from '@/types'

interface Props {
  isOpen: boolean
  issue: Issue
}

const props = defineProps<Props>()
const emit = defineEmits<['close', 'created']>()

const tasksStore = useTasksStore()
const loading = ref(false)

const form = ref({
  project_id: undefined as number | undefined,
  assignee_id: undefined as number | undefined,
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  due_date: undefined as string | undefined,
})

async function handleSubmit() {
  loading.value = true
  try {
    const task = await tasksStore.createTaskFromIssue(props.issue, form.value)
    emit('created', task)
    emit('close')
  } finally {
    loading.value = false
  }
}
</script>
```

---

## DELIVERABLES

1. ✅ `src/stores/tasks.ts` - New file
2. ✅ `src/stores/notifications.ts` - New file
3. ✅ `src/stores/issues.ts` - Updated with task integration
4. ✅ `src/components/scanner/CreateTaskModal.vue` - New file

---

## TESTING CHECKLIST

- [ ] Tasks store creates task from issue correctly
- [ ] Task description includes all issue details
- [ ] Severity maps to priority correctly
- [ ] Bulk task creation works
- [ ] Notifications store sends notifications
- [ ] Issues store updates with task_id
- [ ] CreateTaskModal form works
- [ ] Modal emits events correctly

---

## COMMON PITFALLS

1. **Task API might not exist yet** - Handle 404 gracefully
2. **Issue might not have all fields** - Check for optional fields
3. **Priority mapping** - Handle unknown severities
4. **Notification channels** - API might not support all channels

---

## DEPENDENCIES

- Agent 1: auth store, types, API client
- Agent 7: Backend API endpoints (can mock for now)

---

## COMPLETION CRITERIA

✅ Tasks store functional  
✅ Notifications store functional  
✅ Issues store integrated with tasks  
✅ CreateTaskModal component working  

**Once complete, Agent 6 can integrate CreateTaskModal into IssueCard.**

