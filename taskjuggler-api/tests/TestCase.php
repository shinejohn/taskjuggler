<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\TestLogger;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected ?TestLogger $testLogger = null;

    protected function setUp(): void
    {
        parent::setUp();
        // Only create TestLogger if class exists
        if (class_exists(TestLogger::class)) {
            $this->testLogger = new TestLogger();
        }
    }

    protected function tearDown(): void
    {
        // Generate report if test completed
        if ($this->testLogger !== null) {
            try {
                $this->testLogger->generateReport();
            } catch (\Exception $e) {
                // Ignore errors in test logger
            }
        }
        parent::tearDown();
    }

    /**
     * Log test start
     */
    protected function logTestStart(string $testName, string $category = 'api'): void
    {
        $testId = $this->name() ?? uniqid('test_');
        $this->testLogger->startTest($testId, $testName, $category);
    }

    /**
     * Log test end
     */
    protected function logTestEnd(string $status = 'passed'): array
    {
        return $this->testLogger->endTest($status);
    }

    /**
     * Assert with logging
     */
    protected function assertWithLog($condition, string $message, ?string $expected = null, ?string $actual = null): void
    {
        $this->testLogger->logAssertion(
            $message,
            $condition,
            $condition ? null : "Expected: {$expected}, Actual: {$actual}"
        );
        
        $this->assertTrue($condition, $message);
    }

    /**
     * Log API request
     */
    protected function logApiRequest(string $method, string $url, array $data = []): void
    {
        $this->testLogger->logDetail('api_request', [
            'method' => $method,
            'url' => $url,
            'data' => $data,
        ]);
    }

    /**
     * Log API response
     */
    protected function logApiResponse(int $status, array $data = []): void
    {
        $this->testLogger->logDetail('api_response', [
            'status' => $status,
            'data' => $data,
        ]);

        if ($status >= 400) {
            $this->testLogger->logError("API returned error status: {$status}", null);
        }
    }
}
