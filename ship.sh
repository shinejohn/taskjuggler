#!/bin/bash
# ============================================================================
# ship.sh v4 — Fibonacco Universal Pre-Deploy Validation + AI Log Review
# ============================================================================
# Adds to v3:
#   - Larastan static analysis (Phase 2b, if installed)
#   - Laravel Pint format check (Phase 2c, if installed)
#   - AI log review via Railway + Claude API (--review-logs, --fix)
#   - --deep mode for extended validation
#   - --use-manifest for pre-built commit messages
#
# Works across ALL Fibonacco repos by auto-detecting project structure:
#   - Learning Center (backend/ + src/ React SPA)
#   - Multisite (Laravel root + Inertia/React SSR)
#
# Usage:
#   ./ship.sh --check                     — run all checks (recommended)
#   ./ship.sh "commit message"            — check + commit + push
#   ./ship.sh "commit message" --deep     — slow mode, full validation
#   ./ship.sh "commit message" --dry      — check only, no commit
#   ./ship.sh "commit message" --force    — skip checks (emergency)
#   ./ship.sh --use-manifest              — use built-in batch commit message
#   ./ship.sh --review-logs               — AI analysis of Railway logs
#   ./ship.sh --review-logs --fix         — AI analysis + patch proposals
#   ./ship.sh --review-logs --since 24h   — time window (default 6h)
#   ./ship.sh --report                    — generate ship-report.log
#   ./ship.sh --help                      — show help
#
# Required env vars for optional features:
#   ANTHROPIC_API_KEY    for --review-logs
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
ERRORS=0
WARNINGS=0
REPORT_FILE=""
USE_MANIFEST=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --check)       MODE="dry" ;;
        --dry)         MODE="dry" ;;
        --force)       MODE="force" ;;
        --deep)        DEEP=true ;;
        --review-logs) REVIEW_LOGS=true; MODE="dry" ;;
        --fix)         REVIEW_FIX=true ;;
        --since)       shift; LOGS_SINCE="$1" ;;
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
  --deep          Include Larastan, Pint, tests (if installed)
  --dry           Alias for --check with commit message
  --force         Skip checks, commit and push (emergency)
  --use-manifest  Use the built-in batch commit message
  --report        Generate ship-report-YYYYMMDD-HHMMSS.log
  --review-logs   Pull Railway logs, group errors, ask Claude to analyze
  --fix           With --review-logs, request patch proposals as diffs
  --since <dur>   Time window for --review-logs (e.g. 1h, 24h, 7d; default 6h)
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

# Built-in commit message for the current batch.
# Edit before ./ship.sh --use-manifest when the batch changes.
if [[ "$USE_MANIFEST" == true ]]; then
    COMMIT_MSG=$(cat <<'SHIP_MANIFEST_EOF'
fix: Dendrite official config generation + openclaw Docker build

Use generate-keys/generate-config per Dendrite docs. Add COMMS-COMPLETION-CHECKLIST.
SHIP_MANIFEST_EOF
)
fi

if [[ "$MODE" == "normal" && -z "$COMMIT_MSG" && "$REVIEW_LOGS" == false ]]; then
    echo -e "${RED}Usage: ./ship.sh \"commit message\" [--dry|--force]${NC}"
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
log "${BOLD}${CYAN}║          🚀 FIBONACCO SHIP v4 (Universal)           ║${NC}"
log "${BOLD}${CYAN}║          $(date '+%Y-%m-%d %H:%M:%S')                       ║${NC}"
log "${BOLD}${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
log ""

# ============================================================================
# PROJECT DETECTION — auto-detect structure
# ============================================================================
BACKEND_DIR=""
FRONTEND_DIR=""
PROJECT_TYPE="unknown"
HAS_INERTIA=false
IS_MULTIAPP=false

# Detect backend directory (where artisan lives)
if [[ -f "artisan" ]]; then
    BACKEND_DIR="."
    PROJECT_TYPE="monolith"
elif [[ -f "backend/artisan" ]]; then
    BACKEND_DIR="backend"
    PROJECT_TYPE="learning-center"
elif [[ -f "taskjuggler-api/artisan" ]]; then
    BACKEND_DIR="taskjuggler-api"
    PROJECT_TYPE="taskjuggler"
elif [[ -f "apps/api-core/artisan" ]]; then
    BACKEND_DIR="apps/api-core"
    PROJECT_TYPE="4people"
fi

# Detect frontend
if [[ -f "package.json" ]]; then
    FRONTEND_DIR="."
elif [[ -f "src/package.json" ]]; then
    FRONTEND_DIR="src"
fi

# Detect Inertia
if [[ -n "$BACKEND_DIR" ]] && grep -q 'inertiajs' "${BACKEND_DIR}/composer.json" 2>/dev/null; then
    HAS_INERTIA=true
fi
if [[ -n "$FRONTEND_DIR" ]] && grep -q '@inertiajs' "${FRONTEND_DIR}/package.json" 2>/dev/null; then
    HAS_INERTIA=true
fi

