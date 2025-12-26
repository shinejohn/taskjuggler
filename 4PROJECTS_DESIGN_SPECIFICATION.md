# 4projects.ai - Design Specification
## Based on Fibonacco Design System v1.0

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web (Vue 3), Android (Kotlin/Compose), iOS (Swift/SwiftUI)

---

## 1. APPLICATION OVERVIEW

### 1.1 Purpose
4projects.ai is a comprehensive project management platform that enables teams to:
- Organize work into projects with tasks, questions, and problems
- Track project progress and milestones
- Collaborate with team members
- Manage sprints and iterations
- Integrate with external systems via webhooks

### 1.2 Key Features
- Project management (CRUD, stats, analytics)
- Task management (nested under projects, state transitions)
- Questions & Answers system with voting
- Problems tracking and resolution workflow
- Sprint/milestone management
- Team/member management
- Kanban board view
- Timeline/Gantt view
- Webhook integrations (email, SMS, voice, Slack)

### 1.3 Brand Colors
**Primary:** `#007AFF` (Blue - project/collaboration theme)  
**Secondary:** `#5856D6` (Purple accent)  
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
  --color-primary: #007AFF;
  --color-primary-hover: #0056B3;
  --color-primary-light: rgba(0, 122, 255, 0.1);
  --color-secondary: #5856D6;
  
  /* Semantic Colors */
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-destructive: #FF3B30;
  --color-info: #5AC8FA;
  
  /* Project Status Colors */
  --color-status-active: #007AFF;
  --color-status-on-hold: #FF9500;
  --color-status-completed: #34C759;
  --color-status-archived: #86868B;
  
  /* Task Priority Colors */
  --color-priority-low: #5AC8FA;
  --color-priority-medium: #FF9500;
  --color-priority-high: #FF3B30;
  --color-priority-critical: #8B0000;
  
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
  --color-info: #64D2FF;
  
  /* Project Status Colors */
  --color-status-active: #0A84FF;
  --color-status-on-hold: #FF9F0A;
  --color-status-completed: #30D158;
  --color-status-archived: #6E6E73;
  
  /* Task Priority Colors */
  --color-priority-low: #64D2FF;
  --color-priority-medium: #FF9F0A;
  --color-priority-high: #FF453A;
  --color-priority-critical: #FF6B6B;
  
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
Same as Fibonacco Design System

### 2.3 Spacing System
Same as Fibonacco Design System (4px base unit)

### 2.4 Border Radius
Same as Fibonacco Design System

### 2.5 Glass Surfaces
Same as Fibonacco Design System

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Project Card

**Layout:**
- Glass Standard background
- Padding: `space-6`
- Border Radius: `radius-lg`
- Hover: Lift 2px, shadow increase

**Content:**
- Project name (Headline, 24px)
- Project code (Body Small, 12px, secondary color)
- Description (Body Medium, 14px, truncated to 2 lines)
- Status badge (top-right)
- Progress bar (if progress_percentage available)
- Metadata row: Task count, member count, last updated
- Quick actions: View, Edit, Archive

**Progress Bar:**
- Height: 4px
- Background: `var(--color-bg-tertiary)`
- Fill: `var(--color-primary)`
- Border Radius: `radius-full`
- Smooth animation on load

### 3.2 Kanban Board

**Layout:**
- Horizontal scrollable columns
- Each column: Status name + task count
- Tasks as cards within columns
- Drag and drop between columns

**Column:**
- Background: Glass Subtle
- Width: 320px (min)
- Padding: `space-4`
- Border Radius: `radius-lg`
- Header: Status name (Title Large, 20px) + count badge
- Content: Scrollable task cards list

**Task Card (Kanban):**
- Background: Glass Standard
- Padding: `space-4`
- Border Radius: `radius-md`
- Border Left: 4px solid (priority color)
- Content:
  - Task title (Title Medium, 18px)
  - Assignee avatar (small, 24px)
  - Priority indicator
  - Due date (if set)
  - Labels/tags
- Hover: Lift 1px, shadow increase
- Dragging: Opacity 0.8, scale 1.02

### 3.3 Task Card (List View)

**Layout:**
- Glass Standard background
- Padding: `space-4`
- Border Radius: `radius-md`
- Border Left: 4px solid (priority color)

**Content:**
- Title (Title Medium, 18px)
- Description (Body Medium, 14px, truncated)
- Metadata row:
  - Assignee avatar + name
  - Status badge
  - Priority badge
  - Due date
  - Labels
- Actions: Quick menu (three dots)

### 3.4 Timeline/Gantt View

**Layout:**
- Horizontal timeline (weeks/months)
- Vertical task rows
- Task bars showing duration
- Dependencies (lines connecting tasks)
- Today indicator (vertical line)

**Task Bar:**
- Height: 24px
- Background: Priority color (with opacity)
- Border: 1px solid (priority color, full opacity)
- Border Radius: `radius-sm`
- Label: Task name (truncated)
- Hover: Tooltip with full details

**Today Indicator:**
- Vertical line: 2px solid `var(--color-primary)`
- Label: "Today" badge

