<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Tests\TestReporter;
use Illuminate\Support\Facades\File;

class TestReport extends Command
{
    protected $signature = 'test:report {--input=storage/logs/tests} {--output=storage/logs/tests/reports}';
    protected $description = 'Generate test report from test logs';

    public function handle()
    {
        $inputDir = $this->option('input');
        $outputDir = $this->option('output');

        if (!File::exists($inputDir)) {
            $this->error("Input directory does not exist: {$inputDir}");
            return 1;
        }

        // Create output directory if it doesn't exist
        if (!File::exists($outputDir)) {
            File::makeDirectory($outputDir, 0755, true);
        }

        // Find latest report
        $latestReport = storage_path('logs/tests/latest-report.json');
        
        if (!File::exists($latestReport)) {
            $this->error('No test report found. Run tests first.');
            return 1;
        }

        $reportData = json_decode(File::get($latestReport), true);
        
        if (!$reportData) {
            $this->error('Invalid test report format');
            return 1;
        }

        $reporter = new TestReporter();
        
        // Detect issues
        $issues = $reporter->detectIssues($reportData['tests'] ?? []);
        
        // Generate corrections
        $corrections = $reporter->generateCorrections($issues);
        
        // Generate HTML report
        $htmlFile = $reporter->saveHtmlReport($reportData);
        
        $this->info("Test Report Generated");
        $this->line("Session ID: {$reportData['session_id']}");
        $this->line("Total Tests: {$reportData['summary']['total']}");
        $this->line("Passed: {$reportData['summary']['passed']}");
        $this->line("Failed: {$reportData['summary']['failed']}");
        $this->line("Pass Rate: {$reportData['summary']['pass_rate']}%");
        $this->line("");
        
        if (!empty($issues)) {
            $this->warn("Issues Detected: " . count($issues));
            foreach ($issues as $issue) {
                $this->line("  - [{$issue['priority']}] {$issue['test_name']}: {$issue['issue']}");
            }
        }
        
        $this->line("");
        $this->info("HTML Report: {$htmlFile}");
        
        if (!empty($corrections)) {
            $correctionsFile = storage_path('logs/tests/corrections-' . $reportData['session_id'] . '.json');
            File::put($correctionsFile, json_encode($corrections, JSON_PRETTY_PRINT));
            $this->info("Corrections: {$correctionsFile}");
        }

        return 0;
    }
}
