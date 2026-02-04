<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        // Filter by Organization
        // $orgId = $request->user()->organization_id;
        
        $roles = Role::withCount('users')
            // ->where('organization_id', $orgId)
            // ->orWhere('is_system_role', true)
            ->get();
            
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'based_on_role_id' => 'nullable|exists:roles,id',
            'permissions' => 'array'
        ]);

        // Logic to create role and duplicate permissions
        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
            'description' => $validated['description'] ?? null,
            // 'organization_id' => ...
        ]);

        if (!empty($validated['permissions'])) {
            // sync permissions
        }

        return response()->json($role, 201);
    }

    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        if ($role->is_system_role) {
            return response()->json(['message' => 'Cannot edit system role'], 403);
        }
        
        $role->update($request->only(['name', 'description', 'color']));
        
        if ($request->has('permissions')) {
             // Sync logic with pivots
        }

        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        if ($role->is_system_role) {
            return response()->json(['message' => 'Cannot delete system role'], 403);
        }
        
        $role->delete();
        return response()->json(['message' => 'Role deleted']);
    }
}
