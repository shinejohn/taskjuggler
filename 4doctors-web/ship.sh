#!/bin/bash
# ============================================================================
# ship.sh v5 — Fibonacco Universal Pre-Deploy Validation + AI Log Review
# ============================================================================
# Adds to v4:
#   - Larastan static analysis (Phase 2b)
#   - Laravel Pint format check (Phase 2c)
#   - Gitleaks secret scan (Phase 3b)
#   - Postgres migration dry-run (Phase 4c, --deep)
#   - Docker build validation (Phase 5b, --deep)
#   - Trivy CVE scan (Phase 5c, --deep)
#   - ESLint (Phase 6 enhanced)
#   - composer audit + npm audit (Phase 6b)
#   - OpenAPI drift check (Phase 6c, opt-in)
#   - Pest/PHPUnit tests (Phase 7c, --deep)
#   - Sentry release tagging (post-push)
#   - Playwright smoke test (Phase 8 enhanced)
#   - AI log review via Railway + Claude API (--review-logs, --fix)
#
# Usage:
#   ./ship.sh --check                          run all pre-deploy checks
#   ./ship.sh --check --deep                   include Docker/Trivy/Postgres/tests
#   ./ship.sh "commit message"                 check + commit + push
#   ./ship.sh --use-manifest [--deep|--dry]    use built-in May 2026 batch message (5 test themes + 5 update areas)
#   ./ship.sh "commit message" --deep          slow mode, full validation
#   ./ship.sh "commit message" --dry           check only, no commit
#   ./ship.sh "commit message" --force         skip checks (emergency)
#   ./ship.sh "commit message" --no-sentry     skip Sentry release tagging
#   ./ship.sh --review-logs                    AI analysis of Railway logs
#   ./ship.sh --review-logs --fix              AI analysis + patch proposals
#   ./ship.sh --review-logs --since 24h        time window (default 6h)
#   ./ship.sh --report                         write ship-report.log
#   ./ship.sh --help                           this
#
# Required env vars for optional features:
#   ANTHROPIC_API_KEY    for --review-logs
#   SENTRY_AUTH_TOKEN    for release tagging (optional; skipped if unset)
#   SENTRY_ORG           for release tagging
#   SENTRY_PROJECT       for release tagging
#   SMOKE_USER / SMOKE_PASS   for Playwright smoke test
# ============================================================================

set +e

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Timing ──
SHIP_START=$(date +%s)
phase_start() { PHASE_START=$(date +%s); }
phase_end() {
    local elapsed=$(( $(date +%s) - PHASE_START ))
    echo -e "  ${DIM}(${elapsed}s)${NC}"
}

# ── Args ──
COMMIT_MSG=""
MODE="normal"
DEEP=false
REVIEW_LOGS=false
REVIEW_FIX=false
LOGS_SINCE="6h"
SKIP_SENTRY=false
ERRORS=0
WARNINGS=0
REPORT_FILE=""
USE_MANIFEST=false

# Parse args in order (supports --since <value>)
while [[ $# -gt 0 ]]; do
    case "$1" in
        --check)       MODE="dry" ;;
        --dry)         MODE="dry" ;;
        --force)       MODE="force" ;;
        --deep)        DEEP=true ;;
        --review-logs) REVIEW_LOGS=true; MODE="dry" ;;
        --fix)         REVIEW_FIX=true ;;
        --since)       shift; LOGS_SINCE="$1" ;;
        --no-sentry)   SKIP_SENTRY=true ;;
        --report)      MODE="dry"; REPORT_FILE="ship-report-$(date +%Y%m%d-%H%M%S).log" ;;
        --use-manifest|--batch-current) USE_MANIFEST=true ;;
        --help|-h)
            cat <<'EOF'
Usage: ./ship.sh "commit message" [options]
       ./ship.sh --use-manifest [--deep|--dry|--force]
       ./ship.sh --check [--deep]
       ./ship.sh --review-logs [--fix] [--since <duration>]

Options:
  --check         Run all checks, no commit
  --deep          Include Docker build, Trivy, Postgres migration, tests
  --dry           Alias for --check with commit message
  --force         Skip checks, commit and push (emergency)
  --use-manifest  Use the built-in multisite batch commit body (update SHIP_MANIFEST in ship.sh when it drifts)
  --batch-current Same as --use-manifest
  --report        Generate ship-report-YYYYMMDD-HHMMSS.log
  --review-logs   Pull Railway logs, group errors, ask Claude to analyze
  --fix           With --review-logs, request patch proposals as diffs
  --since <dur>   Time window for --review-logs (e.g. 1h, 24h, 7d; default 6h)
  --no-sentry     Skip Sentry release tagging after push
  -h, --help      Show this help
EOF
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
        *)
            if [[ -z "$COMMIT_MSG" ]]; then
                COMMIT_MSG="$1"
            fi
            ;;
    esac
    shift
done

# Built-in commit message for the current multisite batch (5 test themes + 5 update areas).
# Keep in sync with staged work; edit before ./ship.sh --use-manifest when the batch changes.
if [[ "$USE_MANIFEST" == true ]]; then
    COMMIT_MSG=$(cat <<'SHIP_MANIFEST_EOF'
feat(4healthcare): platform updates — frontend fixes, type safety, deploy hardening

Updates:
1. Frontend — TypeScript type safety: replaced all `any` types with proper interfaces across stores/services
2. Frontend — Removed console.error statements, added proper error handling patterns
3. Frontend — Fixed docConnect service to use centralized auth-aware API client
4. Backend — Wired up dashboard route, fixed PatientPortalService
5. Deploy — ship.sh adapted for Code/ subdirectory layout, vue-tsc type checking
SHIP_MANIFEST_EOF
)
fi

if [[ "$MODE" == "normal" && -z "$COMMIT_MSG" && "$REVIEW_LOGS" == false ]]; then
    echo -e "${RED}Usage: ./ship.sh \"commit message\" [--deep|--dry|--force]${NC}"
    echo -e "       ./ship.sh --use-manifest [--deep|--dry|--force]"
    echo -e "       ./ship.sh --check [--deep]"
    echo -e "       ./ship.sh --review-logs [--fix]"
    exit 1
fi

# ── Logging ──
log() {
    echo -e "$1"
    if [[ -n "$REPORT_FILE" ]]; then
        echo -e "$1" | sed 's/\x1b\[[0-9;]*m//g' >> "$REPORT_FILE"
    fi
}
inc_errors()   { ERRORS=$((ERRORS + 1)); }
inc_warnings() { WARNINGS=$((WARNINGS + 1)); }

log ""
log "${BOLD}${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
log "${BOLD}${CYAN}║          🚀 FIBONACCO SHIP v5 (Universal)           ║${NC}"
log "${BOLD}${CYAN}║          $(date '+%Y-%m-%d %H:%M:%S')                       ║${NC}"
log "${BOLD}${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
log ""

# ============================================================================
# PROJECT DETECTION
# ============================================================================
BACKEND_DIR=""
FRONTEND_DIR=""
PROJECT_TYPE="unknown"
HAS_INERTIA=false
IS_MULTIAPP=false

if [[ -f "artisan" ]]; then
    BACKEND_DIR="."
    PROJECT_TYPE="monolith"
elif [[ -f "backend/artisan" ]]; then
    BACKEND_DIR="backend"
    PROJECT_TYPE="learning-center"
elif [[ -f "Code/taskjuggler-api/artisan" ]]; then
    BACKEND_DIR="Code/taskjuggler-api"
    PROJECT_TYPE="4healthcare"
elif [[ -f "../taskjuggler-api/artisan" ]]; then
    BACKEND_DIR="../taskjuggler-api"
    PROJECT_TYPE="4healthcare"
elif [[ -f "taskjuggler-api/artisan" ]]; then
    BACKEND_DIR="taskjuggler-api"
    PROJECT_TYPE="taskjuggler"
elif [[ -f "apps/api-core/artisan" ]]; then
    BACKEND_DIR="apps/api-core"
    PROJECT_TYPE="4people"
fi

if [[ -f "package.json" ]] && grep -q '"vue"' "package.json" 2>/dev/null; then
    FRONTEND_DIR="."
elif [[ -f "Code/4doctors-web/package.json" ]]; then
    FRONTEND_DIR="Code/4doctors-web"
elif [[ -f "src/package.json" ]]; then
    FRONTEND_DIR="src"
fi

if [[ -n "$BACKEND_DIR" ]] && grep -q 'inertiajs' "${BACKEND_DIR}/composer.json" 2>/dev/null; then
    HAS_INERTIA=true
fi
if [[ -n "$FRONTEND_DIR" ]] && grep -q '@inertiajs' "${FRONTEND_DIR}/package.json" 2>/dev/null; then
    HAS_INERTIA=true
fi

if grep -rq 'PLATFORM_KEY\|platform_key' "${BACKEND_DIR}/config/" 2>/dev/null; then
    IS_MULTIAPP=true
fi

log "${BOLD}${BLUE}━━━ Project Detection ━━━${NC}"
log "  Backend:   ${CYAN}${BACKEND_DIR:-none}${NC}"
log "  Frontend:  ${CYAN}${FRONTEND_DIR:-none}${NC}"
log "  Type:      ${CYAN}${PROJECT_TYPE}${NC}"
log "  Inertia:   ${CYAN}${HAS_INERTIA}${NC}"
log "  Multi-app: ${CYAN}${IS_MULTIAPP}${NC}"
log "  Deep mode: ${CYAN}${DEEP}${NC}"
log ""

if [[ -z "$BACKEND_DIR" && -z "$FRONTEND_DIR" ]]; then
    log "${RED}Could not detect project structure. Run from repo root.${NC}"
    exit 1
fi

