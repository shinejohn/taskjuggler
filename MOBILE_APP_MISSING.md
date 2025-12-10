# Mobile App - Missing Features

## Critical Missing Screens (Referenced but Don't Exist)

### 1. Task Detail Screen (`/tasks/[id].tsx`) ❌
- **Status**: Referenced in Dashboard and Tasks screens but doesn't exist
- **Impact**: Users can't view task details when tapping on tasks
- **Needed**: 
  - View full task details
  - Edit task
  - Complete task
  - Delete task
  - View task history/comments

### 2. Task Create Screen (`/tasks/new.tsx`) ❌
- **Status**: Referenced in Tasks screen ("+ New" button) but doesn't exist
- **Impact**: Users can't create new tasks from mobile app
- **Needed**:
  - Form to create new tasks
  - Title, description, priority, due date
  - Assign to team member
  - Add tags

## Missing Feature Pages (Available in Web but Not Mobile)

### 3. Routing Rules Page ❌
- **Status**: Not implemented
- **Web Equivalent**: `/routing` (RulesPage.vue)
- **Needed**:
  - List routing rules
  - Create/edit/delete rules
  - Visual rule builder
  - Test rules

### 4. Team Management Page ❌
- **Status**: Not implemented
- **Web Equivalent**: `/team` (TeamPage.vue)
- **Needed**:
  - List team members
  - Add/edit/delete team members
  - Manage permissions

### 5. Channels Management Page ❌
- **Status**: Not implemented
- **Web Equivalent**: `/channels` (ChannelsPage.vue)
- **Needed**:
  - List channels (phone/email)
  - Provision phone numbers
  - Create email channels
  - Configure channel settings

### 6. Marketplace Page ❌
- **Status**: Not implemented
- **Web Equivalent**: `/marketplace` (MarketplacePage.vue)
- **Needed**:
  - Browse marketplace listings
  - Create listings
  - Place bids
  - Manage vendors

## Missing Stores

### 7. Rules Store ❌
- **Status**: Not created
- **Needed**: For routing rules management

### 8. Team Store ❌
- **Status**: Not created
- **Needed**: For team member management

### 9. Channels Store ❌
- **Status**: Not created
- **Needed**: For channel management

### 10. Marketplace Store ❌
- **Status**: Not created
- **Needed**: For marketplace functionality

## Missing UI/UX Features

### 11. Logout Functionality ❌
- **Status**: No logout button visible
- **Needed**: 
  - Logout button in settings/profile
  - Or in tab navigation

### 12. User Profile/Settings Screen ❌
- **Status**: Not implemented
- **Needed**:
  - View user profile
  - Edit profile
  - Change password
  - App settings
  - Logout option

### 13. Better Error Handling UI ⚠️
- **Status**: Currently using Alert.alert()
- **Needed**: 
  - Toast notification component (like web app)
  - Better error messages
  - Success notifications

### 14. Loading States ⚠️
- **Status**: Basic loading indicators exist
- **Needed**: 
  - Skeleton loaders
  - Better loading UX

### 15. Empty States ⚠️
- **Status**: Basic "No items" text
- **Needed**: 
  - Better empty state designs
  - Action buttons in empty states

## Missing Navigation Features

### 16. Tab Navigation Enhancements ⚠️
- **Status**: Basic tabs exist
- **Needed**:
  - Badge counts (e.g., unread inbox items)
  - Better icons (using emoji currently)
  - Settings/Profile tab

### 17. Deep Linking ❌
- **Status**: Not configured
- **Needed**: 
  - Handle deep links
  - Push notification navigation
  - Share links

## Missing Functionality

### 18. Task Filtering/Search ❌
- **Status**: Not implemented
- **Needed**:
  - Filter by status
  - Filter by priority
  - Search tasks
  - Sort options

### 19. Inbox Filtering ❌
- **Status**: Not implemented
- **Needed**:
  - Filter by status
  - Filter by source type
  - Search inbox items

### 20. Pull-to-Refresh on All Screens ⚠️
- **Status**: Implemented on main screens
- **Needed**: 
  - Ensure all screens have it
  - Better refresh indicators

### 21. Offline Support ❌
- **Status**: Not implemented
- **Needed**:
  - Cache data locally
  - Queue actions when offline
  - Sync when back online

### 22. Push Notification Integration ❌
- **Status**: Setup exists but not integrated with backend
- **Needed**:
  - Send push token to backend
  - Handle notification taps
  - Navigate to relevant screens
  - Badge counts

## Summary

### Critical (Blocks Core Functionality)
1. Task Detail Screen
2. Task Create Screen

### Important (Feature Parity with Web)
3. Routing Rules Page
4. Team Management Page
5. Channels Management Page
6. Marketplace Page
7-10. Missing Stores (Rules, Team, Channels, Marketplace)

### Nice to Have (UX Improvements)
11. Logout functionality
12. User Profile/Settings
13. Better error handling UI
14. Better loading states
15. Empty states
16. Tab navigation enhancements
17. Deep linking
18. Task filtering/search
19. Inbox filtering
20. Complete pull-to-refresh
21. Offline support
22. Push notification backend integration

## Priority Recommendation

**High Priority:**
- Task Detail Screen (users can't view tasks)
- Task Create Screen (users can't create tasks)
- Logout functionality (users can't sign out)

**Medium Priority:**
- Routing Rules, Team, Channels, Marketplace pages (for feature parity)
- Better error handling UI
- User Profile/Settings

**Low Priority:**
- Offline support
- Deep linking
- Advanced filtering/search
