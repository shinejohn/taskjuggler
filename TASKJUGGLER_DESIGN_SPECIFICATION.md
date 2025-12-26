# Task Juggler - Design Specification
## Based on Fibonacco Design System v1.0

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web (Vue 3), Android (Kotlin/Compose), iOS (Swift/SwiftUI)

---

## 1. APPLICATION OVERVIEW

### 1.1 Purpose
Task Juggler is a comprehensive task management platform with three core systems:
1. **AI Receptionist** - Receives communications (calls, emails, SMS), extracts task information using AI, and routes based on deterministic user-defined rules
2. **Task Management** - Core task creation, assignment, tracking with Requestor/Do-er model
3. **Marketplace** - Two-sided marketplace with human vendors AND AI tools that can execute work

### 1.2 Key Features
- Multi-channel inbox (Phone, Email, SMS, Web)
- AI-powered task extraction and classification
- Deterministic routing rules (no AI judgment)
- Team collaboration and task assignment
- Marketplace integration (human vendors + AI tools)
- Real-time updates via WebSockets
- Appointment booking system
- Direct messaging

### 1.3 Brand Colors
**Primary:** `#007AFF` (iOS Blue - default, can be customized per organization)  
**Secondary:** `#5856D6` (Purple accent)  
**Success:** `#34C759` (Green)  
**Warning:** `#FF9500` (Orange)  
**Destructive:** `#FF3B30` (Red)

---

## 2. VISUAL DESIGN SYSTEM

### 2.1 Color Palette

#### Light Mode
```css
:root {
  /* Brand Colors */
  --color-primary: #007AFF;
  --color-primary-hover: #0056B3;
  --color-primary-light: rgba(0, 122, 255, 0.1);
  --color-secondary: #5856D6;
  
  /* Semantic Colors */
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-destructive: #FF3B30;
  
  /* Backgrounds */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F5F7;
  --color-bg-tertiary: #E8E8ED;
  --color-surface-glass: rgba(255, 255, 255, 0.72);
  
  /* Text */
  --color-text-primary: #1D1D1F;
  --color-text-secondary: #6E6E73;
  --color-text-tertiary: #86868B;
  
  /* Borders */
  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-subtle: rgba(0, 0, 0, 0.04);
}
```

#### Dark Mode
```css
.dark {
  /* Brand Colors */
  --color-primary: #0A84FF;
  --color-primary-hover: #409CFF;
  --color-primary-light: rgba(10, 132, 255, 0.15);
  --color-secondary: #5E5CE6;
  
  /* Semantic Colors */
  --color-success: #30D158;
  --color-warning: #FF9F0A;
  --color-destructive: #FF453A;
  
  /* Backgrounds */
  --color-bg-primary: #000000;
  --color-bg-secondary: #1C1C1E;
  --color-bg-tertiary: #2C2C2E;
  --color-surface-glass: rgba(44, 44, 46, 0.72);
  
  /* Text */
  --color-text-primary: #F5F5F7;
  --color-text-secondary: #98989D;
  --color-text-tertiary: #6E6E73;
  
  /* Borders */
  --color-border: rgba(255, 255, 255, 0.12);
  --color-border-subtle: rgba(255, 255, 255, 0.06);
}
```

### 2.2 Typography

**Font Stack:** `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display Large | 40px | 700 | Hero headlines, landing pages |
| Display Medium | 32px | 700 | Page titles |
| Headline | 24px | 600 | Card titles, modal headers |
| Title Large | 20px | 600 | Section headers |
| Title Medium | 18px | 500 | List item titles |
| Body Large | 16px | 400 | Primary body text |
| Body Medium | 14px | 400 | Secondary body text |
| Body Small | 12px | 400 | Captions, helper text |
| Label | 12px | 500 | Buttons, tags, badges |

### 2.3 Spacing System
4px base unit system:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px

### 2.4 Border Radius
- `radius-sm`: 6px (small buttons, tags)
- `radius-md`: 10px (input fields, buttons)
- `radius-lg`: 14px (cards, panels)
- `radius-xl`: 20px (large cards, modals)
- `radius-full`: 9999px (pills, avatars)

### 2.5 Glass Surfaces
All cards, panels, and elevated surfaces use glass effect:
- Background: `rgba(255, 255, 255, 0.72)` (light) / `rgba(44, 44, 46, 0.72)` (dark)
- Backdrop blur: `20px`
- Border: `1px solid rgba(255, 255, 255, 0.4)` (light) / `1px solid rgba(255, 255, 255, 0.1)` (dark)
- Shadow: `elevation-1` at rest, `elevation-2` on hover

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Navigation

#### Top Navigation Bar
- **Height:** 64px (desktop), 56px (mobile)
- **Background:** Transparent at top, Glass Subtle when scrolled
- **Sticky positioning** with smooth transition
- **Content:** Logo, primary navigation, user menu, notifications

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  transition: all 300ms cubic-bezier(0.33, 1, 0.68, 1);
}

.navbar--scrolled {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}
```

