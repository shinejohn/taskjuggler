// ============================================================
// MCP TOOL REGISTRATIONS
// ============================================================
// These tools are what Claude/Cursor/any MCP client calls
// to audit pages and drive the fix loop.
// ============================================================

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PageAuditorService } from '../services/auditor.js';
import { loadApps, upsertApp, addPageToApp, getAllPages } from '../config/apps.js';
import { FullAuditReport, FixableIssue, AppConfig } from '../types.js';
import fs from 'fs';

// Shared state
let auditor: PageAuditorService | null = null;
let lastReport: FullAuditReport | null = null;
let currentIssues: FixableIssue[] = [];

function getAuditor(): PageAuditorService {
  if (!auditor) auditor = new PageAuditorService();
  return auditor;
}

export function registerTools(server: McpServer): void {

  // ============================================================
  // TOOL: sitehealth_list_apps
  // ============================================================
  server.registerTool(
    'sitehealth_list_apps',
    {
      title: 'List All Configured Apps',
      description: `List all web applications and their pages configured for testing.
Returns the full registry of apps, their base URLs, and all pages/routes to audit.
Use this first to see what can be tested.`,
      inputSchema: {
        tags: z.string().optional().describe('Comma-separated tags to filter by (e.g., "publishing,public")'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ tags }) => {
      const apps = loadApps();
      const tagList = tags?.split(',').map(t => t.trim());
      const filtered = tagList ? apps.filter(a => a.tags?.some(t => tagList.includes(t))) : apps;
      const totalPages = filtered.reduce((sum, a) => sum + a.pages.length, 0);

      const summary = filtered.map(a => ({
        name: a.name,
        baseUrl: a.baseUrl,
        tags: a.tags || [],
        pageCount: a.pages.length,
        pages: a.pages.map(p => ({ path: p.path, name: p.name, requiresAuth: p.requiresAuth || false })),
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ apps: summary, totalApps: filtered.length, totalPages }, null, 2),
        }],
      };
    }
  );

  // ============================================================
  // TOOL: sitehealth_add_app
  // ============================================================
  server.registerTool(
    'sitehealth_add_app',
    {
      title: 'Add or Update an App',
      description: `Register a new web application for testing, or update an existing one.
Provide the app name, base URL, and list of pages to audit.
This is how you add new platforms and apps to the testing registry.`,
      inputSchema: {
        name: z.string().describe('App name (e.g., "My New App")'),
        baseUrl: z.string().url().describe('Base URL (e.g., "http://localhost:3000")'),
        pages: z.string().describe('JSON array of pages: [{"path":"/","name":"Home"},{"path":"/about","name":"About"}]'),
        tags: z.string().optional().describe('Comma-separated tags (e.g., "publishing,public")'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ name, baseUrl, pages, tags }) => {
      const pageList = JSON.parse(pages);
      const app: AppConfig = {
        name, baseUrl, pages: pageList,
        tags: tags?.split(',').map(t => t.trim()),
      };
      const allApps = upsertApp(app);
      return {
        content: [{
          type: 'text',
          text: `App "${name}" registered with ${pageList.length} pages. Total apps: ${allApps.length}`,
        }],
      };
    }
  );

  // ============================================================
  // TOOL: sitehealth_audit_page
  // ============================================================
  server.registerTool(
    'sitehealth_audit_page',
    {
      title: 'Audit a Single Page',
      description: `Run exhaustive interactive element testing on a single page.
Discovers every link, button, menu, dropdown, input, checkbox, tab, modal trigger,
and other interactive element. Tests each one individually and reports what works
and what doesn't.

Returns: Element count, pass/fail/warning for each element, details of failures.
For failures: includes what was clicked, what happened (or didn't), console errors,
network errors, and screenshots.`,
      inputSchema: {
        url: z.string().describe('Full URL to audit (e.g., "http://localhost:8000/articles")'),
        pageName: z.string().optional().describe('Human-readable page name'),
        appName: z.string().optional().describe('App this page belongs to'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ url, pageName, appName }) => {
      const a = getAuditor();
      await a.init();
      try {
        const result = await a.auditPage(url, pageName || url, appName || 'Manual');

        // Store for follow-up queries
        lastReport = {
          runId: `single-${Date.now()}`,
          startTime: result.timestamp, endTime: new Date().toISOString(),
          durationMs: result.loadTimeMs, pages: [result],
          overallSummary: result.summary,
        };
        currentIssues = a.extractFixableIssues(lastReport);

        // Format response
        const failures = result.elements.filter(e => e.status === 'FAIL' || e.status === 'ERROR');
        const response = {
          page: result.name,
          url: result.url,
          loadStatus: result.loadStatus,
          summary: result.summary,
          failures: failures.map(f => ({
            elementType: f.elementType,
            label: f.label,
            selector: f.selector,
            details: f.details,
            consoleErrors: f.consoleErrors,
            networkErrors: f.networkErrors,
          })),
          warnings: result.elements.filter(e => e.status === 'WARNING').map(w => ({
            elementType: w.elementType, label: w.label, details: w.details,
          })),
        };

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2),
          }],
        };
      } finally {
        await a.cleanup();
      }
    }
  );

  // ============================================================
  // TOOL: sitehealth_audit_all
  // ============================================================
  server.registerTool(
    'sitehealth_audit_all',
    {
      title: 'Audit All Configured Pages',
      description: `Run exhaustive element testing across ALL configured pages for all apps
(or filtered by tags). This is the full sweep — every page, every element, every click.

Returns: Complete report with per-page summaries and all failures.`,
      inputSchema: {
        tags: z.string().optional().describe('Filter to specific tags (e.g., "publishing")'),
        appName: z.string().optional().describe('Filter to a specific app name'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ tags, appName }) => {
      let apps = loadApps();
      if (appName) apps = apps.filter(a => a.name === appName);

      const a = getAuditor();
      await a.init();
      try {
        const tagList = tags?.split(',').map(t => t.trim());
        const report = await a.auditAll(apps, tagList);

        lastReport = report;
        currentIssues = a.extractFixableIssues(report);

        // Save report
        fs.writeFileSync(`./audit-reports/${report.runId}.json`, JSON.stringify(report, null, 2));

        // Compact summary
        const response = {
          runId: report.runId,
          duration: `${(report.durationMs / 1000).toFixed(1)}s`,
          overallSummary: report.overallSummary,
          totalIssues: currentIssues.length,
          pageResults: report.pages.map(p => ({
            app: p.app, page: p.name, url: p.url,
            loadStatus: p.loadStatus,
            summary: p.summary,
            failureCount: p.elements.filter(e => e.status === 'FAIL' || e.status === 'ERROR').length,
          })),
          issuesByCategory: currentIssues.reduce((acc, i) => {
            acc[i.fixCategory] = (acc[i.fixCategory] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        };

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2),
          }],
        };
      } finally {
        await a.cleanup();
      }
    }
  );

  // ============================================================
  // TOOL: sitehealth_get_failures
  // ============================================================
  server.registerTool(
    'sitehealth_get_failures',
    {
      title: 'Get Current Failures',
      description: `Get the list of all failures from the last audit run.
Each failure includes: element type, label, selector, error details,
console errors, network errors, and a fix category to help the AI
understand what kind of fix is needed.

Fix categories: dead-link, dead-button, js-error, network-error,
missing-handler, empty-form, broken-navigation, accessibility, unknown.`,
      inputSchema: {
        category: z.string().optional().describe('Filter by fix category (e.g., "dead-button")'),
        app: z.string().optional().describe('Filter by app name'),
        page: z.string().optional().describe('Filter by page name'),
        limit: z.number().int().min(1).max(50).default(20).describe('Max results'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ category, app, page, limit }) => {
      let issues = currentIssues.filter(i => !i.resolved);
      if (category) issues = issues.filter(i => i.fixCategory === category);
      if (app) issues = issues.filter(i => i.app === app);
      if (page) issues = issues.filter(i => i.page === page);

      const total = issues.length;
      issues = issues.slice(0, limit);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            totalUnresolved: total,
            returned: issues.length,
            issues: issues.map(i => ({
              issueId: i.issueId,
              app: i.app,
              page: i.page,
              pageUrl: i.pageUrl,
              elementType: i.elementType,
              label: i.label,
              selector: i.selector,
              fixCategory: i.fixCategory,
              details: i.details,
              consoleErrors: i.consoleErrors,
              networkErrors: i.networkErrors,
            })),
          }, null, 2),
        }],
      };
    }
  );

  // ============================================================
  // TOOL: sitehealth_get_fix_prompt
  // ============================================================
  server.registerTool(
    'sitehealth_get_fix_prompt',
    {
      title: 'Get AI Fix Prompt for an Issue',
      description: `Generate a detailed prompt that can be sent to an AI coding assistant
(Claude Code, Cursor, etc.) to fix a specific issue. The prompt includes the exact
element that failed, what happened, error details, and the suggested fix approach.

This is the bridge between "audit found a problem" and "AI fixes the problem".`,
      inputSchema: {
        issueId: z.string().describe('The issue ID from sitehealth_get_failures'),
        projectRoot: z.string().optional().describe('Path to the project source code'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ issueId, projectRoot }) => {
      const issue = currentIssues.find(i => i.issueId === issueId);
      if (!issue) {
        return { content: [{ type: 'text', text: `Issue ${issueId} not found` }] };
      }

      const prompt = buildFixPrompt(issue, projectRoot || '.');

      return {
        content: [{ type: 'text', text: prompt }],
      };
    }
  );

  // ============================================================
  // TOOL: sitehealth_mark_resolved
  // ============================================================
  server.registerTool(
    'sitehealth_mark_resolved',
    {
      title: 'Mark Issue as Resolved',
      description: `Mark a specific issue as resolved after a fix has been applied.
Use this after fixing the code and before re-running the audit to verify.`,
      inputSchema: {
        issueId: z.string().describe('The issue ID to mark resolved'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ issueId }) => {
      const issue = currentIssues.find(i => i.issueId === issueId);
      if (!issue) {
        return { content: [{ type: 'text', text: `Issue ${issueId} not found` }] };
      }
      issue.resolved = true;
      const remaining = currentIssues.filter(i => !i.resolved).length;
      return {
        content: [{
          type: 'text',
          text: `Issue ${issueId} marked resolved. ${remaining} issues remaining.`,
        }],
      };
    }
  );

  // ============================================================
  // TOOL: sitehealth_verify_fix
  // ============================================================
  server.registerTool(
    'sitehealth_verify_fix',
    {
      title: 'Verify a Fix',
      description: `Re-audit a specific page to verify that fixes have been applied.
Compares the new results against the previous failures to confirm they're resolved.`,
      inputSchema: {
        pageUrl: z.string().describe('The page URL to re-test'),
        pageName: z.string().optional().describe('Page name'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ pageUrl, pageName }) => {
      // Get previous failures for this page
      const prevFailures = currentIssues.filter(i => i.pageUrl === pageUrl && !i.resolved);

      // Re-audit
      const a = getAuditor();
      await a.init();
      try {
        const result = await a.auditPage(pageUrl, pageName || pageUrl, 'Verification');
        const newFailures = result.elements.filter(e => e.status === 'FAIL' || e.status === 'ERROR');

        // Check which previous issues are now fixed
        const fixed: string[] = [];
        const stillBroken: string[] = [];
        const newIssues: string[] = [];

        for (const prev of prevFailures) {
          const stillFailing = newFailures.find(f => f.selector === prev.selector || f.label === prev.label);
          if (stillFailing) {
            stillBroken.push(`${prev.label} — ${prev.details}`);
          } else {
            fixed.push(prev.label);
            prev.resolved = true;
          }
        }

        // Any new failures that weren't in previous?
        for (const nf of newFailures) {
          const wasPrevious = prevFailures.find(p => p.selector === nf.selector || p.label === nf.label);
          if (!wasPrevious) {
            newIssues.push(`${nf.label} — ${nf.details}`);
          }
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              verification: 'complete',
              previousFailures: prevFailures.length,
              nowFixed: fixed.length,
              stillBroken: stillBroken.length,
              newRegressions: newIssues.length,
              details: {
                fixed,
                stillBroken,
                newRegressions: newIssues,
              },
              currentSummary: result.summary,
            }, null, 2),
          }],
        };
      } finally {
        await a.cleanup();
      }
    }
  );
}

