// ============================================================
// SITEHEALTH API-BACKED TOOLS (Scanner/Backend)
// ============================================================
// These tools call the taskjuggler-api scanner endpoints.
// Requires SCANNER_API_URL and SCANNER_API_TOKEN.
// ============================================================

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import axios from 'axios';

const API_URL = process.env.SCANNER_API_URL || 'http://localhost:8000/api';
const API_TOKEN = process.env.SCANNER_API_TOKEN || '';

function getApiClient() {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

export function registerApiTools(server: McpServer): void {
  // sitehealth_scan_website
  server.registerTool(
    'sitehealth_scan_website',
    {
      title: 'Scan a Website',
      description: 'Trigger a full site scan for accessibility, SEO, performance, and security. Uses the backend scanner worker.',
      inputSchema: {
        url: z.string().describe('The URL of the website to scan'),
        site_name: z.string().describe('Name for the site'),
        max_pages: z.number().optional().default(50).describe('Maximum number of pages to scan'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ url, site_name, max_pages }) => {
      const api = getApiClient();
      let siteResponse;
      try {
        siteResponse = await api.post('/scanner/sites', {
          name: site_name,
          url,
          max_pages: max_pages ?? 50,
        });
      } catch (e: any) {
        const sitesRes = await api.get('/scanner/sites');
        const sites = sitesRes.data.data || [];
        const existing = sites.find((s: any) => s.url === url);
        if (existing) siteResponse = { data: { data: existing } };
        else throw e;
      }
      const site = siteResponse.data.data;
      const scanRes = await api.post(`/scanner/sites/${site.id}/scan`);
      const scan = scanRes.data.data;
      return {
        content: [{ type: 'text' as const, text: `Scan started for ${url}. Scan ID: ${scan.id}. Status: ${scan.status}` }],
      };
    }
  );

  // sitehealth_scan_results
  server.registerTool(
    'sitehealth_scan_results',
    {
      title: 'Get Scan Results',
      description: 'Get results from a completed scan.',
      inputSchema: {
        scan_id: z.number().describe('The ID of the scan'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ scan_id }) => {
      const api = getApiClient();
      const res = await api.get(`/scanner/scans/${scan_id}`);
      const scan = res.data.data;
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            status: scan.status,
            health_score: scan.health_score,
            pages_scanned: scan.pages_scanned,
            issue_count: scan.issue_count,
            category_scores: scan.category_scores,
          }, null, 2),
        }],
      };
    }
  );

  // sitehealth_list_sites
  server.registerTool(
    'sitehealth_list_sites',
    {
      title: 'List Monitored Sites',
      description: 'List all sites being monitored.',
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      const api = getApiClient();
      const res = await api.get('/scanner/sites');
      const sites = res.data.data || [];
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(sites.map((s: any) => ({
            id: s.id,
            name: s.name,
            url: s.url,
            health_score: s.health_score,
            issue_count: s.issue_count,
          })), null, 2),
        }],
      };
    }
  );

  // sitehealth_site_issues
  server.registerTool(
    'sitehealth_site_issues',
    {
      title: 'Get Site Issues',
      description: 'Get all issues for a specific site.',
      inputSchema: {
        site_id: z.number().describe('The ID of the site'),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ site_id }) => {
      const api = getApiClient();
      const res = await api.get('/scanner/issues', { params: { site_id } });
      const issues = res.data.data || [];
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(issues, null, 2) }],
      };
    }
  );

  // sitehealth_generate_fix
  server.registerTool(
    'sitehealth_generate_fix',
    {
      title: 'Generate Fix for Issue',
      description: 'Generate a code fix for a specific issue (via backend AI).',
      inputSchema: {
        issue_id: z.number().describe('The ID of the issue'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ issue_id }) => {
      const api = getApiClient();
      const res = await api.post(`/scanner/issues/${issue_id}/fix`);
      const fix = res.data.data;
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(fix, null, 2) }],
      };
    }
  );
}