#### Sidebar Navigation (Desktop)
- **Width:** 240px (collapsed: 64px)
- **Background:** Glass Standard
- **Border:** Right border with subtle color
- **Items:** Icon + Label, active state with accent color

#### Bottom Tab Bar (Mobile)
- **Height:** 83px (includes safe area), 49px content
- **Background:** Glass Standard
- **Icons:** 24px, labels 10px below
- **Active:** Accent color, slight scale (1.05)
- **Inactive:** Secondary text color

### 3.2 Cards

#### Task Card
- **Background:** Glass Standard
- **Padding:** `space-6` (24px)
- **Border Radius:** `radius-lg` (14px)
- **Shadow:** `elevation-1`
- **Hover:** Lift 2px, shadow `elevation-2`
- **Content:** Title, description, assignee avatar, status badge, priority indicator, due date

#### Inbox Item Card
- Similar to Task Card
- **Additional:** Source icon (phone/email/SMS), timestamp, action buttons (Process/Dismiss)

#### Marketplace Vendor Card
- Similar to Task Card
- **Additional:** Vendor type badge (Human/AI), rating, price range, availability status

### 3.3 Buttons

#### Primary Button
- **Background:** `var(--color-primary)`
- **Text:** White
- **Padding:** `12px 20px`
- **Min Height:** 44px
- **Border Radius:** `radius-md` (10px)
- **Font:** Label (12px, 500)
- **Hover:** Darken 10%, lift 1px
- **Active:** Scale to 97%

#### Secondary Button
- **Background:** Transparent
- **Border:** 1px solid `var(--color-primary)`
- **Text:** `var(--color-primary)`
- Same dimensions as Primary

#### Ghost Button
- **Background:** Transparent
- **Border:** None
- **Text:** `var(--color-primary)`
- **Hover:** Background fills with `var(--color-primary-light)`

### 3.4 Input Fields

#### Text Input
- **Background:** `var(--color-bg-primary)` (light) / `var(--color-bg-secondary)` (dark)
- **Border:** 1px solid `var(--color-border)`
- **Border Radius:** `radius-md` (10px)
- **Padding:** `12px 16px`
- **Min Height:** 44px
- **Font:** Body Large (16px) - prevents iOS zoom
- **Focus:** Border color `var(--color-primary)`, ring effect (3px, 15% opacity)

#### Select Dropdown
- Same styling as Text Input
- **Dropdown Menu:** Glass Prominent, `radius-lg`, shadow `elevation-3`

#### Textarea
- Same styling as Text Input
- **Min Height:** 88px
- **Resize:** Vertical only

### 3.5 Status Badges

#### Task Status
- **Pending:** Gray (`#86868B`)
- **Accepted:** Blue (`#007AFF`)
- **In Progress:** Orange (`#FF9500`)
- **Completed:** Green (`#34C759`)
- **Cancelled:** Red (`#FF3B30`)

**Style:**
- Background: Color at 10% opacity
- Text: Full color
- Border: 1px solid color at 30% opacity
- Padding: `4px 12px`
- Border Radius: `radius-full`
- Font: Label (12px, 500)

### 3.6 Modals & Dialogs

#### Center Modal
- **Background:** Glass Prominent (85% opacity)
- **Border Radius:** `radius-2xl` (28px)
- **Max Width:** 480px
- **Padding:** `space-6` (24px)
- **Backdrop:** Black 50% opacity with blur
- **Animation:** Fade + scale up (300ms, ease-out-expo)

#### Bottom Sheet (Mobile)
- **Background:** Glass Prominent
- **Border Radius:** `radius-2xl` top corners only
- **Padding:** `space-6` + safe area bottom
- **Animation:** Slide up from bottom (300ms, ease-out-expo)
- **Handle:** 36px width, 5px height, gray, centered at top

### 3.7 Data Tables

#### Table Container
- **Background:** Glass Standard
- **Border Radius:** `radius-lg`
- **Overflow:** Hidden

#### Table Header
- **Background:** `var(--color-bg-secondary)`
- **Padding:** `space-4`
- **Font:** Title Medium (18px, 500)
- **Border Bottom:** 1px solid `var(--color-border)`

#### Table Row
- **Padding:** `space-4`
- **Border Bottom:** 1px solid `var(--color-border-subtle)`
- **Hover:** Background `var(--color-bg-secondary)`

---

