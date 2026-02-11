#!/usr/bin/env node
// ============================================================
// AI FIX LOOP ORCHESTRATOR
// ============================================================
//
// The automated cycle:
//   1. Audit → find all broken elements
//   2. For each failure → generate fix prompt
//   3. Send to Claude API → get fix suggestion
//   4. Apply fix (or present for review)
//   5. Re-audit → verify fix worked
//   6. Repeat until clean (or max iterations)
//
// Usage:
//   node dist/fix-loop.js --url http://localhost:8000
//   node dist/fix-loop.js --all
//   node dist/fix-loop.js --all --auto-apply
//   node dist/fix-loop.js --app "Day.News" --max-iterations 5
//
// Environment:
//   ANTHROPIC_API_KEY    Required for AI fix suggestions
//   PROJECT_ROOT         Path to source code (default: current dir)
// ============================================================

import { PageAuditorService } from './services/auditor.js';
import { loadApps } from './config/apps.js';
import { FixableIssue, FixLoopConfig, AiFixSuggestion, PageAuditResult, FullAuditReport } from './types.js';
import fs from 'fs';
import path from 'path';

// ============================================================
// CONFIGURATION
// ============================================================
function parseArgs(): FixLoopConfig & { url?: string; all?: boolean; appName?: string; tags?: string } {
  const args = process.argv.slice(2);
  const config: FixLoopConfig & { url?: string; all?: boolean; appName?: string; tags?: string } = {
    maxIterations: 5,
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4-20250514',
    projectRoot: process.env.PROJECT_ROOT || '.',
    autoApply: false,
    verifyAfterFix: true,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url': config.url = args[++i]; break;
      case '--all': config.all = true; break;
      case '--app': config.appName = args[++i]; break;
      case '--tags': config.tags = args[++i]; break;
      case '--max-iterations': config.maxIterations = parseInt(args[++i]); break;
      case '--auto-apply': config.autoApply = true; break;
      case '--no-verify': config.verifyAfterFix = false; break;
      case '--project-root': config.projectRoot = args[++i]; break;
      case '--model': config.model = args[++i]; break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  return config;
}

function printHelp(): void {
  console.log(`
SiteHealth AI Fix Loop

Usage:
  node dist/fix-loop.js [options]

Options:
  --url <url>            Audit and fix a single page
  --all                  Audit and fix all configured pages
  --app <name>           Filter to a specific app
  --tags <tags>          Filter by tags (comma-separated)
  --max-iterations <n>   Max fix-verify cycles (default: 5)
  --auto-apply           Automatically apply AI-suggested fixes
  --no-verify            Skip re-audit after fixes
  --project-root <path>  Path to source code (default: current dir)
  --model <model>        Claude model to use (default: claude-sonnet-4-20250514)

Environment:
  ANTHROPIC_API_KEY      Required for AI fix generation
  PROJECT_ROOT           Path to source code

Examples:
  node dist/fix-loop.js --url http://localhost:8000 --auto-apply
  node dist/fix-loop.js --all --max-iterations 3
  node dist/fix-loop.js --app "Day.News" --auto-apply
`);
}

// ============================================================
// MAIN FIX LOOP
// ============================================================
async function runFixLoop(config: FixLoopConfig & { url?: string; all?: boolean; appName?: string; tags?: string }): Promise<void> {
  console.log('\n' + '═'.repeat(70));
  console.log('  SITEHEALTH AI FIX LOOP');
  console.log('  Audit → AI Fix → Verify → Repeat');
  console.log('═'.repeat(70));
  console.log(`  Max iterations: ${config.maxIterations}`);
  console.log(`  Auto-apply: ${config.autoApply}`);
  console.log(`  Project root: ${config.projectRoot}`);
  console.log(`  Model: ${config.model}`);
  console.log('═'.repeat(70) + '\n');

  const auditor = new PageAuditorService();
  await auditor.init();

  let iteration = 0;
  let totalFixed = 0;
  let totalIssues = 0;

  try {
    while (iteration < config.maxIterations) {
      iteration++;
      console.log(`\n${'─'.repeat(70)}`);
      console.log(`  ITERATION ${iteration}/${config.maxIterations}`);
      console.log(`${'─'.repeat(70)}\n`);

      // ---- STEP 1: AUDIT ----
      console.log('  Step 1: Running audit...\n');
      let report: FullAuditReport;

      if (config.url) {
        const result = await auditor.auditPage(config.url, config.url, 'Manual');
        report = {
          runId: `fixloop-${Date.now()}`,
          startTime: result.timestamp,
          endTime: new Date().toISOString(),
          durationMs: result.loadTimeMs,
          pages: [result],
          overallSummary: result.summary,
        };
      } else {
        let apps = loadApps();
        if (config.appName) apps = apps.filter(a => a.name === config.appName);
        const tagList = config.tags?.split(',').map(t => t.trim());
        report = await auditor.auditAll(apps, tagList);
      }

      // ---- STEP 2: EXTRACT ISSUES ----
      const issues = auditor.extractFixableIssues(report);
      totalIssues = issues.length;

      console.log(`\n  Audit complete: ${report.overallSummary.total} elements tested`);
      console.log(`  ✓ Passed: ${report.overallSummary.passed}`);
      console.log(`  ✗ Failed: ${report.overallSummary.failed}`);
      console.log(`  ⚠ Warnings: ${report.overallSummary.warnings}`);

      if (issues.length === 0) {
        console.log('\n  🎉 NO ISSUES FOUND! All elements working.\n');
        break;
      }

      console.log(`\n  Found ${issues.length} fixable issues:`);
      const byCat = issues.reduce((acc, i) => {
        acc[i.fixCategory] = (acc[i.fixCategory] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      Object.entries(byCat).forEach(([cat, count]) => {
        console.log(`    ${cat}: ${count}`);
      });

      // ---- STEP 3: GENERATE FIX SUGGESTIONS ----
      if (!config.apiKey) {
        console.log('\n  ⚠ No ANTHROPIC_API_KEY set. Writing issues to file instead.\n');
        const issuesPath = `./audit-reports/issues-${report.runId}.json`;
        fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2));
        console.log(`  Issues saved to: ${issuesPath}`);
        console.log('  You can feed these to Claude Code or Cursor manually.\n');

        // Also write human-readable fix prompts
        const promptsPath = `./audit-reports/fix-prompts-${report.runId}.md`;
        let prompts = `# Fix Prompts — ${issues.length} issues\n\n`;
        for (const issue of issues) {
          prompts += buildFixPrompt(issue, config.projectRoot) + '\n\n---\n\n';
        }
        fs.writeFileSync(promptsPath, prompts);
        console.log(`  Fix prompts saved to: ${promptsPath}`);
        break;
      }

      console.log('\n  Step 3: Generating AI fix suggestions...\n');

      for (const issue of issues) {
        console.log(`  Analyzing: [${issue.fixCategory}] "${issue.label}" on ${issue.page}...`);

        try {
          const suggestion = await getAiFixSuggestion(issue, config);

          if (suggestion) {
            console.log(`    Confidence: ${suggestion.confidence}`);
            console.log(`    Files to change: ${suggestion.files.length}`);

            if (config.autoApply && suggestion.confidence !== 'low') {
              // Apply the fix
              for (const change of suggestion.files) {
                await applyFileChange(change, config.projectRoot);
                console.log(`    Applied: ${change.action} ${change.filePath}`);
              }
              totalFixed++;
              issue.resolved = true;
            } else {
              // Save suggestion for manual review
              console.log(`    Suggestion saved for review`);
            }
          }
        } catch (err) {
          console.log(`    ⚠ AI analysis failed: ${(err as Error).message}`);
        }
      }

      // ---- STEP 4: VERIFY ----
      if (!config.verifyAfterFix || !config.autoApply) {
        console.log('\n  Skipping verification (no auto-apply or --no-verify)\n');
        break;
      }

      console.log('\n  Step 4: Verifying fixes (next iteration will re-audit)...\n');

      // Save iteration report
      const iterPath = `./audit-reports/iteration-${iteration}-${report.runId}.json`;
      fs.writeFileSync(iterPath, JSON.stringify({
        iteration, issues: issues.length,
        fixed: issues.filter(i => i.resolved).length,
        remaining: issues.filter(i => !i.resolved).length,
        details: issues,
      }, null, 2));
    }

    // ---- FINAL SUMMARY ----
    console.log('\n' + '═'.repeat(70));
    console.log('  FIX LOOP COMPLETE');
    console.log('═'.repeat(70));
    console.log(`  Iterations: ${iteration}`);
    console.log(`  Total issues found: ${totalIssues}`);
    console.log(`  Auto-fixed: ${totalFixed}`);
    console.log(`  Remaining: ${totalIssues - totalFixed}`);
    console.log('═'.repeat(70) + '\n');

  } finally {
    await auditor.cleanup();
  }
}

// ============================================================
// AI FIX SUGGESTION via Anthropic API
// ============================================================
async function getAiFixSuggestion(
  issue: FixableIssue,
  config: FixLoopConfig
): Promise<AiFixSuggestion | null> {
  const prompt = buildFixPrompt(issue, config.projectRoot);

  // Read relevant source files if we can find them
  const sourceContext = await findRelevantSourceFiles(issue, config.projectRoot);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `${prompt}

${sourceContext ? `\n## Relevant Source Files\n${sourceContext}` : ''}

## Response Format
Respond ONLY with a JSON object (no markdown, no backticks):
{
  "analysis": "Brief explanation of the root cause",
  "confidence": "high" | "medium" | "low",
  "explanation": "What the fix does",
  "files": [
    {
      "filePath": "relative/path/to/file",
      "action": "edit",
      "searchContent": "exact content to find",
      "replaceContent": "content to replace with"
    }
  ]
}`,
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { content: Array<{ type: string; text?: string }> };
  const text = data.content.find(c => c.type === 'text')?.text;
  if (!text) return null;

  try {
    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      issueId: issue.issueId,
      analysis: parsed.analysis,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      files: parsed.files || [],
    };
  } catch {
    console.log(`    Could not parse AI response`);
    return null;
  }
}

// ============================================================
// FIND RELEVANT SOURCE FILES
// ============================================================
async function findRelevantSourceFiles(issue: FixableIssue, projectRoot: string): Promise<string | null> {
  const contexts: string[] = [];

  // Try to find files based on the page name / URL
  const possiblePaths = [
    // Inertia/React pages
    path.join(projectRoot, 'resources/js/Pages'),
    // Components
    path.join(projectRoot, 'resources/js/Components'),
    // Controllers
    path.join(projectRoot, 'app/Http/Controllers'),
    // Routes
    path.join(projectRoot, 'routes'),
  ];

  for (const searchPath of possiblePaths) {
    if (!fs.existsSync(searchPath)) continue;

    try {
      // Search for files that might contain the element
      const files = findFilesContaining(searchPath, issue.label.substring(0, 30));
      for (const file of files.slice(0, 3)) { // Max 3 files
        const content = fs.readFileSync(file, 'utf-8');
        // Only include first 200 lines
        const truncated = content.split('\n').slice(0, 200).join('\n');
        contexts.push(`### ${file}\n\`\`\`\n${truncated}\n\`\`\``);
      }
    } catch {
      // Skip files we can't read
    }
  }

  return contexts.length > 0 ? contexts.join('\n\n') : null;
}

