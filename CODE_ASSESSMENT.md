# TaskJuggler Codebase Assessment

## Overview
This document provides a comprehensive assessment of the TaskJuggler codebase structure, organization patterns, and conventions to enable AI assistants to effectively understand and extend the codebase.

---

## 1. Backend Architecture & Module Organization

### 1.1 Module Structure
The backend (`taskjuggler-api`) follows a **modular architecture** pattern with feature-based modules:

```
taskjuggler-api/
├── app/
│   ├── Modules/
│   │   ├── Core/           # Core functionality (Teams, Profiles, Auth)
│   │   ├── Tasks/          # Task management module
│   │   ├── Processes/      # Process automation module
│   │   ├── Projects/       # Project management module
│   │   ├── Urpa/           # URPA module
│   │   └── SiteHealth/     # Site health scanner module
│   ├── Models/             # Legacy/alias models (backward compatibility)
│   ├── Events/             # Application events
│   ├── Listeners/          # Event listeners
│   └── Providers/          # Service providers
├── database/
│   └── migrations/         # Standard migrations
└── routes/
    └── api.php             # Main API route file
```

### 1.2 Module Pattern
Each module follows a consistent structure:

```
ModuleName/
├── Models/                 # Eloquent models
├── Controllers/            # API controllers
├── Requests/               # Form request validation
├── Resources/              # API resources (transformers)
├── Services/              # Business logic services
├── Routes/
│   └── api.php            # Module-specific routes
└── Migrations/            # Module migrations (auto-loaded)
```

### 1.3 Multi-Tenancy Model
The system uses a **hierarchical multi-tenancy** approach:

```
User → Profile → Team → Resources (Tasks, Projects, Processes)
```

- **User**: Individual user account
- **Profile**: User's workspace/profile (can have multiple)
- **Team**: Group of users working together (belongs to Profile)
- **Resources**: Scoped to Team (with optional Profile scoping)

**Key Fields:**
- `team_id` (required) - Team-scoped resources
- `profile_id` (optional, auto-derived from team) - Profile-scoped resources
- `user_id` - User ownership

### 1.4 Authentication & Authorization
- **Authentication**: Laravel Sanctum (token-based)
- **Authorization**: Team-based access control via `TeamContext` middleware
- **Team Context**: Set via `X-Team-ID` header or user's default team

### 1.5 Key Traits & Patterns

**ScopesToProfile Trait:**
```php
// Automatically scopes queries to current profile
$this->scopeToProfile($query, $request);
$profileId = $this->getCurrentProfileId($request);
```

**ApiResponses Trait:**
```php
// Standardized API response methods
return $this->successResponse($data);
return $this->errorResponse($message, $code);
```

**Team Context Middleware:**
- Validates user has access to team
- Sets `current_team` in application container
- Adds `team_id` to request

---

## 2. Database Migrations Structure

### 2.1 Migration Locations
Migrations exist in two locations:

1. **Standard Location**: `database/migrations/`
   - Core system migrations
   - Run automatically via `php artisan migrate`

2. **Module Migrations**: `app/Modules/{Module}/Migrations/`
   - Module-specific migrations
   - Auto-loaded via `AppServiceProvider::boot()`
   - Example: `app/Modules/Processes/Migrations/`

### 2.2 Migration Naming Convention
```
YYYY_MM_DD_HHMMSS_description.php
```

**Examples:**
- `2024_01_03_000001_create_processes_table.php`
- `2024_01_04_000001_create_projects_table.php`

### 2.3 Migration Patterns

**UUID Primary Keys:**
```php
$table->uuid('id')->primary();
```

**Team/Profile Scoping:**
```php
$table->uuid('team_id');
$table->uuid('profile_id')->nullable();
$table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
$table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
```

**Soft Deletes:**
```php
use Illuminate\Database\Eloquent\SoftDeletes;
$table->softDeletes(); // Adds deleted_at column
```

**JSONB Columns:**
```php
$table->jsonb('config')->nullable(); // PostgreSQL JSONB for structured data
$table->jsonb('metadata')->nullable();
```

**Indexes:**
```php
$table->index(['team_id', 'status']); // Composite indexes for common queries
$table->unique(['team_id', 'slug']); // Unique constraints within team
```

### 2.4 Common Migration Patterns

**Adding Foreign Keys Safely:**
```php
if (Schema::hasTable('teams')) {
    $table->foreign('team_id')->references('id')->on('teams');
}
```

**Conditional Column Addition:**
```php
if (!Schema::hasColumn('tasks', 'project_id')) {
    Schema::table('tasks', function (Blueprint $table) {
        $table->uuid('project_id')->nullable();
    });
}
```

**Running Migrations:**
```bash
# All migrations
php artisan migrate

# Specific module
php artisan migrate --path=app/Modules/Processes/Migrations
```

