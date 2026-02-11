#!/usr/bin/env node
// ============================================================
// CLI ENTRY POINT — Run audits without MCP
// ============================================================
// Usage:
//   node dist/cli.js http://localhost:8000
//   node dist/cli.js --all
//   node dist/cli.js --app "Day.News"
// ============================================================

import { PageAuditorService } from './services/auditor.js';
import { loadApps } from './config/apps.js';
import fs from 'fs';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
SiteHealth CLI — Exhaustive Interactive Element Auditor

Usage:
  node dist/cli.js <url>              Audit a single page
  node dist/cli.js --all              Audit all configured pages
  node dist/cli.js --app <name>       Audit all pages for one app
  node dist/cli.js --tags <tags>      Audit apps with specific tags

Output:
  Console summary + JSON report in ./audit-reports/
`);
    process.exit(0);
  }

  const auditor = new PageAuditorService();
  await auditor.init();

  try {
    if (args[0] === '--all' || args[0] === '--app' || args[0] === '--tags') {
      let apps = loadApps();
      let tags: string[] | undefined;

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '--app') apps = apps.filter(a => a.name === args[++i]);
        if (args[i] === '--tags') tags = args[++i].split(',').map(t => t.trim());
      }

      const report = await auditor.auditAll(apps, tags);

      // Print summary
      console.log('\n' + '═'.repeat(70));
      console.log('  AUDIT COMPLETE');
      console.log('═'.repeat(70));
      console.log(`  Pages tested: ${report.pages.length}`);
      console.log(`  Elements tested: ${report.overallSummary.total}`);
      console.log(`  ✓ Passed:   ${report.overallSummary.passed}`);
      console.log(`  ✗ Failed:   ${report.overallSummary.failed}`);
      console.log(`  ⚠ Warnings: ${report.overallSummary.warnings}`);
      console.log(`  ✗ Errors:   ${report.overallSummary.errors}`);

      const issues = auditor.extractFixableIssues(report);
      if (issues.length > 0) {
        console.log(`\n  FAILURES:`);
        for (const issue of issues) {
          console.log(`  \x1b[31m✗\x1b[0m [${issue.fixCategory}] ${issue.app} > ${issue.page}`);
          console.log(`    "${issue.label}" — ${issue.details}`);
        }
      }

      console.log(`\n  Report: ./audit-reports/${report.runId}.json`);
      process.exit(issues.length > 0 ? 1 : 0);

    } else {
      // Single URL
      const url = args[0];
      const result = await auditor.auditPage(url, args[1] || url, 'CLI');

      console.log('\n' + '═'.repeat(70));
      console.log(`  ${result.name}: ${result.summary.passed} pass / ${result.summary.failed} fail / ${result.summary.warnings} warn`);
      console.log('═'.repeat(70));

      const failures = result.elements.filter(e => e.status === 'FAIL' || e.status === 'ERROR');
      if (failures.length > 0) {
        console.log('\n  FAILURES:');
        failures.forEach(f => {
          console.log(`  \x1b[31m✗\x1b[0m [${f.elementType}] "${f.label}" — ${f.details}`);
        });
      }

      process.exit(failures.length > 0 ? 1 : 0);
    }
  } finally {
    await auditor.cleanup();
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(2);
});