## 4. SCREEN SPECIFICATIONS

### 4.1 Dashboard

**Layout:**
- Hero section with key metrics (cards in grid)
- Recent activity feed
- Quick actions (glass cards)

**Key Metrics Cards:**
- Pending Tasks (count)
- Active Tasks (count)
- Completed Today (count)
- Inbox Items (count)

**Design:**
- Grid: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- Cards: Glass Standard, `radius-lg`, `space-6` padding
- Numbers: Display Medium (32px, 700), accent color
- Labels: Title Medium (18px, 500), secondary text color

### 4.2 Tasks List

**Layout:**
- Filter bar (glass card, sticky)
- Task cards in scrollable list
- Empty state with illustration

**Filter Bar:**
- Status filter (chips)
- Priority filter (chips)
- Assignee filter (dropdown)
- Search input
- Sort dropdown

**Task Card:**
- Title (Headline, 24px)
- Description (Body Medium, 14px, truncated to 2 lines)
- Metadata row: Assignee avatar, status badge, priority indicator, due date
- Actions: Quick actions menu (three dots)

### 4.3 Task Detail

**Layout:**
- Header: Title, status badge, actions
- Content: Description, metadata, comments, activity timeline
- Sidebar: Assignee, due date, priority, related items

**Comments Section:**
- Glass Standard card
- Comment input at bottom
- Comments list with avatars, timestamps
- Real-time updates indicator

### 4.4 Inbox

**Layout:**
- Inbox items list (similar to Tasks List)
- Item detail panel (desktop) or modal (mobile)
- Processing actions: Create Task, Dismiss, Archive

**Inbox Item Card:**
- Source icon (phone/email/SMS) + color indicator
- Sender/From information
- Preview text (truncated)
- Timestamp (relative)
- Status badge (Unread/Processed/Dismissed)
- Quick actions: Process, Dismiss

### 4.5 Routing Rules

**Layout:**
- Rules list with drag-to-reorder
- Rule editor (inline or modal)
- Test rule functionality

**Rule Card:**
- Priority number (badge)
- Conditions list (readable format)
- Actions list (readable format)
- Enabled/Disabled toggle
- Edit/Delete actions

**Rule Editor:**
- Condition builder (dropdowns + inputs)
- Action builder (dropdowns + inputs)
- Live preview of rule logic

### 4.6 Marketplace

**Layout:**
- Vendor grid/list view toggle
- Filter sidebar (desktop) or bottom sheet (mobile)
- Vendor cards with key information

**Vendor Card:**
- Vendor name + type badge (Human/AI)
- Avatar/Logo
- Rating (stars)
- Price range
- Availability status
- Quick actions: View Profile, Request Quote

**Vendor Detail:**
- Full profile information
- Portfolio/examples
- Reviews
- Request Quote form
- Availability calendar

### 4.7 Team Management

**Layout:**
- Team members list
- Invite member form
- Member detail (permissions, activity)

**Member Card:**
- Avatar
- Name + role
- Status (Active/Invited)
- Last active timestamp
- Actions: Edit, Remove

### 4.8 Settings

**Layout:**
- Settings categories (sidebar navigation)
- Settings content area
- Save actions

**Settings Sections:**
- Profile
- Channels (Phone, Email, SMS configuration)
- Notifications
- Billing
- Integrations

---

## 5. INTERACTION PATTERNS

### 5.1 Animations

**Page Transitions:**
- Fade + slide (300ms, ease-out-expo)
- Route transitions handled by Vue Router

**Card Interactions:**
- Hover: Lift 2px, shadow increase (200ms, ease-spring)
- Click: Scale to 99% (150ms, ease-out)
- Drag: Opacity 0.8, scale 1.02

**Modal/Dialog:**
- Backdrop: Fade in (300ms)
- Content: Scale up + fade (300ms, ease-out-expo)

**Loading States:**
- Skeleton screens for content
- Spinner for actions (primary color)
- Progress bars for long operations

### 5.2 Gestures (Mobile)

**Swipe Actions:**
- Swipe right: Quick action (e.g., Complete task)
- Swipe left: Secondary action (e.g., Delete)
- Swipe down: Pull to refresh

**Long Press:**
- Context menu
- Multi-select mode

**Pull to Refresh:**
- Custom indicator with brand colors
- Smooth spring animation

### 5.3 Empty States

**Design:**
- Illustration (SVG, brand colors)
- Headline (Display Small, 28px)
- Description (Body Large, 16px)
- Primary action button
- Secondary action link (optional)

**Examples:**
- No tasks: "Get started by creating your first task"
- No inbox items: "Your inbox is empty"
- No team members: "Invite your first team member"

### 5.4 Error States

