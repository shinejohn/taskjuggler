# TaskJuggler Codebase Assessment - 4 Calls

## Call 1: Backend Architecture

### Module Structure
```
app/Modules/
├── Core/          # Teams, Profiles, Auth, Subscriptions
├── Tasks/         # Task management
├── Processes/     # Process automation
├── Projects/      # Project management
├── Urpa/          # URPA module
└── SiteHealth/    # Site scanner
```

**Pattern:** Each module contains:
- `Models/` - Eloquent models
- `Controllers/` - API controllers
- `Requests/` - Form validation
- `Resources/` - API transformers
- `Services/` - Business logic
- `Routes/api.php` - Module routes
- `Migrations/` - Database migrations

### Multi-Tenancy
```
User → Profile → Team → Resources
```
- **team_id** (required) - Team-scoped resources
- **profile_id** (optional) - Profile-scoped, auto-derived from team
- All resources scoped to team via `TeamContext` middleware

### Key Traits
- `ScopesToProfile` - Auto-scopes queries to current profile
- `ApiResponses` - Standardized API responses
- `TeamContext` middleware - Validates team access, sets `current_team`

### Controller Pattern
```php
class ResourceController extends Controller
{
    use ApiResponses, ScopesToProfile;
    
    public function index(Request $request) {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        $query = Model::where('team_id', $teamId);
        $this->scopeToProfile($query, $request);
        return Resource::collection($query->paginate());
    }
}
```

---

## Call 2: Database Migrations

### Locations
- **Standard**: `database/migrations/` (auto-loaded)
- **Module**: `app/Modules/{Module}/Migrations/` (registered in `AppServiceProvider`)

### Naming Convention
```
YYYY_MM_DD_HHMMSS_description.php
```

### Standard Patterns
```php
// UUID primary keys
$table->uuid('id')->primary();

// Team/Profile scoping
$table->uuid('team_id');
$table->uuid('profile_id')->nullable();
$table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');

// JSONB for flexible data
$table->jsonb('config')->nullable();
$table->jsonb('metadata')->nullable();

// Indexes
$table->index(['team_id', 'status']);
$table->unique(['team_id', 'slug']);

// Soft deletes
$table->softDeletes();
```

### Running Migrations
```bash
php artisan migrate                                    # All migrations
php artisan migrate --path=app/Modules/Processes/Migrations  # Module-specific
```

---

## Call 3: API Structure

### Route Organization
**Main file**: `routes/api.php` loads module routes:
```php
require base_path('app/Modules/Core/Routes/api.php');
require base_path('app/Modules/Tasks/Routes/api.php');
require base_path('app/Modules/Processes/Routes/api.php');
require base_path('app/Modules/Projects/Routes/api.php');
```

**Module routes**: `app/Modules/{Module}/Routes/api.php`
```php
Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    Route::apiResource('resources', Controller::class);
});
```

### Request Headers
- `Authorization: Bearer {token}` - Sanctum authentication
- `X-Team-ID: {team_id}` - Team context (required)

### Response Format
```json
{
  "data": { /* resource or collection */ },
  "meta": { /* pagination */ },
  "links": { /* pagination links */ }
}
```

### Common Patterns
- **Filtering**: `?status=active&priority=high`
- **Search**: `?search=keyword`
- **Sorting**: `?sort=created_at&direction=desc`
- **Pagination**: `?per_page=20&page=1`
- **Eager Loading**: `->with(['relationship'])->withCount('relationship')`

### Error Responses
```php
abort(403, 'Unauthorized');  // 403 Forbidden
return response()->json(['error' => 'Message'], 422);  // Validation error
```

---

## Call 4: Frontend Organization

