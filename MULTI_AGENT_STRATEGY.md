# Multi-Agent Strategy for Component Refactoring Completion

## Overview

This document outlines a strategy to complete the remaining component refactoring work by dividing it among specialized agents working in parallel. The work is divided into independent streams with clear boundaries and coordination points.

---

## Current Status

### ✅ Completed
- **shared-ui library**: All shadcn-vue components created and configured
- **urpa-web**: Login.vue, SignUp.vue refactored
- **taskjuggler-web**: DashboardPage, LoginForm, LoginPage refactored
- **scanner-web**: 12 components refactored (pages + components)

### 🔄 Remaining Work
1. **React → Vue Conversion**: 46 .tsx files in `coordinator-web/UISPEC/`
2. **Component Verification**: Verify existing Vue components match React specs
3. **Shared-UI Migration**: Refactor remaining custom components to use shared-ui
4. **Feature Components**: Refactor feature-specific components across all projects
5. **Cleanup**: Remove old custom UI components and UISPEC directory

---

## Agent Architecture

### Agent Roles & Responsibilities

#### **Agent 1: React-to-Vue Converter (R2V Agent)**
**Focus**: Convert React components from UISPEC to Vue 3 Composition API

**Responsibilities**:
- Convert React .tsx files to Vue .vue files
- Map React hooks to Vue Composition API
- Convert JSX to Vue template syntax
- Update imports (lucide-react → lucide-vue-next)
- Ensure TypeScript types are preserved

**Work Queue**:
```
Priority 1 (Core UI):
- ui/PersonaCard.tsx → ui/PersonaCard.vue
- ui/MetricsCard.tsx → dashboard/MetricCard.vue (verify)
- ui/CallLogItem.tsx → calls/CallLogItem.vue

Priority 2 (Feature Components):
- analytics/Analytics.tsx → pages/analytics/AnalyticsPage.vue (verify)
- billing/Billing.tsx → pages/billing/BillingPage.vue (verify)
- campaigns/CampaignsList.tsx → pages/campaigns/CampaignsPage.vue (verify)
- coordinators/*.tsx → pages/coordinators/*.vue (verify)
- contacts/*.tsx → pages/contacts/*.vue (verify)

Priority 3 (Settings):
- settings/*.tsx → settings/*.vue (verify all 7 components)

Priority 4 (Mobile):
- mobile/MobileDashboard.tsx → mobile/MobileDashboard.vue
- mobile/MobileNav.tsx → mobile/MobileNav.vue
```

**Output**: Vue components in `coordinator-web/src/components/` or `coordinator-web/src/pages/`

**Dependencies**: None (can work independently)

**Deliverables**:
- Converted Vue components
- Updated import statements in consuming files
- Component verification checklist

---

#### **Agent 2: Component Verifier (Verify Agent)**
**Focus**: Verify existing Vue components match React specifications

**Responsibilities**:
- Compare React .tsx files with existing Vue .vue files
- Verify feature parity (props, events, functionality)
- Identify missing features or discrepancies
- Document differences and update tracker
- Mark components as verified or flag for updates

**Work Queue**:
```
Verification Tasks:
- dashboard/Dashboard.tsx ↔ pages/dashboard/DashboardPage.vue
- dashboard/CoordinatorCard.tsx ↔ dashboard/CoordinatorCard.vue
- dashboard/MetricCard.tsx ↔ dashboard/MetricCard.vue
- auth/LoginPage.tsx ↔ pages/auth/LoginPage.vue
- auth/SignUpPage.tsx ↔ pages/auth/RegisterPage.vue
- landing/*.tsx ↔ landing/*.vue (6 components)
- onboarding/*.tsx ↔ onboarding/*.vue (8 components)
- calendar/*.tsx ↔ calendar/*.vue (2 components)
- calls/*.tsx ↔ calls/*.vue (2 components)
- layout/DashboardLayout.tsx ↔ layout/DashboardLayout.vue
```

**Output**: Updated `REACT_TO_VUE_CONVERSION_TRACKER.md` with verification status

**Dependencies**: Can work in parallel with R2V Agent

**Deliverables**:
- Verification report per component
- Updated tracker with status
- List of components needing updates

---

#### **Agent 3: Shared-UI Migrator (Migration Agent)**
**Focus**: Refactor existing Vue components to use shared-ui library

**Responsibilities**:
- Replace custom Button/Card/Input with shared-ui equivalents
- Update imports to use `@taskjuggler/ui`
- Refactor component props to match shared-ui API
- Ensure styling consistency
- Update all consuming components