# Detect multi-app
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

    if ! command -v railway > /dev/null; then
        log "  ${RED}❌ Railway CLI not installed${NC}"
        exit 1
    fi
    if ! command -v jq > /dev/null; then
        log "  ${RED}❌ jq not installed (brew install jq)${NC}"
        exit 1
    fi
    if [[ -z "$ANTHROPIC_API_KEY" ]]; then
        log "  ${RED}❌ ANTHROPIC_API_KEY not set${NC}"
        exit 1
    fi

    log "  ${CYAN}Fetching Railway logs (last ${LOGS_SINCE})...${NC}"
    LOGS_RAW=$(railway logs --since "$LOGS_SINCE" --json 2>&1)
    RC=$?
    if [[ $RC -ne 0 ]] || [[ -z "$LOGS_RAW" ]]; then
        log "  ${RED}❌ Could not fetch logs (run: railway link)${NC}"
        echo "$LOGS_RAW" | head -5
        exit 1
    fi

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

    TOTAL_COUNT=$(echo "$ERRORS_JSON" | wc -l | tr -d ' ')
    NORMALIZED=$(echo "$ERRORS_JSON" | jq -r '.msg' | sed -E '
        s/[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9:.+-]+//g;
        s/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/<UUID>/g;
        s/0x[0-9a-f]+/<ADDR>/g;
        s/\b[0-9]{4,}\b/<NUM>/g;
        s/\s+/ /g
    ')
    UNIQUE_COUNT=$(echo "$NORMALIZED" | cut -c1-120 | sort -u | wc -l | tr -d ' ')
    log "  ${CYAN}${TOTAL_COUNT} error events, ${UNIQUE_COUNT} unique signatures${NC}"

    TOP_ERRORS=$(paste <(echo "$NORMALIZED" | cut -c1-120) <(echo "$ERRORS_JSON") \
        | sort | uniq -c -w120 | sort -rn | head -30 \
        | awk -F'\t' '{
            match($0, /^ *[0-9]+/); count = substr($0, RSTART, RLENGTH);
            gsub(/^ *[0-9]+/, "", count); gsub(/ /, "", count);
            print "{\"count\":" count+0 ",\"example\":" $2 "}"
        }')

    log "  ${CYAN}Gathering referenced source files...${NC}"
    FILES_MENTIONED=$(echo "$ERRORS_JSON" | jq -r '.msg' \
        | grep -oE '(app|routes|database|config)/[a-zA-Z0-9_/-]+\.(php|ts|tsx|js|jsx)' \
        | sort -u | head -25)

    CODE_CONTEXT=""
    FILES_INCLUDED=0
    for f in $FILES_MENTIONED; do
        for path in "$f" "${BACKEND_DIR}/$f" "${FRONTEND_DIR}/$f"; do
            if [[ -f "$path" ]]; then
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

    MODE_DIRECTIVE="Group errors by root cause. For each: 3-5 sentence diagnosis, file:line to fix, severity rating. No code changes."
    if [[ "$REVIEW_FIX" == true ]]; then
        MODE_DIRECTIVE="Group errors by root cause. For each: diagnosis, file:line, severity, and if confident propose a unified diff patch. Mark uncertain fixes as NEEDS HUMAN."
    fi

    log "  ${CYAN}Calling Claude (may take 30-60s)...${NC}"

    REQUEST=$(jq -n \
        --arg errors "$TOP_ERRORS" \
        --arg code "$CODE_CONTEXT" \
        --arg directive "$MODE_DIRECTIVE" \
        --arg project "$PROJECT_TYPE" \
        --arg since "$LOGS_SINCE" \
        '{
            model: "claude-sonnet-4-6",
            max_tokens: 16000,
            messages: [{
                role: "user",
                content: ("You are reviewing production errors from a Laravel API + React SPA on Railway. Project type: " + $project + ". Time window: " + $since + ".\n\nDIRECTIVE:\n" + $directive + "\n\nERRORS:\n" + $errors + "\n\nRELEVANT CODE:\n" + $code + "\n\nBegin analysis. Use markdown headings for each error group.")
            }]
        }')

    RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        --data "$REQUEST")

    API_ERROR=$(echo "$RESPONSE" | jq -r '.error.message // empty' 2>/dev/null)
    if [[ -n "$API_ERROR" ]]; then
        log "  ${RED}❌ Claude API error: ${API_ERROR}${NC}"
        exit 1
    fi

    OUTPUT=$(echo "$RESPONSE" | jq -r '.content[0].text // empty')
    if [[ -z "$OUTPUT" ]]; then
        log "  ${RED}❌ Empty response from Claude${NC}"
        exit 1
    fi

    REPORT_MD="log-review-$(date +%Y%m%d-%H%M%S).md"
    {
        echo "# Log Review — $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        echo "- **Window:** last ${LOGS_SINCE}"
        echo "- **Events:** ${TOTAL_COUNT} total, ${UNIQUE_COUNT} unique"
        echo "- **Files included:** ${FILES_INCLUDED}"
        echo ""
        echo "---"
        echo ""
        echo "$OUTPUT"
    } > "$REPORT_MD"

    phase_end
    log ""
    log "  ${GREEN}✓ Analysis written: ${REPORT_MD}${NC}"
    log ""
    echo "$OUTPUT" | head -40 | while IFS= read -r line; do log "  $line"; done
    log ""
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

# Large files (>5MB)
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

