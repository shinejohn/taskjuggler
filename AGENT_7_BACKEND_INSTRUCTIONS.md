# Agent 7: Backend API Integration Instructions
## Scanner Platform Integration - Laravel Backend

**Priority:** 🟢 HIGH - Can run completely parallel  
**Estimated Time:** 3-4 hours  
**Depends On:** None (backend work, independent)

---

## OBJECTIVE

Create Laravel backend API endpoints and middleware for scanner integration:
- Team context middleware
- Subscription limit middleware
- Scanner controllers
- Scanner models
- Database migrations
- API routes

---

## PREREQUISITES

✅ Laravel backend (taskjuggler-api) exists  
✅ Database access configured

---

## TASKS

### Task 7.1: Create TeamContext Middleware

**File:** `taskjuggler-api/app/Http/Middleware/TeamContext.php` (NEW)

**Requirements:**
1. Extract X-Team-ID header
2. Verify user has access to team
3. Set team context for request
4. Handle missing team gracefully

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 6.2

**Key Implementation:**
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TeamContext
{
    public function handle(Request $request, Closure $next)
    {
        $teamId = $request->header('X-Team-ID');
        
        if (!$teamId) {
            // Use default team if not specified
            $user = $request->user();
            $teamId = $user->currentTeam?->id 
                   ?? $user->teams()->first()?->id;
        }
        
        if (!$teamId) {
            return response()->json(['error' => 'No team context'], 400);
        }
        
        // Verify user has access to this team
        $team = $request->user()->teams()->find($teamId);
        
        if (!$team) {
            return response()->json(['error' => 'Access denied to team'], 403);
        }
        
        // Set team context for this request
        $request->merge(['team_id' => $teamId]);
        app()->instance('current_team', $team);
        
        return $next($request);
    }
}
```

**Register in:** `app/Http/Kernel.php` or `bootstrap/app.php` (Laravel 11)

---

### Task 7.2: Create CheckScannerLimits Middleware

**File:** `taskjuggler-api/app/Http/Middleware/CheckScannerLimits.php` (NEW)

**Requirements:**
1. Check site limits before site creation
2. Check scan limits before scan creation
3. Return upgrade URLs in error responses
4. Get limits from team subscription

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 6.3

**Key Implementation:**
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckScannerLimits
{
    public function handle(Request $request, Closure $next)
    {
        $team = app('current_team');
        $subscription = $team->subscription;
        
        // Check site limits
        if ($request->routeIs('scanner.sites.store')) {
            $currentSites = $team->scannerSites()->count();
            $limit = $subscription->limits['sites'] ?? 3;
            
            if ($currentSites >= $limit) {
                return response()->json([
                    'error' => 'Site limit reached',
                    'limit' => $limit,
                    'current' => $currentSites,
                    'upgrade_url' => '/settings/billing',
                ], 403);
            }
        }
        
        // Check scan limits
        if ($request->routeIs('scanner.scans.store')) {
            $scansThisMonth = $team->scannerScans()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count();
            $limit = $subscription->limits['scans_per_month'] ?? 10;
            
            if ($scansThisMonth >= $limit) {
                return response()->json([
                    'error' => 'Monthly scan limit reached',
                    'limit' => $limit,
                    'current' => $scansThisMonth,
                    'resets_at' => now()->endOfMonth()->toISOString(),
                    'upgrade_url' => '/settings/billing',
                ], 403);
            }
        }
        
        return $next($request);
    }
}
```

---

### Task 7.3: Create Scanner Controllers

**Files to Create:**
- `app/Http/Controllers/Scanner/ScannerDashboardController.php`
- `app/Http/Controllers/Scanner/ScannerSiteController.php`
- `app/Http/Controllers/Scanner/ScannerScanController.php`
- `app/Http/Controllers/Scanner/ScannerIssueController.php`
- `app/Http/Controllers/Scanner/ScannerUsageController.php`
- `app/Http/Controllers/Scanner/ScannerMcpController.php`

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 6.1