**Work Queue**:
```
coordinator-web:
- All components in src/components/ (verify which need migration)
- All pages in src/pages/

projects-web:
- components/ui/Button.vue → use shared-ui Button
- components/ui/Card.vue → use shared-ui Card
- All feature components using custom UI

process-web:
- components/ui/Button.vue → use shared-ui Button
- components/ui/Card.vue → use shared-ui Card
- All feature components using custom UI

urpa-web:
- components/ui/Modal.vue → use shared-ui Dialog (if applicable)
- components/ui/StatusIndicator.vue (may stay custom)
- All feature components using custom UI

scanner-web:
- components/scanner/AddSiteModal.vue → use shared-ui Dialog
- Any remaining custom UI components
```

**Output**: Refactored components using shared-ui

**Dependencies**: 
- Requires shared-ui library (✅ complete)
- Can work in parallel with R2V Agent

**Deliverables**:
- Refactored components
- Updated imports
- Removed custom UI components (where applicable)

---

#### **Agent 4: Feature Component Refactorer (Feature Agent)**
**Focus**: Refactor feature-specific components across all projects

**Responsibilities**:
- Refactor complex feature components (not just UI primitives)
- Ensure consistent patterns across projects
- Update component composition and structure
- Optimize component performance
- Ensure accessibility compliance

**Work Queue**:
```
coordinator-web:
- components/onboarding/*.vue (refactor to use shared-ui)
- components/calls/*.vue (refactor to use shared-ui)
- components/calendar/*.vue (refactor to use shared-ui)
- components/settings/*.vue (refactor to use shared-ui)

taskjuggler-web:
- components/homepage/*.vue (refactor to use shared-ui)
- All feature components

urpa-web:
- components/activities/*.vue
- components/ai/*.vue
- components/phone/*.vue
- components/integrations/*.vue
- components/widgets/*.vue

scanner-web:
- components/scanner/*.vue (already partially done)
```

**Output**: Refactored feature components

**Dependencies**: 
- Can work after Migration Agent completes UI primitives
- Can work in parallel on different projects

**Deliverables**:
- Refactored feature components
- Updated component documentation
- Performance improvements

---

#### **Agent 5: Cleanup & Testing Agent (Cleanup Agent)**
**Focus**: Remove old components, update documentation, run tests

**Responsibilities**:
- Remove UISPEC directory after all conversions verified
- Remove old custom UI components (Button, Card, Input) from projects
- Update all import statements
- Run linting and fix errors
- Update documentation
- Create migration summary

**Work Queue**:
```
Cleanup Tasks:
1. Remove coordinator-web/UISPEC/ directory
2. Remove custom UI components:
   - projects-web/src/components/ui/Button.vue
   - projects-web/src/components/ui/Card.vue
   - process-web/src/components/ui/Button.vue
   - process-web/src/components/ui/Card.vue
   - urpa-web/src/components/ui/Button.vue
   - urpa-web/src/components/ui/Card.vue
   - urpa-web/src/components/ui/Input.vue
   - scanner-web/src/components/ui/*.vue (if replaced)
   - taskjuggler-web/src/components/ui/*.vue (if replaced)

3. Update documentation:
   - REACT_TO_VUE_CONVERSION_TRACKER.md (mark complete)
   - Update README files
   - Create migration summary

4. Testing:
   - Run linting on all projects
   - Fix any TypeScript errors
   - Verify builds succeed
   - Test critical user flows
```

**Output**: Clean codebase, updated docs, test results

**Dependencies**: 
- Must wait for all other agents to complete
- Final step in the process

**Deliverables**:
- Removed old code
- Updated documentation
- Test report
- Migration summary

---

## Coordination Strategy

### Work Assignment

**Phase 1: Parallel Independent Work** (Agents 1, 2, 3 can work simultaneously)
- **Agent 1**: Convert React components (no dependencies)
- **Agent 2**: Verify existing components (no dependencies)
- **Agent 3**: Migrate UI primitives to shared-ui (no dependencies)

**Phase 2: Feature Refactoring** (Agent 4)
- **Agent 4**: Refactor feature components (can start after Agent 3 completes UI primitives)

**Phase 3: Cleanup** (Agent 5)
- **Agent 5**: Final cleanup (waits for all agents)

### Communication Protocol

1. **Status Updates**: Each agent updates `REACT_TO_VUE_CONVERSION_TRACKER.md` with progress
2. **Conflict Resolution**: If multiple agents touch same file:
   - Agent 1 (R2V) has priority for React conversions
   - Agent 3 (Migration) has priority for UI component refactoring
   - Agent 4 (Feature) coordinates with Agent 3
