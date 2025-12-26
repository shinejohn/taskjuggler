<?php

namespace Tests;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

/**
 * Comprehensive Test Runner
 * 
 * Runs all tests and generates detailed reports
 */
class TestRunner
{
    private string $resultsDir;
    private array $results = [];

    public function __construct()
    {
        $this->resultsDir = storage_path('app/test-results');
        if (!File::exists($this->resultsDir)) {
            File::makeDirectory($this->resultsDir, 0755, true);
        }
    }

    /**
     * Run all tests
     */
    public function runAll(): array
    {
        $this->results = [
            'timestamp' => now()->toIso8601String(),
            'unit_tests' => $this->runUnitTests(),
            'feature_tests' => $this->runFeatureTests(),
            'summary' => [],
        ];

        $this->results['summary'] = $this->generateSummary();
        $this->saveResults();

        return $this->results;
    }

    /**
     * Run unit tests
     */
    private function runUnitTests(): array
    {
        $output = [];
        $exitCode = 0;

        exec(
            'cd ' . base_path() . ' && php artisan test --testsuite=Unit --log-junit=' . 
            $this->resultsDir . '/unit-tests.xml 2>&1',
            $output,
            $exitCode
        );

        return [
            'exit_code' => $exitCode,
            'output' => implode("\n", $output),
            'passed' => $exitCode === 0,
        ];
    }

    /**
     * Run feature tests
     */
    private function runFeatureTests(): array
    {
        $output = [];
        $exitCode = 0;

        exec(
            'cd ' . base_path() . ' && php artisan test --testsuite=Feature --log-junit=' . 
            $this->resultsDir . '/feature-tests.xml 2>&1',
            $output,
            $exitCode
        );

        return [
            'exit_code' => $exitCode,
            'output' => implode("\n", $output),
            'passed' => $exitCode === 0,
        ];
    }

    /**
     * Generate summary
     */
    private function generateSummary(): array
    {
        $unitPassed = $this->results['unit_tests']['passed'] ?? false;
        $featurePassed = $this->results['feature_tests']['passed'] ?? false;

        return [
            'total_tests' => $this->countTests(),
            'passed' => $unitPassed && $featurePassed,
            'unit_tests_passed' => $unitPassed,
            'feature_tests_passed' => $featurePassed,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Count tests from XML files
     */
    private function countTests(): int
    {
        $count = 0;

        $unitXml = $this->resultsDir . '/unit-tests.xml';
        $featureXml = $this->resultsDir . '/feature-tests.xml';

        if (File::exists($unitXml)) {
            $xml = simplexml_load_file($unitXml);
            if ($xml) {
                $count += (int) ($xml->testsuite['tests'] ?? 0);
            }
        }

        if (File::exists($featureXml)) {
            $xml = simplexml_load_file($featureXml);
            if ($xml) {
                $count += (int) ($xml->testsuite['tests'] ?? 0);
            }
        }

        return $count;
    }

    /**
     * Save results to JSON
     */
    private function saveResults(): void
    {
        $filename = $this->resultsDir . '/results-' . now()->format('Y-m-d-H-i-s') . '.json';
        File::put($filename, json_encode($this->results, JSON_PRETTY_PRINT));
    }

    /**
     * Get latest results
     */
    public function getLatestResults(): ?array
    {
        $files = File::glob($this->resultsDir . '/results-*.json');
        if (empty($files)) {
            return null;
        }

        usort($files, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        $content = File::get($files[0]);
        return json_decode($content, true);
    }
}
