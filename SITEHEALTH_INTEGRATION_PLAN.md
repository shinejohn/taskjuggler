# SiteHealth Integration Plan — One Branded Toolset

**Goal:** Integrate sitehealth-mcp-server into scanner-mcp to produce one unified **SiteHealth** branded toolset for internal product development (not customer-facing).

**Status:** In Progress  
**Created:** Feb 8, 2026

---

## 1. Current State

### sitehealth-mcp-server 2
- **MCP tools (8):** list_apps, add_app, audit_page, audit_all, get_failures, get_fix_prompt, mark_resolved, verify_fix
- **CLI:** `npm run audit` — single page, --all, --app, --tags
- **Fix loop:** `npm run fix-loop` — audit → Claude API → auto-apply fixes
- **Engine:** Playwright in-process, exhaustive element testing (click every link/button)
- **Config:** sitehealth-apps.json, app registry
- **Transport:** stdio, HTTP (Streamable)

### scanner-mcp
- **MCP tools (5):** scan_website, get_scan_results, list_sites, get_site_issues, generate_fix
- **CLI:** None
- **Fix loop:** None
- **Engine:** Backend API (taskjuggler-api) → scanner-worker (Playwright + axe-core)
- **Persistence:** PostgreSQL via API
- **Transport:** stdio, HTTP (http-server.ts — has bugs: apiKeyCache, AUTH_API_URL undefined)

### Backend generateFix
- **ScannerIssueController:** `generateFix()` returns placeholder — "Fix generation not yet implemented"
- **SiteHealth FixGeneratorService:** Exists in `app/Modules/SiteHealth/Services/` — calls Claude API, returns fix_code, explanation, confidence
- **Models:** Scanner uses `App\Models\Scanner\Issue`; SiteHealth uses `App\Modules\SiteHealth\Models\Issue` — different tables

---

## 2. Integration Architecture

### Unified Toolset: `sitehealth` (single package)

```
sitehealth/  (renamed from scanner-mcp, merge sitehealth-mcp content)
├── MCP Server
│   ├── sitehealth_scan_*      (5 tools) — API-backed, production scans
│   └── sitehealth_audit_*      (8 tools) — Local Playwright, element testing
├── CLI
│   ├── sitehealth scan        — Trigger scan via API, optionally wait
│   ├── sitehealth audit        — Local element audit (from sitehealth-mcp)
│   ├── sitehealth list-sites  — List sites from API
│   └── sitehealth fix-loop     — Audit → fix → verify (local or API)
├── Fix Loop
│   ├── Local mode             — Uses Playwright auditor (existing)
│   └── API mode               — Uses scan → issues → generate_fix API
└── HTTP Server
    └── Optional for CI/webhooks
```

### Tool Naming Convention
- `sitehealth_scan_website` — trigger full site scan
- `sitehealth_scan_results` — get scan results
- `sitehealth_list_sites` — list monitored sites
- `sitehealth_site_issues` — get issues for site
- `sitehealth_generate_fix` — generate fix for issue (API)
- `sitehealth_list_apps` — list configured apps (local)
- `sitehealth_add_app` — add app to registry
- `sitehealth_audit_page` — audit single page (local)
- `sitehealth_audit_all` — audit all configured pages
- `sitehealth_get_failures` — get failures from last audit
- `sitehealth_get_fix_prompt` — get AI fix prompt for issue
- `sitehealth_mark_resolved` — mark issue resolved
- `sitehealth_verify_fix` — re-audit and verify

---

## 3. Implementation Phases

### Phase 1: Backend Fix Generation (Taskjuggler API)
1. Add `claude` config to `config/services.php` (api_key from ANTHROPIC_API_KEY)
2. Create `ScannerFixGeneratorService` (or adapt existing) for `App\Models\Scanner\Issue`
3. Wire `ScannerIssueController::generateFix()` to call fix generator
4. Ensure scanner_issues table has fix_code, fix_explanation, fix_confidence columns (migration if needed)

