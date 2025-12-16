# Multi-Profile Feature Documentation

## Overview

The multi-profile feature allows users to create separate workspaces (profiles) to organize their tasks, teams, projects, messages, and other data by context (e.g., "Work", "Family", "Client 2", "Business 1"). This is a premium feature with tiered limits based on subscription plans.

## Subscription Limits

Profile creation limits are defined in `config/modules.php`:

- **Free/Starter**: 1 profile
- **Pro**: 3 profiles
- **Business**: 10 profiles
- **Enterprise**: Unlimited profiles

## Database Schema

### Profiles Table

```php
- id (uuid, primary)
- user_id (uuid, foreign key to users)
- name (string) - e.g., "Work", "Family"
- slug (string, nullable) - URL-friendly identifier
- description (text, nullable)
- color (string, default: '#3b82f6') - For UI differentiation
- icon (string, nullable) - Emoji or icon identifier
- is_default (boolean, default: false)
- settings (jsonb, nullable) - Profile-specific settings
- timestamps, soft_deletes
```

### Profile Scoping

The following tables now include `profile_id`:
- `tasks`
- `teams`
- `routing_rules`
- `contact_lists`
- `assistant_channels`

## API Endpoints

### List Profiles
```
GET /api/profiles
```

### Get Profile
```
GET /api/profiles/{id}
```

### Create Profile
```
POST /api/profiles
Body: {
  "name": "Work",
  "description": "My work profile",
  "color": "#3b82f6",
  "icon": "💼",
  "is_default": false
}
```

### Update Profile
```
PUT /api/profiles/{id}
```

### Delete Profile
```
DELETE /api/profiles/{id}
```

### Set Default Profile
```
POST /api/profiles/{id}/set-default
```

## Profile Context

### Setting Current Profile

Clients can set the current profile in two ways:

1. **Header** (preferred):
   ```
   X-Profile-Id: {profile-id}
   ```

2. **Query Parameter**:
   ```
   ?profile_id={profile-id}
   ```

The `ProfileContext` middleware automatically reads this and stores it in cache for 30 days.

### Automatic Profile Filtering

Controllers using the `ScopesToProfile` trait automatically filter queries to the current profile:

```php
use App\Modules\Core\Traits\ScopesToProfile;

class TaskController extends Controller
{
    use ScopesToProfile;
    
    public function index(Request $request)
    {
        $query = Task::query();
        $this->scopeToProfile($query, $request); // Automatically filters by profile_id
        return $query->get();
    }
}
```

## Usage in Controllers

### Query Filtering

Use the `ScopesToProfile` trait:

```php
use App\Modules\Core\Traits\ScopesToProfile;

class YourController extends Controller
{
    use ScopesToProfile;
    
    public function index(Request $request)
    {
        $query = YourModel::query();
        $this->scopeToProfile($query, $request);
        return $query->get();
    }
}
```

### Creating Records with Profile

```php
public function store(Request $request)
{
    $model = YourModel::create([
        'user_id' => $request->user()->id,
        'profile_id' => $this->getCurrentProfileId($request),
        // ... other fields
    ]);
}
```

## User Registration

When a new user registers, a default profile named "Default" is automatically created and set as the default profile.

## Profile Limits Enforcement

The `ProfileController` automatically checks profile limits before allowing creation:

```php
if (!$user->canCreateProfile()) {
    return $this->error("You've reached your profile limit...", 403);
}
```

## Frontend Integration

### Setting Profile Context

Include the profile ID in API requests:

```typescript
// Axios instance
const api = axios.create({
  headers: {
    'X-Profile-Id': currentProfileId,
  }
});
```

### Profile Switcher UI

A profile switcher component should:
1. Display all user profiles
2. Allow switching between profiles
3. Store the selected profile ID in localStorage
4. Include `X-Profile-Id` header in all API requests

### Example Profile Switcher

```vue
<template>
  <select v-model="selectedProfile" @change="switchProfile">
    <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
      {{ profile.icon }} {{ profile.name }}
    </option>
  </select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const profiles = ref([])
const selectedProfile = ref(null)

onMounted(async () => {
  const response = await api.get('/profiles')
  profiles.value = response.data.data
  selectedProfile.value = localStorage.getItem('currentProfileId') || profiles.value[0]?.id
})

const switchProfile = async (profileId) => {
  localStorage.setItem('currentProfileId', profileId)
  // Update API client header
  api.defaults.headers.common['X-Profile-Id'] = profileId
  // Reload page data
  window.location.reload()
}
</script>
```

## Migration Notes

1. Run migrations in order:
   - `2024_01_01_000005_create_profiles_table.php`
   - `2024_01_01_000006_add_profile_id_to_core_tables.php`
   - `2024_01_02_000004_add_profile_id_to_tasks_table.php`
   - `2024_01_01_000007_backfill_profiles_for_existing_users.php` (creates default profiles)

2. Existing data will be backfilled with default profiles for each user.

3. New users automatically get a default profile on registration.

## Best Practices

1. **Always scope queries** - Use the `ScopesToProfile` trait to ensure data isolation
2. **Set profile on create** - Always set `profile_id` when creating records
3. **Validate profile ownership** - Ensure users can only access their own profiles
4. **Handle profile limits** - Check limits before allowing profile creation
5. **Clear context on logout** - Clear profile context cache when user logs out

