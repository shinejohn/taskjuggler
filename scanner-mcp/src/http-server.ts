/**
 * HTTP-based MCP Server for Public Access
 * Supports SSE (Server-Sent Events) transport for Cursor IDE
 */
import express from 'express'
import cors from 'cors'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import axios from 'axios'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const API_URL = process.env.SCANNER_API_URL || 'http://localhost:8000/api'

// In-memory store for API keys (in production, use database)
const apiKeys = new Map<string, { userId: string; expiresAt?: Date }>()

// Middleware to authenticate requests
async function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const apiKey = req.headers['x-api-key'] as string || req.query.api_key as string || req.body?.api_key as string
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required. Include X-API-Key header or api_key query parameter.' })
  }

  // Check cache first
  const cached = apiKeyCache.get(apiKey)
  if (cached && cached.expiresAt > Date.now()) {
    (req as any).userId = cached.userId
    ;(req as any).userToken = cached.userToken
    return next()
  }

  // Validate API key with backend API
  try {
    const response = await axios.post(`${AUTH_API_URL}/mcp/validate-key`, {
      api_key: apiKey,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { user_id, user_token } = response.data
    
    // Cache for 1 hour
    apiKeyCache.set(apiKey, {
      userId: user_id,
      userToken: user_token,
      expiresAt: Date.now() + 3600000, // 1 hour
    })

    ;(req as any).userId = user_id
    ;(req as any).userToken = user_token
    next()
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' })
    }
    return res.status(500).json({ error: 'Authentication service unavailable' })
  }
}

// Create API client with user's token
function createApiClient(userToken: string) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
  })
}

// MCP Server instance
const mcpServer = new Server(
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

// Register tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
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

// Handle tool calls
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const userToken = (request as any).userToken

  const apiClient = createApiClient(userToken)

  try {
    switch (name) {
      case 'scan_website': {
        let siteResponse
        try {
          siteResponse = await apiClient.post('/scanner/sites', {
            name: args.site_name,
            url: args.url,
            max_pages: args.max_pages || 50,
          })
        } catch (error: any) {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mcp-server' })
})

// MCP endpoint for SSE transport (Cursor compatible)
app.get('/mcp/sse', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Send initial connection message
  res.write('data: {"type":"connection","status":"connected"}\n\n')

  // Handle MCP protocol messages via SSE
  req.on('close', () => {
    res.end()
  })
})

// MCP endpoint for HTTP POST requests (MCP protocol)
app.post('/mcp/call', authenticate, async (req, res) => {
  try {
    const { method, params } = req.body
    const userToken = (req as any).userToken

    if (method === 'tools/list') {
      const result = await mcpServer.handleRequest(ListToolsRequestSchema, {})
      return res.json(result)
    }

    if (method === 'tools/call') {
      // Set user token for this request
      ;(req as any).userToken = userToken
      const result = await mcpServer.handleRequest(CallToolRequestSchema, {
        params: {
          name: params.name,
          arguments: params.arguments,
        },
      })
      return res.json(result)
    }

    res.status(400).json({ error: 'Unknown method', supported: ['tools/list', 'tools/call'] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Simplified endpoint for Cursor (direct tool calls)
app.post('/mcp/tools/:toolName', authenticate, async (req, res) => {
  try {
    const { toolName } = req.params
    const userToken = (req as any).userToken
    ;(req as any).userToken = userToken

    const result = await mcpServer.handleRequest(CallToolRequestSchema, {
      params: {
        name: toolName,
        arguments: req.body,
      },
    })

    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// List available tools
app.get('/mcp/tools', authenticate, async (req, res) => {
  try {
    const result = await mcpServer.handleRequest(ListToolsRequestSchema, {})
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Helper function to get user token from backend
async function getUserToken(userId: string, apiKey: string): Promise<string> {
  try {
    const response = await axios.post(`${AUTH_API_URL}/mcp/get-token`, {
      user_id: userId,
      api_key: apiKey,
    })
    return response.data.token
  } catch (error) {
    // Fallback to environment token if available
    return process.env.SCANNER_API_TOKEN || ''
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp/call`)
})