**Dependency Line:**
- Color: `var(--color-text-tertiary)` (50% opacity)
- Width: 2px
- Arrow: At end of line

### 3.5 Question Card

**Layout:**
- Glass Standard background
- Padding: `space-6`
- Border Radius: `radius-lg`

**Content:**
- Question title (Headline, 24px)
- Question body (Body Large, 16px)
- Author avatar + name + timestamp
- Vote count (large, centered)
- Vote buttons (up/down)
- Answer count badge
- Tags/labels
- Actions: Answer, Edit, Delete

**Vote Buttons:**
- Circular buttons
- Size: 40px
- Icon: Chevron up/down
- Active state: Primary color fill
- Inactive: Transparent with border

### 3.6 Problem Card

**Layout:**
- Similar to Question Card
- Additional: Severity badge, status badge

**Severity Badges:**
- Low: Info color
- Medium: Warning color
- High: Destructive color
- Critical: Dark red

**Status Badges:**
- Open: Warning color
- In Progress: Primary color
- Resolved: Success color
- Closed: Secondary text color

### 3.7 Sprint Card

**Layout:**
- Glass Standard background
- Padding: `space-6`
- Border Radius: `radius-lg`

**Content:**
- Sprint name (Headline, 24px)
- Date range (Body Medium, 14px)
- Progress bar (task completion)
- Task count (planned vs completed)
- Velocity indicator
- Actions: View, Edit, Complete

### 3.8 Member Avatar

**Design:**
- Circular
- Size variants: 24px, 32px, 40px, 48px
- Border: 2px solid `var(--color-bg-primary)`
- Background: Gradient based on user ID hash
- Fallback: Initials (if no avatar image)
- Online indicator: Green dot (bottom-right, 8px)

---

## 4. SCREEN SPECIFICATIONS

### 4.1 Dashboard

**Layout:**
- Key metrics cards (grid)
- Recent projects carousel
- Active projects list
- Recent activity feed

**Key Metrics:**
- Active Projects (count)
- Tasks This Week (count)
- Completed Tasks (count)
- Team Members (count)

**Recent Projects:**
- Horizontal scrollable carousel
- Project cards (simplified)
- "View All" link

**Recent Activity:**
- Timeline of recent actions
- Task created, completed, assigned
- Question answered
- Problem resolved
- Grouped by date

### 4.2 Projects List

**Layout:**
- Filter/search bar (sticky)
- View toggle (Grid/List)
- Project cards grid/list
- Empty state

**Filters:**
- Status (Active/On Hold/Completed/Archived)
- Created date range
- Tags
- Team members

**Project Card:**
- Name, code, description
- Status badge
- Progress bar
- Task/member counts
- Last updated timestamp
- Quick actions

### 4.3 Project Detail

**Layout:**
- Project header (name, status, actions)
- Tabs: Overview, Tasks, Questions, Problems, Sprints, Settings
- Content area

**Overview Tab:**
- Project stats (cards)
- Progress chart
- Recent activity
- Team members list
- Quick actions

**Tasks Tab:**
- View toggle (List/Kanban/Timeline)
- Filter bar
- Tasks list/board/timeline

**Questions Tab:**
- Questions list
- Filter by status, tags
- Create question button

**Problems Tab:**
- Problems list
- Filter by severity, status
- Create problem button

**Sprints Tab:**
- Sprints list
- Active sprint highlight
- Create sprint button

### 4.4 Task Detail

**Layout:**
- Task header (title, status, priority, assignee)
- Content tabs: Details, Comments, Activity
- Sidebar: Metadata, related items

**Details Tab:**
- Description (rich text)
- Due date
- Labels/tags
- Dependencies
- Attachments
- Time tracking (if enabled)

**Comments Tab:**
- Comments list (newest first)
- Comment input at bottom
- @mentions support
- File attachments

**Activity Tab:**
- Timeline of task changes
- State transitions
- Assignee changes
- Comment activity

### 4.5 Kanban Board View

**Layout:**
- Full-screen board
- Horizontal scrollable columns
- Column headers (status + count)
- Task cards in columns
- Drag and drop enabled

**Column States:**
- To Do
- In Progress
- In Review
- Done

**Customization:**
- Add/remove columns
- Rename columns
- Reorder columns
- Column width adjustment

### 4.6 Timeline View

**Layout:**
- Horizontal timeline (configurable: days/weeks/months)
- Vertical task rows
- Task bars showing duration
- Dependencies
- Milestones (vertical markers)

**Controls:**
- Zoom in/out
- Pan left/right
- Today button
- Fit to screen button
- Filter tasks

**Task Bar:**
- Shows task name
- Color: Priority color
- Hover: Tooltip with details
- Click: Open task detail

### 4.7 Question Detail

**Layout:**
- Question header (title, author, timestamp)
- Question body
- Vote count + buttons
- Answers list (sorted by votes)
- Answer input

**Answer Card:**
- Answer body
- Author avatar + name
- Timestamp
- Vote count + buttons
- Mark as accepted button (question author only)
- Edit/Delete actions

