<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use App\Modules\Urpa\Models\UrpaModeSettings;
use App\Modules\Urpa\Models\UrpaHipaaAuditLog;

class ModeController extends Controller
{
    /**
     * Get current user's mode settings
     */
    public function show(Request $request): JsonResponse
    {
        $settings = UrpaModeSettings::getOrCreateForUser($request->user()->id);
        
        return response()->json([
            'current_mode' => $settings->current_mode,
            'default_mode' => $settings->default_mode,
            'unified_view_enabled' => $settings->unified_view_enabled,
            'auto_switch_mode' => $settings->auto_switch_mode,
            'require_mode_confirm' => $settings->require_mode_confirm,
            'hipaa_session_timeout' => $settings->hipaa_session_timeout,
            'is_hipaa_active' => $settings->isHIPAAMode(),
            'notification_preferences' => $settings->notification_preferences,
            'last_mode_switch' => $settings->last_mode_switch?->toISOString(),
        ]);
    }
    
    /**
     * Update current mode (switch modes)
     */
    public function switchMode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mode' => ['required', Rule::in(UrpaModeSettings::VALID_MODES)],
        ]);
        
        $user = $request->user();
        $settings = UrpaModeSettings::getOrCreateForUser($user->id);
        $previousMode = $settings->current_mode;
        
        // Log mode switch for HIPAA compliance (always log if switching to/from practice)
        if ($previousMode === 'practice' || $validated['mode'] === 'practice') {
            UrpaHipaaAuditLog::logModeSwitch(
                $user->id,
                $previousMode,
                $validated['mode'],
                $request->ip(),
                $request->userAgent()
            );
        }
        
        // Update mode
        $settings->current_mode = $validated['mode'];
        $settings->last_mode_switch = now();
        
        // Track last practice access
        if ($validated['mode'] === 'practice') {
            $settings->last_practice_access = now();
        }
        
        $settings->save();
        
        return response()->json([
            'success' => true,
            'current_mode' => $settings->current_mode,
            'previous_mode' => $previousMode,
            'is_hipaa_active' => $settings->isHIPAAMode(),
        ]);
    }
    
    /**
     * Update mode settings (preferences)
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'default_mode' => ['sometimes', Rule::in(UrpaModeSettings::VALID_MODES)],
            'unified_view_enabled' => 'sometimes|boolean',
            'auto_switch_mode' => 'sometimes|boolean',
            'require_mode_confirm' => 'sometimes|boolean',
            'hipaa_session_timeout' => 'sometimes|integer|min:5|max:120',
            'notification_preferences' => 'sometimes|array',
        ]);
        
        $settings = UrpaModeSettings::getOrCreateForUser($request->user()->id);
        $settings->fill($validated);
        $settings->save();
        
        return response()->json([
            'success' => true,
            'settings' => $settings->only([
                'default_mode',
                'unified_view_enabled',
                'auto_switch_mode',
                'require_mode_confirm',
                'hipaa_session_timeout',
                'notification_preferences',
            ]),
        ]);
    }
    
    /**
     * Get HIPAA audit log for current user
     */
    public function auditLog(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from' => 'sometimes|date',
            'to' => 'sometimes|date',
            'action' => 'sometimes|string',
            'per_page' => 'sometimes|integer|min:10|max:100',
        ]);
        
        $query = UrpaHipaaAuditLog::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');
        
        if (isset($validated['from'])) {
            $query->where('created_at', '>=', $validated['from']);
        }
        
        if (isset($validated['to'])) {
            $query->where('created_at', '<=', $validated['to']);
        }
        
        if (isset($validated['action'])) {
            $query->where('action', $validated['action']);
        }
        
        $perPage = $validated['per_page'] ?? 50;
        $logs = $query->paginate($perPage);
        
        return response()->json($logs);
    }
}
