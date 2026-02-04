# Scanner Web UI Components

This directory contains **scanner-specific** UI components that are not part of the shared component library.

## Component Strategy

### Shared Components (from `@taskjuggler/ui`)
All common shadcn components should be imported from the shared-ui package:
- `Button`, `Card`, `Badge`, `Avatar`, `Input`, `Label`
- `Dialog`, `DropdownMenu`, `Select`, `Checkbox`, etc.
- See `shared-ui/src/components/index.ts` for full list

**Import example:**
```vue
import { Button, Card, CardContent, Badge } from '@taskjuggler/ui'
```

### Scanner-Specific Components (local)
These components are kept local because they have scanner-specific functionality or styling:

- **`Modal.vue`** - Custom modal with scanner-specific styling and animations
- **`LoadingSpinner.vue`** - Scanner-branded loading spinner
- **`AvatarWrapper.vue`** - Wrapper around shared-ui Avatar for name-based avatars
- **`HealthScore.vue`** - Scanner-specific health score visualization (in `scanner/` directory)

### Legacy Components (deprecated)
These components are kept for backward compatibility but should be migrated:
- `Badge.vue` - Use `Badge` from `@taskjuggler/ui` instead
- `Avatar.vue` - Use `AvatarWrapper` or `Avatar` from `@taskjuggler/ui` instead

## Migration Guide

When adding new components:
1. Check if it exists in `@taskjuggler/ui` first
2. If it's scanner-specific, add it here
3. If it's generic, consider adding it to `shared-ui` for reuse