---

## 3. API Structure & Patterns

### 3.1 Route Organization

**Main Route File**: `routes/api.php`
```php
// Loads module routes
require base_path('app/Modules/Core/Routes/api.php');
require base_path('app/Modules/Tasks/Routes/api.php');
require base_path('app/Modules/Processes/Routes/api.php');
require base_path('app/Modules/Projects/Routes/api.php');
```

**Module Route File**: `app/Modules/{Module}/Routes/api.php`
```php
Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    Route::apiResource('resource', Controller::class);
    // Additional routes
});
```

### 3.2 Controller Patterns

**Standard Controller Structure:**
```php
class ResourceController extends Controller
{
    use ApiResponses, ScopesToProfile;

    public function index(Request $request)
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        $query = Model::where('team_id', $teamId);
        $this->scopeToProfile($query, $request);
        
        return Resource::collection($query->paginate());
    }

    public function store(Request $request)
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        $resource = Model::create([
            'team_id' => $teamId,
            'profile_id' => $this->getCurrentProfileId($request),
            ...$request->validated(),
        ]);
        
        return new Resource($resource);
    }
}
```

### 3.3 Request Validation

**Form Request Classes**: `app/Modules/{Module}/Requests/`
```php
class CreateResourceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'team_id' => ['sometimes', 'uuid', 'exists:teams,id'],
        ];
    }
}
```

### 3.4 API Resources (Transformers)

**Resource Classes**: `app/Modules/{Module}/Resources/`
```php
class ResourceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'team_id' => $this->team_id,
            'relationships' => $this->whenLoaded('relationship'),
        ];
    }
}
```

### 3.5 API Response Patterns

**Success Response:**
```php
return response()->json([
    'data' => new Resource($resource),
], 201);
```

**Collection Response:**
```php
return Resource::collection($collection);
```

**Error Response:**
```php
abort(403, 'Unauthorized');
// or
return response()->json(['error' => 'Message'], 422);
```

### 3.6 Common API Endpoints Pattern

**RESTful Resources:**
- `GET /api/resources` - List (with pagination, filtering, search)
- `POST /api/resources` - Create
- `GET /api/resources/{id}` - Show
- `PUT /api/resources/{id}` - Update
- `DELETE /api/resources/{id}` - Delete

**Nested Resources:**
- `GET /api/resources/{resource}/subresources` - List nested
- `POST /api/resources/{resource}/subresources` - Create nested

**Custom Actions:**
- `POST /api/resources/{id}/action` - Custom action endpoint

### 3.7 Query Patterns

**Filtering:**
```php
->when($request->status, fn($q, $status) => $q->where('status', $status))
```

**Search:**
```php
->when($request->search, function ($q) use ($request) {
    $q->where('name', 'ilike', "%{$request->search}%");
})
```

**Sorting:**
```php
$sortField = $request->get('sort', 'updated_at');
$sortDir = $request->get('direction', 'desc');
$query->orderBy($sortField, $sortDir);
```

**Pagination:**
```php
->paginate($request->get('per_page', 20))
```

**Eager Loading:**
```php
->with(['relationship1', 'relationship2'])
->withCount('relationship')
```

---

## 4. Frontend Architecture & Organization

### 4.1 Frontend Applications

The codebase contains multiple frontend applications:

```
scanner-web/          # Site scanner application (Vue 3)
ideacircuit-web/      # Idea Circuit application
@taskjuggler/ui/      # Shared UI component library
```

### 4.2 Scanner-Web Structure (Vue 3)

```
scanner-web/
├── src/
│   ├── components/        # Vue components
│   │   └── scanner/       # Scanner-specific components
│   ├── pages/            # Page components (routes)
│   ├── stores/           # Pinia stores (state management)
│   ├── router/           # Vue Router configuration
│   ├── api/              # API client configuration
│   └── types/            # TypeScript types
├── package.json
└── vite.config.js
```

### 4.3 Component Organization

**Component Structure:**
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/storeName'
import { ComponentName } from '@taskjuggler/ui'

// Component logic
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Styles */
</style>
```

### 4.4 State Management (Pinia)

**Store Pattern:**
```typescript
// stores/resource.ts
import { defineStore } from 'pinia'
import { api } from '@/api'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    items: [],
    loading: false,
  }),
  
  getters: {
    canAddItem: (state) => state.items.length < limit,
  },
  
  actions: {
    async fetchItems() {
      this.loading = true
      const response = await api.get('/resources')
      this.items = response.data.data
      this.loading = false
    },
  },
})
```

### 4.5 API Integration

**API Client**: `src/api/index.ts`
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  const teamId = localStorage.getItem('current_team_id')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (teamId) {
    config.headers['X-Team-ID'] = teamId
  }
  
  return config
})

export { api }
```

