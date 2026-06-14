# 4Doctors Platform - Complete UI Assessment Plan

**Date**: 2026-02-08  
**Purpose**: Systematically test all pages, routes, navigation elements, buttons, popups, and links across the entire platform

---

## Assessment Methodology

For each route/page, we will verify:
1. ✅ **Route loads** - Page renders without errors
2. ✅ **Navigation works** - Can access from main menu/sidebar
3. ✅ **All buttons functional** - Click events trigger expected actions
4. ✅ **All links work** - Internal and external links navigate correctly
5. ✅ **Popups/Modals open** - Dialog components display properly
6. ✅ **Forms submit** - Input validation and submission work
7. ✅ **API Integration** - Data loads from backend (where applicable)
8. ⚠️ **Issues** - Document any problems found

---

## Routes Inventory (by Category)

### 1. PUBLIC PAGES (Unauthenticated)
| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/` | LandingPage.vue | ⏳ Not Tested | - |
| `/login` | Login.vue | ⏳ Not Tested | - |
| `/signup` | SignUp.vue | ⏳ Not Tested | - |
| `/portal/login` | portal/Login.vue | ⏳ Not Tested | - |

---

### 2. PATIENT PORTAL (Patient Users)
**Layout**: PortalLayout.vue  
**Base Path**: `/portal`

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/portal` (redirects to dashboard) | - | ⏳ Not Tested | - |
| `/portal/dashboard` | portal/Dashboard.vue | ⏳ Not Tested | - |
| `/portal/profile` | portal/Profile.vue | ⏳ Not Tested | - |
| `/portal/appointments` | portal/Appointments.vue | ⏳ Not Tested | - |
| `/portal/labs` | portal/LabResults.vue | ⏳ Not Tested | - |
| `/portal/prior-auth` | portal/PriorAuth.vue | ⏳ Not Tested | - |
| `/portal/messages` | portal/Messages.vue | ⏳ Not Tested | - |

**Portal Components to Test**:
- Patient header navigation
- Appointment booking modals
- Message threads
- Lab results viewer
- Prior auth status viewer

---

### 3. MAIN DASHBOARD & CORE
**Layout**: MainLayout.vue

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/dashboard` | Dashboard.vue | ⏳ Not Tested | - |
| `/settings` | Settings.vue | ⏳ Not Tested | - |
| `/onboarding` | onboarding/OnboardingWizard.vue | ⏳ Not Tested | - |
| `/setup/organization` | setup/OrganizationSetup.vue | ⏳ Not Tested | - |

---

### 4. PRACTICE MODE (HIPAA - Clinical)
**Mode**: Practice (Clinical Access Required)

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/patients` | Patients.vue | ⏳ Not Tested | - |
| `/patients/:id` | PatientChart.vue | ⏳ Not Tested | - |
| `/schedule` | Schedule.vue | ⏳ Not Tested | - |
| `/scribe` | Scribe.vue | ⏳ Not Tested | - |
| `/visit/:id/review` | ScribeReview.vue | ⏳ Not Tested | - |
| `/scribemd` | scribemd/LiveDashboardView.vue | ⏳ Not Tested | - |
| `/scribemd/:id` | scribemd/LiveDashboardView.vue | ⏳ Not Tested | - |
| `/scribe/phrases` | scribe/SmartPhrases.vue | ⏳ Not Tested | - |
| `/rx` | rx/Dashboard.vue | ⏳ Not Tested | - |
| `/labs` | labs/LabResults.vue | ⏳ Not Tested | - |
| `/referrals` | referrals/Referrals.vue | ⏳ Not Tested | - |
| `/prior-auth` | prior-auth/Dashboard.vue | ⏳ Not Tested | - |
| `/prior-auth/new` | prior-auth/NewRequest.vue | ⏳ Not Tested | - |

**Practice Mode Components to Test**:
- Patient search/filter
- Appointment calendar (day/week/month views)
- ScribeMD live transcription
- Smart phrases library
- E-prescribing workflow
- Prior authorization wizard
- Lab results integration
- Referral management

---

