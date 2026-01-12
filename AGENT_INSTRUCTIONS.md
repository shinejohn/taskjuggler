# Agent-Specific Instructions

Quick reference guides for each agent role.

---

## Agent 1: React-to-Vue Converter (R2V Agent)

### Your Mission
Convert React .tsx components from `coordinator-web/UISPEC/` to Vue 3 Composition API components.

### Key Conversion Rules

```typescript
// React → Vue Mapping

// State
const [value, setValue] = useState(0)
// → 
const value = ref(0)

// Effects
useEffect(() => {
  // code
}, [deps])
// →
watch(deps, () => { /* code */ })
// or
onMounted(() => { /* code */ })

// Memoization
const computed = useMemo(() => value * 2, [value])
// →
const computed = computed(() => value.value * 2)

// Callbacks
const handler = useCallback(() => {}, [deps])
// →
const handler = () => {} // or computed if needed

// Props
interface Props { name: string }
const Component = ({ name }: Props) => {}
// →
const props = defineProps<{ name: string }>()

// Events
onClick={() => handleClick()}
// →
@click="handleClick"

// Classes
className="btn btn-primary"
// →
class="btn btn-primary"
// or
:class="{ 'btn-primary': isActive }"

// Imports
import { Mail } from 'lucide-react'
// →
import { Mail } from 'lucide-vue-next'
```

### Workflow

1. **Read React Component**
   ```bash
   # Example: coordinator-web/UISPEC/src/components/ui/PersonaCard.tsx
   ```

2. **Create Vue Component**
   ```bash
   # Create: coordinator-web/src/components/ui/PersonaCard.vue
   ```

3. **Convert Structure**
   - Convert JSX to `<template>`
   - Convert hooks to Composition API
   - Convert props/events
   - Update imports

4. **Verify**
   - TypeScript compiles
   - No linting errors
   - Component structure matches

5. **Update Tracker**
   - Mark component as converted in `REACT_TO_VUE_CONVERSION_TRACKER.md`

### Priority Order

1. **ui/PersonaCard.tsx** → `ui/PersonaCard.vue`
2. **ui/CallLogItem.tsx** → `calls/CallLogItem.vue`
3. **analytics/Analytics.tsx** → Verify/create `pages/analytics/AnalyticsPage.vue`
4. Continue with remaining components

### Example Conversion

**React (Before)**:
```tsx
import { useState } from 'react';
import { Mail } from 'lucide-react';

interface Props {
  name: string;
  email: string;
}

export function PersonaCard({ name, email }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
}
```

**Vue (After)**:
```vue
<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>{{ email }}</p>
    <button @click="expanded = !expanded">
      {{ expanded ? 'Collapse' : 'Expand' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Mail } from 'lucide-vue-next';

interface Props {
  name: string;
  email: string;
}

const props = defineProps<Props>();
const expanded = ref(false);
</script>
```

---

## Agent 2: Component Verifier (Verify Agent)

### Your Mission
Verify that existing Vue components match their React counterparts in functionality and features.

### Verification Checklist

For each component pair:

- [ ] **Props Match**: All props from React exist in Vue
- [ ] **Events Match**: All events/emits match React callbacks
- [ ] **State Match**: All state management matches
- [ ] **UI Match**: Visual appearance matches
- [ ] **Functionality Match**: All features work the same
- [ ] **Types Match**: TypeScript types are equivalent

### Workflow

1. **Read Both Files**
   ```bash
   # React: coordinator-web/UISPEC/src/components/dashboard/Dashboard.tsx
   # Vue: coordinator-web/src/pages/dashboard/DashboardPage.vue
   ```

2. **Compare**
   - Props interface
   - State management
   - Event handlers
   - UI structure
   - Functionality

3. **Document**
   - ✅ Match: Component verified
   - ⚠️ Partial: Needs updates
   - ❌ Missing: Component needs creation/update

4. **Update Tracker**
   ```markdown
   - [x] `dashboard/Dashboard.tsx` → ✅ Verified match
   - [ ] `dashboard/MetricCard.tsx` → ⚠️ Missing prop: `trend`
   ```

### Verification Template

```markdown
## Component: Dashboard.tsx ↔ DashboardPage.vue

**Status**: ✅ Verified / ⚠️ Partial / ❌ Missing

**Props**:
- React: `{ user: User, stats: Stats }`
- Vue: `{ user: User, stats: Stats }`
- Match: ✅

**State**:
- React: `useState` for loading, error
- Vue: `ref` for loading, error
- Match: ✅

**Events**:
- React: `onTaskClick`, `onRefresh`
- Vue: `@task-click`, `@refresh`
- Match: ✅

**Issues**: None / [List issues]
```

