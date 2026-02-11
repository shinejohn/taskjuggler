# SiteHealth — Unified MCP Server

**One branded toolset for internal product development.** Combines API-backed site scanning with local element auditing.

> **Full setup guide:** See [SITEHEALTH_USER_GUIDE.md](./SITEHEALTH_USER_GUIDE.md) for install, config, and usage across Cursor, Claude Code, Antigravity, and CLI.

## Tools (13 total)

### API-backed (taskjuggler-api)
- `sitehealth_scan_website` — Trigger full site scan
- `sitehealth_scan_results` — Get scan results
- `sitehealth_list_sites` — List monitored sites
- `sitehealth_site_issues` — Get issues for a site
- `sitehealth_generate_fix` — Generate AI fix for an issue

### Local element auditor (Playwright)
- `sitehealth_list_apps` — List configured apps
- `sitehealth_add_app` — Add app to registry
- `sitehealth_audit_page` — Audit one page (click every element)
- `sitehealth_audit_all` — Audit all configured pages
- `sitehealth_get_failures` — Get failures from last audit
- `sitehealth_get_fix_prompt` — Get AI fix prompt for issue
- `sitehealth_mark_resolved` — Mark issue resolved
- `sitehealth_verify_fix` — Re-audit and verify

## Quick Start

```bash
npm install
npx playwright install chromium
npm run build
```

### MCP (Cursor)
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "sitehealth": {
      "command": "node",
      "args": ["./scanner-mcp/dist/index.js"],
      "env": {
        "SCANNER_API_URL": "https://your-api.railway.app/api",
        "SCANNER_API_TOKEN": "your-token"
      }
    }
  }
}
```

### CLI
```bash
npm run audit -- http://localhost:8000
npm run audit -- --all
npm run fix-loop -- --url http://localhost:8000 --auto-apply
```

### HTTP mode (CI/webhooks)
```bash
TRANSPORT=http PORT=3100 node dist/index.js
# Health: http://localhost:3100/health
# MCP: POST http://localhost:3100/mcp
```

## Env vars
- `SCANNER_API_URL` — taskjuggler-api base URL (e.g. https://api.railway.app/api)
- `SCANNER_API_TOKEN` — Bearer token for API
- `ANTHROPIC_API_KEY` — For fix-loop AI (optional)
- `TRANSPORT` — `stdio` (default) or `http`
- `PORT` — HTTP port (default 3100)
