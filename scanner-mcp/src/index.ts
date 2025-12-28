import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import axios from 'axios'

const API_URL = process.env.SCANNER_API_URL || 'http://localhost:8000/api'
const API_TOKEN = process.env.SCANNER_API_TOKEN || ''

const server = new Server(
  {
    name: 'sitehealth-scanner',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'scan_website',
      description: 'Scan a website for accessibility, SEO, performance, and security issues',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the website to scan',
          },
          site_name: {
            type: 'string',
            description: 'Name for the site',
          },
          max_pages: {
            type: 'number',
            description: 'Maximum number of pages to scan (default: 50)',
          },
        },
        required: ['url', 'site_name'],
      },
    },
    {
      name: 'get_scan_results',
      description: 'Get results from a completed scan',
      inputSchema: {
        type: 'object',
        properties: {
          scan_id: {
            type: 'number',
            description: 'The ID of the scan',
          },
        },
        required: ['scan_id'],
      },
    },
    {
      name: 'list_sites',
      description: 'List all sites being monitored',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_site_issues',
      description: 'Get all issues for a specific site',
      inputSchema: {
        type: 'object',
        properties: {
          site_id: {
            type: 'number',
            description: 'The ID of the site',
          },
        },
        required: ['site_id'],
      },
    },
    {
      name: 'generate_fix',
      description: 'Generate a code fix for a specific issue',
      inputSchema: {
        type: 'object',
        properties: {
          issue_id: {
            type: 'number',
            description: 'The ID of the issue',
          },
        },
        required: ['issue_id'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'scan_website': {
        // Create or get site
        let siteResponse
        try {
          siteResponse = await apiClient.post('/scanner/sites', {
            name: args.site_name,
            url: args.url,
            max_pages: args.max_pages || 50,
          })
        } catch (error: any) {
          // Site might already exist, try to get it
          const sitesResponse = await apiClient.get('/scanner/sites')
          const sites = sitesResponse.data.data || []
          const existingSite = sites.find((s: any) => s.url === args.url)
          if (existingSite) {
            siteResponse = { data: { data: existingSite } }
          } else {
            throw error
          }
        }

        const site = siteResponse.data.data

        // Start scan
        const scanResponse = await apiClient.post(`/scanner/sites/${site.id}/scan`)
        const scan = scanResponse.data.data

        return {
          content: [
            {
              type: 'text',
              text: `Scan started for ${args.url}. Scan ID: ${scan.id}. Status: ${scan.status}`,
            },
          ],
        }
      }

      case 'get_scan_results': {
        const response = await apiClient.get(`/scanner/scans/${args.scan_id}`)
        const scan = response.data.data

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: scan.status,
                health_score: scan.health_score,
                pages_scanned: scan.pages_scanned,
                issue_count: scan.issue_count,
                category_scores: scan.category_scores,
              }, null, 2),
            },
          ],
        }
      }

      case 'list_sites': {
        const response = await apiClient.get('/scanner/sites')
        const sites = response.data.data || []

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sites.map((s: any) => ({
                id: s.id,
                name: s.name,
                url: s.url,
                health_score: s.health_score,
                issue_count: s.issue_count,
              })), null, 2),
            },
          ],
        }
      }

      case 'get_site_issues': {
        const response = await apiClient.get('/scanner/issues', {
          params: { site_id: args.site_id },
        })
        const issues = response.data.data || []

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issues, null, 2),
            },
          ],
        }
      }

      case 'generate_fix': {
        const response = await apiClient.post(`/scanner/issues/${args.issue_id}/fix`)
        const fix = response.data.data

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(fix, null, 2),
            },
          ],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('SiteHealth Scanner MCP server running on stdio')
}

main().catch(console.error)