---

## Agent 3: Shared-UI Migrator (Migration Agent)

### Your Mission
Replace custom UI components (Button, Card, Input) with shared-ui equivalents across all projects.

### Migration Patterns

#### Button Migration

**Before**:
```vue
<script setup>
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <Button variant="primary" size="md" @click="handleClick">
    Click Me
  </Button>
</template>
```

**After**:
```vue
<script setup>
import { Button } from '@taskjuggler/ui'
</script>

<template>
  <Button @click="handleClick">
    Click Me
  </Button>
</template>
```

**Variant Mapping**:
- `variant="primary"` → Default (no variant needed)
- `variant="secondary"` → `variant="outline"`
- `variant="ghost"` → `variant="ghost"`
- `variant="danger"` → `variant="destructive"`

#### Card Migration

**Before**:
```vue
<script setup>
import Card from '@/components/ui/Card.vue'
</script>

<template>
  <Card :padding="'lg'">
    <h2>Title</h2>
    <p>Content</p>
  </Card>
</template>
```

**After**:
```vue
<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@taskjuggler/ui'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Content</p>
    </CardContent>
  </Card>
</template>
```

#### Input Migration

**Before**:
```vue
<script setup>
import Input from '@/components/ui/Input.vue'
</script>

<template>
  <Input
    v-model="email"
    label="Email"
    type="email"
    :error="errors.email"
  />
</template>
```

**After**:
```vue
<script setup>
import { Input, Label } from '@taskjuggler/ui'
</script>

<template>
  <div>
    <Label for="email">Email</Label>
    <Input
      id="email"
      v-model="email"
      type="email"
      :class="errors.email && 'border-destructive'"
    />
    <p v-if="errors.email" class="text-sm text-destructive mt-1">
      {{ errors.email }}
    </p>
  </div>
</template>
```

### Workflow

1. **Find Custom UI Usage**
   ```bash
   grep -r "from '@/components/ui/Button" projects-web/
   ```

2. **Replace Import**
   ```typescript
   // Remove
   import Button from '@/components/ui/Button.vue'
   
   // Add
   import { Button } from '@taskjuggler/ui'
   ```

3. **Update Component Usage**
   - Update props to match shared-ui API
   - Adjust styling if needed
   - Test component still works

4. **Verify**
   - Component renders correctly
   - No linting errors
   - Functionality preserved

5. **Remove Old Component** (after all migrations)
   - Only Agent 5 removes files
   - Mark as ready for removal

### Projects to Migrate

1. **projects-web**
   - `components/ui/Button.vue` → shared-ui
   - `components/ui/Card.vue` → shared-ui

2. **process-web**
   - `components/ui/Button.vue` → shared-ui
   - `components/ui/Card.vue` → shared-ui

3. **coordinator-web**
   - All components using custom UI

4. **urpa-web**
   - `components/ui/Modal.vue` → Consider Dialog (optional)

5. **scanner-web**
   - `components/scanner/AddSiteModal.vue` → Use Dialog

---

## Agent 4: Feature Component Refactorer (Feature Agent)

### Your Mission
Refactor feature-specific components to use shared-ui and ensure consistent patterns.

### Refactoring Focus Areas

1. **Component Structure**
   - Use shared-ui components consistently
   - Follow established patterns
   - Improve component composition

2. **Performance**
   - Optimize re-renders
   - Use computed properties appropriately
   - Lazy load where beneficial

3. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Screen reader support

4. **Consistency**
   - Same patterns across projects
   - Unified styling approach
   - Consistent prop naming

### Example Refactoring

**Before**:
```vue
<template>
  <div class="onboarding-step">
    <div class="step-header">
      <h2>{{ title }}</h2>
    </div>
    <div class="step-content">
      <slot />
    </div>
    <div class="step-actions">
      <button @click="onBack">Back</button>
      <button @click="onNext">Next</button>
    </div>
  </div>
</template>
```

**After**:
```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
    <CardFooter class="flex justify-between">
      <Button variant="outline" @click="onBack">Back</Button>
      <Button @click="onNext">Next</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardFooter, Button } from '@taskjuggler/ui'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  back: []
  next: []
}>()

const onBack = () => emit('back')
const onNext = () => emit('next')
</script>
```

### Workflow

1. **Identify Component**
   - Find feature component to refactor

2. **Analyze**
   - Current structure
   - Dependencies
   - Usage patterns