**Design:**
- Icon (error/warning)
- Headline (Title Large, 20px)
- Description (Body Medium, 14px)
- Action button (Retry/Go Back)

**Types:**
- Network error
- Validation error
- Not found (404)
- Server error (500)

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640px - 1024px | Two column, sidebar optional |
| Desktop | 1024px - 1440px | Multi-column, sidebar |
| Wide | > 1440px | Max-width containers |

### 6.2 Mobile Adaptations

**Navigation:**
- Top nav: Simplified, hamburger menu
- Bottom tabs: Always visible
- Sidebar: Hidden, accessible via menu

**Cards:**
- Full width
- Reduced padding (`space-4` instead of `space-6`)
- Stacked metadata

**Modals:**
- Bottom sheets instead of center modals
- Full width on mobile

**Tables:**
- Card-based layout instead of table
- Horizontal scroll as fallback

---

## 7. ACCESSIBILITY

### 7.1 Requirements

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

**Touch Targets:**
- Minimum: 44x44px (iOS), 48x48dp (Android)
- Adequate spacing between targets

**Focus States:**
- Visible focus indicators (2px accent ring)
- Keyboard navigation support

**Text Scaling:**
- Support up to 200% without layout breaking
- Use relative units (rem, em)

**Motion:**
- Respect `prefers-reduced-motion`
- Provide static alternatives

### 7.2 Implementation

**ARIA Labels:**
- All interactive elements
- Icon-only buttons
- Form inputs

**Semantic HTML:**
- Proper heading hierarchy
- Form labels
- Landmark regions

**Screen Reader Support:**
- Descriptive alt text
- Live regions for dynamic content
- Skip links

---

## 8. IMPLEMENTATION CHECKLIST

### 8.1 Design System Setup

- [ ] Create CSS custom properties file with all design tokens
- [ ] Set up Tailwind config with design system values
- [ ] Create component library (Button, Card, Input, etc.)
- [ ] Implement glass surface utilities
- [ ] Set up dark mode toggle
- [ ] Create typography scale utilities

### 8.2 Core Components

- [ ] Navigation (Top nav, Sidebar, Bottom tabs)
- [ ] Cards (Task, Inbox, Marketplace)
- [ ] Buttons (Primary, Secondary, Ghost)
- [ ] Forms (Input, Select, Textarea)
- [ ] Modals & Dialogs
- [ ] Status Badges
- [ ] Data Tables
- [ ] Empty States
- [ ] Error States
- [ ] Loading States

### 8.3 Pages

- [ ] Dashboard
- [ ] Tasks List
- [ ] Task Detail
- [ ] Inbox
- [ ] Routing Rules
- [ ] Marketplace
- [ ] Team Management
- [ ] Settings

### 8.4 Interactions

- [ ] Page transitions
- [ ] Card hover/click animations
- [ ] Modal animations
- [ ] Loading states
- [ ] Pull to refresh (mobile)
- [ ] Swipe actions (mobile)

### 8.5 Responsive

- [ ] Mobile breakpoints
- [ ] Tablet breakpoints
- [ ] Desktop breakpoints
- [ ] Touch target sizing
- [ ] Mobile navigation patterns

### 8.6 Accessibility

- [ ] Color contrast verification
- [ ] Focus states
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Text scaling support

---

## 9. PLATFORM-SPECIFIC NOTES

### 9.1 Web (Vue 3)

**Framework:** Vue 3 + Vite  
**UI Library:** Tailwind CSS + Headless UI  
**State:** Pinia  
**Router:** Vue Router 7  
**Real-time:** Laravel Echo + Pusher

**Key Files:**
- `src/assets/css/design-system.css` - Design tokens
- `src/components/ui/` - Base components
- `tailwind.config.js` - Tailwind configuration

### 9.2 Android (Kotlin/Compose)

**Framework:** Jetpack Compose  
**Architecture:** MVVM  
**State:** ViewModel + StateFlow  
**Navigation:** Navigation Compose  
**Networking:** Retrofit + OkHttp

**Key Files:**
- `ui/theme/Color.kt` - Color definitions
- `ui/theme/Typography.kt` - Typography scale
- `ui/components/` - Reusable components

### 9.3 iOS (Swift/SwiftUI)

**Framework:** SwiftUI  
**Architecture:** MVVM  
**State:** @StateObject + @Published  
**Navigation:** NavigationStack  
**Networking:** Alamofire

**Key Files:**
- `Resources/Colors.xcassets` - Color definitions
- `Resources/Fonts/` - Typography
- `Views/Components/` - Reusable components

---

**END OF SPECIFICATION**

*This document should be referenced by all developers and designers working on Task Juggler to ensure visual and interaction consistency across all platforms.*