### Applications
- **scanner-web/** - Vue 3 site scanner app
- **ideacircuit-web/** - Idea Circuit app
- **@taskjuggler/ui/** - Shared UI component library

### Scanner-Web Structure
```
scanner-web/src/
├── components/     # Vue components
│   ├── scanner/   # Scanner-specific
│   └── ui/        # UI components
├── pages/         # Route pages
├── stores/        # Pinia stores
├── router/        # Vue Router
├── api/           # API client
└── types/         # TypeScript types
```

### State Management (Pinia)
```typescript
export const useStore = defineStore('name', {
  state: () => ({ items: [], loading: false }),
  getters: { filtered: (state) => state.items.filter(...) },
  actions: { async fetchItems() { ... } }
});
```

### API Client Pattern
```typescript
// src/api/index.ts
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Team-ID'] = teamId;
  return config;
});
```

### Component Pattern
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { Button, Card } from '@taskjuggler/ui'

const store = useStore()
onMounted(() => store.fetchItems())
</script>
```

### Shared UI Library
```vue
import { Button, Card, Badge, Modal } from '@taskjuggler/ui'
```

---

## TaskJuggler Integration Component

### Overview
The TaskJuggler integration component (`@taskjuggler/ui`) is a shared Vue 3 component library located at `shared-ui/`. It's linked as a local package (`file:../shared-ui`) and provides consistent UI components, design system, and integration patterns across all frontend applications.

### Component Library Structure
```
shared-ui/
├── src/
│   ├── components/
│   │   ├── ui/          # Shadcn-vue components (Button, Card, Badge, etc.)
│   │   └── auth/        # Auth-specific components
│   ├── templates/
│   │   └── auth/        # Auth page templates
│   └── styles.css       # Shared styles
├── package.json
└── dist/                # Built output
```

### Key Components (Shadcn-vue based)
- **Button** - Standardized button with variants
- **Card** - Container component
- **Badge** - Status/label badges
- **Dialog/Modal** - Modal dialogs
- **Avatar** - User avatars
- **Input** - Form inputs
- **Label** - Form labels
- **Select** - Dropdown selects
- **Table** - Data tables
- **Sheet** - Slide-out panels
- **DropdownMenu** - Context menus

### Installation & Usage

**Package Reference:**
```json
{
  "dependencies": {
    "@taskjuggler/ui": "file:../shared-ui"
  }
}
```

**Usage in Components:**
```vue
<script setup>
import { Button, Card, Badge, Input, Label } from '@taskjuggler/ui'
</script>

<template>
  <Card>
    <Badge>Status</Badge>
    <Button variant="primary">Click</Button>
  </Card>
</template>
```

### Design System
- **Framework**: Shadcn-vue (Vue 3 port of shadcn/ui)
- **Styling**: Tailwind CSS
- **Theme**: Consistent color palette and spacing
- **Accessibility**: WCAG compliant components
- **Responsive**: Mobile-first design

### Integration with Scanner-Web

**Component Usage Example:**
```vue
<script setup>
import { Card, CardContent, Button, Badge } from '@taskjuggler/ui'
import { useSubscriptionStore } from '@/stores/subscription'

const subscriptionStore = useSubscriptionStore()
</script>

<template>
  <Card>
    <CardContent>
      <Badge v-if="subscriptionStore.plan === 'free'">Free Plan</Badge>
      <Button 
        :disabled="!subscriptionStore.canAddSite"
        @click="handleAction"
      >
        Add Site
      </Button>
    </CardContent>
  </Card>
</template>
```

### Subscription Integration
Components work with subscription system:
- **Feature gates** - Conditional rendering based on subscription
- **Usage limits** - Display usage vs limits
- **Upgrade prompts** - Show upgrade UI for free users

### API Integration Pattern
The shared UI components integrate with:
- **Pinia stores** - State management (auth, subscription, teams)
- **API client** - Standardized API calls via `src/api/index.ts`
- **Team context** - Team switching via `X-Team-ID` header
- **Error handling** - Consistent error display patterns

### Auth Templates
The library includes pre-built auth templates:
- `LoginPageTemplate` - Login page
- `SignUpPageTemplate` - Registration page
- `ForgotPasswordPageTemplate` - Password reset request
- `ResetPasswordPageTemplate` - Password reset form
- `ProfilePageTemplate` - User profile
- `SubscribePageTemplate` - Subscription management

### Integration Points
1. **Authentication** - Shared auth state via Pinia stores
2. **Team Context** - Team switching and context management
3. **Subscriptions** - Shared subscription state and limits
4. **Notifications** - Unified notification system
5. **API Client** - Standardized API communication with interceptors

---

## Quick Reference: Adding Features

### Backend Module
1. Create module structure in `app/Modules/NewModule/`
2. Add migration with `team_id` and `profile_id`
3. Create model with relationships
4. Create controller using `ApiResponses` and `ScopesToProfile` traits
5. Create routes file and register in `routes/api.php`
6. Register migrations in `AppServiceProvider`

### Frontend Feature
1. Create Pinia store in `stores/`
2. Create API functions in `api/`
3. Create Vue component using `@taskjuggler/ui`
4. Add route in `router/index.ts`
5. Integrate with subscription/team context as needed

---

**This document provides the essential patterns for understanding and extending the TaskJuggler codebase.**

