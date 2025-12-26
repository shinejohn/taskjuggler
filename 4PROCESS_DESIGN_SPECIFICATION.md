# 4process.ai - Design Specification
## Based on Fibonacco Design System v1.0

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web (Vue 3), Android (Kotlin/Compose), iOS (Swift/SwiftUI)

---

## 1. APPLICATION OVERVIEW

### 1.1 Purpose
4process.ai is a process/workflow orchestration platform that enables users to:
- Design visual workflows (processes) with multiple steps
- Execute processes automatically or manually
- Track process executions and step completion
- Integrate processes with external systems via triggers
- Monitor process performance and analytics

### 1.2 Key Features
- Visual Process Builder (drag-and-drop workflow designer)
- Process execution engine
- Multiple trigger types (Manual, Task Created, Task Updated, Schedule, Webhook)
- Step types (Action, Condition, Wait, Notification, Integration)
- Execution tracking and history
- Process templates library
- Analytics and reporting

### 1.3 Brand Colors
**Primary:** `#5856D6` (Purple - process/workflow theme)  
**Secondary:** `#007AFF` (Blue accent)  
**Success:** `#34C759` (Green)  
**Warning:** `#FF9500` (Orange)  
**Destructive:** `#FF3B30` (Red)  
**Info:** `#5AC8FA` (Light Blue)

---

## 2. VISUAL DESIGN SYSTEM

### 2.1 Color Palette

