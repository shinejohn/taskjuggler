# React to Vue Conversion Tracker
## coordinator-web/UISPEC → coordinator-web/src/components

**Status**: In Progress  
**Started**: 2025-01-XX  
**Approach**: Convert React components to Vue 3 Composition API, then refactor to use shared shadcn-vue components

## Conversion Progress

### UI Components (Priority: High)
- [ ] `ui/PersonaCard.tsx` → `dashboard/PersonaCard.vue` (or merge with CoordinatorCard.vue)
- [ ] `ui/MetricsCard.tsx` → Already exists as `dashboard/MetricCard.vue` (verify match)
- [ ] `ui/CallLogItem.tsx` → `calls/CallLogItem.vue`

### Dashboard Components
- [ ] `dashboard/Dashboard.tsx` → Already exists as `pages/dashboard/DashboardPage.vue` (verify match)
- [ ] `dashboard/CoordinatorCard.tsx` → Already exists as `dashboard/CoordinatorCard.vue` (verify match)
- [ ] `dashboard/MetricCard.tsx` → Already exists as `dashboard/MetricCard.vue` (verify match)

### Auth Components
- [ ] `auth/LoginPage.tsx` → Already exists as `pages/auth/LoginPage.vue` (verify match)
- [ ] `auth/SignUpPage.tsx` → Already exists as `pages/auth/RegisterPage.vue` (verify match)

### Landing Components
- [ ] `landing/LandingPage.tsx` → Already exists as `pages/LandingPage.vue` (verify match)
- [ ] `landing/HeroSection.tsx` → Already exists as `landing/HeroSection.vue` (verify match)
- [ ] `landing/Navigation.tsx` → Already exists as `landing/Navigation.vue` (verify match)
- [ ] `landing/Footer.tsx` → Already exists as `landing/Footer.vue` (verify match)
- [ ] `landing/PricingSection.tsx` → Already exists as `landing/PricingSection.vue` (verify match)
- [ ] `landing/PersonaShowcase.tsx` → Already exists as `landing/PersonaShowcase.vue` (verify match)

### Onboarding Components
- [ ] `onboarding/OnboardingWizard.tsx` → Already exists as `pages/onboarding/OnboardingPage.vue` (verify match)
- [ ] `onboarding/BusinessPollStep.tsx` → Already exists as `onboarding/BusinessPollStep.vue` (verify match)
- [ ] `onboarding/IndustrySelectionStep.tsx` → Already exists as `onboarding/IndustrySelectionStep.vue` (verify match)
- [ ] `onboarding/IndustryCard.tsx` → Already exists as `onboarding/IndustryCard.vue` (verify match)
- [ ] `onboarding/PersonaCustomizerStep.tsx` → Already exists as `onboarding/PersonaCustomizerStep.vue` (verify match)
- [ ] `onboarding/RoleCard.tsx` → Already exists as `onboarding/RoleCard.vue` (verify match)
- [ ] `onboarding/RoleSelectionStep.tsx` → Already exists as `onboarding/RoleSelectionStep.vue` (verify match)
- [ ] `onboarding/SetupCompleteStep.tsx` → Already exists as `onboarding/SetupCompleteStep.vue` (verify match)

### Coordinator Components
- [ ] `coordinators/CoordinatorsList.tsx` → Already exists as `pages/coordinators/CoordinatorsPage.vue` (verify match)
- [ ] `coordinators/CoordinatorDetail.tsx` → Already exists as `pages/coordinators/CoordinatorDetailPage.vue` (verify match)

### Contact Components
- [ ] `contacts/ContactsList.tsx` → Already exists as `pages/contacts/ContactsPage.vue` (verify match)
- [ ] `contacts/ContactSidebar.tsx` → Already exists as `contacts/ContactSidebar.vue` (verify match)

### Calendar Components
- [ ] `calendar/CalendarView.tsx` → Already exists as `calendar/CalendarView.vue` (verify match)
- [ ] `calendar/AppointmentModal.tsx` → Already exists as `calendar/AppointmentModal.vue` (verify match)

### Call Components
- [ ] `calls/CallHistory.tsx` → Already exists as `pages/calls/CallsPage.vue` (verify match)
- [ ] `calls/CallDetailPanel.tsx` → Already exists as `calls/CallDetailPanel.vue` (verify match)

### Campaign Components
- [ ] `campaigns/CampaignsList.tsx` → Already exists as `pages/campaigns/CampaignsPage.vue` (verify match)

### Analytics Components
- [ ] `analytics/Analytics.tsx` → Already exists as `pages/analytics/AnalyticsPage.vue` (verify match)

### Billing Components
- [ ] `billing/Billing.tsx` → Already exists as `pages/billing/BillingPage.vue` (verify match)

### Settings Components
- [ ] `settings/Settings.tsx` → Already exists as `pages/settings/SettingsPage.vue` (verify match)
- [ ] `settings/BusinessProfile.tsx` → Already exists as `settings/BusinessProfile.vue` (verify match)
- [ ] `settings/PhoneNumbers.tsx` → Already exists as `settings/PhoneNumbers.vue` (verify match)
- [ ] `settings/TeamMembers.tsx` → Already exists as `settings/TeamMembers.vue` (verify match)
- [ ] `settings/Security.tsx` → Already exists as `settings/Security.vue` (verify match)
- [ ] `settings/Integrations.tsx` → Already exists as `settings/Integrations.vue` (verify match)
- [ ] `settings/ApiAccess.tsx` → Already exists as `settings/ApiAccess.vue` (verify match)

### Layout Components
- [ ] `layout/DashboardLayout.tsx` → Already exists as `layout/DashboardLayout.vue` (verify match)

### Common Components
- [ ] `common/EmptyState.tsx` → Create `common/EmptyState.vue` if needed

### Mobile Components
- [ ] `mobile/MobileDashboard.tsx` → Create `mobile/MobileDashboard.vue` if needed
- [ ] `mobile/MobileNav.tsx` → Create `mobile/MobileNav.vue` if needed

## Conversion Notes

### React → Vue Mapping
- `useState` → `ref()` or `reactive()`
- `useEffect` → `watch()`, `watchEffect()`, or `onMounted()`
- `useCallback` → Regular function or `computed()`
- `useMemo` → `computed()`
- `className` → `class` or `:class`
- `onClick` → `@click`
- JSX → Vue template syntax
- `lucide-react` → `lucide-vue-next`

### Next Steps After Conversion
1. Verify all converted components work correctly
2. Update imports in pages/components
3. Remove UISPEC directory
4. Setup shared-ui component library (Phase 1)
5. Refactor to use shadcn-vue components (Phase 2+)

