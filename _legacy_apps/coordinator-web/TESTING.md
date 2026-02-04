# Testing Guide

This document provides a checklist for testing all pages in the 4calls.ai coordinator web application.

## Prerequisites

1. Ensure the backend API is running on `http://localhost:8000`
2. Start the frontend dev server: `npm run dev`
3. The app will be available at `http://localhost:3003`

## Test Checklist

### 1. Landing Page (`/`)
- [ ] Page loads correctly
- [ ] Navigation links work
- [ ] Responsive design works on mobile/tablet/desktop

### 2. Authentication Pages

#### Login Page (`/login`)
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Successful login redirects to dashboard
- [ ] "Forgot password" link (if implemented)
- [ ] "Sign up" link navigates to register page

#### Register Page (`/register`)
- [ ] Form validation works for all fields
- [ ] Password strength indicator (if implemented)
- [ ] Error messages display correctly
- [ ] Successful registration redirects appropriately
- [ ] "Already have an account?" link navigates to login

### 3. Onboarding Flow (`/onboarding`)
- [ ] All steps are accessible
- [ ] Navigation between steps works
- [ ] Form validation on each step
- [ ] Data persists between steps
- [ ] Final submission creates organization and coordinator
- [ ] Success redirects to dashboard

### 4. Dashboard (`/dashboard`)
- [ ] Metrics cards display correctly
- [ ] Recent calls list loads
- [ ] Today's appointments display
- [ ] Active coordinators show correctly
- [ ] Charts/graphs render (if implemented)
- [ ] Refresh button works
- [ ] Navigation to other pages works

### 5. Coordinators Pages

#### Coordinators List (`/coordinators`)
- [ ] List of coordinators displays
- [ ] Search functionality works (debounced)
- [ ] Filter functionality works
- [ ] Create coordinator button works
- [ ] Pagination works (if implemented)
- [ ] Click on coordinator navigates to detail page

#### Coordinator Detail (`/coordinators/:id`)
- [ ] Coordinator details load correctly
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Related data (calls, appointments) displays
- [ ] Back navigation works

### 6. Contacts Page (`/contacts`)
- [ ] Contact list displays
- [ ] Search functionality works (debounced)
- [ ] Filter by status works
- [ ] Bulk selection works
- [ ] Create contact modal/form works
- [ ] Edit contact works
- [ ] Delete contact works
- [ ] Pagination works
- [ ] Virtual scrolling works for long lists (if implemented)

### 7. Appointments Page (`/appointments`)
- [ ] List view displays appointments
- [ ] Calendar view displays appointments
- [ ] Toggle between views works
- [ ] Create appointment works
- [ ] Edit appointment works
- [ ] Cancel appointment works
- [ ] Delete appointment works
- [ ] Filter by date/status works
- [ ] Navigation (today, previous, next) works
- [ ] Optimistic updates work (instant UI feedback)

### 8. Calls Page (`/calls`)
- [ ] Call history displays
- [ ] Search functionality works (debounced)
- [ ] Filter by direction (inbound/outbound) works
- [ ] Filter by outcome works
- [ ] Date filter works
- [ ] Pagination works
- [ ] View call details works
- [ ] Play recording works (if available)
- [ ] View transcript works
- [ ] Export functionality (if implemented)

### 9. Campaigns Page (`/campaigns`)
- [ ] Campaign list displays
- [ ] Filter tabs work (all, active, scheduled, etc.)
- [ ] Create campaign works
- [ ] Edit campaign works
- [ ] View campaign details works
- [ ] Start campaign works
- [ ] Pause campaign works
- [ ] Delete campaign works
- [ ] Campaign stats display correctly
- [ ] Pagination works

### 10. Analytics Page (`/analytics`)
- [ ] Charts/graphs render correctly
- [ ] Date range selector works
- [ ] Metrics display correctly
- [ ] Coordinator performance data displays
- [ ] Export functionality works (if implemented)
- [ ] Data updates when filters change

### 11. Billing Page (`/billing`)
- [ ] Subscription details display
- [ ] Payment method management works
- [ ] Update payment method works
- [ ] Billing history displays
- [ ] Download invoice works (if implemented)
- [ ] Cancel subscription works
- [ ] Upgrade/downgrade subscription works (if implemented)

### 12. Settings Page (`/settings`)
- [ ] All 6 sub-pages are accessible:
  - [ ] Business Profile
  - [ ] Phone Numbers
  - [ ] Integrations
  - [ ] Team Members
  - [ ] Security
  - [ ] API Access
- [ ] Navigation sidebar works
- [ ] Form submissions work
- [ ] Data saves correctly
- [ ] Validation works

## Performance Testing

### Service Worker
- [ ] Service worker registers in production build
- [ ] Offline mode works (cache static assets)
- [ ] API responses cache correctly
- [ ] Cache updates on new version

### Request Optimization
- [ ] Debounced search reduces API calls
- [ ] Request cancellation works (navigate away during request)
- [ ] Stale requests are cancelled automatically
- [ ] API response caching works

### Optimistic Updates
- [ ] Create appointment shows instantly
- [ ] Rollback works on error
- [ ] UI updates before API response

### Performance Monitoring
- [ ] Web Vitals are tracked (check browser console)
- [ ] API call durations are logged
- [ ] Performance metrics export works

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

Test on:
- [ ] Mobile (320px - 640px)
- [ ] Tablet (641px - 1024px)
- [ ] Desktop (1025px+)

## Error Handling

- [ ] Network errors display user-friendly messages
- [ ] 401 errors redirect to login
- [ ] 404 errors show appropriate page
- [ ] 500 errors show error message
- [ ] Form validation errors display correctly

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility (if applicable)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG standards

## Notes

- Use browser DevTools to monitor network requests
- Check console for errors or warnings
- Test with slow network (throttle in DevTools)
- Test with offline mode enabled
- Verify all API calls are properly cached/cancelled

