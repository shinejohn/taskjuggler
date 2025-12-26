<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

/**
 * Auto-Fix Controller
 * 
 * Analyzes test results and automatically fixes common issues
 */
class TestFixController extends Controller
{
    /**
     * Analyze test results and suggest fixes
     */
    public function analyze(Request $request)
    {
        $results = $request->input('results');
        $fixes = [];

        if (!$results) {
            return response()->json(['message' => 'No test results provided'], 400);
        }

        // Analyze unit test failures
        if (isset($results['unit_tests']) && !$results['unit_tests']['passed']) {
            $unitFixes = $this->analyzeUnitTestFailures($results['unit_tests']);
            $fixes = array_merge($fixes, $unitFixes);
        }

        // Analyze feature test failures
        if (isset($results['feature_tests']) && !$results['feature_tests']['passed']) {
            $featureFixes = $this->analyzeFeatureTestFailures($results['feature_tests']);
            $fixes = array_merge($fixes, $featureFixes);
        }

        return response()->json([
            'fixes' => $fixes,
            'total_fixes' => count($fixes),
        ]);
    }

    /**
     * Apply suggested fixes
     */
    public function applyFixes(Request $request)
    {
        $fixes = $request->input('fixes', []);
        $applied = [];
        $failed = [];

        foreach ($fixes as $fix) {
            try {
                $result = $this->applyFix($fix);
                if ($result['success']) {
                    $applied[] = $fix['id'];
                } else {
                    $failed[] = [
                        'id' => $fix['id'],
                        'error' => $result['error'],
                    ];
                }
            } catch (\Exception $e) {
                $failed[] = [
                    'id' => $fix['id'],
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'applied' => $applied,
            'failed' => $failed,
            'total_applied' => count($applied),
            'total_failed' => count($failed),
        ]);
    }

    /**
     * Analyze unit test failures
     */
    private function analyzeUnitTestFailures(array $unitTests): array
    {
        $fixes = [];
        $output = $unitTests['output'] ?? '';

        // Check for common issues
        if (strpos($output, 'Class not found') !== false) {
            $fixes[] = [
                'id' => 'unit_class_not_found',
                'type' => 'missing_class',
                'severity' => 'high',
                'description' => 'Missing class definition',
                'suggestion' => 'Run composer dump-autoload',
                'command' => 'composer dump-autoload',
            ];
        }

        if (strpos($output, 'Undefined method') !== false) {
            $fixes[] = [
                'id' => 'unit_undefined_method',
                'type' => 'missing_method',
                'severity' => 'high',
                'description' => 'Undefined method called',
                'suggestion' => 'Check method exists in class',
            ];
        }

        if (strpos($output, 'Database connection') !== false) {
            $fixes[] = [
                'id' => 'unit_database_connection',
                'type' => 'database',
                'severity' => 'medium',
                'description' => 'Database connection issue',
                'suggestion' => 'Check database configuration',
            ];
        }

        return $fixes;
    }

    /**
     * Analyze feature test failures
     */
    private function analyzeFeatureTestFailures(array $featureTests): array
    {
        $fixes = [];
        $output = $featureTests['output'] ?? '';

        // Check for common API issues
        if (strpos($output, '404') !== false) {
            $fixes[] = [
                'id' => 'feature_404',
                'type' => 'route_not_found',
                'severity' => 'high',
                'description' => 'Route not found (404)',
                'suggestion' => 'Check route definition in routes/api.php',
            ];
        }

        if (strpos($output, '401') !== false || strpos($output, 'Unauthenticated') !== false) {
            $fixes[] = [
                'id' => 'feature_auth',
                'type' => 'authentication',
                'severity' => 'medium',
                'description' => 'Authentication required',
                'suggestion' => 'Ensure test user is authenticated',
            ];
        }

        if (strpos($output, '422') !== false || strpos($output, 'validation') !== false) {
            $fixes[] = [
                'id' => 'feature_validation',
                'type' => 'validation',
                'severity' => 'medium',
                'description' => 'Validation error',
                'suggestion' => 'Check request validation rules',
            ];
        }

        if (strpos($output, '500') !== false) {
            $fixes[] = [
                'id' => 'feature_server_error',
                'type' => 'server_error',
                'severity' => 'high',
                'description' => 'Server error (500)',
                'suggestion' => 'Check server logs for details',
            ];
        }

        return $fixes;
    }

    /**
     * Apply a single fix
     */
    private function applyFix(array $fix): array
    {
        try {
            switch ($fix['type']) {
                case 'missing_class':
                    if (isset($fix['command'])) {
                        exec($fix['command'], $output, $exitCode);
                        return [
                            'success' => $exitCode === 0,
                            'output' => implode("\n", $output),
                        ];
                    }
                    break;

                case 'route_not_found':
                    // Could run route:list to verify
                    Artisan::call('route:list');
                    return [
                        'success' => true,
                        'output' => Artisan::output(),
                    ];

                case 'database':
                    // Could run migrate
                    Artisan::call('migrate', ['--force' => true]);
                    return [
                        'success' => true,
                        'output' => Artisan::output(),
                    ];
            }

            return [
                'success' => false,
                'error' => 'Fix type not supported',
            ];
        } catch (\Exception $e) {
            Log::error('Failed to apply fix', [
                'fix' => $fix,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
