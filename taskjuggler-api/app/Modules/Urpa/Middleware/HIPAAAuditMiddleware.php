<?php

namespace App\Modules\Urpa\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Modules\Urpa\Models\UrpaModeSettings;
use App\Modules\Urpa\Models\UrpaHipaaAuditLog;

class HIPAAAuditMiddleware
{
    /**
     * Resources that require HIPAA audit logging when accessed
     */
    protected array $hipaaResources = [
        'patients',
        'encounters',
        'charts',
        'prescriptions',
        'lab-results',
        'referrals',
        'prior-auth',
        'clinical-notes',
        'scribe',
    ];
    
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip if user not authenticated
        if (!$request->user()) {
            return $next($request);
        }
        
        $response = $next($request);
        
        // Only log successful requests
        if ($response->isSuccessful()) {
            $this->logIfHIPAAResource($request);
        }
        
        return $response;
    }
    
    /**
     * Check if the request accesses a HIPAA-protected resource and log accordingly
     */
    protected function logIfHIPAAResource(Request $request): void
    {
        $path = $request->path();
        $user = $request->user();
        
        // Check if path matches any HIPAA resource
        foreach ($this->hipaaResources as $resource) {
            if (str_contains($path, $resource)) {
                $this->logAccess($request, $user->id, $resource);
                break;
            }
        }
    }
    
    /**
     * Log PHI access to audit log
     */
    protected function logAccess(Request $request, int $userId, string $resourceType): void
    {
        // Try to extract resource ID from route
        $resourceId = $this->extractResourceId($request);
        
        // Determine action based on HTTP method
        $action = match ($request->method()) {
            'GET' => UrpaHipaaAuditLog::ACTION_PHI_ACCESS,
            'POST' => UrpaHipaaAuditLog::ACTION_PHI_CREATE,
            'PUT', 'PATCH' => UrpaHipaaAuditLog::ACTION_PHI_UPDATE,
            'DELETE' => UrpaHipaaAuditLog::ACTION_PHI_DELETE,
            default => UrpaHipaaAuditLog::ACTION_PHI_ACCESS,
        };
        
        UrpaHipaaAuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'additional_data' => [
                'method' => $request->method(),
                'path' => $request->path(),
                'query' => $request->query(),
            ],
        ]);
    }
    
    /**
     * Try to extract resource ID from the route
     */
    protected function extractResourceId(Request $request): ?int
    {
        // Check route parameters
        $route = $request->route();
        
        if ($route) {
            // Look for common ID parameter names
            foreach (['id', 'patient', 'patient_id', 'encounter_id'] as $param) {
                $value = $route->parameter($param);
                if ($value && is_numeric($value)) {
                    return (int) $value;
                }
            }
        }
        
        return null;
    }
}
