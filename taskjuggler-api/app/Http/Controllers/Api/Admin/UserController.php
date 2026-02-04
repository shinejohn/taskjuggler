<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Ensure current user is Admin of the organization
        // For now assuming the logged in user context handles scope

        $perPage = $request->input('per_page', 20);
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        // Assuming tenant context or getting org from user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Find organization (assuming single org for now or logic to select)
        // Basic check: user->roles->organization_id ??
        // Actually, we should look at the org the user is administering.
        // For MVP: assume single org per user context or current_team_id maps to org.
        
        // Placeholder: Use the organization of the first admin role found, or the user's current context
        $orgId = $user->organization_id ?? null; 
        // Note: User model usually doesn't have organization_id directly on it in this codebase, 
        // it relates via relationships. But Coordinator\Organization has user_id (owner).
        // Let's assume we fetch users belonging to the same Org scope.
        
        // Simplified Logic: Fetch all users where id matches some org logic.
        // For now, let's just implement basic listing. filtering later.
        
        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Eager load roles
        $query->with('roles');

        return $query->paginate($perPage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
            'send_invite' => 'boolean'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $password = Str::random(12); // Temp password
            
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($password),
                'status' => 'invited', // Using existing or new status
                // 'organization_id' => ... 
            ]);

            // Assign roles
            $user->roles()->sync($validated['role_ids']);

            // Set primary role?
            // Need to update pivot for is_primary if needed

            // Log
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'create_user',
                'category' => 'admin',
                'resource_type' => 'user',
                'resource_id' => $user->id,
                'description' => "Created user {$user->email}"
            ]);

            return response()->json($user->load('roles'), 201);
        });
    }

    public function show($id)
    {
        $user = User::with(['roles', 'profiles'])->findOrFail($id);
        
        // Also load overrides
        // $user->load('permissionOverrides'); // need relation on User model
        
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'string',
            'last_name' => 'string',
            'email' => 'email|unique:users,email,'.$id,
            'role_ids' => 'array',
        ]);

        $user->update([
            'name' => ($validated['first_name'] ?? ''). ' ' . ($validated['last_name'] ?? ''),
            'email' => $validated['email'] ?? $user->email,
        ]);

        if (isset($validated['role_ids'])) {
            $user->roles()->sync($validated['role_ids']);
        }

        return response()->json($user->load('roles'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'User deactivated']);
    }
    
    // Permission Management Methods
    public function getPermissions($id) {
        // Return effective permissions
        // Need service logic here
        return response()->json([]);
    }
    
    public function updatePermissions(Request $request, $id) {
        // Handle grants/denials
        // return response
    }
}
