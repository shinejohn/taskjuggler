<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Tests\TestRunner;

class TestResultsController extends Controller
{
    /**
     * Run all tests and return results
     */
    public function runTests(Request $request)
    {
        $runner = new TestRunner();
        $results = $runner->runAll();

        return response()->json($results);
    }

    /**
     * Get latest test results
     */
    public function getLatestResults()
    {
        $runner = new TestRunner();
        $results = $runner->getLatestResults();

        if (!$results) {
            return response()->json(['message' => 'No test results found'], 404);
        }

        return response()->json($results);
    }

    /**
     * Get all test result files
     */
    public function getAllResults()
    {
        $resultsDir = storage_path('app/test-results');
        $files = File::glob($resultsDir . '/results-*.json');

        $results = [];
        foreach ($files as $file) {
            $content = File::get($file);
            $data = json_decode($content, true);
            $results[] = [
                'filename' => basename($file),
                'timestamp' => $data['timestamp'] ?? null,
                'summary' => $data['summary'] ?? [],
            ];
        }

        // Sort by timestamp descending
        usort($results, function ($a, $b) {
            return strtotime($b['timestamp'] ?? '') - strtotime($a['timestamp'] ?? '');
        });

        return response()->json($results);
    }

    /**
     * Get specific test result file
     */
    public function getResult($filename)
    {
        $filePath = storage_path('app/test-results/' . $filename);

        if (!File::exists($filePath)) {
            return response()->json(['message' => 'Test result not found'], 404);
        }

        $content = File::get($filePath);
        return response()->json(json_decode($content, true));
    }
}