### 5. BUSINESS MODE (Revenue Cycle)
**Mode**: Business (Business Access Required)

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/claims` | Claims.vue | ⏳ Not Tested | - |
| `/claims/:id` | ClaimDetails.vue | ⏳ Not Tested | - |
| `/billing/claimcoach` | billing/ClaimCoach.vue | ⏳ Not Tested | - |
| `/billing/ledger` | billing/Ledger.vue | ⏳ Not Tested | - |
| `/staff` | staff/StaffManagement.vue | ⏳ Not Tested | - |
| `/vendors` | vendors/VendorManagement.vue | ⏳ Not Tested | - |
| `/marketing` | marketing/Marketing.vue | ⏳ Not Tested | - |
| `/cme` | cme/CMETracking.vue | ⏳ Not Tested | - |

**Business Mode Components to Test**:
- Claims listing and filters
- Claim details viewer
- ClaimCoach AI assistant
- Clinical Ledger A/R tracking
- Staff management (add/edit/permissions)
- Vendor directory
- Marketing campaigns
- CME credit tracking

---

### 6. PERSONAL MODE (Lifestyle)
**Mode**: Personal (Requires Clinical or Admin)

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/travel` | travel/Travel.vue | ⏳ Not Tested | - |
| `/goals` | goals/Goals.vue | ⏳ Not Tested | - |
| `/social` | social/Social.vue | ⏳ Not Tested | - |
| `/files` | files/Files.vue | ⏳ Not Tested | - |

**Personal Mode Components to Test**:
- Travel planner
- Goal tracking dashboard
- Social networking features
- File storage browser

---