# Forbidden paths
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

    # Include committed-but-unpushed changes (@{upstream}..HEAD) so checks
    # still run when changes were committed before invoking ship.sh.
    CHANGED_PHP=$(
        { git diff --name-only HEAD 2>/dev/null
          git diff --name-only --cached 2>/dev/null
          git diff --name-only @{upstream}..HEAD 2>/dev/null
          git ls-files --others --exclude-standard 2>/dev/null
        } | grep '\.php$' | grep "^${BACKEND_DIR}/" | sort -u
    ) || true

    if [[ -z "$CHANGED_PHP" && "$BACKEND_DIR" == "." ]]; then
        CHANGED_PHP=$(
            { git diff --name-only HEAD 2>/dev/null
              git diff --name-only --cached 2>/dev/null
              git diff --name-only @{upstream}..HEAD 2>/dev/null
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

        # Syntax check
        SYNTAX_RESULT=$(php -l "$FILE" 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${RED}❌ SYNTAX ERROR: $FILE${NC}"
            log "     ${RED}$(echo "$SYNTAX_RESULT" | head -3)${NC}"
            inc_errors
            continue
        fi

        # env() in app/ code
        if echo "$FILE" | grep -qE '/app/'; then
            ENV_CALLS=$(grep -nE "env\(\s*'" "$FILE" 2>/dev/null | head -3)
            if [[ -n "$ENV_CALLS" ]]; then
                log "  ${RED}❌ env() in app/ code: $FILE${NC}"
                echo "$ENV_CALLS" | while read line; do log "     ${RED}$line${NC}"; done
                log "     ${RED}Use config('key') — env() breaks under config:cache${NC}"
                inc_errors
            fi
        fi

        # dd(), dump(), ray()
        DEBUG_CALLS=$(grep -nE '\b(dd|dump|ray|var_dump)\s*\(' "$FILE" 2>/dev/null | grep -v '//' | head -3)
        if [[ -n "$DEBUG_CALLS" ]]; then
            log "  ${YELLOW}⚠️  Debug function in: $FILE${NC}"
            echo "$DEBUG_CALLS" | while read line; do log "     ${YELLOW}$line${NC}"; done
            inc_warnings
        fi

        # HasUuids on models
        if echo "$FILE" | grep -q '/Models/'; then
            if grep -q 'class.*extends Model' "$FILE" && ! grep -q 'HasUuids' "$FILE"; then
                log "  ${YELLOW}⚠️  Model missing HasUuids trait: $FILE${NC}"
                inc_warnings
            fi
        fi
    done

    if [[ "$PHP_COUNT" -gt 0 ]]; then
        log "  ${GREEN}✓${NC} PHP checks complete"
    fi

    phase_end
    log ""

    # ========================================================================
    # PHASE 2b: LARASTAN / PHPSTAN (optional, if installed)
    # ========================================================================
    if [[ "$PHP_COUNT" -gt 0 && -f "${BACKEND_DIR}/vendor/bin/phpstan" ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2b: Static Analysis (Larastan) ━━━${NC}"
        phase_start

        REL_FILES=$(echo "$CHANGED_PHP" | sed "s|^${BACKEND_DIR}/||" | tr '\n' ' ')
        PHPSTAN_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/phpstan analyse \
            --no-progress --error-format=raw --memory-limit=1G $REL_FILES 2>&1)
        PHPSTAN_RC=$?

        if [[ $PHPSTAN_RC -ne 0 ]]; then
            ERR_COUNT=$(echo "$PHPSTAN_RESULT" | grep -cE ':[0-9]+:' || echo 0)
            log "  ${RED}❌ Larastan found ${ERR_COUNT} errors:${NC}"
            echo "$PHPSTAN_RESULT" | grep -E ':[0-9]+:' | head -20 | while read line; do log "     ${RED}${line}${NC}"; done
            inc_errors
        else
            log "  ${GREEN}✓${NC} Larastan clean on $PHP_COUNT files"
        fi

        phase_end
        log ""
    elif [[ "$PHP_COUNT" -gt 0 && "$DEEP" == true ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2b: Static Analysis ━━━${NC}"
        log "  ${DIM}Larastan not installed — skipping (composer require --dev larastan/larastan)${NC}"
        log ""
    fi

    # ========================================================================
    # PHASE 2c: LARAVEL PINT FORMAT CHECK (optional, if installed)
    # ========================================================================
    if [[ "$PHP_COUNT" -gt 0 && -f "${BACKEND_DIR}/vendor/bin/pint" ]]; then
        log "${BOLD}${BLUE}━━━ Phase 2c: Format Check (Pint) ━━━${NC}"
        phase_start

        REL_FILES=$(echo "$CHANGED_PHP" | sed "s|^${BACKEND_DIR}/||" | tr '\n' ' ')
        PINT_RESULT=$(cd "$BACKEND_DIR" && vendor/bin/pint --test $REL_FILES 2>&1)
        if [[ $? -ne 0 ]]; then
            log "  ${YELLOW}⚠️  Format issues — run: cd backend && vendor/bin/pint${NC}"
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
    CHANGED_MIGRATIONS=$(echo "$CHANGED_PHP" | grep -E 'database/migrations/|/Migrations/' || true)
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

            # Check for MySQL syntax — skip comments and PostgreSQL CREATE TYPE statements
            MYSQL_HITS=$(grep -nE '\bunsigned\b|\btinyint\b|\bmediumint\b|\bAUTO_INCREMENT\b' "$MIGRATION" 2>/dev/null | grep -v '//' | head -3)
            # Check for $table->enum() (MySQL) but not DB::statement CREATE TYPE AS ENUM (PostgreSQL)
            ENUM_HITS=$(grep -nE '\$table->enum\(|\->enum\(' "$MIGRATION" 2>/dev/null | head -3)
            # Check for dateTime() — should be timestamp/timestampTz
            DATETIME_HITS=$(grep -nE '\bdateTime\(' "$MIGRATION" 2>/dev/null | grep -v '//' | head -3)
            MYSQL_HITS="${MYSQL_HITS}${ENUM_HITS:+$'\n'$ENUM_HITS}${DATETIME_HITS:+$'\n'$DATETIME_HITS}"
            MYSQL_HITS=$(echo "$MYSQL_HITS" | sed '/^$/d')
            if [[ -n "$MYSQL_HITS" ]]; then
                log "    ${RED}❌ MySQL syntax (Railway uses PostgreSQL):${NC}"
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

        # Full migration chain on a scratch PostgreSQL — catches ordering bugs,
        # forward-reference FKs, bigint-vs-uuid FK type mismatches, and silent
        # transaction rollbacks that SQLite-based tests cannot detect.
        if command -v initdb >/dev/null 2>&1 && command -v pg_ctl >/dev/null 2>&1 && command -v createdb >/dev/null 2>&1; then
            log "  Fresh-DB migrate check (scratch PostgreSQL)..."
            SHIP_PGDIR=$(mktemp -d /tmp/ship-pg.XXXXXX)
            SHIP_PGPORT=54331
            if initdb -D "$SHIP_PGDIR" -U postgres -A trust >/dev/null 2>&1 \
                && pg_ctl -D "$SHIP_PGDIR" -o "-p $SHIP_PGPORT -k $SHIP_PGDIR" -l "$SHIP_PGDIR/pg.log" start >/dev/null 2>&1; then
                createdb -h "$SHIP_PGDIR" -p "$SHIP_PGPORT" -U postgres ship_migrate >/dev/null 2>&1
                if (cd "$BACKEND_DIR" && DB_CONNECTION=pgsql DB_HOST="$SHIP_PGDIR" DB_PORT="$SHIP_PGPORT" \
                    DB_DATABASE=ship_migrate DB_USERNAME=postgres DB_PASSWORD= \
                    php artisan migrate --force --no-interaction > "$SHIP_PGDIR/migrate.log" 2>&1); then
                    log "    ${GREEN}✓${NC} All migrations succeed on fresh PostgreSQL"
                else
                    log "    ${RED}❌ Migrations FAIL on fresh PostgreSQL:${NC}"
                    grep -E 'FAIL|SQLSTATE' "$SHIP_PGDIR/migrate.log" | head -4 | while read line; do log "       ${RED}$line${NC}"; done
                    inc_errors
                fi
                pg_ctl -D "$SHIP_PGDIR" stop >/dev/null 2>&1
            else
                log "    ${YELLOW}⚠️  Could not start scratch PostgreSQL — skipping fresh-DB migrate check${NC}"
                inc_warnings
            fi
            rm -rf "$SHIP_PGDIR"
        else
            log "    ${YELLOW}⚠️  initdb/pg_ctl not found — skipping fresh-DB migrate check${NC}"
            inc_warnings
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

    # Config cache
    CONFIG_RESULT=$($ARTISAN config:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${RED}❌ Config compilation failed:${NC}"
        echo "$CONFIG_RESULT" | tail -5
        inc_errors
    else
        log "  ${GREEN}✓${NC} Config compiles"
        $ARTISAN config:clear > /dev/null 2>&1
    fi

    # Route cache (catches duplicate route names and compilation errors)
    ROUTE_RESULT=$($ARTISAN route:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        if echo "$ROUTE_RESULT" | grep -qi 'closure'; then
            log "  ${YELLOW}⚠️  Closure routes can't be cached (not a deploy blocker)${NC}"
            inc_warnings
        elif echo "$ROUTE_RESULT" | grep -qi 'already been assigned name'; then
            # Duplicate names block route:cache but routes still work at runtime
            # Verify routes actually compile via route:list
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

    # Event cache
    EVENT_RESULT=$($ARTISAN event:cache 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${YELLOW}⚠️  Event cache issue:${NC}"
        echo "$EVENT_RESULT" | tail -5
        inc_warnings
    else
        log "  ${GREEN}✓${NC} Events compile"
        $ARTISAN event:clear > /dev/null 2>&1
    fi

    # Package discover
    DISCOVER_RESULT=$($ARTISAN package:discover --ansi 2>&1)
    if [[ $? -ne 0 ]]; then
        log "  ${RED}❌ Package discovery failed:${NC}"
        echo "$DISCOVER_RESULT" | tail -10
        inc_errors
    else
        log "  ${GREEN}✓${NC} Package discovery OK"
    fi

    # Composer lock sync
    if [[ -f "${BACKEND_DIR}/composer.json" && -f "${BACKEND_DIR}/composer.lock" ]]; then
        COMPOSER_VALIDATE=$(cd "$BACKEND_DIR" && composer validate --no-check-all --no-check-publish 2>&1)
        if echo "$COMPOSER_VALIDATE" | grep -qi 'lock file is not up to date'; then
            log "  ${RED}❌ composer.lock out of sync — run: composer update --lock${NC}"
            inc_errors
        else
            log "  ${GREEN}✓${NC} composer.lock in sync"
        fi
    fi

    # Check for dependencies requiring PHP extensions not in Dockerfile
    # This catches the exact scenario where a new package (e.g. phpspreadsheet)
    # requires an extension (e.g. ext-gd) that isn't installed in the Docker image.
    if [[ -f "${BACKEND_DIR}/composer.lock" ]]; then
        # Extract required extensions from composer.lock
        REQUIRED_EXTS=$(php -r '
            $lock = json_decode(file_get_contents("'"${BACKEND_DIR}"'/composer.lock"), true);
            $exts = [];
            foreach (array_merge($lock["packages"] ?? [], $lock["packages-dev"] ?? []) as $pkg) {
                foreach ($pkg["require"] ?? [] as $dep => $ver) {
                    if (str_starts_with($dep, "ext-") && $dep !== "ext-mbstring" && $dep !== "ext-openssl" && $dep !== "ext-tokenizer" && $dep !== "ext-ctype" && $dep !== "ext-dom" && $dep !== "ext-xml" && $dep !== "ext-xmlwriter" && $dep !== "ext-xmlreader" && $dep !== "ext-fileinfo" && $dep !== "ext-pdo" && $dep !== "ext-curl" && $dep !== "ext-filter" && $dep !== "ext-hash" && $dep !== "ext-json" && $dep !== "ext-session" && $dep !== "ext-simplexml" && $dep !== "ext-iconv") {
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
            # Find which Dockerfile Railway will use
            DEPLOY_DOCKERFILE=""
            for candidate in "docker/standalone/Dockerfile" "Dockerfile"; do
                if [[ -f "$candidate" ]]; then
                    DEPLOY_DOCKERFILE="$candidate"
                    break
                fi
            done

            if [[ -n "$DEPLOY_DOCKERFILE" ]]; then
                # Extract extensions installed in Dockerfile
                DOCKER_EXTS=$(grep -oE 'install-php-extensions\s+.*' "$DEPLOY_DOCKERFILE" 2>/dev/null \
                    | sed 's/install-php-extensions//' | tr ' ' '\n' | sed '/^$/d' | sort -u)

                EXT_MISSING=false
                while IFS=: read -r ext pkgs; do
                    if ! echo "$DOCKER_EXTS" | grep -qw "$ext"; then
                        # Check if it's available in the base PHP image (common built-ins)
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
    # PHASE 4b: MIGRATION DRY RUN (new migrations only)
    # ========================================================================
    # NOTE: the real migration validation runs the FULL chain against a scratch
    # PostgreSQL instance in Phase 3 (sqlite --pretend hides every PG-only trap:
    # forward-ref FKs, foreignId-vs-uuid mismatches, GIN-on-json silent rollbacks).
    # This stub remains only so the phase numbering stays stable.

    # ========================================================================
    # PHASE 5: NIXPACKS / DEPLOY CONFIG CHECK
    # ========================================================================
    log "${BOLD}${BLUE}━━━ Phase 5: Deploy Config ━━━${NC}"
    phase_start

    # Find nixpacks.toml
    NIXPACKS_FILE=""
    for candidate in "${BACKEND_DIR}/nixpacks.toml" "nixpacks.toml" "Railway/nixpacks.toml"; do
        if [[ -f "$candidate" ]]; then
            NIXPACKS_FILE="$candidate"
            break
        fi
    done

    if [[ -n "$NIXPACKS_FILE" ]]; then
        log "  ${GREEN}✓${NC} Found: $NIXPACKS_FILE"

        # A Dockerfile next to nixpacks.toml silently wins on Railway —
        # a stale php-fpm Dockerfile once made every healthcheck fail with no logs.
        NIXPACKS_DIR=$(dirname "$NIXPACKS_FILE")
        if [[ -f "$NIXPACKS_DIR/Dockerfile" ]]; then
            log "  ${RED}❌ Dockerfile exists in $NIXPACKS_DIR — Railway uses it INSTEAD of nixpacks.toml${NC}"
            log "     ${RED}Delete the Dockerfile or remove nixpacks.toml; they cannot coexist safely.${NC}"
            inc_errors
        fi

        # Check for --no-scripts (the bug we fixed!)
        if grep -q 'composer install' "$NIXPACKS_FILE" 2>/dev/null; then
            INSTALL_PHASE=$(grep -A1 '\[phases.install\]' "$NIXPACKS_FILE" 2>/dev/null | grep 'composer')
            if [[ -n "$INSTALL_PHASE" ]] && ! echo "$INSTALL_PHASE" | grep -q '\-\-no-scripts'; then
                log "  ${RED}❌ Nixpacks install phase runs composer WITHOUT --no-scripts${NC}"
                log "     ${RED}This causes RouteGroup errors in Docker. Add --no-scripts to install phase.${NC}"
                inc_errors
            else
                log "  ${GREEN}✓${NC} Install phase uses --no-scripts"
            fi

            # Check for duplicate composer install in build phase
            BUILD_COMPOSER=$(grep -A5 '\[phases.build\]' "$NIXPACKS_FILE" 2>/dev/null | grep 'composer install')
            if [[ -n "$BUILD_COMPOSER" ]]; then
                log "  ${YELLOW}⚠️  Build phase also runs 'composer install' — redundant with install phase${NC}"
                log "     ${YELLOW}Use explicit artisan commands in build phase instead${NC}"
                inc_warnings
            fi
        fi

        # Check that build phase caches config/routes
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

    # .env.example sync
    if [[ -f "${BACKEND_DIR}/.env.example" && -d "${BACKEND_DIR}/config" ]]; then
        CONFIG_ENVS=$(grep -rohE "env\(\s*'([A-Z_]+)'" "${BACKEND_DIR}/config/" 2>/dev/null | grep -oE "'[A-Z_]+'" | tr -d "'" | sort -u)
        MISSING_FROM_EXAMPLE=""
        for var in $CONFIG_ENVS; do
            if ! grep -q "^${var}=" "${BACKEND_DIR}/.env.example" 2>/dev/null; then
                case "$var" in
                    # Skip standard Laravel framework vars — only flag custom/project-specific ones
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

    # Hardcoded Railway hostnames (skip config/ — config files use .railway.internal as env() fallbacks)
    HARDCODED_RAILWAY=$(grep -rl '\.railway\.internal' "${BACKEND_DIR}/app/" "${BACKEND_DIR}/routes/" 2>/dev/null || true)
    if [[ -n "$HARDCODED_RAILWAY" ]]; then
        log "  ${RED}❌ Hardcoded Railway hostnames in app/routes code:${NC}"
        echo "$HARDCODED_RAILWAY" | while read f; do log "     $f"; done
        inc_errors
    else
        log "  ${GREEN}✓${NC} No hardcoded Railway hostnames in app code"
    fi

    # Hardcoded localhost
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

    # console.log / debugger
    if [[ "$JS_COUNT" -gt 0 ]]; then
        CONSOLE_HITS=""
        for FILE in $CHANGED_JS; do
            if [[ ! -f "$FILE" ]]; then continue; fi
            if echo "$FILE" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then continue; fi
            if echo "$FILE" | grep -qE 'node_modules|vendor|dist/|\.cjs$'; then continue; fi
            # Skip root-level utility scripts
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

        # TypeScript 'any' types
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
    fi

    # npm lockfile check — without a committed package-lock.json, Railway
    # resolves fresh dependency versions on every build (npm install at root),
    # so deploys can break on dep drift even when local builds pass.
    # (June 2026: vite 7.3.1→7.3.5 drift broke taskjuggler-web on Railway.)
    if [[ -f "${FRONTEND_DIR}/package.json" ]]; then
        LOCKFILE="${FRONTEND_DIR}/package-lock.json"
        [[ "$FRONTEND_DIR" == "." ]] && LOCKFILE="package-lock.json"
        if [[ ! -f "$LOCKFILE" ]]; then
            log "  ${RED}❌ No package-lock.json — Railway will resolve fresh deps (version drift). Run: npm install, then commit the lockfile${NC}"
            inc_errors
        elif ! git ls-files --error-unmatch "$LOCKFILE" &>/dev/null; then
            log "  ${RED}❌ package-lock.json exists but is not committed — Railway won't see it. Commit it${NC}"
            inc_errors
        else
            # package.json changed without lockfile change → likely out of sync
            PKG_CHANGED=$(
                { git diff --name-only HEAD 2>/dev/null
                  git diff --name-only --cached 2>/dev/null
                } | grep -E '(^|/)package\.json$' | sort -u
            ) || true
            LOCK_CHANGED=$(
                { git diff --name-only HEAD 2>/dev/null
                  git diff --name-only --cached 2>/dev/null
                } | grep -E '(^|/)package-lock\.json$' || true
            )
            if [[ -n "$PKG_CHANGED" && -z "$LOCK_CHANGED" ]]; then
                log "  ${YELLOW}⚠️  package.json changed but package-lock.json didn't — run npm install to re-sync the lockfile:${NC}"
                echo "$PKG_CHANGED" | head -5
                inc_warnings
            else
                log "  ${GREEN}✓${NC} package-lock.json committed and consistent"
            fi

            # Platform completeness — Railway builds on linux-x64. A lockfile
            # generated on macOS with a dirty node_modules can silently omit
            # other-platform native binaries (npm/cli#4828), failing the deploy
            # with "Cannot find module @rollup/rollup-linux-x64-gnu".
            # Fix: regenerate the lock from a CLEAN checkout:
            #   git clone . /tmp/lockgen && cd /tmp/lockgen && npm install --package-lock-only
            MISSING_LINUX=""
            grep -q '"node_modules/rollup"' "$LOCKFILE" 2>/dev/null && ! grep -q 'node_modules/@rollup/rollup-linux-x64-gnu"' "$LOCKFILE" && MISSING_LINUX+=" @rollup/rollup-linux-x64-gnu"
            grep -q '"node_modules/esbuild"' "$LOCKFILE" 2>/dev/null && ! grep -q 'node_modules/@esbuild/linux-x64"' "$LOCKFILE" && MISSING_LINUX+=" @esbuild/linux-x64"
            grep -q '"node_modules/@tailwindcss/oxide"' "$LOCKFILE" 2>/dev/null && ! grep -q 'node_modules/@tailwindcss/oxide-linux-x64-gnu"' "$LOCKFILE" && MISSING_LINUX+=" @tailwindcss/oxide-linux-x64-gnu"
            grep -q '"node_modules/lightningcss"' "$LOCKFILE" 2>/dev/null && ! grep -q 'node_modules/lightningcss-linux-x64-gnu"' "$LOCKFILE" && MISSING_LINUX+=" lightningcss-linux-x64-gnu"
            if [[ -n "$MISSING_LINUX" ]]; then
                log "  ${RED}❌ package-lock.json is missing linux-x64 native binaries (Railway will fail):${MISSING_LINUX}${NC}"
                log "     Regenerate from a clean checkout (see comment in ship.sh) — npm/cli#4828"
                inc_errors
            else
                log "  ${GREEN}✓${NC} package-lock.json includes linux-x64 binaries"
            fi
        fi
    fi

    # TypeScript compilation (if tsconfig exists in frontend dir)
    TSCONFIG=""
    for candidate in "${FRONTEND_DIR}/tsconfig.json" "tsconfig.json"; do
        if [[ -f "$candidate" ]]; then
            TSCONFIG="$candidate"
            break
        fi
    done
    # Vite build (run first — if this passes, TS errors are just strict-mode noise)
    VITE_BUILD_OK=false
    if grep -q '"build"' "${FRONTEND_DIR}/package.json" 2>/dev/null; then
        # Check if build script needs env vars (monorepo service selector)
        BUILD_SCRIPT=$(grep '"build"' "${FRONTEND_DIR}/package.json" | head -1)
        if echo "$BUILD_SCRIPT" | grep -qE 'monorepo-build|RAILWAY_SERVICE_NAME'; then
            # npm workspaces monorepo — Railway rebuilds EVERY service on push to
            # main, so a broken build in ANY workspace fails a deploy. Build them
            # all locally (shared-ui first: the apps depend on it).
            WS_LIST=$(node -p "(require('./package.json').workspaces||[]).join(' ')" 2>/dev/null) || WS_LIST=""
            if [[ -z "$WS_LIST" ]]; then
                log "  ${CYAN}ℹ${NC}  Monorepo build (needs RAILWAY_SERVICE_NAME) — no workspaces found, skipping"
            else
                log "  ${CYAN}npm workspaces monorepo — building all workspaces (Railway rebuilds every service on push)${NC}"
                ORDERED=""
                for WS in $WS_LIST; do [[ "$WS" == "shared-ui" ]] && ORDERED="$WS"; done
                for WS in $WS_LIST; do [[ "$WS" != "shared-ui" ]] && ORDERED="$ORDERED $WS"; done
                VITE_BUILD_OK=true
                for WS in $ORDERED; do
                    if [[ ! -f "$WS/package.json" ]] || ! grep -q '"build"' "$WS/package.json" 2>/dev/null; then
                        continue
                    fi
                    log "  ${CYAN}Building ${WS}...${NC}"
                    WS_RESULT=$(npm run build -w "$WS" 2>&1)
                    if [[ $? -ne 0 ]]; then
                        log "  ${RED}❌ ${WS} build FAILED:${NC}"
                        echo "$WS_RESULT" | tail -12
                        inc_errors
                        VITE_BUILD_OK=false
                    else
                        log "  ${GREEN}✓${NC} ${WS} build passed"
                    fi
                done
            fi
        else
            log "  ${CYAN}Vite build...${NC}"
            BUILD_RESULT=$(cd "$FRONTEND_DIR" && npm run build 2>&1)
            if [[ $? -ne 0 ]]; then
                # Check if it failed because of missing env var for monorepo
                if echo "$BUILD_RESULT" | grep -qi 'RAILWAY_SERVICE_NAME\|could not determine workspace'; then
                    log "  ${CYAN}ℹ${NC}  Monorepo build skipped (needs RAILWAY_SERVICE_NAME)"
                else
                    log "  ${RED}❌ Build FAILED:${NC}"
                    echo "$BUILD_RESULT" | tail -15
                    inc_errors
                fi
            else
                log "  ${GREEN}✓${NC} Build passed"
                VITE_BUILD_OK=true
            fi
        fi
    fi

    # TypeScript strict check
    if [[ -n "$TSCONFIG" ]] && command -v npx &> /dev/null; then
        log "  ${CYAN}TypeScript check...${NC}"
        TSC_RESULT=$(npx tsc --noEmit -p "$TSCONFIG" 2>&1)
        if [[ $? -ne 0 ]]; then
            TSC_ERRORS=$(echo "$TSC_RESULT" | grep -c 'error TS' || echo 0)
            if [[ "$VITE_BUILD_OK" == true ]]; then
                log "  ${YELLOW}⚠️  TypeScript strict: $TSC_ERRORS errors (build still passes)${NC}"
                echo "$TSC_RESULT" | grep 'error TS' | head -5
                inc_warnings
            else
                log "  ${RED}❌ TypeScript: $TSC_ERRORS errors${NC}"
                echo "$TSC_RESULT" | grep 'error TS' | head -10
                inc_errors
            fi
        else
            log "  ${GREEN}✓${NC} TypeScript passes"
        fi
    fi

    # Inertia-specific: SSR build
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
# PHASE 7: INERTIA / MULTI-APP CHECKS (only if detected)
# ============================================================================
if [[ "$HAS_INERTIA" == true || "$IS_MULTIAPP" == true ]]; then
    log "${BOLD}${BLUE}━━━ Phase 7: Platform-Specific Checks ━━━${NC}"
    phase_start

    if [[ "$HAS_INERTIA" == true ]]; then
        # SSR-incompatible code
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

        # Vite manifest
        if [[ ! -f "public/build/manifest.json" ]] && [[ ! -f "public/build/.vite/manifest.json" ]]; then
            log "  ${YELLOW}⚠️  Vite manifest missing — SSR may crash${NC}"
            inc_warnings
        fi
    fi

    if [[ "$IS_MULTIAPP" == true ]]; then
        # Branding leak check — only flag shared components, not app-specific subdirs
        BRAND_DIRS=("resources/js/Components" "resources/js/Layouts" "src/components" "src/layouts")
        # App-specific subdirs that legitimately contain app names
        APP_SUBDIRS="alphasite\|day-news\|downtown-guide\|go-event-city\|local-voices\|goeventcity\|daynews\|downtownguide"
        HARDCODED_BRANDS=""
        for dir in "${BRAND_DIRS[@]}"; do
            if [[ -d "$dir" ]]; then
                # Find branding in shared files, excluding app-specific subdirectories
                HITS=$(grep -rlE '"Go ?Event ?City"|"Day\.News"|"DowntownGuide"|"GoLocalVoices"' "$dir" 2>/dev/null \
                    | grep -vE "/(${APP_SUBDIRS})/" || true)
                if [[ -n "$HITS" ]]; then
                    HARDCODED_BRANDS+="$HITS"$'\n'
                fi
            fi
        done
        HARDCODED_BRANDS=$(echo "$HARDCODED_BRANDS" | sed '/^$/d')
        if [[ -n "$HARDCODED_BRANDS" ]]; then
            log "  ${YELLOW}⚠️  App names in shared components (check if platform-aware):${NC}"
            echo "$HARDCODED_BRANDS" | while read f; do log "     ${YELLOW}$f${NC}"; done
            inc_warnings
        else
            log "  ${GREEN}✓${NC} No branding leaks"
        fi
    fi

    phase_end
    log ""
fi

# ============================================================================
# PHASE 8: TASKJUGGLER REGRESSION GUARDS
# Every check here exists because this exact class of bug shipped to production
# and had to be hot-fixed. The commit ref cites the incident. Rule for adding to
# this phase: only after a real failure, and always cite it. (Built from the
# 30-day fix history, June 2026.)
# ============================================================================
if [[ "$PROJECT_TYPE" == "taskjuggler" && -n "$BACKEND_DIR" ]]; then
    log "${BOLD}${BLUE}━━━ Phase 8: TaskJuggler Regression Guards ━━━${NC}"
    phase_start

    rel_path() { echo "${1#"$BACKEND_DIR"/}"; }
    ALL_MIGRATIONS=$(find "${BACKEND_DIR}/database/migrations" "${BACKEND_DIR}/app/Modules" -type f -name '*.php' 2>/dev/null | grep -iE '/migrations?/' | sort)

    if [[ -z "$ALL_MIGRATIONS" ]]; then
        log "  ${YELLOW}⚠️  No migrations found — skipping migration guards${NC}"
    else
        # ── Guard 1: model keeps timestamps ON but its table has no updated_at ──
        # (commits 9756237 urpa_* tables, 0164e81 transactions + ai_tool_executions)
        # Every insert/update 500s with "no column updated_at". Hit prod 3×.
        TS_ERR=0; TS_WARN=0
        while IFS= read -r MODELF; do
            [[ -z "$MODELF" || ! -f "$MODELF" ]] && continue
            echo "$MODELF" | grep -q '/Models/' || continue
            grep -qE "const +UPDATED_AT *= *null|\\\$timestamps *= *false" "$MODELF" && continue
            CLASS=$(basename "$MODELF" .php)
            TBL=$(grep -oE "protected +\\\$table *= *'[a-z0-9_]+'" "$MODELF" | grep -oE "'[a-z0-9_]+'" | tr -d "'" | head -1)
            if [[ -z "$TBL" ]]; then
                SNAKE=$(echo "$CLASS" | sed -E 's/([a-z0-9])([A-Z])/\1_\2/g' | tr '[:upper:]' '[:lower:]')
                case "$SNAKE" in
                    *s) TBL="$SNAKE" ;;
                    *y) TBL="${SNAKE%y}ies" ;;
                    *)  TBL="${SNAKE}s" ;;
                esac
            fi
            CREATE_MIG=$(grep -lE "Schema::create\( *'${TBL}'" $ALL_MIGRATIONS </dev/null 2>/dev/null | head -1)
            [[ -z "$CREATE_MIG" ]] && continue
            # create migration adds an explicit created_at but not updated_at...
            grep -qE -e "->(timestampTz|timestamp)\( *'created_at'" "$CREATE_MIG" || continue
            grep -qE -e "updated_at|->timestamps\(|->timestampsTz\(" "$CREATE_MIG" && continue
            # ...and no later Schema::table alter on this table adds updated_at
            # (e.g. the 9756237 URPA fix retro-added it). Scan all migrations.
            SAFE=no
            for AM in $(grep -lE "Schema::table\( *'${TBL}'" $ALL_MIGRATIONS </dev/null 2>/dev/null); do
                grep -qE -e "updated_at" "$AM" && { SAFE=yes; break; }
            done
            [[ "$SAFE" == yes ]] && continue
            # Risky. New/changed model → hard error; pre-existing → warning so a
            # legacy latent bug doesn't block every unrelated ship.
            if echo "$CHANGED_PHP" | grep -qF "$MODELF" 2>/dev/null; then
                log "  ${RED}❌ ${CLASS} keeps Eloquent timestamps ON but table '${TBL}' has no updated_at — every insert/update will 500${NC}"
                log "     ${RED}Fix: add 'const UPDATED_AT = null;' to ${CLASS}, or \$table->timestampsTz() to $(rel_path "$CREATE_MIG").${NC}"
                inc_errors; TS_ERR=$((TS_ERR+1))
            else
                log "  ${YELLOW}⚠️  (pre-existing) ${CLASS} timestamps ON but '${TBL}' has no updated_at — latent 500; add 'const UPDATED_AT = null;'${NC}"
                inc_warnings; TS_WARN=$((TS_WARN+1))
            fi
        done < <(grep -rlE "use .*HasUuids|extends Model|extends Authenticatable" "${BACKEND_DIR}/app" --include='*.php' 2>/dev/null)
        [[ "$TS_ERR" -eq 0 && "$TS_WARN" -eq 0 ]] && log "  ${GREEN}✓${NC} Models with timestamps all have an updated_at column"

        # ── Guard 2: morphs()/nullableMorphs() = bigint morph id vs UUID PKs ──
        # (commit e544cd7: personal_access_tokens.tokenable_id bigint broke ALL login + registration)
        MORPH_NEW=""; MORPH_OLD=""
        while IFS= read -r MF; do
            [[ -z "$MF" ]] && continue
            if echo "$CHANGED_PHP" | grep -qF "$MF" 2>/dev/null; then MORPH_NEW+="$(rel_path "$MF") "; else MORPH_OLD+="$(rel_path "$MF") "; fi
        done < <(grep -lE -e '->(morphs|nullableMorphs)\(' $ALL_MIGRATIONS </dev/null 2>/dev/null)
        if [[ -n "$MORPH_NEW" ]]; then
            log "  ${RED}❌ morphs()/nullableMorphs() makes a bigint id — UUID PKs need uuidMorphs()/nullableUuidMorphs(): ${MORPH_NEW}${NC}"
            inc_errors
        fi
        if [[ -n "$MORPH_OLD" ]]; then
            log "  ${YELLOW}⚠️  (pre-existing) bigint morphs() in: ${MORPH_OLD}— should be uuidMorphs() (patched later, but the create migration is wrong)${NC}"
            inc_warnings
        fi
        [[ -z "$MORPH_NEW$MORPH_OLD" ]] && log "  ${GREEN}✓${NC} No bigint morphs() in migrations"

        # ── Guard 3: GIN index on a json column (GIN needs jsonb) ──
        # (commit 6343a81: tef_actors GIN-on-json failed inside try/catch, silently
        #  aborting the PG transaction — table vanished, migration recorded DONE)
        GIN_HITS=""
        for MIG in $ALL_MIGRATIONS; do
            if grep -qiE -e "'gin'|->index\([^)]*gin" "$MIG" && grep -qE -e "->json\(" "$MIG"; then
                GIN_HITS+="$(rel_path "$MIG")"$'\n'
            fi
        done
        if [[ -n "$GIN_HITS" ]]; then
            log "  ${YELLOW}⚠️  Possible GIN index on a json column (GIN needs jsonb — silent-rollback risk):${NC}"
            echo "$GIN_HITS" | sed '/^$/d' | while read -r l; do log "     ${YELLOW}$l${NC}"; done
            inc_warnings
        fi

        # ── Guard 4: DB::statement() inside try/catch in a migration ──
        # (commit 6343a81 root cause: a failed DB::statement aborts the PG tx, but
        #  the catch swallows it and Laravel records the migration as DONE.)
        TRYCATCH_HITS=""
        for MIG in $ALL_MIGRATIONS; do
            if grep -qE 'try *\{' "$MIG" && grep -qE 'DB::statement' "$MIG"; then
                TRYCATCH_HITS+="$(rel_path "$MIG")"$'\n'
            fi
        done
        if [[ -n "$TRYCATCH_HITS" ]]; then
            log "  ${YELLOW}⚠️  try/catch around DB::statement in a migration (a failed statement aborts the PG tx but is recorded DONE):${NC}"
            echo "$TRYCATCH_HITS" | sed '/^$/d' | while read -r l; do log "     ${YELLOW}$l${NC}"; done
            inc_warnings
        fi
    fi

    # ── Guard 5: module Migrations/ dir that is never loaded ──
    # (commit 6343a81: Urpa + Coordinator migrations weren't in modules.enabled
    #  and weren't loadMigrationsFrom'd → their tables were silently never created)
    PROVIDERS=$(find "${BACKEND_DIR}/app" -name '*ServiceProvider.php' 2>/dev/null)
    MODCFG="${BACKEND_DIR}/config/modules.php"
    UNLOADED=""
    if [[ -n "$PROVIDERS" ]]; then
        while IFS= read -r MODDIR; do
            [[ -z "$MODDIR" ]] && continue
            MODNAME=$(echo "$MODDIR" | sed -E 's|.*/Modules/([^/]+)/.*|\1|')
            MODLC=$(echo "$MODNAME" | tr '[:upper:]' '[:lower:]')
            grep -rqE "loadMigrationsFrom.*Modules/${MODNAME}/" $PROVIDERS </dev/null 2>/dev/null && continue
            grep -rqE "loadMigrationsFrom" "${BACKEND_DIR}/app/Modules/${MODNAME}" 2>/dev/null && continue
            grep -qiE "'${MODLC}'" "$MODCFG" 2>/dev/null && continue
            UNLOADED+="${MODNAME} "
        done < <(find "${BACKEND_DIR}/app/Modules" -type d -iname 'migrations' 2>/dev/null)
    fi
    if [[ -n "$UNLOADED" ]]; then
        log "  ${YELLOW}⚠️  Module migrations may never run (not loadMigrationsFrom'd, not in config/modules.php): ${UNLOADED}${NC}"
        log "     ${YELLOW}A disabled module's tables are silently never created.${NC}"
        inc_warnings
    else
        log "  ${GREEN}✓${NC} All module migration dirs are loaded"
    fi

    # ── Guard 6: healthcare MODULE must not reappear in this repo ──
    # (commit 261f678: Doctors module extracted to 4healthcare-Platform for HIPAA
    #  isolation). Only flag actual healthcare module DIRECTORIES — a passing
    #  mention of "HIPAA" in a comment is not a healthcare feature.
    HC_DIRS=$(find "${BACKEND_DIR}/app/Modules" -maxdepth 1 -type d -iregex '.*/\(doctors\|patients\|healthcare\|medical\)' 2>/dev/null | head -3)
    if [[ -n "$HC_DIRS" ]]; then
        log "  ${RED}❌ Healthcare module directory in this repo — forbidden (belongs in 4healthcare-Platform):${NC}"
        for x in $HC_DIRS; do log "     ${RED}$(rel_path "$x")${NC}"; done
        inc_errors
    else
        log "  ${GREEN}✓${NC} No healthcare module in this repo"
    fi

    # ── Guard 7: nixpacks uses phpXXExtensions.*, not phpXXPackages.* ──
    # (commit e0f9ae5: php82Packages.pdo_pgsql is an invalid nix attr → build fails)
    NIX=""
    for c in "${BACKEND_DIR}/nixpacks.toml" "nixpacks.toml"; do [[ -f "$c" ]] && NIX="$c" && break; done
    if [[ -n "$NIX" ]]; then
        # phpXXPackages.composer is legitimate; only PHP *extensions* under
        # Packages are the bug (e.g. php82Packages.pdo_pgsql).
        PKG_EXT_HITS=$(grep -nE 'php[0-9]+Packages\.' "$NIX" 2>/dev/null | grep -vE 'Packages\.composer')
        if [[ -n "$PKG_EXT_HITS" ]]; then
            log "  ${RED}❌ nixpacks.toml puts a PHP extension under phpXXPackages.* — extensions live under phpXXExtensions.*:${NC}"
            echo "$PKG_EXT_HITS" | head -3 | while read -r l; do log "     ${RED}$l${NC}"; done
            inc_errors
        else
            log "  ${GREEN}✓${NC} nixpacks PHP extensions use phpXXExtensions.*"
        fi
    fi

    # ── Guard 8: every frontend workspace ships a real, committed .env.production ──
    # (commit 486570b: projects-web/.env.production was gitignored → 4projects
    #  deployed pointing at the localhost API fallback)
    if [[ -f "package.json" ]] && command -v node >/dev/null 2>&1; then
        WS_LIST=$(node -p "(require('./package.json').workspaces||[]).join(' ')" 2>/dev/null) || WS_LIST=""
        ENV_PROD_ISSUES=0
        for WS in $WS_LIST; do
            [[ -f "$WS/package.json" ]] || continue
            grep -q '"build"' "$WS/package.json" 2>/dev/null || continue
            # Only API-consuming apps need .env.production — skip libraries like
            # shared-ui (a vite build that never calls VITE_API_URL).
            grep -rqE 'VITE_API_URL' "$WS/src" 2>/dev/null || continue
            EP="$WS/.env.production"
            if [[ ! -f "$EP" ]]; then
                log "  ${YELLOW}⚠️  ${WS} has no .env.production — Vite bakes the localhost API fallback${NC}"
                inc_warnings; ENV_PROD_ISSUES=$((ENV_PROD_ISSUES+1)); continue
            fi
            if ! git ls-files --error-unmatch "$EP" &>/dev/null; then
                log "  ${RED}❌ ${EP} exists but is gitignored/untracked — Railway won't get it (deploys with localhost API)${NC}"
                inc_errors; ENV_PROD_ISSUES=$((ENV_PROD_ISSUES+1)); continue
            fi
            if grep -qE 'VITE_API_URL=.*(localhost|127\.0\.0\.1)' "$EP" 2>/dev/null; then
                log "  ${RED}❌ ${EP} points VITE_API_URL at localhost${NC}"
                inc_errors; ENV_PROD_ISSUES=$((ENV_PROD_ISSUES+1))
            fi
        done
        [[ "$ENV_PROD_ISSUES" -eq 0 && -n "$WS_LIST" ]] && log "  ${GREEN}✓${NC} All frontend workspaces ship a committed, non-localhost .env.production"
    fi

    # ── Guard 9: lockfile is actually installable (npm ci) when it changed ──
    # (commit d446e17: a corrupt lock from a stale node_modules made npm ci reject
    #  with "Invalid Version" — failed ALL Railway services at once)
    LOCK_IN_DIFF=$(
        { git diff --name-only HEAD 2>/dev/null
          git diff --name-only --cached 2>/dev/null
          git diff --name-only @{upstream}..HEAD 2>/dev/null
        } | grep -E '(^|/)package-lock\.json$' | head -1
    )
    if [[ -n "$LOCK_IN_DIFF" && -f "package-lock.json" ]] && command -v npm >/dev/null 2>&1; then
        log "  ${CYAN}Validating package-lock.json is installable (npm ci --dry-run)...${NC}"
        if npm ci --dry-run >/dev/null 2>&1; then
            log "  ${GREEN}✓${NC} package-lock.json parses and resolves (npm ci)"
        else
            log "  ${RED}❌ npm ci rejects the lockfile — Railway will fail every service. Regenerate from a clean checkout.${NC}"
            inc_errors
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

# ── Dry run stops here ──
if [[ "$MODE" == "dry" || -z "$COMMIT_MSG" ]]; then
    log "  ${CYAN}Dry run complete. No commit made.${NC}"
    if [[ -n "$REPORT_FILE" ]]; then
        log "  Report: ${CYAN}$REPORT_FILE${NC}"
    fi
    exit 0
fi

# ============================================================================
# COMMIT & PUSH
# ============================================================================
log "${BOLD}${BLUE}━━━ Ship It ━━━${NC}"

git add -A
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

log ""
log "${GREEN}${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
log "${GREEN}${BOLD}║            🚀 SHIPPED SUCCESSFULLY                  ║${NC}"
log "${GREEN}${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
log ""
log "  Commit:   ${CYAN}$COMMIT_MSG${NC}"
log "  Duration: ${CYAN}${SHIP_ELAPSED}s${NC}"
log ""