// ============================================================
// HELPER: Build a fix prompt for AI
// ============================================================
function buildFixPrompt(issue: FixableIssue, projectRoot: string): string {
  const fixStrategies: Record<string, string> = {
    'dead-link': `This is a broken link. The href points to a page that returns an error.
Fix approach: Check the route definition, ensure the controller/page exists, or update the href.`,
    'dead-button': `This button/element does nothing when clicked. No event handler fires.
Fix approach: Check if an onClick/event handler is attached. In React/Inertia, check the component
for missing onClick props, broken event wiring, or conditional rendering that removes functionality.`,
    'js-error': `Clicking this element causes a JavaScript console error.
Fix approach: Look at the error message below. Common causes: undefined variables, missing imports,
null reference errors, or API response handling issues.`,
    'network-error': `Clicking this element triggers a failed network request (4xx/5xx).
Fix approach: Check the API endpoint, verify the route exists, check authentication/CSRF,
and ensure the controller method handles the request correctly.`,
    'empty-form': `This form element (select/dropdown) has no options or all options are disabled.
Fix approach: Check that options are being populated — usually from an API call or prop.
Verify the data source returns results.`,
    'broken-navigation': `This element navigates to a page that fails to load properly.
Fix approach: Check the destination route, ensure the controller returns a valid response,
and verify the Inertia page component exists.`,
    'missing-handler': `This element appears to be missing its event handler entirely.
Fix approach: In the React component, ensure the element has an onClick or onChange handler attached.`,
  };

  return `
# SiteHealth Fix Request

## Issue Details
- **App**: ${issue.app}
- **Page**: ${issue.page} (${issue.pageUrl})
- **Element**: [${issue.elementType}] "${issue.label}"
- **Selector**: \`${issue.selector}\`
- **Category**: ${issue.fixCategory}

## What Happened
${issue.details}

${issue.consoleErrors.length > 0 ? `## Console Errors\n${issue.consoleErrors.map(e => `- \`${e}\``).join('\n')}` : ''}

${issue.networkErrors.length > 0 ? `## Network Errors\n${issue.networkErrors.map(e => `- \`${e}\``).join('\n')}` : ''}

## Fix Strategy
${fixStrategies[issue.fixCategory] || 'Investigate the element and determine why it fails to respond.'}

## Instructions
1. Find the component/file that renders this element in the project at \`${projectRoot}\`
2. Identify the root cause based on the error details above
3. Apply the fix
4. The fix will be verified by re-running the page audit

## Context
This issue was found by the SiteHealth exhaustive element auditor, which tests
every interactive element on every page. The element was clicked and the auditor
detected the failure described above.
`.trim();
}