**Example: ScannerSiteController.php**
```php
<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use App\Models\Scanner\Site;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerSiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $sites = Site::where('team_id', $team->id)
            ->with(['latestScan'])
            ->get();
        
        return response()->json([
            'data' => $sites,
        ]);
    }
    
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'auth_type' => 'nullable|in:none,basic,cookie,header',
            'auth_config' => 'nullable|array',
            'max_pages' => 'nullable|integer|min:1|max:1000',
        ]);
        
        $team = app('current_team');
        
        $site = Site::create([
            'team_id' => $team->id,
            'name' => $validated['name'],
            'url' => $validated['url'],
            'auth_type' => $validated['auth_type'] ?? 'none',
            'auth_config' => $validated['auth_config'] ?? [],
            'max_pages' => $validated['max_pages'] ?? 25,
        ]);
        
        return response()->json([
            'data' => $site->load('team'),
        ], 201);
    }
    
    public function show(Site $site): JsonResponse
    {
        $team = app('current_team');
        
        // Verify site belongs to team
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        return response()->json([
            'data' => $site->load(['scans', 'issues']),
        ]);
    }
    
    public function update(Request $request, Site $site): JsonResponse
    {
        $team = app('current_team');
        
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|url',
            'auth_type' => 'sometimes|in:none,basic,cookie,header',
            'auth_config' => 'sometimes|array',
            'max_pages' => 'sometimes|integer|min:1|max:1000',
        ]);
        
        $site->update($validated);
        
        return response()->json([
            'data' => $site->fresh(),
        ]);
    }
    
    public function destroy(Site $site): JsonResponse
    {
        $team = app('current_team');
        
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $site->delete();
        
        return response()->json(null, 204);
    }
}
```

**Example: ScannerDashboardController.php**
```php
<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $stats = [
            'total_sites' => $team->scannerSites()->count(),
            'total_scans' => $team->scannerScans()->count(),
            'total_issues' => $team->scannerIssues()->count(),
            'open_issues' => $team->scannerIssues()->where('status', 'open')->count(),
            'average_health_score' => $team->scannerSites()->avg('health_score') ?? 0,
            'sites_needing_attention' => $team->scannerSites()
                ->where('health_score', '<', 70)
                ->count(),
        ];
        
        return response()->json([
            'data' => $stats,
        ]);
    }
}
```

**Example: ScannerUsageController.php**
```php
<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerUsageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $usage = [
            'scans_this_month' => $team->scannerScans()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'ai_fixes_this_month' => $team->scannerIssues()
                ->whereNotNull('fix_code')
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'sites_count' => $team->scannerSites()->count(),
        ];
        
        return response()->json([
            'data' => $usage,
        ]);
    }
}
```

---

### Task 7.4: Create Scanner Models

**Files to Create:**
- `app/Models/Scanner/Site.php`
- `app/Models/Scanner/Scan.php`
- `app/Models/Scanner/Issue.php`

**Example: Site.php**
```php
<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    protected $table = 'scanner_sites';
    
    protected $fillable = [
        'team_id',
        'name',
        'url',
        'auth_type',
        'auth_config',
        'max_pages',
        'health_score',
        'issue_count',
        'last_scan_at',
    ];
    
    protected $casts = [
        'auth_config' => 'array',
        'last_scan_at' => 'datetime',
    ];
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
    
    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }
    
    public function latestScan(): HasMany
    {
        return $this->hasMany(Scan::class)->latest();
    }
    
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }
}
```

**Example: Scan.php**
```php
<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scan extends Model
{
    protected $table = 'scanner_scans';
    
    protected $fillable = [
        'site_id',
        'team_id',
        'status',
        'started_at',
        'completed_at',
        'pages_scanned',
        'total_pages',
        'health_score',
        'issue_count',
        'category_scores',
        'created_by',
        'error',
    ];
    
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'category_scores' => 'array',
    ];
    
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
    
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }
}
```

**Example: Issue.php**
```php
<?php

namespace App\Models\Scanner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Issue extends Model
{
    protected $table = 'scanner_issues';
    
    protected $fillable = [
        'scan_id',
        'site_id',
        'team_id',
        'category',
        'severity',
        'status',
        'title',
        'message',
        'page_url',
        'selector',
        'html_context',
        'wcag_criteria',
        'fix_code',
        'fix_explanation',
        'fix_confidence',
        'task_id',
    ];
    
    protected $casts = [
        'wcag_criteria' => 'array',
    ];
    
    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class);
    }
    
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
    
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
```

---

### Task 7.5: Create Database Migrations

**Files to Create:**
- `database/migrations/YYYY_MM_DD_HHMMSS_add_team_id_to_scanner_tables.php`

