<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ScannerMcpController extends Controller
{
    public function listKeys(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        // Get MCP API keys for this team
        // Assuming there's an mcp_api_keys table or similar
        $keys = DB::table('mcp_api_keys')
            ->where('team_id', $team->id)
            ->select(['id', 'name', 'created_at', 'last_used_at'])
            ->get();
        
        return response()->json([
            'data' => $keys,
        ]);
    }
    
    public function createKey(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $team = app('current_team');
        
        // Check if mcp_api_keys table exists
        if (!Schema::hasTable('mcp_api_keys')) {
            return response()->json([
                'error' => 'MCP API keys table not yet created',
            ], 503);
        }
        
        $apiKey = Str::random(64);
        $hashedKey = hash('sha256', $apiKey);
        
        $id = DB::table('mcp_api_keys')->insertGetId([
            'team_id' => $team->id,
            'name' => $validated['name'],
            'key_hash' => $hashedKey,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Return the key only once (plaintext)
        return response()->json([
            'data' => [
                'id' => $id,
                'name' => $validated['name'],
                'api_key' => $apiKey, // Only returned on creation
            ],
        ], 201);
    }
    
    public function revokeKey(Request $request, $keyId): JsonResponse
    {
        $team = app('current_team');
        
        // Check if mcp_api_keys table exists
        if (!Schema::hasTable('mcp_api_keys')) {
            return response()->json([
                'error' => 'MCP API keys table not yet created',
            ], 503);
        }
        
        $deleted = DB::table('mcp_api_keys')
            ->where('id', $keyId)
            ->where('team_id', $team->id)
            ->delete();
        
        if (!$deleted) {
            return response()->json(['error' => 'Key not found'], 404);
        }
        
        return response()->json([
            'message' => 'API key revoked successfully',
        ]);
    }
}