### 4.6 Routing (Vue Router)

**Router Configuration:**
```typescript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/DashboardPage.vue'),
  },
  {
    path: '/resources',
    component: () => import('@/pages/ResourcesPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

### 4.7 Shared UI Library (@taskjuggler/ui)

**Component Usage:**
```vue
<script setup>
import { Button, Card, Badge } from '@taskjuggler/ui'
</script>

<template>
  <Card>
    <Button variant="primary">Click</Button>
    <Badge>Label</Badge>
  </Card>
</template>
```

### 4.8 Common Frontend Patterns

**Fetching Data:**
```typescript
import { onMounted } from 'vue'
import { useResourceStore } from '@/stores/resource'

const resourceStore = useResourceStore()

onMounted(() => {
  resourceStore.fetchItems()
})
```

**Form Handling:**
```typescript
const formData = ref({
  name: '',
  description: '',
})

const handleSubmit = async () => {
  await resourceStore.createItem(formData.value)
  // Handle success
}
```

**Error Handling:**
```typescript
try {
  await resourceStore.fetchItems()
} catch (error) {
  console.error('Failed to fetch:', error)
  // Show error message to user
}
```

**Computed Properties:**
```typescript
const filteredItems = computed(() => {
  return items.value.filter(item => item.status === 'active')
})
```

### 4.9 Frontend-Backend Integration

**Request Headers:**
- `Authorization: Bearer {token}` - Authentication
- `X-Team-ID: {team_id}` - Team context

**Response Format:**
```json
{
  "data": { /* single resource */ },
  "meta": { /* pagination info */ },
  "links": { /* pagination links */ }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "errors": { /* validation errors */ }
}
```

---

## Key Conventions Summary

### Backend
- ✅ Module-based architecture
- ✅ Team-scoped resources (team_id required)
- ✅ Profile-scoped resources (profile_id optional)
- ✅ UUID primary keys
- ✅ Soft deletes for important resources
- ✅ JSONB for flexible configuration/metadata
- ✅ Form requests for validation
- ✅ API resources for response transformation
- ✅ Event-driven architecture for triggers

### Frontend
- ✅ Vue 3 Composition API
- ✅ Pinia for state management
- ✅ Vue Router for navigation
- ✅ Shared UI component library
- ✅ TypeScript for type safety
- ✅ Axios for API calls
- ✅ Team context via X-Team-ID header

### Database
- ✅ UUID primary keys
- ✅ Foreign keys with cascade deletes
- ✅ Composite indexes for common queries
- ✅ Unique constraints scoped to team
- ✅ Timestamps (created_at, updated_at)
- ✅ Soft deletes (deleted_at)

### API
- ✅ RESTful conventions
- ✅ Pagination support
- ✅ Filtering and search
- ✅ Sorting
- ✅ Eager loading relationships
- ✅ Standardized error responses

---

## Adding New Features - Quick Reference

### Adding a New Module

1. **Create Module Structure:**
   ```
   app/Modules/NewModule/
   ├── Models/
   ├── Controllers/
   ├── Requests/
   ├── Resources/
   ├── Services/
   ├── Routes/
   └── Migrations/
   ```

2. **Create Migration:**
   ```php
   // app/Modules/NewModule/Migrations/YYYY_MM_DD_create_table.php
   Schema::create('new_resources', function (Blueprint $table) {
       $table->uuid('id')->primary();
       $table->uuid('team_id');
       $table->uuid('profile_id')->nullable();
       // ... fields
   });
   ```

3. **Create Model:**
   ```php
   // app/Modules/NewModule/Models/NewResource.php
   class NewResource extends Model
   {
       use HasUuids;
       protected $fillable = ['team_id', 'profile_id', /* ... */];
       public function team(): BelongsTo { /* ... */ }
   }
   ```

4. **Create Controller:**
   ```php
   // app/Modules/NewModule/Controllers/NewResourceController.php
   class NewResourceController extends Controller
   {
       use ApiResponses, ScopesToProfile;
       // Implement CRUD methods
   }
   ```

5. **Create Routes:**
   ```php
   // app/Modules/NewModule/Routes/api.php
   Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
       Route::apiResource('new-resources', NewResourceController::class);
   });
   ```

6. **Register Routes:**
   ```php
   // routes/api.php
   require base_path('app/Modules/NewModule/Routes/api.php');
   ```

7. **Register Migrations:**
   ```php
   // app/Providers/AppServiceProvider.php
   $this->loadMigrationsFrom(app_path('Modules/NewModule/Migrations'));
   ```

---

This assessment provides the foundation for understanding and extending the TaskJuggler codebase. Follow these patterns and conventions when adding new features.