# ============================================================================
# AI LOG REVIEW MODE — pull Railway logs, analyze with Claude, exit
# ============================================================================
if [[ "$REVIEW_LOGS" == true ]]; then
    log "${BOLD}${BLUE}━━━ AI Log Review ━━━${NC}"
    phase_start

    # Preflight
    if ! command -v railway > /dev/null; then
        log "  ${RED}❌ Railway CLI not installed${NC}"
        log "     ${DIM}Install: npm install -g @railway/cli${NC}"
        exit 1
    fi
    if ! command -v jq > /dev/null; then
        log "  ${RED}❌ jq not installed (required for JSON parsing)${NC}"
        log "     ${DIM}Install: brew install jq  OR  apt install jq${NC}"
        exit 1
    fi
    if [[ -z "$ANTHROPIC_API_KEY" ]]; then
        log "  ${RED}❌ ANTHROPIC_API_KEY not set${NC}"
        log "     ${DIM}Get one at: https://console.anthropic.com/${NC}"
        exit 1
    fi

    # Warn if local is ahead of remote (patches won't match prod)
    if git rev-parse --abbrev-ref HEAD > /dev/null 2>&1; then
        CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
        git fetch origin "$CURRENT_BRANCH" 2>/dev/null
        AHEAD=$(git rev-list --count "origin/${CURRENT_BRANCH}"..HEAD 2>/dev/null || echo 0)
        if [[ "$AHEAD" -gt 2 ]]; then
            log "  ${YELLOW}⚠️  Local is ${AHEAD} commits ahead of remote${NC}"
            log "     ${YELLOW}Patches may reference code that isn't in production yet${NC}"
        fi
    fi

    # Pull logs
    log "  ${CYAN}Fetching Railway logs (last ${LOGS_SINCE})...${NC}"
    LOGS_RAW=$(railway logs --since "$LOGS_SINCE" --json 2>&1)
    RC=$?
    if [[ $RC -ne 0 ]] || [[ -z "$LOGS_RAW" ]]; then
        log "  ${RED}❌ Could not fetch logs${NC}"
        log "     ${DIM}Run: railway link${NC}"
        log "     ${DIM}Verify: railway status${NC}"
        echo "$LOGS_RAW" | head -5
        exit 1
    fi

    # Filter to errors + exceptions, normalize for dedup
    ERRORS_JSON=$(echo "$LOGS_RAW" | jq -c '
        select(
            (.severity // "" | test("error|critical|alert|emergency"; "i"))
            or (.message // "" | test("Exception|ERROR|Fatal|Stack trace|SQLSTATE|Undefined|TypeError"; "i"))
        )
        | {
            ts: (.timestamp // .ts // ""),
            severity: (.severity // ""),
            msg: .message,
            ctx: (.attributes // .context // {})
        }
    ' 2>/dev/null)

    if [[ -z "$ERRORS_JSON" ]]; then
        log "  ${GREEN}✓ No errors in Railway logs for the last ${LOGS_SINCE}${NC}"
        phase_end
        exit 0
    fi

    # Normalize for dedup: strip timestamps, UUIDs, numeric IDs, memory addresses
    NORMALIZED=$(echo "$ERRORS_JSON" | jq -r '.msg' | sed -E '
        s/[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9:.+-]+//g;
        s/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/<UUID>/g;
        s/0x[0-9a-f]+/<ADDR>/g;
        s/\b[0-9]{4,}\b/<NUM>/g;
        s/\s+/ /g
    ')

    # Count unique signatures (first 120 chars of normalized message)
    UNIQUE_COUNT=$(echo "$NORMALIZED" | cut -c1-120 | sort -u | wc -l | tr -d ' ')
    TOTAL_COUNT=$(echo "$ERRORS_JSON" | wc -l | tr -d ' ')
    log "  ${CYAN}${TOTAL_COUNT} error events, ${UNIQUE_COUNT} unique signatures${NC}"

    # Keep top 30 unique by frequency
    TOP_ERRORS=$(paste <(echo "$NORMALIZED" | cut -c1-120) <(echo "$ERRORS_JSON") \
        | sort | uniq -c -w120 | sort -rn | head -30 \
        | awk -F'\t' '{
            # line format: "  count normalized\tjson"
            match($0, /^ *[0-9]+/); count = substr($0, RSTART, RLENGTH);
            gsub(/^ *[0-9]+/, "", count); gsub(/ /, "", count);
            print "{\"count\":" count+0 ",\"example\":" $2 "}"
        }')

    # Gather relevant code files from stack traces
    log "  ${CYAN}Gathering referenced source files...${NC}"
    FILES_MENTIONED=$(echo "$ERRORS_JSON" | jq -r '.msg' \
        | grep -oE '(app|routes|database|resources|config)/[a-zA-Z0-9_/-]+\.(php|blade\.php|ts|tsx|vue|js|jsx)' \
        | sort -u | head -25)

    CODE_CONTEXT=""
    FILES_INCLUDED=0
    for f in $FILES_MENTIONED; do
        # Try as-is, then prefixed with BACKEND_DIR, then FRONTEND_DIR
        for path in "$f" "${BACKEND_DIR}/$f" "${FRONTEND_DIR}/$f"; do
            if [[ -f "$path" ]]; then
                # Limit each file to 300 lines to control tokens
                CONTENT=$(head -300 "$path")
                CODE_CONTEXT="${CODE_CONTEXT}

=== ${path} ===
${CONTENT}"
                FILES_INCLUDED=$((FILES_INCLUDED + 1))
                break
            fi
        done
        [[ $FILES_INCLUDED -ge 15 ]] && break
    done
    log "  ${CYAN}Included ${FILES_INCLUDED} source files for context${NC}"

    # Build prompt
    MODE_DIRECTIVE="Group the errors by likely root cause. For each group, give a 3-5 sentence diagnosis, identify the most likely file:line to fix, and rate severity (critical/high/medium/low). Do NOT propose code changes."
    if [[ "$REVIEW_FIX" == true ]]; then
        MODE_DIRECTIVE="Group the errors by likely root cause. For each group:
1. Give a 3-5 sentence diagnosis
2. Identify the file:line most likely at fault
3. Rate severity
4. If you are CONFIDENT about the fix, propose a unified diff patch (git-apply compatible) with the \`\`\`diff fenced code block
5. If you are NOT confident, write: NEEDS HUMAN — and explain what information is missing
Only produce diffs for issues where the fix is unambiguous. Do not fabricate file contents. Do not invent line numbers. If you reference a file that wasn't provided in the RELEVANT CODE section, mark it NEEDS HUMAN."
    fi

    log "  ${CYAN}Calling Claude (this may take 30-60s)...${NC}"

    REQUEST=$(jq -n \
        --arg errors "$TOP_ERRORS" \
        --arg code "$CODE_CONTEXT" \
        --arg directive "$MODE_DIRECTIVE" \
        --arg project "$PROJECT_TYPE" \
        --arg since "$LOGS_SINCE" \
        '{
            model: "claude-opus-4-5",
            max_tokens: 16000,
            messages: [{
                role: "user",
                content: ("You are reviewing production errors from a Laravel 12 API + Vue 3 SPA (decoupled, NOT Inertia) healthcare platform on Railway. Project type: " + $project + ". Time window: " + $since + ".\n\nDIRECTIVE:\n" + $directive + "\n\nERRORS (deduplicated, with frequency counts):\n" + $errors + "\n\nRELEVANT CODE (partial, top 300 lines per file):\n" + $code + "\n\nBegin your analysis now. Use markdown headings for each error group.")
            }]
        }')

    RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        --data "$REQUEST")

    # Check for API error
    API_ERROR=$(echo "$RESPONSE" | jq -r '.error.message // empty' 2>/dev/null)
    if [[ -n "$API_ERROR" ]]; then
        log "  ${RED}❌ Claude API error: ${API_ERROR}${NC}"
        exit 1
    fi

    OUTPUT=$(echo "$RESPONSE" | jq -r '.content[0].text // empty')
    if [[ -z "$OUTPUT" ]]; then
        log "  ${RED}❌ Empty response from Claude${NC}"
        echo "$RESPONSE" | jq . | head -20
        exit 1
    fi

    USAGE=$(echo "$RESPONSE" | jq -r '"\(.usage.input_tokens) in, \(.usage.output_tokens) out"')

    REPORT_MD="log-review-$(date +%Y%m%d-%H%M%S).md"
    {
        echo "# Log Review — $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        echo "- **Window:** last ${LOGS_SINCE}"
        echo "- **Events:** ${TOTAL_COUNT} total, ${UNIQUE_COUNT} unique"
        echo "- **Files included:** ${FILES_INCLUDED}"
        echo "- **Tokens:** ${USAGE}"
        echo "- **Mode:** $([ "$REVIEW_FIX" == true ] && echo 'analysis + fix proposals' || echo 'analysis only')"
        echo ""
        echo "---"
        echo ""
        echo "$OUTPUT"
    } > "$REPORT_MD"

    phase_end
    log ""
    log "  ${GREEN}✓ Analysis written: ${REPORT_MD}${NC}"
    log ""
    if [[ "$REVIEW_FIX" == true ]]; then
        log "  ${CYAN}To apply a suggested patch:${NC}"
        log "    ${DIM}1. Open ${REPORT_MD} and copy the diff for the fix you want${NC}"
        log "    ${DIM}2. Save to fix.patch${NC}"
        log "    ${DIM}3. git apply --check fix.patch    # verify it applies${NC}"
        log "    ${DIM}4. git apply fix.patch            # apply${NC}"
        log "    ${DIM}5. ./ship.sh --check              # validate patched code${NC}"
        log "    ${DIM}6. ./ship.sh \"fix: <desc>\"       # ship${NC}"
        log ""
    fi
    log "  ${DIM}Summary (first 40 lines):${NC}"
    log ""
    echo "$OUTPUT" | head -40 | while IFS= read -r line; do log "  $line"; done
    log ""
    log "  ${DIM}Full report: ${REPORT_MD}${NC}"
    exit 0
fi

# ── Emergency Force Push ──
if [[ "$MODE" == "force" ]]; then
    log "${YELLOW}⚡ FORCE MODE — skipping all checks${NC}"
    if [[ -n "$BACKEND_DIR" ]]; then
        SYNTAX_FAIL=false
        for f in $(git diff --name-only --cached 2>/dev/null | grep '\.php$'); do
            if [[ -f "$f" ]] && ! php -l "$f" > /dev/null 2>&1; then
                log "  ${RED}❌ SYNTAX ERROR in $f — refusing even force push${NC}"
                SYNTAX_FAIL=true
            fi
        done
        if [[ "$SYNTAX_FAIL" == true ]]; then
            log "${RED}Fix syntax errors first. Cannot ship broken PHP.${NC}"
            exit 1
        fi
    fi
    git add -A
    git commit -m "$COMMIT_MSG"
    git push
    log "${GREEN}✅ Force pushed.${NC}"
    exit 0
fi

# ============================================================================
# PHASE 1: STAGING SAFETY
# ============================================================================
log "${BOLD}${BLUE}━━━ Phase 1: Staging Safety ━━━${NC}"
phase_start

LARGE_FILES=$(git diff --cached --name-only 2>/dev/null | while read f; do
    if [[ -f "$f" ]]; then
        SIZE=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo 0)
        if [[ $SIZE -gt 5000000 ]]; then
            echo "$f ($((SIZE / 1048576))MB)"
        fi
    fi
done)
if [[ -n "$LARGE_FILES" ]]; then
    log "  ${RED}❌ Large files staged (>5MB):${NC}"
    echo "$LARGE_FILES" | while read f; do log "     $f"; done
    inc_errors
else
    log "  ${GREEN}✓${NC} No oversized files"
fi

FORBIDDEN=$(git diff --cached --name-only 2>/dev/null | grep -E '(^|/)node_modules/|(^|/)vendor/|^\.env$|\.env\.local$|^\.env\.production$' || true)
if [[ -n "$FORBIDDEN" ]]; then
    log "  ${RED}❌ Forbidden files staged:${NC}"
    echo "$FORBIDDEN" | while read f; do log "     $f"; done
    inc_errors
else
    log "  ${GREEN}✓${NC} No forbidden files staged"
fi

phase_end
log ""

# ============================================================================
# PHASE 2: PHP CHECKS
# ============================================================================
if [[ -n "$BACKEND_DIR" ]]; then
    log "${BOLD}${BLUE}━━━ Phase 2: PHP Checks ━━━${NC}"
    phase_start

    CHANGED_PHP=$(
        { git diff --name-only HEAD 2>/dev/null
          git diff --name-only --cached 2>/dev/null
          git ls-files --others --exclude-standard 2>/dev/null
        } | grep '\.php$' | grep "^${BACKEND_DIR}/" | sort -u
    ) || true

    if [[ -z "$CHANGED_PHP" && "$BACKEND_DIR" == "." ]]; then
        CHANGED_PHP=$(
            { git diff --name-only HEAD 2>/dev/null
              git diff --name-only --cached 2>/dev/null
              git ls-files --others --exclude-standard 2>/dev/null
            } | grep '\.php$' | sort -u
        ) || true
    fi

    if [[ -z "$CHANGED_PHP" ]]; then
        PHP_COUNT=0
    else
        PHP_COUNT=$(echo "$CHANGED_PHP" | wc -l | tr -d ' ')
    fi
    log "  PHP files changed: ${BOLD}$PHP_COUNT${NC}"

    for FILE in $CHANGED_PHP; do
        if [[ ! -f "$FILE" ]]; then continue; fi

        SYNTAX_RESULT=$(php -l "$FILE" 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${RED}❌ SYNTAX ERROR: $FILE${NC}"
            log "     ${RED}$(echo "$SYNTAX_RESULT" | head -3)${NC}"
            inc_errors
            continue
        fi

        if echo "$FILE" | grep -qE '/app/'; then
            ENV_CALLS=$(grep -nE "env\(\s*'" "$FILE" 2>/dev/null | head -3)
            if [[ -n "$ENV_CALLS" ]]; then
                log "  ${RED}❌ env() in app/ code: $FILE${NC}"
                echo "$ENV_CALLS" | while read line; do log "     ${RED}$line${NC}"; done
                log "     ${RED}Use config('key') — env() breaks under config:cache${NC}"
                inc_errors
            fi
        fi

        DEBUG_CALLS=$(grep -nE '\b(dd|dump|ray)\s*\(' "$FILE" 2>/dev/null | grep -v '//' | head -3)
        if [[ -n "$DEBUG_CALLS" ]]; then
            log "  ${YELLOW}⚠️  Debug function in: $FILE${NC}"
            echo "$DEBUG_CALLS" | while read line; do log "     ${YELLOW}$line${NC}"; done
            inc_warnings
        fi

        if echo "$FILE" | grep -q '/Models/'; then
            if grep -q 'class.*extends Model' "$FILE" && ! grep -q 'HasUuids' "$FILE"; then
                log "  ${YELLOW}⚠️  Model missing HasUuids trait: $FILE${NC}"
                inc_warnings
            fi
        fi

        # ── Missing facade imports ──
        # Using DB::, Cache::, Log::, Storage:: without the corresponding use statement
        # causes fatal errors in production (commit 8dfca17 broke GoLocalVoices).
        FACADE_ISSUES=""
        # Parallel arrays avoid bash syntax errors with '::' in associative array keys
        FACADE_NAMES=("DB::" "Cache::" "Log::" "Storage::" "Http::" "Schema::")
        FACADE_IMPORTS=(
            "use Illuminate\Support\Facades\DB;"
            "use Illuminate\Support\Facades\Cache;"
            "use Illuminate\Support\Facades\Log;"
            "use Illuminate\Support\Facades\Storage;"
            "use Illuminate\Support\Facades\Http;"
            "use Illuminate\Support\Facades\Schema;"
        )
        for i in "${!FACADE_NAMES[@]}"; do
            FACADE="${FACADE_NAMES[$i]}"
            EXPECTED="${FACADE_IMPORTS[$i]}"
            if grep -q "$FACADE" "$FILE" 2>/dev/null && ! grep -qF "$EXPECTED" "$FILE" 2>/dev/null; then
                # Skip if it's the facade definition itself or a config/migration file
                if ! echo "$FILE" | grep -qE '(Facades/|config/|database/migrations/)'; then
                    FACADE_ISSUES+="     ${FACADE} used without '${EXPECTED}'\n"
                fi
            fi
        done
        if [[ -n "$FACADE_ISSUES" ]]; then
            log "  ${RED}❌ Missing facade import: $FILE${NC}"
            echo -e "$FACADE_ISSUES" | head -5
            inc_errors
        fi

        # ── LIKE instead of ILIKE (PostgreSQL is case-sensitive) ──
        # 29 controllers were broken by this (commit a3ae0a7c).
        if echo "$FILE" | grep -qE '/(Controllers|Services)/'; then
            LIKE_HITS=$(grep -nE "'like'" "$FILE" 2>/dev/null | grep -v '//' | grep -v 'ilike' | head -3)
            if [[ -n "$LIKE_HITS" ]]; then
                log "  ${YELLOW}⚠️  Case-sensitive LIKE (PostgreSQL needs ILIKE): $FILE${NC}"
                echo "$LIKE_HITS" | while read line; do log "     ${YELLOW}$line${NC}"; done
                inc_warnings
            fi
        fi

        # ── ShouldQueue jobs missing resilience properties ──
        # Jobs without $timeout/$tries hang indefinitely (commit a3ae0a7c).
        if echo "$FILE" | grep -qE '/(Jobs|Listeners)/'; then
            if grep -q 'implements ShouldQueue' "$FILE" 2>/dev/null; then
                JOB_MISSING=""
                if ! grep -q '\$timeout' "$FILE" 2>/dev/null; then
                    JOB_MISSING+="timeout "
                fi
                if ! grep -q '\$tries' "$FILE" 2>/dev/null; then
                    JOB_MISSING+="tries "
                fi
                if ! grep -q '\$backoff' "$FILE" 2>/dev/null; then
                    JOB_MISSING+="backoff "
                fi
                if [[ -n "$JOB_MISSING" ]]; then
                    log "  ${YELLOW}⚠️  Job missing resilience props (${JOB_MISSING}): $FILE${NC}"
                    inc_warnings
                fi
            fi
        fi
    done

    if [[ "$PHP_COUNT" -gt 0 ]]; then
        log "  ${GREEN}✓${NC} PHP checks complete"
    fi

    phase_end
    log ""

    # ========================================================================
    # PHASE 2b: LARASTAN / PHPSTAN
    # ========================================================================
    if [[ "$PHP_COUNT" -gt 0 && -f "${BACKEND_DIR}/vendor/bin/phpstan" ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2b: Static Analysis (Larastan) ━━━${NC}"
        phase_start

        REL_FILES=$(echo "$CHANGED_PHP" | sed "s|^${BACKEND_DIR}/||" | tr '\n' ' ')
        PHPSTAN_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/phpstan analyse \
            --no-progress --error-format=raw --memory-limit=1G $REL_FILES 2>&1)
        PHPSTAN_RC=$?

        if [[ $PHPSTAN_RC -ne 0 ]]; then
            ERR_LINES=$(echo "$PHPSTAN_RESULT" | grep -E ':[0-9]+:' | head -20)
            ERR_COUNT=$(echo "$PHPSTAN_RESULT" | grep -cE ':[0-9]+:' || echo 0)
            log "  ${RED}❌ Larastan found ${ERR_COUNT} errors:${NC}"
            echo "$ERR_LINES" | head -20 | while read line; do log "     ${RED}${line}${NC}"; done
            if [[ "$ERR_COUNT" -gt 20 ]]; then
                log "     ${DIM}... ($((ERR_COUNT - 20)) more — run: vendor/bin/phpstan analyse)${NC}"
            fi
            inc_errors
        else
            log "  ${GREEN}✓${NC} Larastan clean on $PHP_COUNT files"
        fi

        phase_end
        log ""
    elif [[ "$PHP_COUNT" -gt 0 ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2b: Static Analysis ━━━${NC}"
        log "  ${DIM}Larastan not installed — skipping${NC}"
        log "  ${DIM}Install: composer require --dev larastan/larastan${NC}"
        log ""
    fi

    # ========================================================================
    # PHASE 2c: LARAVEL PINT FORMAT CHECK
    # ========================================================================
    if [[ "$PHP_COUNT" -gt 0 && -f "${BACKEND_DIR}/vendor/bin/pint" ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2c: Format Check (Pint) ━━━${NC}"
        phase_start

        REL_FILES=$(echo "$CHANGED_PHP" | sed "s|^${BACKEND_DIR}/||" | tr '\n' ' ')
        PINT_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/pint --test $REL_FILES 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${YELLOW}⚠️  Format issues — run: vendor/bin/pint${NC}"
            echo "$PINT_RESULT" | grep -E 'STYLE|FIXED' | head -5
            inc_warnings
        else
            log "  ${GREEN}✓${NC} Format clean"
        fi

        phase_end
        log ""
    fi

    # ========================================================================
    # PHASE 3: MIGRATION VALIDATION
    # ========================================================================
    CHANGED_MIGRATIONS=$(echo "$CHANGED_PHP" | grep 'database/migrations/' || true)
    if [[ -z "$CHANGED_MIGRATIONS" ]]; then
        MIGRATION_COUNT=0
    else
        MIGRATION_COUNT=$(echo "$CHANGED_MIGRATIONS" | wc -l | tr -d ' ')
    fi

    if [[ "$MIGRATION_COUNT" -gt 0 ]]; then
        log "${BOLD}${BLUE}━━━ Phase 3: Migration Validation ━━━${NC}"
        phase_start

        for MIGRATION in $CHANGED_MIGRATIONS; do
            if [[ ! -f "$MIGRATION" ]]; then continue; fi
            log "  Checking: ${CYAN}$(basename "$MIGRATION")${NC}"

            if ! php -l "$MIGRATION" > /dev/null 2>&1; then
                log "    ${RED}❌ PHP syntax error${NC}"
                inc_errors
                continue
            fi

            if ! grep -q 'function down' "$MIGRATION"; then
                log "    ${YELLOW}⚠️  No down() method (rollback won't work)${NC}"
                inc_warnings
            fi

            # Flag raw MySQL column types / SQL — not Laravel Schema ($table->dateTime() etc. are PG-safe).
            MYSQL_HITS=$(grep -nE '\bunsigned\b|\btinyint\b|\bmediumint\b|\bAUTO_INCREMENT\b' "$MIGRATION" 2>/dev/null | grep -v '//' | head -3)
            ENUM_HITS=$(grep -nE '\$table->enum\(|\->enum\(' "$MIGRATION" 2>/dev/null | head -3)
            MYSQL_HITS="${MYSQL_HITS}${ENUM_HITS:+$'\n'$ENUM_HITS}"
            MYSQL_HITS=$(echo "$MYSQL_HITS" | sed '/^$/d')
            if [[ -n "$MYSQL_HITS" ]]; then
                log "    ${RED}❌ MySQL-specific schema (Railway uses PostgreSQL):${NC}"
                echo "$MYSQL_HITS" | while read line; do log "       $line"; done
                inc_errors
            fi

            if grep -qE '\$table->id\(\)' "$MIGRATION" 2>/dev/null; then
                log "    ${YELLOW}⚠️  Uses \$table->id() — should be \$table->uuid('id')->primary()${NC}"
                inc_warnings
            fi

            if grep -qE 'foreignId\(' "$MIGRATION" 2>/dev/null; then
                log "    ${YELLOW}⚠️  Uses foreignId() — should this be foreignUuid()?${NC}"
                inc_warnings
            fi

            log "    ${GREEN}✓${NC} OK"
        done

        phase_end
        log ""
    fi

    # ========================================================================
    # PHASE 3b: SECRET SCANNER (gitleaks)
    # ========================================================================
    if command -v gitleaks > /dev/null 2>&1; then
        log "${BOLD}${BLUE}━━━ Phase 3b: Secret Scan ━━━${NC}"
        phase_start

        GITLEAKS_RESULT=$(gitleaks protect --staged --no-banner --redact -v 2>&1)
        GITLEAKS_RC=$?
        if [[ $GITLEAKS_RC -ne 0 ]]; then
            log "  ${RED}❌ Possible secrets in staged files:${NC}"
            echo "$GITLEAKS_RESULT" | head -20
            inc_errors
        else
            log "  ${GREEN}✓${NC} No secrets detected"
        fi

        phase_end
        log ""
    fi

    # ========================================================================
    # PHASE 4: LARAVEL BOOT CHECK
    # ========================================================================
    log "${BOLD}${BLUE}━━━ Phase 4: Laravel Boot Check ━━━${NC}"
    phase_start

    ARTISAN="php ${BACKEND_DIR}/artisan"

    CONFIG_RESULT=$($ARTISAN config:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${RED}❌ Config compilation failed:${NC}"
        echo "$CONFIG_RESULT" | tail -5
        inc_errors
    else
        log "  ${GREEN}✓${NC} Config compiles"
        $ARTISAN config:clear > /dev/null 2>&1
    fi

    ROUTE_RESULT=$($ARTISAN route:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        if echo "$ROUTE_RESULT" | grep -qi 'closure'; then
            log "  ${YELLOW}⚠️  Closure routes can't be cached (not a deploy blocker)${NC}"
            inc_warnings
        elif echo "$ROUTE_RESULT" | grep -qi 'already been assigned name'; then
            ROUTE_LIST_RESULT=$($ARTISAN route:list 2>&1)
            if [[ $? -eq 0 ]]; then
                log "  ${YELLOW}⚠️  Duplicate route names (route:cache disabled, routes work at runtime):${NC}"
                echo "$ROUTE_RESULT" | grep -i 'assigned name' | head -3
                inc_warnings
            else
                log "  ${RED}❌ Route compilation failed:${NC}"
                echo "$ROUTE_LIST_RESULT" | tail -10
                inc_errors
            fi
        else
            log "  ${RED}❌ Route compilation failed:${NC}"
            echo "$ROUTE_RESULT" | tail -10
            inc_errors
        fi
    else
        log "  ${GREEN}✓${NC} Routes compile and cache (no duplicate names)"
    fi
    $ARTISAN route:clear > /dev/null 2>&1

    EVENT_RESULT=$($ARTISAN event:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${YELLOW}⚠️  Event cache issue:${NC}"
        echo "$EVENT_RESULT" | tail -5
        inc_warnings
    else
        log "  ${GREEN}✓${NC} Events compile"
        $ARTISAN event:clear > /dev/null 2>&1
    fi

    DISCOVER_RESULT=$($ARTISAN package:discover --ansi 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${RED}❌ Package discovery failed:${NC}"
        echo "$DISCOVER_RESULT" | tail -10
        inc_errors
    else
        log "  ${GREEN}✓${NC} Package discovery OK"
    fi

    if [[ -f "${BACKEND_DIR}/composer.json" && -f "${BACKEND_DIR}/composer.lock" ]]; then
        COMPOSER_VALIDATE=$(cd "$BACKEND_DIR" && composer validate --no-check-all --no-check-publish 2>&1)
        if echo "$COMPOSER_VALIDATE" | grep -qi 'lock file is not up to date'; then
            log "  ${RED}❌ composer.lock out of sync — run: composer update --lock${NC}"
            inc_errors
        else
            log "  ${GREEN}✓${NC} composer.lock in sync"
        fi
    fi

    # PHP extension check
    if [[ -f "${BACKEND_DIR}/composer.lock" ]]; then
        REQUIRED_EXTS=$(php -r '
            $lock = json_decode(file_get_contents("'"${BACKEND_DIR}"'/composer.lock"), true);
            $exts = [];
            foreach (array_merge($lock["packages"] ?? [], $lock["packages-dev"] ?? []) as $pkg) {
                foreach ($pkg["require"] ?? [] as $dep => $ver) {
                    if (str_starts_with($dep, "ext-") && !in_array($dep, ["ext-mbstring","ext-openssl","ext-tokenizer","ext-ctype","ext-dom","ext-xml","ext-xmlwriter","ext-xmlreader","ext-fileinfo","ext-pdo","ext-curl","ext-filter","ext-hash","ext-json","ext-session","ext-simplexml","ext-iconv"])) {
                        $ext = substr($dep, 4);
                        $exts[$ext] = ($exts[$ext] ?? []);
                        $exts[$ext][] = $pkg["name"];
                    }
                }
            }
            foreach ($exts as $ext => $pkgs) {
                echo $ext . ":" . implode(",", array_unique($pkgs)) . "\n";
            }
        ' 2>/dev/null)

        if [[ -n "$REQUIRED_EXTS" ]]; then
            DEPLOY_DOCKERFILE=""
            for candidate in "docker/standalone/Dockerfile" "Dockerfile"; do
                if [[ -f "$candidate" ]]; then
                    DEPLOY_DOCKERFILE="$candidate"
                    break
                fi
            done

            if [[ -n "$DEPLOY_DOCKERFILE" ]]; then
                DOCKER_EXTS=$(grep -oE 'install-php-extensions\s+.*' "$DEPLOY_DOCKERFILE" 2>/dev/null \
                    | sed 's/install-php-extensions//' | tr ' ' '\n' | sed '/^$/d' | sort -u)

                EXT_MISSING=false
                while IFS=: read -r ext pkgs; do
                    if ! echo "$DOCKER_EXTS" | grep -qw "$ext"; then
                        if ! php -m 2>/dev/null | grep -qiw "$ext"; then
                            log "  ${RED}❌ Missing PHP extension in Docker: ext-${ext} (required by: ${pkgs})${NC}"
                            log "     ${RED}Add '${ext}' to install-php-extensions in ${DEPLOY_DOCKERFILE}${NC}"
                            EXT_MISSING=true
                            inc_errors
                        fi
                    fi
                done <<< "$REQUIRED_EXTS"
                if [[ "$EXT_MISSING" == false ]]; then
                    log "  ${GREEN}✓${NC} All required PHP extensions available in Docker"
                fi
            fi
        fi
    fi

    phase_end
    log ""

    # ========================================================================
    # PHASE 4b: MIGRATION DRY RUN (sqlite)
    # ========================================================================
    CHANGED_MIGRATIONS=${CHANGED_MIGRATIONS:-""}
    if [[ -n "$CHANGED_MIGRATIONS" ]]; then
        log "${BOLD}${BLUE}━━━ Phase 4b: Migration Dry Run (sqlite) ━━━${NC}"
        phase_start
        for MIGRATION in $CHANGED_MIGRATIONS; do
            if [[ ! -f "$MIGRATION" ]]; then continue; fi
            REL_PATH=${MIGRATION#$BACKEND_DIR/}
            log "  ${CYAN}→ $REL_PATH${NC}"
            MIG_RESULT=$(DB_CONNECTION=sqlite DB_DATABASE=:memory: $ARTISAN migrate --pretend --path="$REL_PATH" 2>&1)
            if [[ $? -ne 0 ]]; then
                log "    ${RED}❌ Migrate failed${NC}"
                echo "$MIG_RESULT" | tail -15
                inc_errors
            else
                log "    ${GREEN}✓${NC} OK"
            fi
        done
        phase_end
        log ""

        # ====================================================================
        # PHASE 4c: MIGRATION DRY RUN (real Postgres, --deep only)
        # ====================================================================
        if [[ "$DEEP" == true ]] && command -v docker > /dev/null 2>&1; then
            log "${BOLD}${BLUE}━━━ Phase 4c: Migration Dry Run (Postgres) ━━━${NC}"
            phase_start

            log "  ${CYAN}Starting throwaway Postgres...${NC}"
            PG_CID=$(docker run -d --rm \
                -e POSTGRES_PASSWORD=ship_test \
                -e POSTGRES_DB=ship_test \
                -p 54329:5432 \
                postgres:16-alpine 2>&1 | tail -1)

            if [[ -z "$PG_CID" ]] || ! echo "$PG_CID" | grep -qE '^[a-f0-9]{12,}$'; then
                log "  ${YELLOW}⚠️  Could not start Postgres container (skipping)${NC}"
                inc_warnings
            else
                # Wait for readiness
                for i in {1..15}; do
                    if docker exec "$PG_CID" pg_isready -U postgres > /dev/null 2>&1; then
                        break
                    fi
                    sleep 1
                done

                PG_FAIL=false
                for MIGRATION in $CHANGED_MIGRATIONS; do
                    if [[ ! -f "$MIGRATION" ]]; then continue; fi
                    REL_PATH=${MIGRATION#$BACKEND_DIR/}
                    log "  ${CYAN}→ $REL_PATH${NC}"
                    MIG_RESULT=$(DB_CONNECTION=pgsql DB_HOST=127.0.0.1 DB_PORT=54329 \
                        DB_DATABASE=ship_test DB_USERNAME=postgres DB_PASSWORD=ship_test \
                        $ARTISAN migrate --pretend --path="$REL_PATH" 2>&1)
                    if [[ $? -ne 0 ]]; then
                        log "    ${RED}❌ Postgres rejected migration${NC}"
                        echo "$MIG_RESULT" | tail -15
                        inc_errors
                        PG_FAIL=true
                    else
                        log "    ${GREEN}✓${NC} OK on Postgres"
                    fi
                done

                docker stop "$PG_CID" > /dev/null 2>&1

                if [[ "$PG_FAIL" == false ]]; then
                    log "  ${GREEN}✓${NC} All migrations valid against Postgres 16"
                fi
            fi

            phase_end
            log ""
        fi
    fi

    # ========================================================================
    # PHASE 5: NIXPACKS / DEPLOY CONFIG CHECK
    # ========================================================================
    log "${BOLD}${BLUE}━━━ Phase 5: Deploy Config ━━━${NC}"
    phase_start

    NIXPACKS_FILE=""
    for candidate in "${BACKEND_DIR}/nixpacks.toml" "nixpacks.toml" "Railway/nixpacks.toml"; do
        if [[ -f "$candidate" ]]; then
            NIXPACKS_FILE="$candidate"
            break
        fi
    done

    if [[ -n "$NIXPACKS_FILE" ]]; then
        log "  ${GREEN}✓${NC} Found: $NIXPACKS_FILE"

        if grep -q 'composer install' "$NIXPACKS_FILE" 2>/dev/null; then
            INSTALL_PHASE=$(grep -A1 '\[phases.install\]' "$NIXPACKS_FILE" 2>/dev/null | grep 'composer')
            if [[ -n "$INSTALL_PHASE" ]] && ! echo "$INSTALL_PHASE" | grep -q '\-\-no-scripts'; then
                log "  ${RED}❌ Nixpacks install phase runs composer WITHOUT --no-scripts${NC}"
                log "     ${RED}This causes RouteGroup errors in Docker. Add --no-scripts to install phase.${NC}"
                inc_errors
            else
                log "  ${GREEN}✓${NC} Install phase uses --no-scripts"
            fi

            BUILD_COMPOSER=$(grep -A5 '\[phases.build\]' "$NIXPACKS_FILE" 2>/dev/null | grep 'composer install')
            if [[ -n "$BUILD_COMPOSER" ]]; then
                log "  ${YELLOW}⚠️  Build phase also runs 'composer install' — redundant with install phase${NC}"
                inc_warnings
            fi
        fi

        if ! grep -q 'config:cache' "$NIXPACKS_FILE" 2>/dev/null; then
            log "  ${YELLOW}⚠️  nixpacks.toml missing 'config:cache' in build phase${NC}"
            inc_warnings
        fi
        if ! grep -q 'route:cache' "$NIXPACKS_FILE" 2>/dev/null; then
            log "  ${YELLOW}⚠️  nixpacks.toml missing 'route:cache' in build phase${NC}"
            inc_warnings
        fi
    elif [[ -f "Dockerfile" ]] || [[ -f "${BACKEND_DIR}/Dockerfile" ]]; then
        log "  ${GREEN}✓${NC} Dockerfile present"
    else
        log "  ${CYAN}ℹ${NC}  No nixpacks.toml or Dockerfile (Railway auto-detect)"
    fi

    if [[ -f "${BACKEND_DIR}/.env.example" && -d "${BACKEND_DIR}/config" ]]; then
        CONFIG_ENVS=$(grep -rohE "env\(\s*'([A-Z_]+)'" "${BACKEND_DIR}/config/" 2>/dev/null | grep -oE "'[A-Z_]+'" | tr -d "'" | sort -u)
        MISSING_FROM_EXAMPLE=""
        for var in $CONFIG_ENVS; do
            if ! grep -q "^${var}=" "${BACKEND_DIR}/.env.example" 2>/dev/null; then
                case "$var" in
                    APP_*|LOG_*|DB_*|MAIL_*|REDIS_*|CACHE_*|SESSION_*|QUEUE_*|SQS_*|MEMCACHED_*|DYNAMODB_*|BEANSTALKD_*|PAPERTRAIL_*|AUTH_*|MYSQL_*) continue ;;
                esac
                MISSING_FROM_EXAMPLE+="$var "
            fi
        done
        if [[ -n "$MISSING_FROM_EXAMPLE" ]]; then
            log "  ${YELLOW}⚠️  Env vars in config/ not in .env.example: ${MISSING_FROM_EXAMPLE}${NC}"
            inc_warnings
        else
            log "  ${GREEN}✓${NC} .env.example covers config/ env vars"
        fi
    fi

    HARDCODED_RAILWAY=$(grep -rl '\.railway\.internal' "${BACKEND_DIR}/app/" "${BACKEND_DIR}/routes/" 2>/dev/null || true)
    if [[ -n "$HARDCODED_RAILWAY" ]]; then
        log "  ${RED}❌ Hardcoded Railway hostnames in app/routes code:${NC}"
        echo "$HARDCODED_RAILWAY" | while read f; do log "     $f"; done
        inc_errors
    else
        log "  ${GREEN}✓${NC} No hardcoded Railway hostnames in app code"
    fi

    HARDCODED_LOCAL=$(grep -rlnE '(localhost|127\.0\.0\.1|0\.0\.0\.0):[0-9]+' "${BACKEND_DIR}/app/" "${BACKEND_DIR}/config/" "${BACKEND_DIR}/routes/" 2>/dev/null \
        | grep -v '.example' | head -5 || true)
    if [[ -n "$HARDCODED_LOCAL" ]]; then
        log "  ${YELLOW}⚠️  Hardcoded localhost URLs:${NC}"
        echo "$HARDCODED_LOCAL" | while read f; do log "     ${YELLOW}$f${NC}"; done
        inc_warnings
    else
        log "  ${GREEN}✓${NC} No hardcoded localhost URLs"
    fi

    phase_end
    log ""

    # ========================================================================
    # PHASE 5b: DOCKER BUILD TEST (--deep only)
    # ========================================================================
    if [[ "$DEEP" == true ]] && command -v docker > /dev/null 2>&1; then
        DOCKERFILE_PATH=""
        for candidate in "docker/standalone/Dockerfile" "Dockerfile" "${BACKEND_DIR}/Dockerfile"; do
            if [[ -f "$candidate" ]]; then
                DOCKERFILE_PATH="$candidate"
                break
            fi
        done

        if [[ -n "$DOCKERFILE_PATH" ]]; then
            log "${BOLD}${BLUE}━━━ Phase 5b: Docker Build Test ━━━${NC}"
            phase_start
            log "  ${CYAN}Building ${DOCKERFILE_PATH}... (may take 1-3 min)${NC}"

            BUILD_LOG=$(mktemp)
            docker build -f "$DOCKERFILE_PATH" -t ship-test:latest . > "$BUILD_LOG" 2>&1
            BUILD_RC=$?

            if [[ $BUILD_RC -ne 0 ]]; then
                log "  ${RED}❌ Docker build failed — Railway will fail too${NC}"
                tail -30 "$BUILD_LOG"
                inc_errors
                DOCKER_IMAGE_BUILT=false
            else
                log "  ${GREEN}✓${NC} Docker build succeeds"
                DOCKER_IMAGE_BUILT=true
            fi
            rm -f "$BUILD_LOG"

            phase_end
            log ""

            # ================================================================
            # PHASE 5c: TRIVY CVE SCAN (only if Docker built)
            # ================================================================
            if [[ "${DOCKER_IMAGE_BUILT:-false}" == true ]] && command -v trivy > /dev/null 2>&1; then
                log "${BOLD}${BLUE}━━━ Phase 5c: Container CVE Scan (Trivy) ━━━${NC}"
                phase_start

                TRIVY_RESULT=$(trivy image \
                    --severity HIGH,CRITICAL \
                    --ignore-unfixed \
                    --no-progress \
                    --format table \
                    --cache-dir /tmp/trivy-cache \
                    ship-test:latest 2>&1)
                TRIVY_RC=$?

                VULN_COUNT=$(echo "$TRIVY_RESULT" | grep -cE 'HIGH|CRITICAL' || echo 0)
                if [[ "$VULN_COUNT" -gt 0 ]]; then
                    log "  ${YELLOW}⚠️  ${VULN_COUNT} fixable HIGH/CRITICAL CVEs${NC}"
                    echo "$TRIVY_RESULT" | tail -25
                    inc_warnings
                else
                    log "  ${GREEN}✓${NC} No fixable HIGH/CRITICAL CVEs"
                fi

                phase_end
                log ""
            fi

            # Clean up test image
            docker rmi ship-test:latest > /dev/null 2>&1
        fi
    fi

    # ========================================================================
    # PHASE 7c: TESTS (Pest / PHPUnit) — --deep only
    # ========================================================================
    if [[ "$DEEP" == true ]]; then
        if [[ -f "${BACKEND_DIR}/vendor/bin/pest" ]]; then
            log "${BOLD}${BLUE}━━━ Phase 7c: Tests (Pest) ━━━${NC}"
            phase_start
            TEST_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/pest --parallel --bail --compact 2>&1)
            if [[ $? -ne 0 ]]; then
                log "  ${RED}❌ Tests failed${NC}"
                echo "$TEST_RESULT" | tail -30
                inc_errors
            else
                PASSED=$(echo "$TEST_RESULT" | grep -oE '[0-9]+ passed' | head -1)
                log "  ${GREEN}✓${NC} ${PASSED:-tests passed}"
            fi
            phase_end
            log ""
        elif [[ -f "${BACKEND_DIR}/vendor/bin/phpunit" ]]; then
            log "${BOLD}${BLUE}━━━ Phase 7c: Tests (PHPUnit) ━━━${NC}"
            phase_start
            TEST_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/phpunit --stop-on-failure 2>&1)
            if [[ $? -ne 0 ]]; then
                log "  ${RED}❌ Tests failed${NC}"
                echo "$TEST_RESULT" | tail -30
                inc_errors
            else
                log "  ${GREEN}✓${NC} Tests pass"
            fi
            phase_end
            log ""
        fi
    fi
fi

# ============================================================================
# PHASE 6: FRONTEND CHECKS
# ============================================================================
if [[ -n "$FRONTEND_DIR" && -f "${FRONTEND_DIR}/package.json" ]]; then
    log "${BOLD}${BLUE}━━━ Phase 6: Frontend Checks ━━━${NC}"
    phase_start

    CHANGED_JS=$(
        { git diff --name-only HEAD 2>/dev/null
          git diff --name-only --cached 2>/dev/null
          git ls-files --others --exclude-standard 2>/dev/null
        } | grep -E '\.(ts|tsx|js|jsx|vue)$' | sort -u
    ) || true

    if [[ -z "$CHANGED_JS" ]]; then
        JS_COUNT=0
    else
        JS_COUNT=$(echo "$CHANGED_JS" | wc -l | tr -d ' ')
    fi
    log "  JS/TS/Vue files changed: ${BOLD}$JS_COUNT${NC}"

    if [[ "$JS_COUNT" -gt 0 ]]; then
        CONSOLE_HITS=""
        for FILE in $CHANGED_JS; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            if echo "$FILE" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then continue; fi
            if echo "$FILE" | grep -qE 'node_modules|vendor|dist/|\.cjs$'; then continue; fi
            if [[ "$(dirname "$FILE")" == "." ]]; then continue; fi
            HITS=$(grep -nE '^\s*(console\.(log|debug|info)\(|debugger\b)' "$FILE" 2>/dev/null | head -3 || true)
            if [[ -n "$HITS" ]]; then
                CONSOLE_HITS+="  $FILE:\n$HITS\n"
            fi
        done
        if [[ -n "$CONSOLE_HITS" ]]; then
            log "  ${YELLOW}⚠️  console.log/debugger in production code:${NC}"
            echo -e "$CONSOLE_HITS" | head -15
            inc_warnings
        else
            log "  ${GREEN}✓${NC} No debug statements"
        fi

        ANY_HITS=""
        for FILE in $CHANGED_JS; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            if echo "$FILE" | grep -qE '\.(js|jsx)$'; then continue; fi
            if echo "$FILE" | grep -qE 'node_modules|vendor|dist/'; then continue; fi
            HITS=$(grep -nE ':\s*any\b|<any>|as any' "$FILE" 2>/dev/null | head -3 || true)
            if [[ -n "$HITS" ]]; then
                ANY_COUNT=$(grep -cE ':\s*any\b|<any>|as any' "$FILE" 2>/dev/null || echo 0)
                ANY_HITS+="  $FILE ($ANY_COUNT instances)\n"
            fi
        done
        if [[ -n "$ANY_HITS" ]]; then
            log "  ${YELLOW}⚠️  TypeScript 'any' types:${NC}"
            echo -e "$ANY_HITS" | head -10
            inc_warnings
        else
            log "  ${GREEN}✓${NC} No 'any' types"
        fi

        # ESLint on changed files
        if [[ -f "${FRONTEND_DIR}/.eslintrc.js" || -f "${FRONTEND_DIR}/.eslintrc.json" || -f "${FRONTEND_DIR}/eslint.config.js" || -f "${FRONTEND_DIR}/eslint.config.mjs" ]]; then
            ESLINT_FILES=$(echo "$CHANGED_JS" | grep -v node_modules | grep -v dist/ | tr '\n' ' ')
            if [[ -n "$ESLINT_FILES" ]]; then
                log "  ${CYAN}ESLint...${NC}"
                ESLINT_RESULT=$(cd "$FRONTEND_DIR" && npx eslint --no-error-on-unmatched-pattern $ESLINT_FILES 2>&1)
                if [[ $? -ne 0 ]]; then
                    ESLINT_ERRORS=$(echo "$ESLINT_RESULT" | grep -cE '^\s+[0-9]+:[0-9]+.*error' || echo 0)
                    if [[ "$ESLINT_ERRORS" -gt 0 ]]; then
                        log "  ${RED}❌ ESLint: ${ESLINT_ERRORS} errors${NC}"
                        echo "$ESLINT_RESULT" | grep -E 'error|warning' | head -10
                        inc_errors
                    else
                        log "  ${YELLOW}⚠️  ESLint warnings${NC}"
                        echo "$ESLINT_RESULT" | grep -E 'warning' | head -5
                        inc_warnings
                    fi
                else
                    log "  ${GREEN}✓${NC} ESLint clean"
                fi
            fi
        fi
    fi

    TSCONFIG=""
    for candidate in "${FRONTEND_DIR}/tsconfig.json" "tsconfig.json"; do
        if [[ -f "$candidate" ]]; then
            TSCONFIG="$candidate"
            break
        fi
    done

    # ── Orphaned import check ──────────────────────────────────────────────────
    # Find imports referencing files that don't exist at all (even case-insensitive).
    # These always break the build in Docker.
    # Resolve @/ alias from vite.config.ts (defaults to resources/js).
    ALIAS_BASE="${FRONTEND_DIR}/resources/js"
    if [[ -f "${FRONTEND_DIR}/vite.config.ts" ]]; then
        # Match both '@': path.resolve(__dirname, './src') and "@": "./src" patterns
        ALIAS_LINE=$(grep -oE "['\"]@['\"].*['\"][^'\"]*['\"]" "${FRONTEND_DIR}/vite.config.ts" 2>/dev/null | head -1 || true)
        if [[ -n "$ALIAS_LINE" ]]; then
            ALIAS_DIR=$(echo "$ALIAS_LINE" | grep -oE "['\"][^'\"]*['\"]$" | tr -d "\"'" | sed 's|^\./||')
            if [[ -d "${FRONTEND_DIR}/${ALIAS_DIR}" ]]; then
                ALIAS_BASE="${FRONTEND_DIR}/${ALIAS_DIR}"
            fi
        fi
    fi

    ORPHAN_IMPORTS=""
    for SRC_FILE in $(find "${FRONTEND_DIR}" -type f \( -name '*.vue' -o -name '*.tsx' -o -name '*.ts' \) ! -path '*/node_modules/*' ! -path '*/vendor/*' ! -path '*/.git/*' 2>/dev/null); do
        IMPORTS=$(grep -oE "from ['\"]@/[^'\"]+['\"]" "$SRC_FILE" 2>/dev/null | sed "s/from ['\"]@\///;s/['\"]$//" || true)
        for IMPORT_PATH in $IMPORTS; do
            # Skip extensionless imports (Vite resolves .ts/.tsx/.vue/.js)
            if [[ "$IMPORT_PATH" != *.* ]]; then continue; fi
            # Skip type imports (.d suffix — Vite appends .ts)
            if [[ "$IMPORT_PATH" == *.d ]]; then continue; fi
            RESOLVED="${ALIAS_BASE}/${IMPORT_PATH}"
            # If the file doesn't exist even on case-insensitive macOS, it's truly orphaned
            if [[ ! -f "$RESOLVED" ]]; then
                ORPHAN_IMPORTS+="  ${SRC_FILE##*/}: @/${IMPORT_PATH}\n"
            fi
        done
    done
    if [[ -n "$ORPHAN_IMPORTS" ]]; then
        log "  ${RED}❌ Orphaned imports (files don't exist, will fail in Docker):${NC}"
        echo -e "$ORPHAN_IMPORTS" | head -10
        inc_errors
    fi

    VITE_BUILD_OK=false
    if grep -q '"build"' "${FRONTEND_DIR}/package.json" 2>/dev/null; then
        BUILD_SCRIPT=$(grep '"build"' "${FRONTEND_DIR}/package.json" | head -1)
        if echo "$BUILD_SCRIPT" | grep -qE 'monorepo-build|RAILWAY_SERVICE_NAME'; then
            log "  ${CYAN}ℹ${NC}  Monorepo build (needs RAILWAY_SERVICE_NAME) — skipping local build test"
        else
            log "  ${CYAN}Vite build...${NC}"
            BUILD_OK=false
            BUILD_RESULT=""
            for attempt in 1 2 3; do
                BUILD_RESULT=$(cd "$FRONTEND_DIR" && npm run build 2>&1)
                if [[ $? -eq 0 ]]; then
                    BUILD_OK=true
                    break
                fi
                if echo "$BUILD_RESULT" | grep -qi 'RAILWAY_SERVICE_NAME\|could not determine workspace'; then
                    log "  ${CYAN}ℹ${NC}  Monorepo build skipped (needs RAILWAY_SERVICE_NAME)"
                    BUILD_RESULT=""
                    break
                fi
                # vite-plugin-pwa injectManifest can flake (race / stale intermediate); retry before failing
                if [[ "$attempt" -lt 3 ]] && echo "$BUILD_RESULT" | grep -qiE 'injectManifest|__WB_MANIFEST|Unable to find a place to inject'; then
                    log "  ${YELLOW}⚠️  PWA injectManifest failed (attempt ${attempt}/3) — retrying...${NC}"
                    rm -f "${FRONTEND_DIR}/public/build/service-worker.mjs" "${FRONTEND_DIR}/public/build/service-worker.js" "${FRONTEND_DIR}/public/build/service-worker.js.map" 2>/dev/null || true
                    sleep 2
                    continue
                fi
                break
            done
            if [[ "$BUILD_OK" == true ]]; then
                log "  ${GREEN}✓${NC} Build passed"
                VITE_BUILD_OK=true
            elif echo "$BUILD_RESULT" | grep -qi 'RAILWAY_SERVICE_NAME\|could not determine workspace'; then
                :
            else
                log "  ${RED}❌ Build FAILED:${NC}"
                echo "$BUILD_RESULT" | tail -15
                inc_errors
            fi
        fi
    fi

    if [[ -n "$TSCONFIG" ]] && command -v npx &> /dev/null; then
        log "  ${CYAN}TypeScript check...${NC}"
        # Use vue-tsc for Vue projects (plain tsc can't resolve .vue imports)
        if [[ -f "${FRONTEND_DIR}/node_modules/.bin/vue-tsc" ]]; then
            TSC_RESULT=$(cd "$FRONTEND_DIR" && npx vue-tsc --noEmit 2>&1)
        else
            TSC_RESULT=$(npx tsc --noEmit -p "$TSCONFIG" 2>&1)
        fi
        if [[ $? -ne 0 ]]; then
            TSC_ERRORS=$(echo "$TSC_RESULT" | grep -c 'error TS' || echo 0)
            log "  ${RED}❌ TypeScript: $TSC_ERRORS errors (Vite strips types — TS errors are runtime crashes)${NC}"
            echo "$TSC_RESULT" | grep 'error TS' | head -10
            inc_errors
        else
            log "  ${GREEN}✓${NC} TypeScript passes"
        fi
    fi

    if [[ "$HAS_INERTIA" == true ]]; then
        if grep -q '"build:ssr"' "${FRONTEND_DIR}/package.json" 2>/dev/null; then
            log "  ${CYAN}SSR build...${NC}"
            SSR_RESULT=$(cd "$FRONTEND_DIR" && npm run build:ssr 2>&1)
            if [[ $? -ne 0 ]]; then
                log "  ${RED}❌ SSR build FAILED:${NC}"
                echo "$SSR_RESULT" | tail -15
                inc_errors
            else
                log "  ${GREEN}✓${NC} SSR build passed"
            fi
        fi
    fi

    phase_end
    log ""
fi

# ============================================================================
# PHASE 6b: DEPENDENCY AUDIT (composer + npm)
# ============================================================================
log "${BOLD}${BLUE}━━━ Phase 6b: Dependency Audit ━━━${NC}"
phase_start

if [[ -n "$BACKEND_DIR" && -f "${BACKEND_DIR}/composer.lock" ]]; then
    COMPOSER_AUDIT=$(cd "$BACKEND_DIR" && composer audit --format=plain --no-interaction 2>&1)
    COMPOSER_AUDIT_RC=$?
    if [[ $COMPOSER_AUDIT_RC -ne 0 ]]; then
        VULN_LINES=$(echo "$COMPOSER_AUDIT" | grep -cE '^\+\-\-\-|^Advisory' || echo 0)
        log "  ${YELLOW}⚠️  composer audit found vulnerabilities${NC}"
        echo "$COMPOSER_AUDIT" | grep -E 'Severity|Package|Title|CVE' | head -12
        inc_warnings
    else
        log "  ${GREEN}✓${NC} composer: no known vulnerabilities"
    fi
fi

if [[ -n "$FRONTEND_DIR" && -f "${FRONTEND_DIR}/package-lock.json" ]]; then
    NPM_AUDIT=$(cd "$FRONTEND_DIR" && npm audit --audit-level=high --json 2>/dev/null)
    CRITICAL=$(echo "$NPM_AUDIT" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null)
    HIGH=$(echo "$NPM_AUDIT" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null)
    if [[ "${CRITICAL:-0}" -gt 0 || "${HIGH:-0}" -gt 0 ]]; then
        log "  ${YELLOW}⚠️  npm: ${CRITICAL} critical, ${HIGH} high vulnerabilities${NC}"
        log "     ${DIM}Run: cd ${FRONTEND_DIR} && npm audit${NC}"
        inc_warnings
    else
        log "  ${GREEN}✓${NC} npm: no high/critical vulnerabilities"
    fi
fi

phase_end
log ""

# ============================================================================
# PHASE 6c: OPENAPI DRIFT (if scramble detected)
# ============================================================================
if [[ -n "$BACKEND_DIR" ]] && grep -q 'dedoc/scramble' "${BACKEND_DIR}/composer.json" 2>/dev/null; then
    log "${BOLD}${BLUE}━━━ Phase 6c: OpenAPI Drift ━━━${NC}"
    phase_start

    SPEC_FILE=""
    for candidate in "${BACKEND_DIR}/public/openapi.json" "${BACKEND_DIR}/storage/app/openapi.json" "public/openapi.json"; do
        if [[ -f "$candidate" ]]; then
            SPEC_FILE="$candidate"
            break
        fi
    done

    if [[ -n "$SPEC_FILE" ]]; then
        CURRENT_SPEC=$($ARTISAN scramble:export 2>/dev/null)
        if [[ -n "$CURRENT_SPEC" ]]; then
            if ! diff -q <(echo "$CURRENT_SPEC" | jq -S . 2>/dev/null) <(jq -S . "$SPEC_FILE" 2>/dev/null) > /dev/null 2>&1; then
                log "  ${YELLOW}⚠️  API spec drift detected${NC}"
                log "     ${DIM}Regenerate: php artisan scramble:export > ${SPEC_FILE}${NC}"
                inc_warnings
            else
                log "  ${GREEN}✓${NC} API spec in sync"
            fi
        fi
    else
        log "  ${DIM}No published spec — skip${NC}"
    fi

    phase_end
    log ""
fi

# ============================================================================
# PHASE 7: INERTIA / MULTI-APP CHECKS
# ============================================================================
if [[ "$HAS_INERTIA" == true || "$IS_MULTIAPP" == true ]]; then
    log "${BOLD}${BLUE}━━━ Phase 7: Platform-Specific Checks ━━━${NC}"
    phase_start

    if [[ "$HAS_INERTIA" == true ]]; then
        if [[ -n "$CHANGED_JS" ]]; then
            SSR_ISSUES=""
            for FILE in $CHANGED_JS; do
                if [[ ! -f "$FILE" ]]; then continue; fi
                BARE_WINDOW=$(grep -nE '(?<!typeof )(window\.|document\.|localStorage|sessionStorage)' "$FILE" 2>/dev/null \
                    | grep -v 'typeof' | grep -v '//' | grep -v '\.d\.ts' | head -3 || true)
                if [[ -n "$BARE_WINDOW" ]]; then
                    SSR_ISSUES+="  $FILE\n"
                fi
            done
            if [[ -n "$SSR_ISSUES" ]]; then
                log "  ${YELLOW}⚠️  SSR-incompatible code (window/document without guard):${NC}"
                echo -e "$SSR_ISSUES" | head -10
                inc_warnings
            else
                log "  ${GREEN}✓${NC} No SSR issues"
            fi
        fi

        if [[ ! -f "public/build/manifest.json" ]] && [[ ! -f "public/build/.vite/manifest.json" ]]; then
            log "  ${YELLOW}⚠️  Vite manifest missing — SSR may crash${NC}"
            inc_warnings
        fi
    fi

    # 4healthcare: no multisite brand checks needed (single-tenant SPA)

    phase_end
    log ""
fi

# ============================================================================
# PHASE 7b: DEEP SAFETY CHECKS
# ============================================================================
if [[ -n "$BACKEND_DIR" && -d "${BACKEND_DIR}/app" ]]; then
    log "${BOLD}${BLUE}━━━ Phase 7b: Deep Safety Checks ━━━${NC}"
    phase_start

    if [[ -n "$CHANGED_PHP" ]]; then
        IMPORT_ISSUES=""
        for FILE in $CHANGED_PHP; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            APP_IMPORTS=$(grep -oP 'use App\\[A-Za-z\\]+' "$FILE" 2>/dev/null | sed 's/use //' || true)
            for CLASS in $APP_IMPORTS; do
                CLASS_PATH=$(echo "$CLASS" | sed 's|\\|/|g' | sed 's|^App/|app/|').php
                if [[ ! -f "$CLASS_PATH" ]]; then
                    IMPORT_ISSUES+="  ${RED}❌ $FILE imports $CLASS — file not found: $CLASS_PATH${NC}\n"
                fi
            done
        done
        if [[ -n "$IMPORT_ISSUES" ]]; then
            log "  ${RED}Broken PHP imports (class files don't exist):${NC}"
            echo -e "$IMPORT_ISSUES" | head -10
            inc_errors
        else
            log "  ${GREEN}✓${NC} PHP imports resolve"
        fi
    fi

    DEPRECATED_MODELS="claude-3\.5-sonnet|claude-3-opus|claude-3-haiku|claude-3\.5-haiku|gemini-1\.0-pro|gemini-pro[^-]|gpt-4-turbo-preview|gpt-4-0613|gpt-4-0314|gpt-3\.5-turbo-0301"
    STALE_AI=$(grep -rnE "$DEPRECATED_MODELS" "${BACKEND_DIR}/app/" "${BACKEND_DIR}/config/" --include='*.php' 2>/dev/null \
        | grep -v '//' | grep -v 'vendor/' | grep -v '\.blade\.' | grep -v 'DEPRECATED_MODELS' || true)
    if [[ -n "$STALE_AI" ]]; then
        log "  ${YELLOW}⚠️  Deprecated AI model references (may 404 in production):${NC}"
        echo "$STALE_AI" | head -5 | while read line; do log "     ${YELLOW}$line${NC}"; done
        inc_warnings
    else
        log "  ${GREEN}✓${NC} No deprecated AI models"
    fi

    # ── OpenRouter model ID format ──
    # Dashes-not-dots killed 11,732 articles (commit 59484d8c).
    # OpenRouter IDs use "anthropic/" prefix with dots: anthropic/claude-haiku-4.5
    # NOT: anthropic/claude-haiku-4-5-20251001 (that's Anthropic direct API format
    # with prefix — never valid on OpenRouter).
    # Only flag IDs that have the "anthropic/" or similar provider prefix AND a
    # dash-separated date suffix, since that combo is always wrong on OpenRouter.
    BAD_MODEL_IDS=$(grep -rnE "anthropic/claude-[a-z]+-[0-9]+-[0-9]+-[0-9]+" "${BACKEND_DIR}/app/" "${BACKEND_DIR}/config/" --include='*.php' 2>/dev/null \
        | grep -v '//' | grep -v 'vendor/' | grep -v 'DEPRECATED' || true)
    if [[ -n "$BAD_MODEL_IDS" ]]; then
        log "  ${RED}❌ Invalid OpenRouter model IDs (provider-prefixed + date-suffixed):${NC}"
        echo "$BAD_MODEL_IDS" | head -5 | while read line; do log "     ${RED}$line${NC}"; done
        log "     ${RED}OpenRouter format: 'anthropic/claude-haiku-4.5' (dots, no date)${NC}"
        log "     ${RED}Anthropic direct: 'claude-sonnet-4-5-20250514' (no provider prefix)${NC}"
        inc_errors
    else
        log "  ${GREEN}✓${NC} No malformed OpenRouter model IDs"
    fi

    # ── Haversine acos() without domain clamp ──
    # Floating-point precision can push acos() arg >1.0, returning NaN (commit 1a8a76a2, 17 files).
    ACOS_UNSAFE=$(grep -rnE 'acos\(' "${BACKEND_DIR}/app/" --include='*.php' 2>/dev/null \
        | grep -v 'LEAST\|GREATEST\|clamp\|min(1\|max(-1' | grep -v '//' | grep -v 'vendor/' || true)
    if [[ -n "$ACOS_UNSAFE" ]]; then
        log "  ${YELLOW}⚠️  acos() without LEAST/GREATEST domain clamp (NaN on edge cases):${NC}"
        echo "$ACOS_UNSAFE" | head -5 | while read line; do log "     ${YELLOW}$line${NC}"; done
        log "     ${YELLOW}Wrap: acos(LEAST(1.0, GREATEST(-1.0, ...)))${NC}"
        inc_warnings
    else
        log "  ${GREEN}✓${NC} Haversine acos() calls are domain-safe"
    fi

    DISTINCT_ORDER_ISSUES=""
    DISTINCT_FILES=$(grep -rlE '->distinct\(\)' "${BACKEND_DIR}/app/" --include='*.php' 2>/dev/null || true)
    for FILE in $DISTINCT_FILES; do
        if grep -qE '->(orderBy|latest|oldest)\(' "$FILE" 2>/dev/null; then
            DISTINCT_LINES=$(grep -nE '->distinct\(\)' "$FILE" | cut -d: -f1)
            for DLINE in $DISTINCT_LINES; do
                RANGE_START=$((DLINE - 5))
                RANGE_END=$((DLINE + 15))
                NEARBY=$(sed -n "${RANGE_START},${RANGE_END}p" "$FILE" 2>/dev/null | grep -E '->(orderBy|latest|oldest)\(' || true)
                if [[ -n "$NEARBY" ]]; then
                    DISTINCT_ORDER_ISSUES+="     ${YELLOW}$FILE:$DLINE — distinct() with orderBy (PostgreSQL rejects this)${NC}\n"
                fi
            done
        fi
    done
    if [[ -n "$DISTINCT_ORDER_ISSUES" ]]; then
        log "  ${YELLOW}⚠️  PostgreSQL-incompatible queries:${NC}"
        echo -e "$DISTINCT_ORDER_ISSUES" | head -5
        inc_warnings
    else
        log "  ${GREEN}✓${NC} No distinct()+orderBy() conflicts"
    fi

    NGINX_ISSUES=""
    NGINX_CONFS=$(find docker -name '*.conf' -path '*/nginx/*' 2>/dev/null || true)
    for CONF in $NGINX_CONFS; do
        if [[ ! -f "$CONF" ]]; then continue; fi
        PROBLEM_BLOCKS=$(awk '
            /location.*(\.php|index\.php).*\{/ { in_block=1; block=""; has_fastcgi=0; line=NR; loc=$0 }
            in_block { block = block "\n" $0 }
            in_block && /fastcgi_pass/ { has_fastcgi=1 }
            in_block && /\}/ {
                if (!has_fastcgi && loc !~ /healthcheck/) {
                    print "line " line ": " loc " — matches PHP but no fastcgi_pass"
                }
                in_block=0
            }
        ' "$CONF" 2>/dev/null)
        if [[ -n "$PROBLEM_BLOCKS" ]]; then
            NGINX_ISSUES+="  ${RED}❌ $CONF:${NC}\n"
            echo "$PROBLEM_BLOCKS" | while read line; do NGINX_ISSUES+="     ${RED}$line${NC}\n"; done
        fi
    done
    if [[ -n "$NGINX_ISSUES" ]]; then
        log "  ${RED}Nginx location blocks handling PHP without fastcgi_pass:${NC}"
        echo -e "$NGINX_ISSUES"
        inc_errors
    else
        log "  ${GREEN}✓${NC} Nginx PHP handlers valid"
    fi

    # Unsafe explode() calls: explode on model properties, config() without default, or env() without default
    # PHP 8.1+ throws TypeError when explode() receives null — production 500s
    EXPLODE_ISSUES=""
    if [[ -n "$CHANGED_PHP" ]]; then
        for FILE in $CHANGED_PHP; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            # Pattern 1: explode on model/object properties that could be null: explode('x', $foo->bar)
            # -Fv 'if (' avoids BRE "\(" which breaks macOS grep (unbalanced parentheses)
            HITS=$(grep -nE 'explode\([^)]+\$\w+->\w+\)' "$FILE" 2>/dev/null | grep -v '(string)' | grep -v '??' | grep -Fv 'if (' || true)
            for HIT in $HITS; do
                LINE_NUM=$(echo "$HIT" | cut -d: -f1)
                # Check if there's a null guard in the 3 lines above
                RANGE_START=$((LINE_NUM - 3))
                if [[ $RANGE_START -lt 1 ]]; then RANGE_START=1; fi
                GUARD=$(sed -n "${RANGE_START},${LINE_NUM}p" "$FILE" 2>/dev/null | grep -E 'if \(\$|!== null|\?\?' || true)
                if [[ -z "$GUARD" ]]; then
                    EXPLODE_ISSUES+="     ${YELLOW}$FILE:$LINE_NUM — explode() on nullable model property (use (string) cast or ?? '')${NC}\n"
                fi
            done
        done
    fi
    if [[ -n "$EXPLODE_ISSUES" ]]; then
        log "  ${YELLOW}⚠️  Potentially unsafe explode() calls (TypeError if null in PHP 8.1+):${NC}"
        echo -e "$EXPLODE_ISSUES" | head -8
        inc_warnings
    else
        log "  ${GREEN}✓${NC} No unsafe explode() patterns"
    fi

    if [[ -n "$CHANGED_JS" ]]; then
        # ── PHI / HIPAA safety check ──
        # Flag potential PHI logging (patient names, SSN patterns, DOB in console/log output)
        PHI_ISSUES=""
        for FILE in $CHANGED_JS; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            if echo "$FILE" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then continue; fi
            HITS=$(grep -nE 'console\.(log|warn|info|error)\(.*\b(patient|ssn|dob|date_of_birth|social_security)\b' "$FILE" 2>/dev/null | head -3 || true)
            if [[ -n "$HITS" ]]; then
                PHI_ISSUES+="  ${RED}❌ $FILE — potential PHI in console output:${NC}\n"
                echo "$HITS" | while read line; do PHI_ISSUES+="     ${RED}$line${NC}\n"; done
            fi
        done
        if [[ -n "$PHI_ISSUES" ]]; then
            log "  ${RED}Potential PHI exposure in frontend logging:${NC}"
            echo -e "$PHI_ISSUES" | head -15
            inc_errors
        else
            log "  ${GREEN}✓${NC} No PHI in console output"
        fi

        # ── .toFixed() on nullable values ──
        # Calling .toFixed() on undefined/null crashes React (multiple production fixes).
        # Safe: Number(val ?? 0).toFixed(1)  |  Unsafe: foo.rating.toFixed(1)
        TOFIXED_ISSUES=""
        for FILE in $CHANGED_JS; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            # Match .toFixed( NOT preceded by Number( or parseFloat( on the same line
            HITS=$(grep -nE '\.toFixed\(' "$FILE" 2>/dev/null | grep -v 'Number(' | grep -v 'parseFloat(' | grep -v '//' | head -3 || true)
            if [[ -n "$HITS" ]]; then
                TOFIXED_ISSUES+="  ${YELLOW}$FILE${NC}\n"
                echo "$HITS" | while read line; do TOFIXED_ISSUES+="     ${YELLOW}$line${NC}\n"; done
            fi
        done
        if [[ -n "$TOFIXED_ISSUES" ]]; then
            log "  ${YELLOW}⚠️  .toFixed() without Number() wrap (crashes if value is null/undefined):${NC}"
            echo -e "$TOFIXED_ISSUES" | head -10
            log "     ${YELLOW}Fix: Number(value ?? 0).toFixed(N)${NC}"
            inc_warnings
        else
            log "  ${GREEN}✓${NC} No unsafe .toFixed() calls"
        fi
    fi

    phase_end
    log ""
fi

# ============================================================================
# SUMMARY
# ============================================================================
SHIP_ELAPSED=$(( $(date +%s) - SHIP_START ))

log "${BOLD}${BLUE}━━━ Summary ━━━${NC}"
log ""
log "  ${DIM}Duration: ${SHIP_ELAPSED}s${NC}"
log ""

if [[ $WARNINGS -gt 0 ]]; then
    log "  ${YELLOW}⚠️  Warnings:  $WARNINGS${NC}"
fi
if [[ $ERRORS -gt 0 ]]; then
    log "  ${RED}❌ Errors:    $ERRORS${NC}"
    log ""
    log "${RED}${BOLD}══════════════════════════════════════════════════════${NC}"
    log "${RED}${BOLD}  BLOCKED — Fix $ERRORS error(s) before shipping     ${NC}"
    log "${RED}${BOLD}══════════════════════════════════════════════════════${NC}"
    log ""
    log "  To force: ${YELLOW}./ship.sh \"message\" --force${NC}"
    if [[ -n "$REPORT_FILE" ]]; then
        log "  Report:   ${CYAN}$REPORT_FILE${NC}"
    fi
    exit 1
fi

log "  ${GREEN}${BOLD}✅ ALL CHECKS PASSED${NC}"
log ""

if [[ "$MODE" == "dry" || -z "$COMMIT_MSG" ]]; then
    log "  ${CYAN}Dry run complete. No commit made.${NC}"
    if [[ -n "$REPORT_FILE" ]]; then
        log "  Report: ${CYAN}$REPORT_FILE${NC}"
    fi
    exit 0
fi

# ============================================================================
# REMOTE SYNC
# ============================================================================
log "${BOLD}${BLUE}━━━ Remote Sync ━━━${NC}"
phase_start

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
log "  Branch: ${CYAN}${CURRENT_BRANCH}${NC}"

log "  ${CYAN}Fetching from origin...${NC}"
FETCH_RESULT=$(git fetch origin "$CURRENT_BRANCH" 2>&1)
if [[ $? -ne 0 ]]; then
    log "  ${YELLOW}⚠️  Fetch failed (offline?) — continuing with local state${NC}"
    inc_warnings
else
    LOCAL_HEAD=$(git rev-parse HEAD 2>/dev/null)
    REMOTE_HEAD=$(git rev-parse "origin/${CURRENT_BRANCH}" 2>/dev/null)
    MERGE_BASE=$(git merge-base HEAD "origin/${CURRENT_BRANCH}" 2>/dev/null)

    if [[ "$LOCAL_HEAD" == "$REMOTE_HEAD" ]]; then
        log "  ${GREEN}✓${NC} Already up to date with origin/${CURRENT_BRANCH}"
    elif [[ "$LOCAL_HEAD" == "$MERGE_BASE" ]]; then
        BEHIND_COUNT=$(git rev-list --count HEAD.."origin/${CURRENT_BRANCH}" 2>/dev/null)
        log ""
        log "  ${YELLOW}📥 Remote has ${BEHIND_COUNT} new commit(s) from another developer:${NC}"
        git log --oneline HEAD.."origin/${CURRENT_BRANCH}" | while read line; do
            log "     ${CYAN}${line}${NC}"
        done
        log ""

        REMOTE_FILES=$(git diff --stat HEAD.."origin/${CURRENT_BRANCH}" 2>/dev/null | tail -1)
        log "  ${DIM}Remote changes: ${REMOTE_FILES}${NC}"

        OUR_FILES=$(git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)
        THEIR_FILES=$(git diff --name-only HEAD.."origin/${CURRENT_BRANCH}" 2>/dev/null)
        OVERLAP=$(comm -12 <(echo "$OUR_FILES" | sort) <(echo "$THEIR_FILES" | sort) 2>/dev/null)

        if [[ -n "$OVERLAP" ]]; then
            log ""
            log "  ${YELLOW}⚠️  Both you and remote modified these files:${NC}"
            echo "$OVERLAP" | while read f; do log "     ${YELLOW}${f}${NC}"; done
            log ""
        fi

        log "  ${CYAN}Rebasing onto origin/${CURRENT_BRANCH}...${NC}"
        STASH_RESULT=$(git stash --include-untracked 2>&1)
        STASHED=false
        if echo "$STASH_RESULT" | grep -q 'Saved working directory'; then
            STASHED=true
        fi

        REBASE_RESULT=$(git rebase "origin/${CURRENT_BRANCH}" 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${RED}❌ Rebase conflict! Aborting rebase.${NC}"
            git rebase --abort 2>/dev/null
            if [[ "$STASHED" == true ]]; then
                git stash pop 2>/dev/null
            fi
            log ""
            log "  ${RED}Remote commits conflict with your local commits.${NC}"
            log "  ${RED}Resolve manually: git pull --rebase origin ${CURRENT_BRANCH}${NC}"
            inc_errors
            exit 1
        fi

        if [[ "$STASHED" == true ]]; then
            STASH_POP_RESULT=$(git stash pop 2>&1)
            if echo "$STASH_POP_RESULT" | grep -qi 'conflict'; then
                log "  ${RED}❌ Stash pop conflict — your uncommitted changes clash with remote.${NC}"
                log "  ${RED}Resolve conflicts, then re-run: ./ship.sh \"$COMMIT_MSG\"${NC}"
                exit 1
            fi
        fi

        log "  ${GREEN}✓${NC} Rebased successfully — your changes are on top of remote"
    elif [[ "$REMOTE_HEAD" == "$MERGE_BASE" ]]; then
        AHEAD_COUNT=$(git rev-list --count "origin/${CURRENT_BRANCH}"..HEAD 2>/dev/null)
        log "  ${GREEN}✓${NC} Local is ${AHEAD_COUNT} commit(s) ahead of remote (will push)"
    else
        AHEAD_COUNT=$(git rev-list --count "origin/${CURRENT_BRANCH}"..HEAD 2>/dev/null)
        BEHIND_COUNT=$(git rev-list --count HEAD.."origin/${CURRENT_BRANCH}" 2>/dev/null)
        log ""
        log "  ${YELLOW}⚠️  Branches diverged: ${AHEAD_COUNT} local / ${BEHIND_COUNT} remote commits${NC}"
        log ""
        log "  ${YELLOW}📥 Remote commits:${NC}"
        git log --oneline HEAD.."origin/${CURRENT_BRANCH}" | while read line; do
            log "     ${CYAN}${line}${NC}"
        done
        log ""

        log "  ${CYAN}Rebasing local commits onto remote...${NC}"
        STASH_RESULT=$(git stash --include-untracked 2>&1)
        STASHED=false
        if echo "$STASH_RESULT" | grep -q 'Saved working directory'; then
            STASHED=true
        fi

        REBASE_RESULT=$(git rebase "origin/${CURRENT_BRANCH}" 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${RED}❌ Rebase conflict! Aborting.${NC}"
            git rebase --abort 2>/dev/null
            if [[ "$STASHED" == true ]]; then
                git stash pop 2>/dev/null
            fi
            log ""
            log "  ${RED}Diverged commits conflict. Resolve: git pull --rebase origin ${CURRENT_BRANCH}${NC}"
            exit 1
        fi

        if [[ "$STASHED" == true ]]; then
            STASH_POP_RESULT=$(git stash pop 2>&1)
            if echo "$STASH_POP_RESULT" | grep -qi 'conflict'; then
                log "  ${RED}❌ Stash pop conflict — resolve and re-run ship.sh${NC}"
                exit 1
            fi
        fi

        log "  ${GREEN}✓${NC} Rebased ${AHEAD_COUNT} local commit(s) onto ${BEHIND_COUNT} remote commit(s)"
    fi
fi

phase_end
log ""

# ============================================================================
# COMMIT & PUSH
# ============================================================================
log "${BOLD}${BLUE}━━━ Ship It ━━━${NC}"

# No MCP knowledge base dirs in this project

git add -A

# No workflow manifest in this project

log "  ${CYAN}Files being committed:${NC}"
git diff --cached --stat | head -20
log ""

git commit -m "$COMMIT_MSG"
if [[ $? -ne 0 ]]; then
    log "  ${YELLOW}Nothing to commit${NC}"
    exit 0
fi

log "  ${CYAN}Pushing to origin...${NC}"
git push
PUSH_EXIT=$?

if [[ $PUSH_EXIT -ne 0 ]]; then
    log "  ${RED}❌ Push failed. Try: git pull --rebase && ./ship.sh \"$COMMIT_MSG\"${NC}"
    exit 1
fi

SHIP_ELAPSED=$(( $(date +%s) - SHIP_START ))

log ""
log "${GREEN}${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
log "${GREEN}${BOLD}║            🚀 SHIPPED SUCCESSFULLY                  ║${NC}"
log "${GREEN}${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
log ""
log "  Commit:   ${CYAN}$COMMIT_MSG${NC}"
log "  Duration: ${CYAN}${SHIP_ELAPSED}s${NC}"
log ""

# ============================================================================
# SENTRY RELEASE TAGGING (post-push)
# ============================================================================
if [[ "$SKIP_SENTRY" == false ]] && command -v sentry-cli > /dev/null 2>&1 && [[ -n "$SENTRY_AUTH_TOKEN" ]]; then
    log "${BOLD}${BLUE}━━━ Sentry Release ━━━${NC}"
    RELEASE=$(git rev-parse --short HEAD)

    sentry-cli releases new "$RELEASE" > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
        sentry-cli releases set-commits "$RELEASE" --auto > /dev/null 2>&1
        sentry-cli releases finalize "$RELEASE" > /dev/null 2>&1
        sentry-cli releases deploys "$RELEASE" new -e production > /dev/null 2>&1

        # Upload source maps if build output exists
        if [[ -d "public/build" ]]; then
            sentry-cli sourcemaps inject public/build > /dev/null 2>&1
            sentry-cli sourcemaps upload --release="$RELEASE" public/build > /dev/null 2>&1
        fi

        log "  ${GREEN}✓${NC} Sentry release ${RELEASE} tagged"
    else
        log "  ${YELLOW}⚠️  sentry-cli release failed (non-blocking)${NC}"
    fi
    log ""
fi

# ============================================================================
# PHASE 8: POST-DEPLOY SMOKE TEST (background)
# ============================================================================
SMOKE_URLS=""
# Add production health check URL when deployed
# SMOKE_URLS="https://4healthcare.app/app-health"

if [[ -n "$SMOKE_URLS" ]]; then
    log "${BOLD}${BLUE}━━━ Phase 8: Post-Deploy Smoke Test ━━━${NC}"
    log "  ${CYAN}Waiting 90s for Railway deployment...${NC}"
    log "  ${DIM}(Smoke test runs in background — you can keep working)${NC}"
    log ""

    (
        sleep 90

        SMOKE_PASS=true
        SMOKE_RESULTS=""

        for URL in $SMOKE_URLS; do
            DOMAIN=$(echo "$URL" | sed 's|https://||' | sed 's|/.*||')

            RESPONSE=$(curl -s --max-time 15 "$URL" 2>/dev/null)
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$URL" 2>/dev/null)

            if [[ "$HTTP_CODE" == "200" ]]; then
                SMOKE_RESULTS+="\n  ✅ ${DOMAIN}: healthy (${HTTP_CODE})"
            elif [[ "$HTTP_CODE" == "503" ]]; then
                DB_STATUS=$(echo "$RESPONSE" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)
                REDIS_STATUS=$(echo "$RESPONSE" | grep -o '"redis":"[^"]*"' | cut -d'"' -f4)
                SMOKE_RESULTS+="\n  ❌ ${DOMAIN}: DEGRADED (${HTTP_CODE}) — DB:${DB_STATUS:-unknown} Redis:${REDIS_STATUS:-unknown}"
                SMOKE_PASS=false
            elif [[ "$HTTP_CODE" == "500" ]]; then
                SMOKE_RESULTS+="\n  ❌ ${DOMAIN}: DOWN (${HTTP_CODE}) — Server Error"
                SMOKE_PASS=false
            elif [[ "$HTTP_CODE" == "000" ]]; then
                SMOKE_RESULTS+="\n  ⚠️  ${DOMAIN}: UNREACHABLE (timeout/DNS)"
                SMOKE_PASS=false
            else
                SMOKE_RESULTS+="\n  ⚠️  ${DOMAIN}: UNEXPECTED (${HTTP_CODE})"
                SMOKE_PASS=false
            fi

            PAGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}|%{content_type}" --max-time 15 "https://${DOMAIN}/" 2>/dev/null)
            PAGE_CODE=$(echo "$PAGE_RESPONSE" | cut -d'|' -f1)
            PAGE_CTYPE=$(echo "$PAGE_RESPONSE" | cut -d'|' -f2)
            if [[ "$PAGE_CODE" != "200" && "$PAGE_CODE" != "302" ]]; then
                SMOKE_RESULTS+="\n  ❌ ${DOMAIN}: homepage ${PAGE_CODE} (middleware/session may be broken)"
                SMOKE_PASS=false
            elif [[ "$PAGE_CODE" == "200" && "$PAGE_CTYPE" != *"text/html"* ]]; then
                SMOKE_RESULTS+="\n  ❌ ${DOMAIN}: homepage Content-Type is '${PAGE_CTYPE}' — expected text/html (nginx may be serving raw PHP as download!)"
                SMOKE_PASS=false
            fi
        done

        # Playwright E2E (if configured)
        if [[ -f "tests/e2e/smoke.spec.ts" ]] || [[ -f "tests/e2e/smoke.spec.js" ]]; then
            if command -v npx > /dev/null 2>&1; then
                PW_RESULT=$(npx playwright test tests/e2e/smoke.spec.* \
                    --reporter=line --timeout=30000 2>&1)
                if [[ $? -ne 0 ]]; then
                    SMOKE_RESULTS+="\n  ❌ Playwright E2E failed:"
                    SMOKE_RESULTS+="\n$(echo "$PW_RESULT" | tail -10 | sed 's/^/      /')"
                    SMOKE_PASS=false
                else
                    SMOKE_RESULTS+="\n  ✅ Playwright E2E passed"
                fi
            fi
        fi

        echo ""
        echo -e "\033[1m\033[34m━━━ Smoke Test Results ━━━\033[0m"
        echo -e "$SMOKE_RESULTS"
        echo ""

        if [[ "$SMOKE_PASS" == true ]]; then
            echo -e "\033[0;32m  ✅ All production sites healthy after deploy\033[0m"
        else
            echo -e "\033[0;31m  ╔══════════════════════════════════════════════════════╗\033[0m"
            echo -e "\033[0;31m  ║  ⚠️  PRODUCTION MAY BE DOWN AFTER THIS DEPLOY        ║\033[0m"
            echo -e "\033[0;31m  ║  Check Railway dashboard immediately                 ║\033[0m"
            echo -e "\033[0;31m  ║  Run: ./ship.sh --review-logs                        ║\033[0m"
            echo -e "\033[0;31m  ╚══════════════════════════════════════════════════════╝\033[0m"

            # Mark Sentry deploy as failed
            if command -v sentry-cli > /dev/null 2>&1 && [[ -n "$SENTRY_AUTH_TOKEN" ]] && [[ -n "$RELEASE" ]]; then
                sentry-cli releases deploys "$RELEASE" new -e production --name "smoke-failed" > /dev/null 2>&1
            fi
        fi
        echo ""
    ) &

    SMOKE_PID=$!
    log "  ${DIM}Smoke test PID: $SMOKE_PID — results will appear in ~90s${NC}"
    log ""
fi

# ============================================================================
# PHASE 9: POST-DEPLOY KNOWLEDGE BASE UPDATE
# ============================================================================
# Regenerate schema from live database after deploy (requires Railway CLI).
# The workflow manifest was already regenerated pre-commit.
if command -v railway > /dev/null 2>&1; then
    log "${BOLD}${BLUE}━━━ Phase 9: Knowledge Base Update ━━━${NC}"
    phase_start

    # Clear schedule locks (prevents silent command skipping after deploy)
    log "  ${CYAN}Clearing schedule locks...${NC}"
    railway ssh -- php artisan schedule:clear-locks 2>/dev/null && \
        log "  ${GREEN}✓${NC} Schedule locks cleared" || \
        log "  ${YELLOW}⚠️  Could not clear schedule locks${NC}"

    phase_end
    log ""
fi