function findFilesContaining(dir: string, searchStr: string, maxDepth: number = 3): string[] {
  const results: string[] = [];
  if (maxDepth <= 0) return results;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'vendor') {
        results.push(...findFilesContaining(fullPath, searchStr, maxDepth - 1));
      } else if (entry.isFile() && /\.(tsx?|jsx?|php|vue)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes(searchStr)) {
            results.push(fullPath);
          }
        } catch { /* skip */ }
      }
    }
  } catch { /* skip */ }

  return results;
}

// ============================================================
// APPLY FILE CHANGE
// ============================================================
async function applyFileChange(
  change: { filePath: string; action: string; searchContent?: string; replaceContent?: string; newContent?: string },
  projectRoot: string
): Promise<void> {
  const fullPath = path.resolve(projectRoot, change.filePath);

  switch (change.action) {
    case 'edit': {
      if (!change.searchContent || change.replaceContent === undefined) {
        throw new Error('Edit requires searchContent and replaceContent');
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes(change.searchContent)) {
        throw new Error(`Could not find search content in ${change.filePath}`);
      }
      const updated = content.replace(change.searchContent, change.replaceContent);
      fs.writeFileSync(fullPath, updated);
      break;
    }
    case 'create': {
      if (!change.newContent) throw new Error('Create requires newContent');
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, change.newContent);
      break;
    }
    case 'delete': {
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      break;
    }
  }
}