### Phase 2: Merge MCP Servers
1. Move sitehealth-mcp-server 2 content into scanner-mcp
2. Rename scanner-mcp → sitehealth (or keep scanner-mcp folder, rebrand)
3. Consolidate tools: both API-backed and local auditor
4. Use McpServer (new SDK) for sitehealth-mcp, or Server for scanner-mcp — standardize on one
5. Fix http-server.ts: either remove auth or use SCANNER_API_TOKEN bypass for internal use

### Phase 3: CLI and Fix Loop
1. Add CLI: `src/cli.ts` with commands: scan, audit, list-sites, fix-loop
2. Add fix-loop: `src/fix-loop.ts` — support both local (auditor) and API (scan → issues → generate_fix)
3. Package.json scripts: `sitehealth scan`, `sitehealth audit`, `sitehealth fix-loop`

### Phase 4: Deploy
1. Add `sitehealth/railway.json` or `scanner-mcp/railway.json` for Railway
2. Dockerfile: Node 20, Playwright chromium (for local audit), build + start
3. Deploy to Railway as internal service (not public product)
4. Env vars: SCANNER_API_URL, SCANNER_API_TOKEN, ANTHROPIC_API_KEY (for fix loop)

---

## 4. Deployment Model (Internal Use)

- **Trigger:** Git push or manual deploy
- **Use case:** Developers run `sitehealth audit` locally or via MCP in Cursor to test Fibonacco apps
- **API mode:** When using scan_website, connects to taskjuggler-api (Railway)
- **Local mode:** When using audit_page, runs Playwright locally — no API needed
- **Auth:** For internal use, bearer token (SCANNER_API_TOKEN) sufficient; API key validation optional

---

## 5. Files to Create/Modify

| File | Action |
|------|--------|
| taskjuggler-api/config/services.php | Add claude config |
| taskjuggler-api/app/Services/ScannerFixGeneratorService.php | Create (or reuse SiteHealth) |
| taskjuggler-api/app/Http/Controllers/Scanner/ScannerIssueController.php | Wire generateFix |
| taskjuggler-api/database/migrations | Add fix_code, etc. to scanner_issues if missing |
| scanner-mcp/ → sitehealth/ | Merge, rename |
| sitehealth/src/index.ts | Combined tools |
| sitehealth/src/cli.ts | New CLI |
| sitehealth/src/fix-loop.ts | Port from sitehealth-mcp |
| sitehealth/src/http-server.ts | Fix apiKeyCache, simplify auth |
| sitehealth/package.json | Add playwright, zod, scripts |
| sitehealth/Dockerfile | Add Playwright |
| sitehealth/railway.json | Deploy config |

---

## 6. Quick Start (Post-Integration)

```bash
# Install
cd sitehealth && npm install && npx playwright install chromium

# CLI
npm run audit -- http://localhost:8000
npm run audit -- --all
npm run scan -- https://example.com --name "My Site" --wait

# MCP (Cursor)
# Add to .cursor/mcp.json:
{
  "mcpServers": {
    "sitehealth": {
      "command": "node",
      "args": ["./sitehealth/dist/index.js"]
    }
  }
}
```

---

## 7. Success Criteria

- [x] Backend generateFix returns real fix (fix_code, explanation, confidence)
- [x] One MCP server with 13 tools (5 API + 8 local)
- [x] CLI: audit, fix-loop (scan via MCP tools)
- [x] Fix loop works (local mode via auditor)
- [x] HTTP mode works (TRANSPORT=http)
- [ ] Deployed to Railway — add service, set Root Directory to `scanner-mcp`

## 8. Implementation Complete (Feb 8, 2026)

**Done:**
- ScannerIssueController wired to ScannerFixGeneratorService
- scanner-mcp merged with sitehealth-mcp → one `sitehealth` package
- 13 tools: sitehealth_scan_website, sitehealth_scan_results, sitehealth_list_sites, sitehealth_site_issues, sitehealth_generate_fix + 8 audit tools
- CLI and fix-loop from sitehealth-mcp
- railway.json + nixpacks.toml for deployment

**Deploy to Railway:**
1. Add new service in Fibonacco AI Tools project
2. Set Root Directory: `scanner-mcp`
3. Set env: SCANNER_API_URL, SCANNER_API_TOKEN, TRANSPORT=http
4. Railway will use nixpacks.toml
