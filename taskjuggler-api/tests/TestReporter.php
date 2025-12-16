<?php

namespace Tests;

use Illuminate\Support\Facades\File;

class TestReporter
{
    private string $logDir;

    public function __construct()
    {
        $this->logDir = storage_path('logs/tests');
    }

    /**
     * Analyze test results and detect issues
     */
    public function detectIssues(array $testResults): array
    {
        $issues = [];

        foreach ($testResults as $test) {
            // Detect API errors
            if (!empty($test['errors'])) {
                foreach ($test['errors'] as $error) {
                    $issues[] = $this->categorizeError($test, $error);
                }
            }

            // Detect performance issues
            if ($test['duration_ms'] > 5000) { // Tests taking > 5 seconds
                $issues[] = [
                    'test_id' => $test['test_id'],
                    'test_name' => $test['test_name'],
                    'category' => 'performance',
                    'priority' => 'medium',
                    'issue' => 'Test execution time exceeds threshold',
                    'details' => [
                        'duration_ms' => $test['duration_ms'],
                        'threshold_ms' => 5000,
                    ],
                    'suggestion' => 'Optimize test or increase timeout',
                ];
            }

            // Detect assertion failures
            $failedAssertions = array_filter($test['assertions'] ?? [], fn($a) => !$a['passed']);
            if (!empty($failedAssertions)) {
                foreach ($failedAssertions as $assertion) {
                    $issues[] = [
                        'test_id' => $test['test_id'],
                        'test_name' => $test['test_name'],
                        'category' => 'assertion',
                        'priority' => 'high',
                        'issue' => 'Assertion failed',
                        'details' => $assertion,
                        'suggestion' => 'Review expected vs actual values',
                    ];
                }
            }
        }

        return $issues;
    }

    /**
     * Categorize error and suggest fix
     */
    private function categorizeError(array $test, array $error): array
    {
        $issue = [
            'test_id' => $test['test_id'],
            'test_name' => $test['test_name'],
            'category' => 'error',
            'priority' => 'high',
            'issue' => $error['message'],
            'details' => $error,
        ];

        // Suggest fixes based on error type
        if (isset($error['exception'])) {
            $exception = $error['exception'];
            
            // Database errors
            if (str_contains($exception['message'], 'SQLSTATE') || str_contains($exception['class'], 'Database')) {
                $issue['category'] = 'database';
                $issue['suggestion'] = 'Check database connection, migrations, or query syntax';
            }
            
            // Authentication errors
            if (str_contains($exception['message'], 'Unauthenticated') || str_contains($exception['message'], 'Unauthorized')) {
                $issue['category'] = 'authentication';
                $issue['suggestion'] = 'Check authentication token or user permissions';
            }
            
            // Validation errors
            if (str_contains($exception['message'], 'validation') || str_contains($exception['class'], 'Validation')) {
                $issue['category'] = 'validation';
                $issue['suggestion'] = 'Review request data and validation rules';
            }
            
            // 404 errors
            if (str_contains($exception['message'], '404') || str_contains($exception['message'], 'Not Found')) {
                $issue['category'] = 'routing';
                $issue['suggestion'] = 'Check route definition and URL';
            }
            
            // 500 errors
            if (str_contains($exception['message'], '500') || str_contains($exception['message'], 'Internal Server Error')) {
                $issue['category'] = 'server';
                $issue['priority'] = 'critical';
                $issue['suggestion'] = 'Check server logs and application code';
            }
        }

        return $issue;
    }

