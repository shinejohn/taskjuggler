
```typescript
interface User {
  id: number
  name: string
  email: string
  teams?: Team[]
  permissions?: string[]
  subscription?: Subscription
}

interface Team {
  id: number
  name: string
  slug: string
  pivot?: { role: 'owner' | 'admin' | 'member' | 'viewer' }
}

interface Subscription {
  plan: 'free' | 'pro' | 'business' | 'enterprise'
  limits: {
    sites: number
    scans_per_month: number
    pages_per_scan: number
    team_members: number
    ai_fixes: number
  }
}
```

---

### Task 1.2: Rewrite Auth Store

**File:** `scanner-web/src/stores/auth.ts`

**Requirements:**
1. Replace standalone auth with platform auth pattern
2. Add currentTeam state
3. Add fetchUser() that gets user with teams and permissions
4. Add setCurrentTeam() function
5. Add hasPermission() function
6. Add hasTeamRole() function
7. Update login/logout to use platform endpoints (`/api/auth/login`, `/api/auth/logout`)
8. Use `/api/user` endpoint for user data

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 1.1

**Key Functions:**
```typescript
async function fetchUser() {
  // GET /api/user
  // Set default team if user has teams
}

function setCurrentTeam(team: Team) {
  // Update currentTeam
  // Store in localStorage
}

function hasPermission(permission: string): boolean {
  // Check user.permissions array
}

function hasTeamRole(role: string): boolean {
  // Check team membership role
}
```

---

### Task 1.3: Update API Client

**File:** `scanner-web/src/utils/api.ts`

**Requirements:**
1. Add `withCredentials: true` for Laravel Sanctum
2. Update baseURL to use `import.meta.env.VITE_API_URL` (default: `https://api.taskjuggler.com`)
3. Add X-Team-ID header injection in request interceptor
4. Update error handling:
   - 401 → logout and redirect to `/login`
   - 403 → redirect to `/upgrade`

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 1.2

**Key Changes:**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.taskjuggler.com',
  withCredentials: true, // CRITICAL for Laravel Sanctum
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  
  // CRITICAL: Add team context
  if (authStore.currentTeam) {
    config.headers['X-Team-ID'] = authStore.currentTeam.id.toString()
  }
  
  return config
})
```

---

### Task 1.4: Update Router

**File:** `scanner-web/src/router/index.ts`

**Requirements:**
1. Add permission checks to route meta
2. Add route guard that checks permissions
3. Update login route to redirect to platform login (`/login?redirect=/scanner`)
4. Add team context check
5. Fetch user if token exists but no user data

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 1.3

**Key Changes:**
```typescript
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // Fetch user if we have token but no user data
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
  
  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  
  // Check permissions
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    return next('/upgrade')
  }
  
  next()
})
```

**Route Meta Example:**
```typescript
{
  path: '/sites',
  meta: { 
    requiresAuth: true,
    permission: 'scanner:view' 
  },
}
```

---

## DELIVERABLES

1. ✅ `src/types/index.ts` - Complete platform type definitions
2. ✅ `src/stores/auth.ts` - Platform-compatible auth store
3. ✅ `src/utils/api.ts` - Team-aware API client
4. ✅ `src/router/index.ts` - Permission-aware router

---

## TESTING CHECKLIST

- [ ] TypeScript compiles without errors
- [ ] Auth store can login/logout
- [ ] Auth store fetches user with teams
- [ ] API client sends X-Team-ID header
- [ ] API client handles 401/403 correctly
- [ ] Router guards work for protected routes
- [ ] Router checks permissions correctly
- [ ] Login redirects to platform login

---

## COMMON PITFALLS

1. **Don't forget `withCredentials: true`** - Required for Laravel Sanctum cookies
2. **X-Team-ID header must be string** - Convert team.id to string
3. **Check for null before accessing** - currentTeam might be null initially
4. **Permission check must handle undefined** - user.permissions might not exist

---# Agent 1: Foundation Layer Instructions
## Scanner Platform Integration - Critical Path

**Priority:** 🔴 CRITICAL - Must complete first  
**Estimated Time:** 2-3 hours  
**Blocks:** All other agents

---

## OBJECTIVE

Establish the foundation infrastructure that all other agents depend on:
- Type definitions with platform structure
- Platform-compatible authentication store
- Team-aware API client
- Permission-aware router

---

## TASKS

### Task 1.1: Update Type Definitions

**File:** `scanner-web/src/types/index.ts`

**Requirements:**
1. Add platform User type with teams, permissions, subscription
2. Add Team interface with pivot role
3. Add Subscription interface with plan and limits
4. Add team_id to Site, Scan, Issue interfaces
5. Add task_id to Issue interface
6. Update all interfaces to match platform structure

**Reference:** See SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 8

**Key Types to Add:**

## REFERENCE FILES

- `PLATFORM_INTEGRATION_GUIDE.md` - Platform patterns
- `SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md` - Detailed spec
- `taskjuggler-web/src/stores/auth.ts` - Reference implementation (if exists)

---

## COMPLETION CRITERIA

✅ All files updated and tested  
✅ No TypeScript errors  
✅ Auth flow works end-to-end  
✅ API client sends correct headers  
✅ Router guards work correctly  

**Once complete, notify other agents that foundation is ready.**

