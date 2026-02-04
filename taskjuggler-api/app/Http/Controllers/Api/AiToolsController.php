<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\AiTools\Domain\TaskTool;
use App\AiTools\Domain\ProjectTool;
use App\AiTools\Domain\TeamTool;

class AiToolsController extends Controller
{
    public function index()
    {
        // Return list of available tools
        $tools = [
            new TaskTool(),
            new ProjectTool(),
            new TeamTool(),
        ];

        return response()->json([
            'tools' => array_map(fn($t) => [
                'name' => $t->name(),
                'description' => $t->description(),
                'parameters' => $t->parameters(),
                'category' => $t->category(),
            ], $tools)
        ]);
    }

    public function execute(Request $request, string $tool)
    {
        // For security, internal tools typically validate auth
        // The BaseTool handles auth validation if required

        $instance = match ($tool) {
            'task' => new TaskTool(),
            'project' => new ProjectTool(),
            'team' => new TeamTool(),
            default => null
        };

        if (!$instance) {
            return response()->json(['error' => 'Tool not found'], 404);
        }

        try {
            $result = $instance->execute($request->all());
            return response()->json(['success' => true, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