### 7. ECOSYSTEM APPS (All Modes)
**Universal Access**

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/marketplace` | Marketplace.vue | ⏳ Not Tested | - |
| `/doclife` | DocLife.vue | ⏳ Not Tested | - |
| `/docconnect` | DocConnect.vue | ⏳ Not Tested | - |
| `/docconnect/directory` | docconnect/Directory.vue | ⏳ Not Tested | - |
| `/docconnect/profile/:id` | docconnect/Profile.vue | ⏳ Not Tested | - |
| `/docconnect/referrals` | docconnect/Referrals.vue | ⏳ Not Tested | - |
| `/docboard` | docboard/Dashboard.vue | ⏳ Not Tested | - |
| `/urpa` | urpa/Dashboard.vue | ⏳ Not Tested | - |
| `/urpa/modules` | urpa/Marketplace.vue | ⏳ Not Tested | - |
| `/urpa/builder` | urpa/WorkflowBuilder.vue | ⏳ Not Tested | - |

**Ecosystem Components to Test**:
- Marketplace browsing and purchase flow
- DocLife wellness features
- DocConnect physician directory
- DocConnect profile pages
- DocBoard clinical decision support
- URPA dashboard and modules
- URPA workflow builder (visual editor)

---

### 8. ADMIN SECTION
**Layout**: AdminLayout.vue  
**Base Path**: `/admin`

| Route | Page Component | Status | Issues |
|-------|----------------|--------|---------|
| `/admin` | admin/AdminDashboard.vue | ⏳ Not Tested | - |
| `/admin/users` | setup/users/UserDirectory.vue | ⏳ Not Tested | - |
| `/admin/roles` | setup/roles/Roles.vue | ⏳ Not Tested | - |
| `/admin/audit-log` | admin/AuditLog.vue | ⏳ Not Tested | - |

**Admin Components to Test**:
- User directory (search/filter/add/edit)
- Role and permission management
- Audit log viewer with filters

---

## Main Layout Navigation Elements

### Sidebar Navigation (MainLayout.vue)
- [ ] Logo click (navigates to dashboard)
- [ ] Collapse/expand toggle
- [ ] Mode toggle component
- [ ] All mode sections expand/collapse
- [ ] Practice mode menu items
- [ ] Business mode menu items
- [ ] Personal mode menu items
- [ ] Ecosystem section items
- [ ] Settings link

### Header Elements
- [ ] User profile dropdown
- [ ] Notifications bell
- [ ] Search functionality
- [ ] Help/support links
- [ ] Logout button

### Portal Layout Navigation (PortalLayout.vue)
- [ ] Patient header menu
- [ ] Portal-specific navigation
- [ ] Appointment quick actions
- [ ] Message notifications

---

## Universal Components to Test

### Shared UI Components
Located in: `@taskjuggler/ui` (shared-ui package)

- [ ] **Buttons**: Primary, secondary, danger variants
- [ ] **Modals/Dialogs**: Open, close, confirm actions
- [ ] **Forms**: Input validation, error states
- [ ] **Tables**: Sorting, filtering, pagination
- [ ] **Cards**: Click actions, expandable sections
- [ ] **Dropdowns**: Menu items functional
- [ ] **Date Pickers**: Date selection works
- [ ] **File Upload**: Upload and preview
- [ ] **Alerts/Toasts**: Success/error messages display
- [ ] **Loading States**: Spinners and skeletons

---

## Testing Workflow

### Phase 1: Public Pages & Authentication
1. Start dev server
2. Test landing page
3. Test login flow
4. Test signup flow
5. Test portal login (patient)

### Phase 2: Main Dashboard & Core
1. Login as provider
2. Test main dashboard
3. Test settings page
4. Test onboarding wizard
5. Test organization setup

### Phase 3: Practice Mode (Clinical)
1. Switch to practice mode
2. Test each clinical route
3. Verify HIPAA-restricted access
4. Test patient chart workflows
5. Test ScribeMD live features

### Phase 4: Business Mode (Revenue)
1. Switch to business mode
2. Test claims management
3. Test billing features
4. Test staff management
5. Test vendor/marketing features

### Phase 5: Personal Mode
1. Switch to personal mode
2. Test lifestyle features
3. Verify access restrictions

### Phase 6: Ecosystem Apps
1. Test each ecosystem app
2. Verify cross-app navigation
3. Test URPA workflow builder

### Phase 7: Admin Section
1. Login as admin user
2. Test user management
3. Test role/permission system
4. Test audit log

### Phase 8: Patient Portal
1. Login as patient user
2. Test all portal pages
3. Verify patient-only access
4. Test appointment booking
5. Test messaging

---

## Test User Credentials Needed

We need test accounts for:
- [ ] **Provider (Clinical)** - physician with practice access
- [ ] **Provider (Non-Clinical)** - PA/NP with limited access
- [ ] **Business User** - billing/admin staff
- [ ] **Admin** - full system admin
- [ ] **Patient** - patient portal user
- [ ] **Front Desk** - receptionist role

---

## Testing Tools

### Browser Testing
- Chrome DevTools (Console, Network tab)
- Vue DevTools (Component inspector)

### Manual Tests
- Click every button
- Fill every form
- Open every modal
- Navigate every link
- Check responsive layouts

### Automated Checks
- Console errors (should be zero)
- Network failures (capture 404s, 500s)
- Route guards (unauthorized access blocked)

---

## Issue Reporting Format

For each issue found:
```markdown
**Page**: [Route/Component Name]
**Issue**: [Description]
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Severity**: Critical | High | Medium | Low
**Screenshot**: [If applicable]
**Console Errors**: [Any errors from console]
```

---

## Success Criteria

### Must Pass (100%)
- ✅ All routes load without 404 errors
- ✅ All navigation links work
- ✅ No JavaScript console errors on page load
- ✅ Authentication guards work correctly
- ✅ Patient/provider separation enforced

### Should Pass (90%+)
- ✅ All buttons trigger actions
- ✅ All modals/popups open and close
- ✅ All forms validate and submit
- ✅ All API calls return data or proper errors

### Nice to Have (75%+)
- ✅ Responsive design works on mobile
- ✅ Loading states display correctly
- ✅ Error states are user-friendly
- ✅ Smooth transitions and animations

---

## Next Steps

1. **Start Dev Server**: `npm run dev` in 4doctors-web
2. **Verify Backend**: Ensure API is running
3. **Create Test Users**: Set up test accounts in database
4. **Begin Phase 1**: Start with public pages
5. **Document Everything**: Track results in this document
6. **Fix Issues**: Create tickets for problems found
7. **Re-test**: Verify fixes work

---

## Assessment Log

### Session 1: [Date]
**Tester**: [Name]  
**Pages Tested**: [List]  
**Issues Found**: [Count]  
**Status**: [In Progress / Complete]

---

## Notes

- Some pages may require specific backend services running
- ScribeMD requires audio permissions
- File upload needs storage configuration
- E-prescribing may need external API credentials
- Prior auth engine may have limited test data

---

**Last Updated**: 2026-02-08  
**Status**: Ready to Begin Testing  
**Estimated Time**: 4-6 hours for complete assessment
