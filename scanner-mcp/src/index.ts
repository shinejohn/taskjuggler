// ============================================================
// SITEHEALTH — UNIFIED MCP SERVER
// ============================================================
// Combined: API-backed scanner tools + local element auditor.
// For internal product development.
//
// Usage:
//   stdio:  node dist/index.js
//   HTTP:   TRANSPORT=http PORT=3100 node dist/index.js
//
// MCP Config (.cursor/mcp.json):
// {
//   "mcpServers": {
//     "sitehealth": {
//       "command": "node",
//       "args": ["./scanner-mcp/dist/index.js"]
//     }
//   }
// }
// ============================================================

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools as registerAuditTools } from './tools/audit.js';
import { registerApiTools } from './tools/api.js';

const server = new McpServer({
  name: 'sitehealth',
  version: '2.0.0',
});

registerApiTools(server);
registerAuditTools(server);

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SiteHealth MCP server running on stdio');
}

async function runHTTP(): Promise<void> {
  const { default: express } = await import('express');
  const { StreamableHTTPServerTransport } = await import(
    '@modelcontextprotocol/sdk/server/streamableHttp.js'
  );

  const app = express();
  app.use(express.json());

  app.post('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on('close', () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', server: 'sitehealth', version: '2.0.0' });
  });

  const port = parseInt(process.env.PORT || '3100');
  app.listen(port, () => {
    console.error(`SiteHealth MCP server running on http://localhost:${port}/mcp`);
  });
}

const transport = process.env.TRANSPORT || 'stdio';
if (transport === 'http') {
  runHTTP().catch(err => { console.error('Server error:', err); process.exit(1); });
} else {
  runStdio().catch(err => { console.error('Server error:', err); process.exit(1); });
}