3. **Refactor**
   - Replace custom UI with shared-ui
   - Improve structure
   - Optimize performance

4. **Test**
   - Verify functionality
   - Check styling
   - Test edge cases

5. **Document**
   - Update component docs
   - Note any breaking changes

---

## Agent 5: Cleanup & Testing Agent (Cleanup Agent)

### Your Mission
Remove old code, update documentation, and ensure everything works.

### Cleanup Checklist

#### Phase 1: Remove Old Code

- [ ] Remove `coordinator-web/UISPEC/` directory
- [ ] Remove custom UI components:
  - [ ] `projects-web/src/components/ui/Button.vue`
  - [ ] `projects-web/src/components/ui/Card.vue`
  - [ ] `process-web/src/components/ui/Button.vue`
  - [ ] `process-web/src/components/ui/Card.vue`
  - [ ] `urpa-web/src/components/ui/Button.vue`
  - [ ] `urpa-web/src/components/ui/Card.vue`
  - [ ] `urpa-web/src/components/ui/Input.vue`
  - [ ] `scanner-web/src/components/ui/*.vue` (if replaced)
  - [ ] `taskjuggler-web/src/components/ui/*.vue` (if replaced)

#### Phase 2: Update Documentation

- [ ] Update `REACT_TO_VUE_CONVERSION_TRACKER.md`:
  - [ ] Mark all components as complete
  - [ ] Add completion date
  - [ ] Note any exceptions

- [ ] Update project README files:
  - [ ] Note shared-ui usage
  - [ ] Update component examples
  - [ ] Update setup instructions

- [ ] Create migration summary:
  - [ ] Components converted
  - [ ] Components migrated
  - [ ] Breaking changes
  - [ ] Migration guide

#### Phase 3: Testing

- [ ] Run linting:
  ```bash
  cd coordinator-web && npm run lint
  cd projects-web && npm run lint
  cd process-web && npm run lint
  cd urpa-web && npm run lint
  cd scanner-web && npm run lint
  cd taskjuggler-web && npm run lint
  ```

- [ ] Fix all linting errors

- [ ] Run TypeScript checks:
  ```bash
  cd coordinator-web && npm run type-check
  # Repeat for all projects
  ```

- [ ] Build all projects:
  ```bash
  cd coordinator-web && npm run build
  # Repeat for all projects
  ```

- [ ] Test critical flows:
  - [ ] Login/Register
  - [ ] Dashboard
  - [ ] Feature pages
  - [ ] Settings

#### Phase 4: Final Verification

- [ ] All imports resolve correctly
- [ ] No broken references
- [ ] All builds succeed
- [ ] Documentation complete
- [ ] Migration summary created

### Workflow

1. **Wait for All Agents**
   - Verify all other agents completed work
   - Check tracker for completion status

2. **Remove Old Code**
   - Delete UISPEC directory
   - Delete custom UI components
   - Remove unused imports

3. **Update Documentation**
   - Mark tracker as complete
   - Update README files
   - Create summary

4. **Run Tests**
   - Linting
   - Type checking
   - Builds
   - Manual testing

5. **Create Report**
   - Summary of changes
   - Migration statistics
   - Known issues
   - Next steps

---

## Coordination Notes

### File Conflicts

If multiple agents need to modify the same file:

1. **Agent 1 (R2V)** has priority for React conversions
2. **Agent 3 (Migration)** has priority for UI refactoring
3. **Agent 4 (Feature)** coordinates with Agent 3
4. **Agent 5 (Cleanup)** waits for all

### Status Updates

Update `REACT_TO_VUE_CONVERSION_TRACKER.md` with:
- ✅ Complete
- 🔄 In Progress
- ⚠️ Needs Attention
- ❌ Blocked

### Communication

- Use tracker file for status
- Note blockers immediately
- Request help if stuck
- Document decisions

---

## Quick Reference

### Shared-UI Components Available

```typescript
// Import from '@taskjuggler/ui'
import {
  Button,
  Card, CardContent, CardHeader, CardTitle, CardFooter,
  Input,
  Label,
  Badge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Checkbox,
  Switch,
  Textarea,
  Tabs, TabsList, TabsTrigger, TabsContent,
  // ... and more
} from '@taskjuggler/ui'
```

### Common Patterns

**Card with Header**:
```vue
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Form Input**:
```vue
<div>
  <Label for="input-id">Label</Label>
  <Input id="input-id" v-model="value" />
</div>
```

**Button Variants**:
```vue
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

---

Good luck! 🚀

