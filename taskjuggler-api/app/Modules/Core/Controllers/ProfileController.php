<?php

namespace App\Modules\Core\Controllers;

use App\Modules\Core\Models\Profile;
use App\Modules\Core\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController
{
    use ApiResponses;

    /**
     * List all profiles for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $profiles = $request->user()->profiles;
        
        return $this->success($profiles);
    }

    /**
     * Get a specific profile
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profiles()->findOrFail($id);
        
        return $this->success($profile);
    }

    /**
     * Create a new profile
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Check if user can create more profiles
        if (!$user->canCreateProfile()) {
            $limit = $user->getProfileLimit();
            return $this->error(
                "You've reached your profile limit of {$limit}. Upgrade your plan to create more profiles.",
                403
            );
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:10',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();
        $data['user_id'] = $user->id;
        
        // If this is the first profile or explicitly set as default, make it default
        if ($user->profiles()->count() === 0 || ($data['is_default'] ?? false)) {
            // Unset other defaults first
            $user->profiles()->update(['is_default' => false]);
            $data['is_default'] = true;
        } else {
            $data['is_default'] = false;
        }

        $profile = Profile::create($data);
        
        return $this->created($profile, 'Profile created successfully');
    }

    /**
     * Update a profile
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profiles()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:10',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();

        // Handle default flag
        if (isset($data['is_default']) && $data['is_default']) {
            $profile->setAsDefault();
            unset($data['is_default']);
        }

        $profile->update($data);
        
        return $this->success($profile, 'Profile updated successfully');
    }

    /**
     * Delete a profile
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profiles()->findOrFail($id);
        
        // Don't allow deleting the last profile
        if ($request->user()->profiles()->count() <= 1) {
            return $this->error('Cannot delete your last profile. Create another profile first.', 403);
        }

        // If deleting default, set another as default
        if ($profile->is_default) {
            $newDefault = $request->user()->profiles()->where('id', '!=', $profile->id)->first();
            if ($newDefault) {
                $newDefault->setAsDefault();
            }
        }

        $profile->delete();
        
        return $this->success(null, 'Profile deleted successfully');
    }

    /**
     * Set a profile as default
     */
    public function setDefault(Request $request, string $id): JsonResponse
    {
        $profile = $request->user()->profiles()->findOrFail($id);
        $profile->setAsDefault();
        
        return $this->success($profile, 'Default profile updated');
    }
}