#### Light Mode
```css
:root {
  /* Brand Colors */
  --color-primary: #5856D6;
  --color-primary-hover: #4846C6;
  --color-primary-light: rgba(88, 86, 214, 0.1);
  --color-secondary: #007AFF;
  
  /* Semantic Colors */
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-destructive: #FF3B30;
  --color-info: #5AC8FA;
  
  /* Process Step Colors */
  --color-step-action: #5856D6;
  --color-step-condition: #FF9500;
  --color-step-wait: #5AC8FA;
  --color-step-notification: #34C759;
  --color-step-integration: #007AFF;
  
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
  --color-primary: #5E5CE6;
  --color-primary-hover: #6E6CF0;
  --color-primary-light: rgba(94, 92, 230, 0.15);
  --color-secondary: #0A84FF;
  
  /* Semantic Colors */
  --color-success: #30D158;
  --color-warning: #FF9F0A;
  --color-destructive: #FF453A;
  --color-info: #64D2FF;
  
  /* Process Step Colors */
  --color-step-action: #5E5CE6;
  --color-step-condition: #FF9F0A;
  --color-step-wait: #64D2FF;
  --color-step-notification: #30D158;
  --color-step-integration: #0A84FF;
  
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
Same as Fibonacco Design System (see Task Juggler spec)

### 2.3 Spacing System
Same as Fibonacco Design System (4px base unit)

### 2.4 Border Radius
Same as Fibonacco Design System

### 2.5 Glass Surfaces
Same as Fibonacco Design System

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Process Builder Canvas

**Layout:**
- Infinite canvas with zoom/pan controls
- Grid background (subtle, 20px spacing)
- Snap-to-grid enabled
- Minimap (bottom-right corner)

**Canvas Controls:**
- Zoom in/out buttons (top-right)
- Fit to screen button
- Grid toggle
- Undo/Redo buttons

**Design:**
- Background: `var(--color-bg-secondary)`
- Grid: `rgba(0, 0, 0, 0.05)` (light) / `rgba(255, 255, 255, 0.05)` (dark)
- Canvas area: Full viewport minus toolbar

### 3.2 Process Step Nodes

**Node Types:**

#### Action Step
- **Color:** `var(--color-step-action)` (#5856D6)
- **Icon:** Play circle
- **Shape:** Rounded rectangle, `radius-md`
- **Size:** 200px width (min), auto height
- **Content:** Step name, action type, configuration preview

#### Condition Step
- **Color:** `var(--color-step-condition)` (#FF9500)
- **Icon:** Code branch
- **Shape:** Diamond
- **Size:** 120px × 120px
- **Content:** Condition expression preview

#### Wait Step
- **Color:** `var(--color-step-wait)` (#5AC8FA)
- **Icon:** Clock
- **Shape:** Rounded rectangle
- **Size:** 200px width (min)
- **Content:** Wait duration, wait type

#### Notification Step
- **Color:** `var(--color-step-notification)` (#34C759)
- **Icon:** Bell
- **Shape:** Rounded rectangle
- **Size:** 200px width (min)
- **Content:** Notification type, recipient

#### Integration Step
- **Color:** `var(--color-step-integration)` (#007AFF)
- **Icon:** Plug
- **Shape:** Rounded rectangle
- **Size:** 200px width (min)
- **Content:** Integration name, action

**Node Styling:**
- Background: Glass Standard with step color tint (10% opacity)
- Border: 2px solid step color
- Shadow: `elevation-2`
- Hover: Border color brightens, shadow increases
- Selected: Border 3px, shadow `elevation-3`
- Dragging: Opacity 0.8, scale 1.05

**Node Content:**
- Header: Step name (Title Medium, 18px, 600)
- Icon: 24px, step color
- Body: Configuration preview (Body Small, 12px)
- Footer: Step type badge

### 3.3 Connection Lines

**Design:**
- Color: `var(--color-text-tertiary)` with 50% opacity
- Width: 2px
- Arrow: Filled triangle at end
- Hover: Color brightens, width increases to 3px
- Active path: Primary color, 3px width

**Animation:**
- Flow animation (dashed line moving along path) when process is executing
- Color changes based on execution status:
  - Pending: Gray
  - Running: Primary color (animated)
  - Success: Green
  - Error: Red

### 3.4 Step Configuration Panel

**Layout:**
- Right sidebar (desktop) or bottom sheet (mobile)
- Slides in when step is selected
- Glass Prominent background
- Scrollable content

**Sections:**
- Step name input
- Step type selector (if changeable)
- Configuration form (dynamic based on step type)
- Validation errors
- Save/Cancel actions

**Design:**
- Width: 360px (desktop)
- Padding: `space-6`
- Border: Left border (desktop) or top border (mobile), primary color

### 3.5 Process List

**Layout:**
- Grid or list view toggle
- Filter/search bar
- Process cards

**Process Card:**
- Background: Glass Standard
- Padding: `space-6`
- Border Radius: `radius-lg`
- Content:
  - Process name (Headline, 24px)
  - Description (Body Medium, 14px, truncated)
  - Status badge (Draft/Published)
  - Trigger type badge
  - Execution count
  - Last executed timestamp
  - Actions: Edit, Execute, Delete

### 3.6 Execution History

**Layout:**
- Timeline view (vertical)
- Execution cards with status indicators
- Filter by status, date range

**Execution Card:**
- Background: Glass Standard
- Border Left: 4px solid (status color)
- Content:
  - Execution ID
  - Process name
  - Started timestamp
  - Duration
  - Status badge
  - Step completion indicators
  - Actions: View Details, Retry, Cancel

**Status Colors:**
- Running: Primary color
- Completed: Success color
- Failed: Destructive color
- Cancelled: Warning color

### 3.7 Trigger Configuration

**Trigger Types:**

#### Manual
- Icon: Hand
- Description: "Triggered manually by user"
- Configuration: None

#### Task Created
- Icon: Plus circle
- Description: "Triggers when a task is created"
- Configuration: Task filter conditions

#### Task Updated
- Icon: Edit
- Description: "Triggers when a task is updated"
- Configuration: Task filter conditions, field changes

#### Schedule
- Icon: Calendar
- Description: "Triggers on a schedule"
- Configuration: Cron expression or schedule builder

#### Webhook
- Icon: Webhook
- Description: "Triggers via webhook"
- Configuration: Webhook URL, authentication

**Design:**
- Trigger selector: Dropdown with icons
- Configuration form: Dynamic based on trigger type
- Preview: Human-readable description of trigger

---

## 4. SCREEN SPECIFICATIONS

### 4.1 Dashboard

**Layout:**
- Key metrics cards (grid)
- Recent executions list
- Process templates carousel
- Quick actions

**Key Metrics:**
- Total Processes (count)
- Active Executions (count)
- Completed Today (count)
- Success Rate (percentage)

**Recent Executions:**
- Last 10 executions
- Status indicators
- Quick view actions

### 4.2 Process Builder

**Layout:**
- Top toolbar (process name, save, publish, execute)
- Left sidebar: Step palette (draggable step types)
- Center: Canvas (infinite, zoomable)
- Right sidebar: Step configuration panel (when step selected)
- Bottom: Minimap

**Toolbar:**
- Process name input
- Save button
- Publish button (disabled if draft)
- Execute button (test run)
- View mode toggle (Edit/View)

**Step Palette:**
- Draggable step type cards
- Icon + name
- Description on hover
- Categories: Actions, Logic, Timing, Notifications, Integrations

**Canvas:**
- Grid background
- Zoom controls
- Pan via drag
- Multi-select via drag selection
- Context menu on right-click

### 4.3 Process List

**Layout:**
- Filter/search bar (sticky)
- View toggle (Grid/List)
- Process cards grid/list
- Empty state

**Filters:**
- Status (Draft/Published)
- Trigger type
- Created date range
- Tags

**Process Card:**
- Process name
- Description
- Status badge
- Trigger type badge
- Execution stats
- Quick actions menu

### 4.4 Process Detail

**Layout:**
- Process info header
- Execution history tab
- Analytics tab
- Settings tab

**Process Info:**
- Name, description
- Status, trigger type
- Created/updated timestamps
- Actions: Edit, Publish/Unpublish, Execute, Delete

**Execution History:**
- Timeline view
- Filter by status, date
- Execution details modal

**Analytics:**
- Execution count chart
- Success rate chart
- Average duration chart
- Step performance breakdown

### 4.5 Execution Detail

**Layout:**
- Execution info header
- Step-by-step timeline
- Logs/output panel
- Actions

**Step Timeline:**
- Vertical timeline
- Each step shows:
  - Step name
  - Status (Pending/Running/Success/Error)
  - Duration
  - Output/preview
  - Expandable details

**Logs Panel:**
- Console-style output
- Filter by level (Info/Warning/Error)
- Search functionality
- Export option

---

## 5. INTERACTION PATTERNS

### 5.1 Process Builder Interactions

**Adding Steps:**
- Drag from palette to canvas
- Or: Click canvas, select step type from menu
- Step appears at drop location

**Connecting Steps:**
- Click output port of source step
- Click input port of target step
- Connection line appears
- Auto-routing around other steps

**Editing Steps:**
- Click step to select
- Configuration panel opens
- Changes auto-save (or manual save button)

**Deleting Steps:**
- Select step, press Delete key
- Or: Right-click → Delete
- Confirmation dialog if step has connections

**Moving Steps:**
- Drag step to new position
- Connections auto-update
- Snap to grid (optional)

**Zooming:**
- Mouse wheel: Zoom in/out
- Pinch gesture (mobile/tablet)
- Zoom controls in toolbar
- Fit to screen button

**Panning:**
- Click + drag on canvas background
- Arrow keys (with modifier)
- Touch drag (mobile/tablet)

### 5.2 Execution Flow Animation

**Visual Feedback:**
- Active step: Pulsing border, primary color
- Completed step: Green checkmark overlay
- Failed step: Red X overlay
- Connection line: Animated flow (dashed line moving)
- Current path: Highlighted in primary color

**Timing:**
- Animation speed: Configurable (1x, 2x, 5x, 10x)
- Pause/Resume controls
- Step-by-step mode

### 5.3 Empty States

**No Processes:**
- Illustration: Workflow diagram icon
- Headline: "Create your first process"
- Description: "Design automated workflows to streamline your work"
- Action: "Create Process" button

**No Executions:**
- Illustration: Clock icon
- Headline: "No executions yet"
- Description: "Execute a process to see its history here"
- Action: "Execute Process" button

**Empty Canvas:**
- Illustration: Plus icon
- Headline: "Start building your process"
- Description: "Drag steps from the palette or click to add"
- Hint: Step palette highlighted

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints
Same as Fibonacco Design System

### 6.2 Mobile Adaptations

**Process Builder:**
- Step palette: Bottom sheet instead of sidebar
- Configuration panel: Bottom sheet instead of sidebar
- Canvas: Touch gestures for pan/zoom
- Minimap: Hidden or smaller

**Process List:**
- Single column layout
- Simplified cards
- Bottom sheet for filters

**Execution Detail:**
- Stacked timeline
- Collapsible sections
- Bottom sheet for logs

---

## 7. ACCESSIBILITY

Same requirements as Fibonacco Design System:
- Color contrast (4.5:1 minimum)
- Touch targets (44x44px minimum)
- Focus states
- Keyboard navigation
- Screen reader support
- Text scaling

**Additional Considerations:**
- Process builder canvas: Keyboard shortcuts for all actions
- Step nodes: ARIA labels with step type and status
- Connection lines: Described in screen reader context

---

## 8. IMPLEMENTATION CHECKLIST

### 8.1 Design System Setup
- [ ] Create CSS custom properties with process-specific colors
- [ ] Set up Tailwind config
- [ ] Create step type color utilities
- [ ] Implement canvas component library

### 8.2 Core Components
- [ ] Process Builder Canvas
- [ ] Step Nodes (all types)
- [ ] Connection Lines
- [ ] Step Configuration Panel
- [ ] Step Palette
- [ ] Execution Timeline
- [ ] Process Cards
- [ ] Execution Cards

### 8.3 Pages
- [ ] Dashboard
- [ ] Process Builder
- [ ] Process List
- [ ] Process Detail
- [ ] Execution Detail

### 8.4 Interactions
- [ ] Drag and drop (steps, connections)
- [ ] Canvas zoom/pan
- [ ] Step selection/editing
- [ ] Execution flow animation
- [ ] Real-time execution updates

### 8.5 Responsive
- [ ] Mobile process builder
- [ ] Tablet optimizations
- [ ] Touch gestures

### 8.6 Accessibility
- [ ] Keyboard shortcuts
- [ ] Screen reader support
- [ ] Focus management
- [ ] ARIA labels

---

## 9. PLATFORM-SPECIFIC NOTES

### 9.1 Web (Vue 3)
**Canvas Library:** Consider using:
- `vue-flow` or `@xyflow/vue` for process builder
- `konva` or `fabric.js` for custom canvas implementation
- `d3.js` for advanced visualizations

**Key Files:**
- `src/components/ProcessBuilder/Canvas.vue`
- `src/components/ProcessBuilder/StepNode.vue`
- `src/components/ProcessBuilder/ConnectionLine.vue`

### 9.2 Android (Kotlin/Compose)
**Canvas:** Use `Canvas` composable or `Modifier.drawWithContent`
**Drag and Drop:** Use `Modifier.draggable` and `Modifier.detectDragGestures`

### 9.3 iOS (Swift/SwiftUI)
**Canvas:** Use `Canvas` view or `Path` with `Shape`
**Drag and Drop:** Use `onDrag` and `onDrop` modifiers

---

**END OF SPECIFICATION**

*This document should be referenced by all developers and designers working on 4process.ai to ensure visual and interaction consistency across all platforms.*
