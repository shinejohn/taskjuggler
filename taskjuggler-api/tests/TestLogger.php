<?php

namespace Tests;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class TestLogger
{
    private string $sessionId;
    private string $logDir;
    private array $currentTest = [];
    private array $testResults = [];

    public function __construct()
    {
        $this->sessionId = 'test-' . date('Ymd-His') . '-' . uniqid();
        $this->logDir = storage_path('logs/tests');
        
        if (!File::exists($this->logDir)) {
            File::makeDirectory($this->logDir, 0755, true);
        }
    }

    /**
     * Start logging a test
     */
    public function startTest(string $testId, string $testName, string $category = 'api'): void
    {
        $this->currentTest = [
            'test_id' => $testId,
            'test_name' => $testName,
            'category' => $category,
            'status' => 'running',
            'started_at' => now()->toIso8601String(),
            'details' => [],
            'assertions' => [],
            'errors' => [],
            'warnings' => [],
            'screenshots' => [],
            'performance' => [
                'start_memory' => memory_get_usage(true),
                'start_time' => microtime(true),
            ],
        ];
    }

    /**
     * Log test details
     */
    public function logDetail(string $key, $value): void
    {
        $this->currentTest['details'][$key] = $value;
    }

    /**
     * Log an assertion
     */
    public function logAssertion(string $description, bool $passed, ?string $message = null): void
    {
        $this->currentTest['assertions'][] = [
            'description' => $description,
            'passed' => $passed,
            'message' => $message,
            'timestamp' => now()->toIso8601String(),
        ];

        if (!$passed) {
            $this->currentTest['warnings'][] = [
                'type' => 'assertion_failed',
                'message' => $message ?? "Assertion failed: {$description}",
                'timestamp' => now()->toIso8601String(),
            ];
        }
    }

    /**
     * Log an error
     */
    public function logError(string $message, ?\Throwable $exception = null): void
    {
        $error = [
            'message' => $message,
            'timestamp' => now()->toIso8601String(),
        ];

        if ($exception) {
            $error['exception'] = [
                'class' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        $this->currentTest['errors'][] = $error;
        $this->currentTest['status'] = 'failed';
    }

    /**
     * Log a warning
     */
    public function logWarning(string $message, array $context = []): void
    {
        $this->currentTest['warnings'][] = [
            'type' => 'warning',
            'message' => $message,
            'context' => $context,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Log a screenshot (for E2E tests)
     */
    public function logScreenshot(string $path, string $description = ''): void
    {
        $this->currentTest['screenshots'][] = [
            'path' => $path,
            'description' => $description,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * End logging a test
     */
    public function endTest(string $status = 'passed'): array
    {
        if (empty($this->currentTest)) {
            return [];
        }

        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);

        $this->currentTest['status'] = $this->currentTest['status'] === 'failed' ? 'failed' : $status;
        $this->currentTest['completed_at'] = now()->toIso8601String();
        $this->currentTest['duration_ms'] = round(($endTime - $this->currentTest['performance']['start_time']) * 1000, 2);
        $this->currentTest['performance']['end_memory'] = $endMemory;
        $this->currentTest['performance']['memory_used'] = $endMemory - $this->currentTest['performance']['start_memory'];
        $this->currentTest['performance']['end_time'] = $endTime;

        $testResult = $this->currentTest;
        $this->testResults[] = $testResult;

        // Save individual test log
        $this->saveTestLog($testResult);

        // Reset current test
        $this->currentTest = [];

        return $testResult;
    }

    /**
     * Save test log to file
     */
    private function saveTestLog(array $testResult): void
    {
        $filename = sprintf(
            '%s/%s-%s.json',
            $this->logDir,
            $this->sessionId,
            $testResult['test_id']
        );

        File::put($filename, json_encode($testResult, JSON_PRETTY_PRINT));
    }

    /**
     * Generate test session report
     */
    public function generateReport(): array
    {
        $total = count($this->testResults);
        $passed = count(array_filter($this->testResults, fn($r) => $r['status'] === 'passed'));
        $failed = count(array_filter($this->testResults, fn($r) => $r['status'] === 'failed'));
        $skipped = count(array_filter($this->testResults, fn($r) => $r['status'] === 'skipped'));

        $totalDuration = array_sum(array_column($this->testResults, 'duration_ms'));
        $totalErrors = array_sum(array_map(fn($r) => count($r['errors']), $this->testResults));
        $totalWarnings = array_sum(array_map(fn($r) => count($r['warnings']), $this->testResults));

        $report = [
            'session_id' => $this->sessionId,
            'timestamp' => now()->toIso8601String(),
            'summary' => [
                'total' => $total,
                'passed' => $passed,
                'failed' => $failed,
                'skipped' => $skipped,
                'pass_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            ],
            'performance' => [
                'total_duration_ms' => round($totalDuration, 2),
                'average_duration_ms' => $total > 0 ? round($totalDuration / $total, 2) : 0,
            ],
            'issues' => [
                'total_errors' => $totalErrors,
                'total_warnings' => $totalWarnings,
            ],
            'tests' => $this->testResults,
            'failed_tests' => array_filter($this->testResults, fn($r) => $r['status'] === 'failed'),
        ];

        // Save report
        $reportFile = sprintf('%s/report-%s.json', $this->logDir, $this->sessionId);
        File::put($reportFile, json_encode($report, JSON_PRETTY_PRINT));

        // Also save as latest
        File::put(sprintf('%s/latest-report.json', $this->logDir), json_encode($report, JSON_PRETTY_PRINT));

        return $report;
    }

    /**
     * Get session ID
     */
    public function getSessionId(): string
    {
        return $this->sessionId;
    }
}
