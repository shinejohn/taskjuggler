import { defineStore } from 'pinia';
import api from '@/utils/api';
import type { Issue } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  
  interface CreateTaskOptions {
    assignee_id?: string;
    project_id?: string;
    due_date?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }

  function buildTaskPayload(issue: Issue, options?: CreateTaskOptions) {
    return {
      title: `Fix: ${issue.title}`,
      description: buildTaskDescription(issue),
      priority: options?.priority || mapSeverityToPriority(issue.severity),
      due_date: options?.due_date,
      tags: ['accessibility', 'scanner-generated'],
      owner_id: options?.assignee_id,
    };
  }

  async function createTask(issue: Issue, options?: CreateTaskOptions) {
    const payload = buildTaskPayload(issue, options);
    // Project tasks go through the Projects module so they get project + team linkage
    const response = options?.project_id
      ? await api.post(`/projects/${options.project_id}/tasks`, payload)
      : await api.post('/tasks', payload);
    return response.data?.data ?? response.data;
  }

  async function createTaskFromIssue(issue: Issue, options?: CreateTaskOptions) {
    return createTask(issue, options);
  }

  async function createTasksFromIssues(issues: Issue[], options?: CreateTaskOptions) {
    // Backend does not expose /tasks/bulk; create tasks one-by-one
    return Promise.all(issues.map(issue => createTask(issue, options)));
  }

  function buildTaskDescription(issue: Issue): string {
    let description = `## Issue Details\n\n`;
    description += `**Category:** ${issue.category}\n`;
    description += `**Severity:** ${issue.severity}\n`;
    description += `**Page:** ${issue.page_url}\n\n`;
    description += `## Problem\n\n${issue.message}\n\n`;
    
    if (issue.selector) {
      description += `**Selector:** \`${issue.selector}\`\n\n`;
    }
    
    if (issue.html_context) {
      description += `## HTML Context\n\n\`\`\`html\n${issue.html_context}\n\`\`\`\n\n`;
    }
    
    if (issue.wcag_criteria && issue.wcag_criteria.length > 0) {
      description += `## WCAG Criteria\n\n${issue.wcag_criteria.join(', ')}\n\n`;
    }
    
    if (issue.fix_code) {
      description += `## Suggested Fix\n\n\`\`\`html\n${issue.fix_code}\n\`\`\`\n\n`;
      if (issue.fix_explanation) {
        description += `**Explanation:** ${issue.fix_explanation}\n`;
      }
    }
    
    return description;
  }

  function mapSeverityToPriority(severity: string): 'low' | 'normal' | 'high' | 'urgent' {
    const map: Record<string, 'low' | 'normal' | 'high' | 'urgent'> = {
      critical: 'urgent',
      serious: 'high',
      moderate: 'normal',
      minor: 'low',
    };
    return map[severity] ?? 'normal';
  }

  return {
    createTaskFromIssue,
    createTasksFromIssues,
  };
});

