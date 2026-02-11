# SiteHealth — User & Developer Guide

**Purpose:** This document enables human developers and AI assistants (Claude Code, Cursor, Antigravity, etc.) to install, configure, and use SiteHealth. It is designed to be ingested as-is—drop into a project, attach to an AI, or follow manually.

---

## What Is SiteHealth?

SiteHealth is a unified toolset for testing and fixing web applications. It combines:

1. **API-backed scanning** — Full site scans (accessibility, SEO, performance, security) via taskjuggler-api
2. **Local element auditing** — Click every link, button, dropdown on a page; find dead elements, broken handlers, JS errors
3. **AI fix loop** — Audit → generate fix prompts → apply fixes → verify

**Use case:** Internal product development. Find broken UI elements and get AI-generated fixes.

---

## Installation

### Prerequisites

- Node.js 20+
- npm

### Steps

```bash
cd scanner-mcp
npm install
npx playwright install chromium
npm run build
```

**Verify:**
```bash
node dist/index.js
# Should print: SiteHealth MCP server running on stdio
# Ctrl+C to stop
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SCANNER_API_URL` | For API tools | Base URL of taskjuggler-api, e.g. `https://your-api.railway.app/api` |
| `SCANNER_API_TOKEN` | For API tools | Bearer token for API authentication |
| `ANTHROPIC_API_KEY` | For fix-loop | Claude API key for AI fix generation |
| `PROJECT_ROOT` | For fix-loop | Path to source code (default: `.`) |
| `TRANSPORT` | Optional | `stdio` (default) or `http` |
| `PORT` | Optional | HTTP port when `TRANSPORT=http` (default: 3100) |

### App Registry (Local Auditor)

For `sitehealth_audit_all` and `sitehealth_audit_page`, configure apps in `sitehealth-apps.json` (created on first `sitehealth_add_app` use) or edit `src/config/apps.ts` defaults.

---

## MCP Setup

### Cursor

**File:** `.cursor/mcp.json` (project root or user config)

```json
{
  "mcpServers": {
    "sitehealth": {
      "command": "node",
      "args": ["/absolute/path/to/scanner-mcp/dist/index.js"],
      "env": {
        "SCANNER_API_URL": "https://your-api.railway.app/api",
        "SCANNER_API_TOKEN": "your-bearer-token"
      }
    }
  }
}
```

**For monorepo:** Use path relative to repo root, e.g. `["./scanner-mcp/dist/index.js"]` if run from repo root.

---

### Claude Code

**File:** `~/.mcp.json` (user) or `.mcp.json` (project root)

```json
{
  "mcpServers": {
    "sitehealth": {
      "command": "node",
      "args": ["/absolute/path/to/scanner-mcp/dist/index.js"],
      "env": {
        "SCANNER_API_URL": "https://your-api.railway.app/api",
        "SCANNER_API_TOKEN": "your-bearer-token"
      }
    }
  }
}
```

**Alternative (project scope):** Create `.mcp.json` in your project root with the same structure.

---

### Antigravity

1. Open MCP Store via "..." dropdown in the side panel
2. Click **Manage MCP Servers**
3. Click **View raw config**
4. Add to `mcp_config.json`:

```json
{
  "mcpServers": {
    "sitehealth": {
      "command": "node",
      "args": ["/absolute/path/to/scanner-mcp/dist/index.js"],
      "env": {
        "SCANNER_API_URL": "https://your-api.railway.app/api",
        "SCANNER_API_TOKEN": "your-bearer-token"
      }
    }
  }
}
```

---

### Other MCP Clients

Any MCP client that supports stdio transport can use:

- **Command:** `node`
- **Args:** `["/path/to/scanner-mcp/dist/index.js"]`
- **Env:** Pass `SCANNER_API_URL` and `SCANNER_API_TOKEN` for API tools

---

## MCP Tools Reference

### API-Backed Tools (require SCANNER_API_URL + SCANNER_API_TOKEN)