// ============================================================
// BUILD FIX PROMPT (same as in tools, kept here for standalone use)
// ============================================================
function buildFixPrompt(issue: FixableIssue, projectRoot: string): string {
  const strategies: Record<string, string> = {
    'dead-link': 'Broken link — check route definition, controller, or update href.',
    'dead-button': 'Dead button — missing onClick/event handler. Check the component for missing event wiring.',
    'js-error': 'JavaScript error on interaction — look at the console error below.',
    'network-error': 'Failed network request — check API endpoint, route, auth, CSRF.',
    'empty-form': 'Select/dropdown has no options — check data source or prop.',
    'broken-navigation': 'Navigation to broken page — check destination route and controller.',
    'missing-handler': 'Missing event handler — add onClick/onChange to the element.',
  };

  return `# SiteHealth Fix Request

**App**: ${issue.app} | **Page**: ${issue.page} (${issue.pageUrl})
**Element**: [${issue.elementType}] "${issue.label}"
**Selector**: \`${issue.selector}\`
**Category**: ${issue.fixCategory}
**Problem**: ${issue.details}
${issue.consoleErrors.length > 0 ? `**Console Errors**: ${issue.consoleErrors.join('; ')}` : ''}
${issue.networkErrors.length > 0 ? `**Network Errors**: ${issue.networkErrors.join('; ')}` : ''}
**Strategy**: ${strategies[issue.fixCategory] || 'Investigate and fix.'}
**Project**: ${projectRoot}`;
}

// ============================================================
// ENTRY POINT
// ============================================================
const config = parseArgs();
if (!config.url && !config.all && !config.appName) {
  printHelp();
  process.exit(0);
}

runFixLoop(config).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