3. **Handoff Points**: 
   - Agent 1 → Agent 2: After conversion, mark for verification
   - Agent 2 → Agent 3: After verification, mark for migration
   - Agent 3 → Agent 4: After UI primitives migrated
   - All → Agent 5: After all work complete

### File Ownership

```
coordinator-web/UISPEC/**/*.tsx          → Agent 1 (R2V)
coordinator-web/src/components/**/*.vue   → Agent 2 (Verify) → Agent 3 (Migration) → Agent 4 (Feature)
projects-web/src/components/ui/*.vue      → Agent 3 (Migration)
process-web/src/components/ui/*.vue      → Agent 3 (Migration)
urpa-web/src/components/ui/*.vue         → Agent 3 (Migration)
scanner-web/src/components/ui/*.vue       → Agent 3 (Migration)
All projects cleanup                      → Agent 5 (Cleanup)
```

---

## Quality Gates

### Before Agent 1 Completes:
- [ ] All React components converted to Vue
- [ ] TypeScript types preserved
- [ ] No linting errors
- [ ] Components compile successfully

### Before Agent 2 Completes:
- [ ] All existing components verified
- [ ] Discrepancies documented
- [ ] Tracker updated

### Before Agent 3 Completes:
- [ ] All UI primitives migrated to shared-ui
- [ ] No custom Button/Card/Input remain (except where needed)
- [ ] All imports updated
- [ ] No linting errors

### Before Agent 4 Completes:
- [ ] All feature components refactored
- [ ] Consistent patterns across projects
- [ ] Performance verified

### Before Agent 5 Completes:
- [ ] UISPEC directory removed
- [ ] Old custom UI components removed
- [ ] All documentation updated
- [ ] All tests passing
- [ ] Build succeeds for all projects

---

## Execution Plan

### Week 1: Foundation
- **Agent 1**: Convert Priority 1 React components (3 components)
- **Agent 2**: Verify Priority 1 components (dashboard, auth, landing)
- **Agent 3**: Migrate UI primitives in projects-web and process-web

### Week 2: Core Features
- **Agent 1**: Convert Priority 2 React components (feature components)
- **Agent 2**: Verify Priority 2 components
- **Agent 3**: Migrate UI primitives in coordinator-web
- **Agent 4**: Start refactoring coordinator-web feature components

### Week 3: Feature Completion
- **Agent 1**: Convert Priority 3 & 4 components (settings, mobile)
- **Agent 2**: Complete all verifications
- **Agent 3**: Complete all UI migrations
- **Agent 4**: Complete feature component refactoring

### Week 4: Cleanup
- **Agent 5**: Remove old code, update docs, run tests
- **All Agents**: Review and finalize

---

## Success Metrics

1. **Code Reduction**: 
   - Remove 46 React .tsx files
   - Remove ~10 custom UI component files
   - Reduce code duplication

2. **Consistency**:
   - All projects use shared-ui
   - Consistent component patterns
   - Unified design system

3. **Quality**:
   - Zero linting errors
   - All builds succeed
   - All tests pass
   - TypeScript types correct

4. **Documentation**:
   - Tracker updated
   - Migration documented
   - README files current

---

## Risk Mitigation

### Risk: Merge Conflicts
**Mitigation**: Clear file ownership, sequential work on same files

### Risk: Breaking Changes
**Mitigation**: Incremental migration, test after each phase

### Risk: Incomplete Conversions
**Mitigation**: Verification agent checks all components

### Risk: Performance Regression
**Mitigation**: Performance testing before cleanup phase

---

## Tools & Resources

### Required Tools
- TypeScript compiler
- Vue 3 + Vite
- ESLint
- Shared-ui library (already set up)

### Reference Documents
- `REACT_TO_VUE_CONVERSION_TRACKER.md` - Progress tracking
- `shared-ui/README.md` - Component API reference
- Component examples in already-refactored files

### Key Files
- `coordinator-web/UISPEC/` - Source React components
- `shared-ui/src/components/ui/` - Shared component library
- Project-specific component directories

---

## Next Steps

1. **Assign Agents**: Create separate agent instances with specific roles
2. **Initialize Trackers**: Set up progress tracking for each agent
3. **Start Phase 1**: Begin parallel work on independent streams
4. **Daily Sync**: Check progress and resolve conflicts
5. **Weekly Review**: Assess progress and adjust plan

---

## Notes

- Agents can work on different projects simultaneously
- Priority order ensures critical components are done first
- Verification step ensures quality before migration
- Cleanup agent ensures final codebase is clean
- All work should be incremental and testable

