# Mobile UI/UX Specification
## Task Juggler Native Apps

### Version: 1.0
### Date: December 2024

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Visual Design System](#visual-design-system)
3. [Navigation Structure](#navigation-structure)
4. [Screen Specifications](#screen-specifications)
5. [Feature Parity Matrix](#feature-parity-matrix)
6. [Interaction Patterns](#interaction-patterns)
7. [Accessibility](#accessibility)
8. [Platform-Specific Guidelines](#platform-specific-guidelines)

---

## Design Principles

### 1. Consistency with Web
- Maintain visual consistency with web application
- Use similar color schemes and typography
- Preserve core functionality and workflows
- Ensure feature parity where possible

### 2. Mobile-First
- Optimize for touch interactions
- Prioritize thumb-friendly navigation
- Minimize typing with smart defaults
- Leverage native mobile capabilities

### 3. Performance
- Fast load times (< 2 seconds)
- Smooth animations (60fps)
- Efficient data loading
- Offline capability where possible

### 4. Clarity
- Clear visual hierarchy
- Intuitive navigation
- Obvious call-to-actions
- Helpful error messages

---

## Visual Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#2563eb` (RGB: 37, 99, 235)
- Primary Dark: `#1e40af` (RGB: 30, 64, 175)
- Primary Light: `#3b82f6` (RGB: 59, 130, 246)

**Status Colors:**
- Success/Completed: `#10b981` (Green)
- Warning/Pending: `#f59e0b` (Amber)
- Error/Urgent: `#ef4444` (Red)
- Info/Active: `#3b82f6` (Blue)

**Neutral Colors:**
- Background: `#f9fafb` (Gray-50)
- Surface: `#ffffff` (White)
- Text Primary: `#111827` (Gray-900)
- Text Secondary: `#6b7280` (Gray-500)
- Border: `#e5e7eb` (Gray-200)

**Task Status Colors:**
- Pending: `#fef3c7` background, `#92400e` text
- In Progress: `#dbeafe` background, `#1e40af` text
- Completed: `#d1fae5` background, `#065f46` text
- Cancelled: `#fee2e2` background, `#991b1b` text

**Priority Colors:**
- Urgent: `#fee2e2` background, `#991b1b` text
- High: `#fed7aa` background, `#9a3412` text
- Normal: `#dbeafe` background, `#1e40af` text
- Low: `#f3f4f6` background, `#374151` text

### Typography

**iOS (SF Pro):**
- Display: SF Pro Display, 34pt, Bold
- Title 1: SF Pro Display, 28pt, Bold
- Title 2: SF Pro Display, 22pt, Bold
- Title 3: SF Pro Display, 20pt, Semibold
- Headline: SF Pro Text, 17pt, Semibold
- Body: SF Pro Text, 17pt, Regular
- Callout: SF Pro Text, 16pt, Regular
- Subhead: SF Pro Text, 15pt, Regular
- Footnote: SF Pro Text, 13pt, Regular
- Caption: SF Pro Text, 12pt, Regular

**Android (Roboto):**
- Display Large: Roboto, 57sp, Regular
- Display Medium: Roboto, 45sp, Regular
- Display Small: Roboto, 36sp, Regular
- Headline Large: Roboto, 32sp, Regular
- Headline Medium: Roboto, 28sp, Regular
- Headline Small: Roboto, 24sp, Regular
- Title Large: Roboto, 22sp, Medium
- Title Medium: Roboto, 16sp, Medium
- Title Small: Roboto, 14sp, Medium
- Body Large: Roboto, 16sp, Regular
- Body Medium: Roboto, 14sp, Regular
- Body Small: Roboto, 12sp, Regular
- Label Large: Roboto, 14sp, Medium
- Label Medium: Roboto, 12sp, Medium
- Label Small: Roboto, 11sp, Medium

### Spacing System

- XS: 4dp/pt
- SM: 8dp/pt
- MD: 16dp/pt
- LG: 24dp/pt
- XL: 32dp/pt
- 2XL: 48dp/pt

### Component Sizes

- Touch Target: Minimum 44x44pt (iOS) / 48x48dp (Android)
- Button Height: 44pt (iOS) / 48dp (Android)
- Input Height: 44pt (iOS) / 48dp (Android)
- Card Padding: 16dp/pt
- Screen Padding: 16dp/pt

### Shadows & Elevation

**iOS:**
- Small: shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: (0, 2)
- Medium: shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: (0, 4)
- Large: shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: (0, 8)

**Android (Material Design):**
- Level 1: elevation: 2dp
- Level 2: elevation: 4dp
- Level 3: elevation: 8dp
- Level 4: elevation: 12dp

---

## Navigation Structure

### Bottom Tab Navigation (Primary)

1. **Dashboard** (Home icon)
   - Overview of tasks, inbox, recent activity
   - Quick actions

2. **Tasks** (Checklist icon)
   - List of all tasks
   - Filters and search
   - Create new task

3. **Inbox** (Inbox icon)
   - Unprocessed items
   - Badge with unread count

4. **Messages** (Message icon)
   - Direct messages
   - Badge with unread count

5. **More** (Menu icon)
   - Teams
   - Marketplace
   - Settings
   - Profile

### Stack Navigation (Secondary)

**Tasks Stack:**
- Tasks List → Task Detail → Task Edit
- Tasks List → Create Task

**Inbox Stack:**
- Inbox List → Inbox Detail → Create Task from Item

**Messages Stack:**
- Conversations List → Message Thread

**Teams Stack:**
- Teams List → Team Detail → Team Members → Invite

**Marketplace Stack:**
- Marketplace List → Listing Detail → Bid/Assign

---

## Screen Specifications

### 1. Authentication Screens

#### Login Screen
**Layout:**
- Logo/App name at top (centered)
- Email input field
- Password input field
- "Forgot Password?" link
- Login button (full width, primary color)
- "Don't have an account? Sign up" link at bottom

**Features:**
- Email validation
- Password visibility toggle
- Remember me checkbox (optional)
- Loading state on button during login
- Error message display below form

**Parity with Web:**
- Same fields and validation
- Same error handling
- Same authentication flow

#### Register Screen
**Layout:**
- Name input field
- Email input field
- Password input field
- Confirm Password input field
- Register button (full width, primary color)
- "Already have an account? Sign in" link

**Features:**
- Real-time validation
- Password strength indicator
- Terms of service checkbox
- Loading state during registration

#### Forgot Password Screen
**Layout:**
- Email input field
- "Send Reset Link" button
- Back to login link

---

### 2. Dashboard Screen

**Layout:**
- Welcome message with user name
- Task statistics cards (3 columns):
  - Pending count (yellow)
  - Active count (blue)
  - Completed count (green)
- "Create New Task" button (prominent, full width)
- Recent Tasks section:
  - List of 5 most recent tasks
  - Tap to view details
- Quick Actions section:
  - View Inbox
  - View Teams
  - View Marketplace

**Features:**
- Pull-to-refresh
- Real-time updates via push notifications
- Swipe actions on task cards (complete/dismiss)

**Parity with Web:**
- Same statistics display
- Same quick actions
- Same recent tasks list

---

### 3. Tasks Screen

**Layout:**
- Search bar at top
- Filter chips (Status: All, Pending, Active, Completed)
- Filter chips (Priority: All, Urgent, High, Normal)
- Task list (cards):
  - Task title (bold)
  - Description preview (2 lines max)
  - Status badge
  - Priority badge
  - Due date (if set)
  - Owner/Requestor info
  - Action buttons (Complete, Delete)

**Features:**
- Search functionality
- Filter by status and priority
- Pull-to-refresh
- Swipe actions:
  - Swipe right: Complete
  - Swipe left: Delete
- Long press: Multi-select mode
- Empty state with "Create Task" CTA

**Parity with Web:**
- Same filtering options
- Same task information display
- Same actions available

---

### 4. Task Detail Screen

**Layout:**
- Header:
  - Back button
  - Task title
  - Menu button (edit, delete, share)
- Content:
  - Status badge (large, prominent)
  - Priority badge
  - Description (expandable)
  - Due date section
  - Timeline section:
    - Created date
    - Start date (if set)
    - Completion date (if completed)
  - Assignee section:
    - Requestor info
    - Owner info (if assigned)
    - Assign button
  - Messages section:
    - List of messages
    - Input field to send message
  - Actions:
    - Complete button (if not completed)
    - Accept button (if pending assignment)
    - Decline button (if pending assignment)

**Features:**
- Real-time message updates
- Image attachments (if supported)
- Share task via native share sheet
- Export to calendar (iCal/Google Calendar)

**Parity with Web:**
- Same information displayed
- Same actions available
- Same message functionality

---

### 5. Create/Edit Task Screen

**Layout:**
- Form fields:
  - Title (required, text input)
  - Description (text area, optional)
  - Priority (picker: Urgent, High, Normal, Low)
  - Due date (date picker, optional)
  - Assign to (user picker, optional)
  - Tags (optional)
- Action buttons:
  - Cancel button
  - Save button (primary)

**Features:**
- Form validation
- Auto-save draft (optional)
- Rich text editor for description (optional)
- Location picker (if address needed)

**Parity with Web:**
- Same fields
- Same validation rules
- Same options

---

### 6. Inbox Screen

**Layout:**
- Filter tabs:
  - All
  - Unprocessed
  - Processed
- Inbox items list:
  - Type icon (email, SMS, call)
  - Subject/title
  - Preview text
  - Received date/time
  - Status badge
  - Action buttons:
    - Process
    - Dismiss
    - Create Task

**Features:**
- Pull-to-refresh
- Swipe actions:
  - Swipe right: Process
  - Swipe left: Dismiss
- Badge with unprocessed count
- Empty state

**Parity with Web:**
- Same filtering
- Same actions
- Same information display

---

### 7. Inbox Detail Screen

**Layout:**
- Header with back button
- Item type indicator
- Subject/title
- Full content display
- Metadata:
  - Received date/time
  - From (email/phone)
  - Status
- Action buttons:
  - Process (creates task automatically)
  - Create Task (manual task creation)
  - Dismiss

**Features:**
- Rich content rendering
- Link detection
- Phone number detection
- Email detection

**Parity with Web:**
- Same content display
- Same actions

---

### 8. Messages Screen

**Layout:**
- Conversations list:
  - Avatar (user initial or photo)
  - User name
  - Last message preview
  - Timestamp
  - Unread badge (if unread)
- Search bar at top
- Empty state if no conversations

**Features:**
- Pull-to-refresh
- Real-time updates
- Unread count badge

**Parity with Web:**
- Same conversation list
- Same unread indicators

---

### 9. Message Thread Screen

**Layout:**
- Header:
  - Back button
  - User name/avatar
  - Info button
- Messages list (bubbles):
  - Sent messages (right aligned, primary color)
  - Received messages (left aligned, gray)
  - Timestamp for each message
  - Read receipts (if available)
- Input area at bottom:
  - Text input field
  - Send button

**Features:**
- Real-time message updates
- Auto-scroll to bottom
- Image attachments (if supported)
- Typing indicators (if available)

**Parity with Web:**
- Same message display
- Same functionality

---

### 10. Teams Screen

**Layout:**
- Teams list:
  - Team name
  - Member count
  - Description preview
  - Last activity
- "Create Team" button (floating action button)
- Empty state if no teams

**Features:**
- Pull-to-refresh
- Search functionality
- Swipe to leave team

**Parity with Web:**
- Same team information
- Same actions

---

### 11. Team Detail Screen

**Layout:**
- Header:
  - Team name
  - Member count
  - Settings button (if owner)
- Description section
- Members section:
  - List of members with avatars
  - Role badges
  - Remove member button (if owner)
- Tasks section:
  - List of team tasks
  - Filter options
- Actions:
  - Invite Members button
  - Leave Team button (if not owner)

**Features:**
- Real-time member updates
- Task filtering
- Invite via email/phone

**Parity with Web:**
- Same information
- Same management features

---

### 12. Marketplace Screen

**Layout:**
- Filter tabs:
  - All Listings
  - My Listings
  - My Bids
- Search bar
- Listings grid/list:
  - Listing image/icon
  - Title
  - Category badge
  - Budget range
  - Status badge
  - Time remaining
- "Create Listing" button

**Features:**
- Pull-to-refresh
- Category filtering
- Status filtering
- Sort options

**Parity with Web:**
- Same filtering options
- Same listing information

---

### 13. Marketplace Listing Detail Screen

**Layout:**
- Images carousel (if available)
- Title
- Category badge
- Description
- Budget information
- Status
- Requestor info
- Bids section (if applicable)
- Action buttons:
  - Bid button
  - Assign Vendor button
  - Contact button

**Features:**
- Image gallery
- Bid submission form
- Vendor selection

**Parity with Web:**
- Same information display
- Same actions

---

### 14. Settings Screen

**Layout:**
- Profile section:
  - Avatar
  - Name
  - Email
  - Edit profile button
- Account section:
  - Change password
  - Notification settings
  - Privacy settings
- App section:
  - About
  - Terms of Service
  - Privacy Policy
  - Version number
- Logout button (red, at bottom)

**Features:**
- Toggle switches for settings
- Native settings integration (iOS Settings app)

**Parity with Web:**
- Same settings options
- Same profile management

---

## Feature Parity Matrix

| Feature | Web | Mobile | Notes |
|---------|-----|--------|-------|
| **Authentication** |
| Login | ✅ | ✅ | Full parity |
| Register | ✅ | ✅ | Full parity |
| Forgot Password | ✅ | ✅ | Full parity |
| Logout | ✅ | ✅ | Full parity |
| **Tasks** |
| List Tasks | ✅ | ✅ | Full parity |
| Create Task | ✅ | ✅ | Full parity |
| View Task | ✅ | ✅ | Full parity |
| Edit Task | ✅ | ✅ | Full parity |
| Delete Task | ✅ | ✅ | Full parity |
| Complete Task | ✅ | ✅ | Full parity |
| Assign Task | ✅ | ✅ | Full parity |
| Filter Tasks | ✅ | ✅ | Full parity |
| Search Tasks | ✅ | ✅ | Full parity |
| Task Messages | ✅ | ✅ | Full parity |
| Task Timeline | ✅ | ✅ | Full parity |
| **Inbox** |
| View Inbox | ✅ | ✅ | Full parity |
| Process Item | ✅ | ✅ | Full parity |
| Dismiss Item | ✅ | ✅ | Full parity |
| Create Task from Item | ✅ | ✅ | Full parity |
| **Teams** |
| List Teams | ✅ | ✅ | Full parity |
| Create Team | ✅ | ✅ | Full parity |
| View Team | ✅ | ✅ | Full parity |
| Invite Members | ✅ | ✅ | Full parity |
| Leave Team | ✅ | ✅ | Full parity |
| **Messages** |
| View Conversations | ✅ | ✅ | Full parity |
| Send Message | ✅ | ✅ | Full parity |
| View Thread | ✅ | ✅ | Full parity |
| **Marketplace** |
| Browse Listings | ✅ | ✅ | Full parity |
| Create Listing | ✅ | ✅ | Full parity |
| Bid on Listing | ✅ | ✅ | Full parity |
| Assign Vendor | ✅ | ✅ | Full parity |
| **Routing Rules** |
| List Rules | ✅ | ✅ | Full parity |
| Create Rule | ✅ | ⚠️ | Simplified UI |
| Edit Rule | ✅ | ⚠️ | Simplified UI |
| Test Rule | ✅ | ❌ | Web only |
| **Channels** |
| List Channels | ✅ | ✅ | Full parity |
| Create Channel | ✅ | ⚠️ | Simplified flow |
| **Contact Lists** |
| List Contacts | ✅ | ✅ | Full parity |
| Create List | ✅ | ✅ | Full parity |
| Import Contacts | ✅ | ⚠️ | Native contacts integration |

**Legend:**
- ✅ Full parity
- ⚠️ Simplified but functional
- ❌ Not available (web only)

---

## Interaction Patterns

### 1. Pull-to-Refresh
- Standard on all list screens
- Visual feedback during refresh
- Auto-refresh on screen focus

### 2. Swipe Actions
- **Tasks:** Swipe right to complete, swipe left to delete
- **Inbox:** Swipe right to process, swipe left to dismiss
- **Messages:** Swipe left to delete conversation

### 3. Long Press
- **Tasks:** Enter multi-select mode
- **Messages:** Show options menu
- **Teams:** Show team options

### 4. Empty States
- Friendly illustration/icon
- Clear message
- Call-to-action button
- Helpful tips

### 5. Loading States
- Skeleton screens for content
- Progress indicators for actions
- Disable interactions during loading

### 6. Error States
- Clear error message
- Retry button
- Helpful suggestions

### 7. Success Feedback
- Toast notifications for actions
- Haptic feedback (iOS)
- Visual confirmation

---

## Accessibility

### iOS Accessibility
- VoiceOver support
- Dynamic Type support
- High Contrast support
- Reduce Motion support
- Minimum touch target: 44x44pt

### Android Accessibility
- TalkBack support
- Large text support
- High contrast support
- Minimum touch target: 48x48dp

### Common Guidelines
- Semantic labels for all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators
- Screen reader announcements for dynamic content
- Accessible form labels

---

## Platform-Specific Guidelines

### iOS (Human Interface Guidelines)

**Navigation:**
- Use standard iOS navigation patterns
- Back button in navigation bar
- Tab bar at bottom (5 tabs max)

**Components:**
- Use native iOS components where possible
- SF Symbols for icons
- Standard iOS pickers and date pickers

**Gestures:**
- Swipe from left edge: Back navigation
- Pull down: Refresh
- Swipe actions: Contextual actions

**Animations:**
- Smooth transitions (0.3s default)
- Respect Reduce Motion setting
- Spring animations for natural feel

### Android (Material Design)

**Navigation:**
- Use Material Design navigation patterns
- Back button in system navigation
- Bottom navigation bar (5 items max)

**Components:**
- Use Material Design components
- Material Icons
- Material date/time pickers

**Gestures:**
- Swipe from left edge: Open drawer (if applicable)
- Pull down: Refresh
- Swipe actions: Contextual actions

**Animations:**
- Material motion principles
- Elevation changes for depth
- Ripple effects for touch feedback

---

## Responsive Design

### Screen Sizes

**iOS:**
- iPhone SE (375x667)
- iPhone 12/13/14 (390x844)
- iPhone 14 Pro Max (430x932)
- iPad (768x1024)

**Android:**
- Small phones (360x640)
- Standard phones (360x800)
- Large phones (411x891)
- Tablets (600x960+)

### Adaptations

- **Small screens:** Single column layouts, condensed information
- **Large screens:** Multi-column layouts, more information visible
- **Tablets:** Side-by-side views, master-detail patterns

---

## Performance Targets

- **Initial Load:** < 2 seconds
- **Screen Transitions:** < 300ms
- **API Calls:** < 1 second (with loading states)
- **Animations:** 60fps
- **Memory Usage:** < 150MB typical

---

## Testing Checklist

### Functional Testing
- [ ] All API endpoints work correctly
- [ ] Authentication flow works
- [ ] CRUD operations work
- [ ] Filters and search work
- [ ] Real-time updates work
- [ ] Push notifications work

### UI/UX Testing
- [ ] All screens match specification
- [ ] Navigation flows correctly
- [ ] Empty states display correctly
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Animations are smooth

### Accessibility Testing
- [ ] VoiceOver/TalkBack works
- [ ] Dynamic Type works
- [ ] Color contrast is sufficient
- [ ] Touch targets are adequate

### Performance Testing
- [ ] App loads quickly
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Efficient API usage

---

## Implementation Notes

1. **State Management:** Use platform-appropriate state management (ViewModel for Android, ObservableObject for iOS)

2. **API Integration:** Follow the Mobile API Integration Guide for consistent API usage

3. **Offline Support:** Cache frequently accessed data, show cached data when offline

4. **Push Notifications:** Implement push notifications for:
   - New tasks assigned
   - Task status changes
   - New messages
   - New inbox items
   - Team invitations

5. **Deep Linking:** Support deep links for:
   - Task details: `taskjuggler://task/{id}`
   - Team details: `taskjuggler://team/{id}`
   - Message thread: `taskjuggler://messages/{userId}`

6. **Analytics:** Track key user actions:
   - Screen views
   - Task creation/completion
   - Message sending
   - Feature usage

---

## Conclusion

This specification ensures feature parity with the web application while optimizing for mobile platforms. The design follows platform-specific guidelines (iOS HIG and Material Design) while maintaining consistency with the web application's functionality and visual identity.
