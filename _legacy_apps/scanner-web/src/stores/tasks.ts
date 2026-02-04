import { defineStore } from 'pinia';
import api from '@/utils/api';
import type { Issue } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  
  async function createTaskFromIssue(issue: Issue, options?: {
    assignee_id?: number;
    project_id?: number;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    const taskData = {
      title: `Fix: ${issue.title}`,
      description: buildTaskDescription(issue),
      type: 'bug',
      priority: options?.priority || mapSeverityToPriority(issue.severity),
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
    };

    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data;
    } catch (error: any) {
      // Handle 404 gracefully if task API doesn't exist yet
      if (error.response?.status === 404) {
        throw new Error('Task API endpoint not available yet');
      }
      throw error;
    }
  }

  async function createTasksFromIssues(issues: Issue[], options?: {
    project_id?: number;
    assignee_id?: number;
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
        category: issue.category,
        wcag_criteria: issue.wcag_criteria,
      },
      ...options,
    }));

    try {
      const response = await api.post('/tasks/bulk', { tasks });
      return response.data.data;
    } catch (error: any) {
      // Handle 404 gracefully if task API doesn't exist yet
      if (error.response?.status === 404) {
        throw new Error('Task API endpoint not available yet');
      }
      throw error;
    }
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

  function mapSeverityToPriority(severity: string): 'low' | 'medium' | 'high' | 'urgent' {
    const map: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
      critical: 'urgent',
      serious: 'high',
      moderate: 'medium',
      minor: 'low',
    };
    return map[severity] ?? 'medium';
  }

  return {
    createTaskFromIssue,
    createTasksFromIssues,
  };
});