| Tool | Description | Parameters |
|------|-------------|------------|
| `sitehealth_scan_website` | Trigger full site scan | `url`, `site_name`, `max_pages?` |
| `sitehealth_scan_results` | Get results from a scan | `scan_id` |
| `sitehealth_list_sites` | List monitored sites | (none) |
| `sitehealth_site_issues` | Get issues for a site | `site_id` |
| `sitehealth_generate_fix` | Generate AI fix for an issue | `issue_id` |

### Local Auditor Tools (no API required)

| Tool | Description | Parameters |
|------|-------------|------------|
| `sitehealth_list_apps` | List configured apps | `tags?` |
| `sitehealth_add_app` | Add app to registry | `name`, `baseUrl`, `pages` (JSON), `tags?` |
| `sitehealth_audit_page` | Audit one page (click every element) | `url`, `pageName?`, `appName?` |
| `sitehealth_audit_all` | Audit all configured pages | `tags?`, `appName?` |
| `sitehealth_get_failures` | Get failures from last audit | `category?`, `app?`, `page?`, `limit?` |
| `sitehealth_get_fix_prompt` | Get AI fix prompt for an issue | `issueId`, `projectRoot?` |
| `sitehealth_mark_resolved` | Mark issue resolved | `issueId` |
| `sitehealth_verify_fix` | Re-audit and compare | `pageUrl`, `pageName?` |

---

## Example Prompts for AI Assistants

When using SiteHealth via MCP, you can instruct the AI with prompts like:

- **"Audit the homepage at http://localhost:8000"** → Uses `sitehealth_audit_page`
- **"List all configured apps"** → Uses `sitehealth_list_apps`
- **"Add an app called MyApp at http://localhost:3000 with pages Home (/), Dashboard (/dashboard)"** → Uses `sitehealth_add_app`
- **"Run a full audit on all configured pages"** → Uses `sitehealth_audit_all`
- **"Show me the failures from the last audit"** → Uses `sitehealth_get_failures`
- **"Generate a fix prompt for issue abc123"** → Uses `sitehealth_get_fix_prompt`
- **"Verify the fixes on http://localhost:8000/articles"** → Uses `sitehealth_verify_fix`
- **"Scan https://example.com and name it Example Site"** → Uses `sitehealth_scan_website` (API)

---

## CLI Usage

### Audit (Local Element Testing)

```bash
# Single page
npm run audit -- http://localhost:8000

# All configured pages
npm run audit -- --all

# One app
npm run audit -- --app "Day.News"

# Filter by tags
npm run audit -- --tags "publishing,public"

# Help
npm run audit -- --help
```

**Output:** Console summary + JSON report in `./audit-reports/`

---

### Fix Loop (Audit → AI Fix → Verify)

```bash
# Single page, auto-apply fixes
ANTHROPIC_API_KEY=sk-... npm run fix-loop -- --url http://localhost:8000 --auto-apply

# All pages
npm run fix-loop -- --all --auto-apply

# One app, max 5 iterations
npm run fix-loop -- --app "Day.News" --max-iterations 5 --auto-apply

# Without auto-apply: writes issues and fix prompts to files for manual review
npm run fix-loop -- --url http://localhost:8000

# Help
npm run fix-loop -- --help
```

**Options:**
- `--url <url>` — Audit and fix a single page
- `--all` — All configured pages
- `--app <name>` — Filter to one app
- `--tags <tags>` — Filter by tags (comma-separated)
- `--max-iterations <n>` — Max fix-verify cycles (default: 5)
- `--auto-apply` — Apply AI fixes to files
- `--no-verify` — Skip re-audit after fixes
- `--project-root <path>` — Path to source code
- `--model <model>` — Claude model (default: claude-sonnet-4-20250514)

**Environment:**
- `ANTHROPIC_API_KEY` — Required for AI fix generation
- `PROJECT_ROOT` — Path to source (default: current dir)

---

## HTTP Mode (CI / Webhooks)

```bash
TRANSPORT=http PORT=3100 node dist/index.js
```