### 4.8 Problem Detail

**Layout:**
- Similar to Question Detail
- Additional: Severity badge, status badge
- Resolution notes section
- Related tasks/questions

---

## 5. INTERACTION PATTERNS

### 5.1 Drag and Drop

**Kanban Board:**
- Drag task card between columns
- Visual feedback: Ghost image, column highlight
- Drop zone indicator
- Auto-save on drop

**Timeline View:**
- Drag task bar to change dates
- Drag task bar edges to change duration
- Visual feedback: Preview position/duration

**Project List:**
- Drag projects to reorder (if custom ordering enabled)

### 5.2 Real-time Updates

**WebSocket Events:**
- Task created/updated/completed
- Comment added
- Question answered
- Problem status changed
- Member joined/left

**Visual Feedback:**
- Toast notifications
- Inline updates (no page refresh)
- Activity indicators
- Badge count updates

### 5.3 Quick Actions

**Context Menus:**
- Right-click on task/project/question/problem
- Quick actions menu (glass card)
- Actions: Edit, Delete, Duplicate, Archive, etc.

**Keyboard Shortcuts:**
- `N`: New task/project
- `S`: Search
- `F`: Filter
- `E`: Edit selected
- `Delete`: Delete selected
- `Esc`: Close modal/menu

### 5.4 Empty States

**No Projects:**
- Illustration: Folder icon
- Headline: "Create your first project"
- Description: "Organize your work into projects"
- Action: "Create Project" button

**No Tasks:**
- Illustration: Checkmark icon
- Headline: "No tasks yet"
- Description: "Add tasks to track your work"
- Action: "Create Task" button

**No Questions:**
- Illustration: Question mark icon
- Headline: "No questions yet"
- Description: "Ask questions to get answers from your team"
- Action: "Ask Question" button

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints
Same as Fibonacco Design System

### 6.2 Mobile Adaptations

**Projects List:**
- Single column layout
- Simplified cards
- Bottom sheet for filters

**Project Detail:**
- Tabs become bottom navigation
- Sidebar becomes bottom sheet
- Full-width content

**Kanban Board:**
- Single column at a time
- Swipe between columns
- Horizontal scroll indicator

**Timeline View:**
- Vertical timeline (mobile-optimized)
- Simplified task bars
- Touch gestures for zoom/pan

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
- Drag and drop: Keyboard alternatives (move up/down, change status)
- Timeline: Screen reader descriptions of task positions
- Kanban: Column announcements when moving tasks

---

## 8. IMPLEMENTATION CHECKLIST

### 8.1 Design System Setup
- [ ] Create CSS custom properties with project-specific colors
- [ ] Set up Tailwind config
- [ ] Create status/priority color utilities
- [ ] Implement kanban board component library

### 8.2 Core Components
- [ ] Project Card
- [ ] Task Card (List/Kanban variants)
- [ ] Kanban Board
- [ ] Timeline/Gantt View
- [ ] Question Card
- [ ] Problem Card
- [ ] Sprint Card
- [ ] Member Avatar
- [ ] Progress Bar
- [ ] Vote Buttons

### 8.3 Pages
- [ ] Dashboard
- [ ] Projects List
- [ ] Project Detail
- [ ] Task Detail
- [ ] Kanban Board View
- [ ] Timeline View
- [ ] Question Detail
- [ ] Problem Detail

### 8.4 Interactions
- [ ] Drag and drop (kanban, timeline)
- [ ] Real-time updates
- [ ] Quick actions (context menus)
- [ ] Keyboard shortcuts
- [ ] Filter/search

### 8.5 Responsive
- [ ] Mobile project list
- [ ] Mobile kanban board
- [ ] Mobile timeline
- [ ] Touch gestures

### 8.6 Accessibility
- [ ] Keyboard alternatives for drag/drop
- [ ] Screen reader support
- [ ] Focus management
- [ ] ARIA labels

---

## 9. PLATFORM-SPECIFIC NOTES

### 9.1 Web (Vue 3)
**Kanban Library:** Consider using:
- `vue-draggable` or `@vueuse/core` useDraggable
- Custom implementation with native drag API

**Timeline Library:** Consider using:
- `d3.js` for custom timeline
- `vis-timeline` or similar library

**Key Files:**
- `src/components/KanbanBoard.vue`
- `src/components/KanbanColumn.vue`
- `src/components/TaskCard.vue`
- `src/components/TimelineView.vue`

### 9.2 Android (Kotlin/Compose)
**Drag and Drop:** Use `Modifier.draggable` and `Modifier.detectDragGestures`
**Kanban:** Custom implementation with `LazyRow` and `LazyColumn`

### 9.3 iOS (Swift/SwiftUI)
**Drag and Drop:** Use `onDrag` and `onDrop` modifiers
**Kanban:** Custom implementation with `ScrollView` and `HStack`

---

**END OF SPECIFICATION**

*This document should be referenced by all developers and designers working on 4projects.ai to ensure visual and interaction consistency across all platforms.*