**Key Implementation:**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add team_id to scanner_sites
        Schema::table('scanner_sites', function (Blueprint $table) {
            $table->foreignId('team_id')->after('id')->constrained('teams')->onDelete('cascade');
            $table->index('team_id');
        });
        
        // Add team_id to scanner_scans
        Schema::table('scanner_scans', function (Blueprint $table) {
            $table->foreignId('team_id')->after('id')->constrained('teams')->onDelete('cascade');
            $table->index('team_id');
        });
        
        // Add team_id and task_id to scanner_issues
        Schema::table('scanner_issues', function (Blueprint $table) {
            $table->foreignId('team_id')->after('id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('task_id')->nullable()->after('id')->constrained('tasks')->onDelete('set null');
            $table->index('team_id');
            $table->index('task_id');
        });
    }
    
    public function down(): void
    {
        Schema::table('scanner_issues', function (Blueprint $table) {
            $table->dropForeign(['task_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn(['task_id', 'team_id']);
        });
        
        Schema::table('scanner_scans', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn('team_id');
        });
        
        Schema::table('scanner_sites', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn('team_id');
        });
    }
};
```

---

### Task 7.6: Create API Routes

**File:** `taskjuggler-api/routes/api.php` (MODIFY)

**Requirements:**
1. Add scanner routes group
2. Apply auth:sanctum middleware
3. Apply team middleware
4. Apply limit middleware where needed

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 6.1

**Key Implementation:**
```php
// In routes/api.php

use App\Http\Controllers\Scanner\ScannerDashboardController;
use App\Http\Controllers\Scanner\ScannerSiteController;
use App\Http\Controllers\Scanner\ScannerScanController;
use App\Http\Controllers\Scanner\ScannerIssueController;
use App\Http\Controllers\Scanner\ScannerUsageController;
use App\Http\Controllers\Scanner\ScannerMcpController;
use App\Http\Middleware\TeamContext;
use App\Http\Middleware\CheckScannerLimits;

// Scanner Module Routes
Route::prefix('scanner')
    ->middleware(['auth:sanctum', TeamContext::class])
    ->group(function () {
    
    // Dashboard
    Route::get('dashboard', [ScannerDashboardController::class, 'index']);
    Route::get('usage', [ScannerUsageController::class, 'index']);
    
    // Sites (with limit check)
    Route::apiResource('sites', ScannerSiteController::class)
        ->middleware(CheckScannerLimits::class);
    
    // Scans
    Route::get('sites/{site}/scans', [ScannerScanController::class, 'index']);
    Route::post('sites/{site}/scan', [ScannerScanController::class, 'store'])
        ->middleware(CheckScannerLimits::class);
    Route::get('scans/{scan}', [ScannerScanController::class, 'show']);
    Route::get('scans/{scan}/report', [ScannerScanController::class, 'report']);
    
    // Issues
    Route::get('issues', [ScannerIssueController::class, 'index']);
    Route::get('issues/{issue}', [ScannerIssueController::class, 'show']);
    Route::put('issues/{issue}', [ScannerIssueController::class, 'update']);
    Route::post('issues/bulk', [ScannerIssueController::class, 'bulkUpdate']);
    Route::post('issues/{issue}/fix', [ScannerIssueController::class, 'generateFix']);
    
    // MCP API Key Management
    Route::prefix('mcp')->group(function () {
        Route::get('keys', [ScannerMcpController::class, 'listKeys']);
        Route::post('keys', [ScannerMcpController::class, 'createKey']);
        Route::delete('keys/{key}', [ScannerMcpController::class, 'revokeKey']);
    });
});
```

---

## DELIVERABLES

1. ✅ `app/Http/Middleware/TeamContext.php` - New file
2. ✅ `app/Http/Middleware/CheckScannerLimits.php` - New file
3. ✅ `app/Http/Controllers/Scanner/*.php` - New files (6 controllers)
4. ✅ `app/Models/Scanner/*.php` - New files (3 models)
5. ✅ `database/migrations/*_add_team_id_to_scanner_tables.php` - New file
6. ✅ `routes/api.php` - Updated with scanner routes

---

## TESTING CHECKLIST

- [ ] TeamContext middleware extracts X-Team-ID header
- [ ] TeamContext middleware verifies team access
- [ ] CheckScannerLimits middleware blocks at limits
- [ ] ScannerSiteController CRUD works
- [ ] ScannerScanController creates scans
- [ ] ScannerIssueController manages issues
- [ ] ScannerDashboardController returns stats
- [ ] ScannerUsageController returns usage
- [ ] Models have correct relationships
- [ ] Migrations run successfully
- [ ] Routes are registered correctly
- [ ] All endpoints require authentication
- [ ] All endpoints filter by team

---

## COMMON PITFALLS

1. **Team relationship** - Make sure Team model exists
2. **Subscription relationship** - Make sure subscription structure exists
3. **Route naming** - Use consistent naming convention
4. **Error responses** - Return consistent error format
5. **Validation** - Validate all inputs

---

## DEPENDENCIES

- Laravel backend exists
- Teams table exists
- Subscriptions table exists
- Tasks table exists (for task_id foreign key)

---

## COMPLETION CRITERIA

✅ All middleware created and registered  
✅ All controllers created  
✅ All models created with relationships  
✅ Migrations created and tested  
✅ Routes registered correctly  
✅ All endpoints tested  

**Once complete, backend API is ready for frontend integration.**