- **Health:** `GET http://localhost:3100/health`
- **MCP:** `POST http://localhost:3100/mcp` (Streamable HTTP transport)

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "No tools found" | MCP not connected | Restart IDE / reconnect MCP; check path to `dist/index.js` |
| "Error: connect ECONNREFUSED" | API unreachable | Set `SCANNER_API_URL` and ensure API is running |
| "401" or "Unauthorized" | Bad token | Set `SCANNER_API_TOKEN` to a valid Bearer token |
| "Playwright not found" | Chromium not installed | Run `npx playwright install chromium` |
| Fix loop writes files but doesn't apply | No API key | Set `ANTHROPIC_API_KEY` for auto-apply |
| MCP path wrong | Relative path fails | Use absolute path in `args` |

---

## Quick Reference Card (for AI)

```
SiteHealth: Installation
  cd scanner-mcp && npm install && npx playwright install chromium && npm run build

SiteHealth: MCP config (stdio)
  command: node
  args: ["/path/to/scanner-mcp/dist/index.js"]
  env: SCANNER_API_URL, SCANNER_API_TOKEN

SiteHealth: CLI audit
  npm run audit -- <url>
  npm run audit -- --all
  npm run audit -- --app "AppName"

SiteHealth: CLI fix-loop
  ANTHROPIC_API_KEY=sk-... npm run fix-loop -- --url <url> --auto-apply
  npm run fix-loop -- --all --max-iterations 5

SiteHealth: Key tools
  sitehealth_audit_page(url) — test one page
  sitehealth_audit_all() — test all pages
  sitehealth_get_failures() — list failures
  sitehealth_get_fix_prompt(issueId) — get fix prompt
  sitehealth_verify_fix(pageUrl) — re-test
  sitehealth_scan_website(url, site_name) — API scan
  sitehealth_generate_fix(issue_id) — API fix
```

---

## File Locations

| File | Purpose |
|------|---------|
| `scanner-mcp/dist/index.js` | MCP server entry point |
| `scanner-mcp/dist/cli.js` | CLI audit entry point |
| `scanner-mcp/dist/fix-loop.js` | Fix loop entry point |
| `sitehealth-apps.json` | App registry (created on first add) |
| `audit-reports/` | JSON reports from audits |
| `audit-screenshots/` | Screenshots of failures |

---

---

## Appendix: AI Instructions Block

Copy the block below into Claude Code instructions, Cursor rules, Antigravity context, or any AI coding assistant's system/instructions field:

```
## SiteHealth Toolset

You have access to SiteHealth tools for testing and fixing web UIs.

**When to use:**
- User asks to audit, test, or check a page → use sitehealth_audit_page or sitehealth_audit_all
- User reports broken buttons/links → use sitehealth_audit_page, then sitehealth_get_failures
- User wants fixes generated → use sitehealth_get_fix_prompt (local) or sitehealth_generate_fix (API)
- User wants to verify fixes → use sitehealth_verify_fix

**Workflow:**
1. Audit: sitehealth_audit_page(url) or sitehealth_audit_all()
2. Get failures: sitehealth_get_failures()
3. For each issue: sitehealth_get_fix_prompt(issueId) → apply fix in code
4. Verify: sitehealth_verify_fix(pageUrl)

**API tools** (need SCANNER_API_URL + SCANNER_API_TOKEN):
- sitehealth_scan_website(url, site_name) — full site scan
- sitehealth_scan_results(scan_id)
- sitehealth_list_sites()
- sitehealth_site_issues(site_id)
- sitehealth_generate_fix(issue_id)

**Local tools** (no API):
- sitehealth_list_apps(), sitehealth_add_app(), sitehealth_audit_page(), sitehealth_audit_all()
- sitehealth_get_failures(), sitehealth_get_fix_prompt(), sitehealth_mark_resolved(), sitehealth_verify_fix()

**CLI** (when MCP unavailable): cd scanner-mcp && npm run audit -- <url>
**Fix loop**: ANTHROPIC_API_KEY=... npm run fix-loop -- --url <url> --auto-apply
```
```

---

*Document version: 2.0 — compatible with SiteHealth package 2.0.0*