    /**
     * Generate HTML report
     */
    public function generateHtmlReport(array $report): string
    {
        $html = '<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ' . $report['timestamp'] . '</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .skipped { color: orange; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #4CAF50; color: white; }
        .issue { padding: 10px; margin: 10px 0; border-left: 4px solid #f44336; background: #ffebee; }
        .issue.critical { border-color: #d32f2f; }
        .issue.high { border-color: #f44336; }
        .issue.medium { border-color: #ff9800; }
        .issue.low { border-color: #ffc107; }
    </style>
</head>
<body>
    <h1>Test Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Session ID: ' . htmlspecialchars($report['session_id']) . '</p>
        <p>Timestamp: ' . htmlspecialchars($report['timestamp']) . '</p>
        <p>Total: ' . $report['summary']['total'] . '</p>
        <p class="passed">Passed: ' . $report['summary']['passed'] . '</p>
        <p class="failed">Failed: ' . $report['summary']['failed'] . '</p>
        <p class="skipped">Skipped: ' . $report['summary']['skipped'] . '</p>
        <p>Pass Rate: ' . $report['summary']['pass_rate'] . '%</p>
        <p>Total Duration: ' . $report['performance']['total_duration_ms'] . 'ms</p>
    </div>';

        if (!empty($report['failed_tests'])) {
            $html .= '<h2>Failed Tests</h2><table><tr><th>Test ID</th><th>Test Name</th><th>Status</th><th>Errors</th></tr>';
            foreach ($report['failed_tests'] as $test) {
                $html .= '<tr>
                    <td>' . htmlspecialchars($test['test_id']) . '</td>
                    <td>' . htmlspecialchars($test['test_name']) . '</td>
                    <td class="failed">' . htmlspecialchars($test['status']) . '</td>
                    <td>' . count($test['errors']) . '</td>
                </tr>';
            }
            $html .= '</table>';
        }

        $issues = $this->detectIssues($report['tests']);
        if (!empty($issues)) {
            $html .= '<h2>Detected Issues</h2>';
            foreach ($issues as $issue) {
                $html .= '<div class="issue ' . htmlspecialchars($issue['priority']) . '">
                    <h3>' . htmlspecialchars($issue['test_name']) . '</h3>
                    <p><strong>Category:</strong> ' . htmlspecialchars($issue['category']) . '</p>
                    <p><strong>Priority:</strong> ' . htmlspecialchars($issue['priority']) . '</p>
                    <p><strong>Issue:</strong> ' . htmlspecialchars($issue['issue']) . '</p>
                    ' . (isset($issue['suggestion']) ? '<p><strong>Suggestion:</strong> ' . htmlspecialchars($issue['suggestion']) . '</p>' : '') . '
                </div>';
            }
        }

        $html .= '</body></html>';
        return $html;
    }

    /**
     * Save HTML report
     */
    public function saveHtmlReport(array $report): string
    {
        $html = $this->generateHtmlReport($report);
        $filename = sprintf('%s/report-%s.html', $this->logDir, $report['session_id']);
        File::put($filename, $html);
        
        // Also save as latest
        File::put(sprintf('%s/latest-report.html', $this->logDir), $html);
        
        return $filename;
    }

    /**
     * Generate correction suggestions
     */
    public function generateCorrections(array $issues): array
    {
        $corrections = [];

        foreach ($issues as $issue) {
            $correction = [
                'issue_id' => $issue['test_id'] . '-' . uniqid(),
                'test_id' => $issue['test_id'],
                'priority' => $issue['priority'],
                'category' => $issue['category'],
                'suggested_fix' => $issue['suggestion'] ?? 'Review test and fix issue',
                'files_to_check' => [],
                'steps' => [],
            ];

            // Add file suggestions based on category
            switch ($issue['category']) {
                case 'database':
                    $correction['files_to_check'][] = 'database/migrations/';
                    $correction['files_to_check'][] = 'app/Models/';
                    $correction['steps'][] = 'Check migration files';
                    $correction['steps'][] = 'Verify model relationships';
                    break;
                case 'authentication':
                    $correction['files_to_check'][] = 'app/Http/Controllers/';
                    $correction['files_to_check'][] = 'app/Policies/';
                    $correction['steps'][] = 'Check authentication middleware';
                    $correction['steps'][] = 'Verify user permissions';
                    break;
                case 'routing':
                    $correction['files_to_check'][] = 'routes/api.php';
                    $correction['steps'][] = 'Check route definition';
                    $correction['steps'][] = 'Verify route parameters';
                    break;
            }

            $corrections[] = $correction;
        }

        return $corrections;
    }
}
