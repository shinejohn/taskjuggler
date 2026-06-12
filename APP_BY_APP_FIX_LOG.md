# App-by-App Concrete Issue Log

Status key: `OPEN` -> `FIXED`

## projects-web

1. `FIXED` - Home CTA sends authenticated users to non-existent route `/projects/new` (actual route is `/app/projects/new`).
   - File: `projects-web/src/pages/HomePage.vue`

2. `FIXED` - Task API likely broken against backend (frontend used nested `/projects/{id}/tasks/*`; remapped to `/tasks/*` with `project_id` filter for list/create).
   - File: `projects-web/src/api/tasks.ts`

## scanner-web

3. `FIXED` - Billing link pointed to missing route `/settings/billing` (now `/subscribe`).
   - File: `scanner-web/src/components/layout/UserMenu.vue`

4. `FIXED` - Upgrade prompt redirected to missing route `/settings/billing` (now `/subscribe`).
   - File: `scanner-web/src/components/common/UpgradePrompt.vue`

5. `FIXED` - Site card upgrade button redirected to missing route `/settings/billing?upgrade_reason=sites` (now `/subscribe?upgrade_reason=sites`).
   - File: `scanner-web/src/components/scanner/SiteCard.vue`

6. `FIXED` - Side nav dashboard link pointed to `/` while actual app dashboard route is `/dashboard`.
   - File: `scanner-web/src/components/layout/SideNav.vue`

7. `FIXED` - Bulk task creation called `/tasks/bulk` which is not present in backend task routes; now creates tasks one-by-one via `/tasks`.
   - File: `scanner-web/src/stores/tasks.ts`

## urpa-web

8. `FIXED` - Profile page button pointed to missing route `/setup-wizard` (actual route is `/setup`).
   - File: `urpa-web/src/pages/Profile.vue`

9. `FIXED` - Sidebar nav dead-route risk for `/inbox`, `/calendar`, `/calls`, `/settings` resolved by:
   - mapping nav items to working routes, and
   - adding protected redirect routes in router (`/settings`, `/calls`, `/inbox`, `/calendar`).
   - Files:
     - `urpa-web/src/stores/ui.ts`
     - `urpa-web/src/router/index.ts`

