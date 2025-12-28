# TaskJuggler User Manual
## Complete Guide to Task Management and Collaboration

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web Application

---

## TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Tasks](#tasks)
5. [Inbox](#inbox)
6. [Routing Rules](#routing-rules)
7. [Teams](#teams)
8. [Messages](#messages)
9. [Channels](#channels)
10. [Marketplace](#marketplace)
11. [Contacts](#contacts)
12. [Settings](#settings)
13. [UI Specifications](#ui-specifications)

---

## INTRODUCTION

TaskJuggler is a comprehensive task management and collaboration platform designed to help teams organize, delegate, and track work efficiently. Built with modern design principles and powered by AI, TaskJuggler streamlines workflow management for individuals and teams.

### Key Features

- **Task Management**: Create, assign, and track tasks with full lifecycle management
- **Smart Inbox**: Centralized inbox for all incoming tasks and messages
- **Routing Rules**: Automated task routing based on customizable rules
- **Team Collaboration**: Team workspaces with shared tasks and communication
- **Real-time Messaging**: Direct messages and channel-based communication
- **Marketplace**: Buy and sell services, find vendors
- **Contact Management**: Organize contacts into lists for easy management

---

## GETTING STARTED

### Creating an Account

1. Navigate to the TaskJuggler login page
2. Click **"Sign Up"** or **"Create Account"**
3. Fill in your information:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: Create a strong password (minimum 8 characters)
   - **Confirm Password**: Re-enter your password
4. Click **"Create Account"**
5. Verify your email address (if required)

### Logging In

1. Navigate to the TaskJuggler login page
2. Enter your **Email** and **Password**
3. Click **"Login"**
4. You'll be redirected to your Dashboard

### Forgot Password

1. Click **"Forgot Password?"** on the login page
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email for password reset instructions
5. Follow the link to reset your password

---

## DASHBOARD

### Overview

The Dashboard is your central command center, providing an overview of your tasks, team activity, and important updates.

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] TaskJuggler                    [User Avatar] [Menu]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Welcome Back, [Name]                                │   │
│  │  Here's what's happening today                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Tasks   │  │  Teams   │  │ Messages │  │ Inbox    │   │
│  │    12    │  │    3     │  │    5     │  │    8     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  My Tasks                                            │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  [Task Card 1]                                       │   │
│  │  [Task Card 2]                                       │   │
│  │  [Task Card 3]                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Recent Activity                                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  • Task "Design Logo" completed                     │   │
│  │  • New message from John                           │   │
│  │  • Team "Marketing" added new member                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Elements

- **Stats Cards**: Quick overview of tasks, teams, messages, and inbox items
- **My Tasks**: List of your assigned tasks with status indicators
- **Recent Activity**: Timeline of recent actions and updates
- **Quick Actions**: Buttons to create new tasks, join teams, etc.

### Features

- **Task Overview**: See all your tasks at a glance
- **Activity Feed**: Track recent changes and updates
- **Quick Navigation**: Access all major features from one place
- **Notifications**: View unread messages and task updates

---

## TASKS

### Creating a Task

1. Click **"Tasks"** in the navigation menu
2. Click **"New Task"** button (top right)
3. Fill in task details:
   - **Title**: Task name (required)
   - **Description**: Detailed task description
   - **Assignee**: Select team member to assign
   - **Due Date**: Set deadline
   - **Priority**: Low, Medium, High, Critical
   - **Status**: Pending, In Progress, Completed, Cancelled
   - **Tags**: Add tags for organization
4. Click **"Create Task"**

### Task List View

```
┌─────────────────────────────────────────────────────────────┐
│  Tasks                                    [+ New Task]       │
├─────────────────────────────────────────────────────────────┤
│  [Filter] [Search...]                                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Status Badge] Task Title                          │   │
│  │  Description preview text...                         │   │
│  │  👤 Assigned to: John Doe  📅 Due: Dec 30           │   │
│  │  [Priority Badge] [Tags]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Status Badge] Another Task                         │   │
│  │  Description preview text...                         │   │
│  │  👤 Assigned to: Jane Smith  📅 Due: Jan 5          │   │
│  │  [Priority Badge] [Tags]                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Task Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Tasks                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Task Title                                                  │
│  [Status Badge] [Priority Badge]                             │
│                                                               │
│  Description:                                                │
│  Full task description goes here...                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Details                                             │   │
│  │  • Assignee: John Doe                                │   │
│  │  • Due Date: December 30, 2025                       │   │
│  │  • Created: December 15, 2025                        │   │
│  │  • Tags: Design, Urgent                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Comments                                            │   │
│  │  [Comment Input]                                     │   │
│  │  [Post Comment]                                      │   │
│  │                                                       │   │
│  │  • John Doe: Working on this now                     │   │
│  │    2 hours ago                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Edit Task] [Delete Task]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Task Statuses

- **Pending**: Task created but not started
- **In Progress**: Task is actively being worked on
- **Completed**: Task finished successfully
- **Cancelled**: Task cancelled or no longer needed

### Task Priorities

- **Low**: Nice to have, no urgency
- **Medium**: Normal priority
- **High**: Important, needs attention soon
- **Critical**: Urgent, requires immediate action

### Filtering and Searching

- **Filter by Status**: Show only tasks with specific status
- **Filter by Priority**: Show only high-priority tasks
- **Filter by Assignee**: Show tasks assigned to specific person
- **Search**: Search tasks by title or description
- **Sort**: Sort by due date, priority, or creation date

---

## INBOX

### Overview

The Inbox is your central hub for all incoming tasks, messages, and notifications that need your attention.

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Inbox                                                       │
├─────────────────────────────────────────────────────────────┤
│  [Filter: All] [Filter: Unread] [Filter: Tasks]            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Unread Badge] New Task Assignment                 │   │
│  │  You've been assigned: "Design Logo"                │   │
│  │  From: John Doe  •  2 hours ago                      │   │
│  │  [Accept] [Decline] [View Task]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Task Update                                         │   │
│  │  "Website Redesign" status changed to Completed      │   │
│  │  From: System  •  5 hours ago                        │   │
│  │  [View Task]                                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Inbox Actions

- **Accept**: Accept a task assignment
- **Decline**: Decline a task assignment
- **View Task**: Navigate to full task details
- **Dismiss**: Remove item from inbox
- **Create Task**: Convert inbox item into a task

### Processing Inbox Items

1. Click on an inbox item to view details
2. Choose an action:
   - **Accept**: Accept the task/message
   - **Decline**: Decline the assignment
   - **Create Task**: Convert to a task
   - **Dismiss**: Remove from inbox
3. Items are automatically archived after processing

---

## ROUTING RULES

### Overview

Routing Rules automate task assignment based on customizable conditions. Set up rules to automatically route tasks to the right team members.

### Creating a Routing Rule

1. Navigate to **"Routing"** in the menu
2. Click **"New Rule"**
3. Configure rule:
   - **Rule Name**: Descriptive name
   - **Conditions**: Set when rule applies
     - Task title contains keywords
     - Task has specific tags
     - Task priority level
     - Task type
   - **Actions**: What happens when rule matches
     - Assign to user/team
     - Set priority
     - Add tags
     - Set due date
4. Set **Priority** (rules execute in priority order)
5. Click **"Create Rule"**

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Routing Rules                          [+ New Rule]         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Rule: High Priority → Marketing Team               │   │
│  │  If: Priority = High AND Tags contains "marketing" │   │
│  │  Then: Assign to Marketing Team, Set Due Date +7d  │   │
│  │  Priority: 1  [Edit] [Delete] [Test]               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Rule: Design Tasks → Design Team                    │   │
│  │  If: Title contains "design" OR Tags = "design"     │   │
│  │  Then: Assign to Design Team                        │   │
│  │  Priority: 2  [Edit] [Delete] [Test]               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Testing Rules

1. Click **"Test"** on any rule
2. Enter a sample task title/description
3. View how the rule would process the task
4. Adjust rule conditions as needed

### Rule Priority

Rules execute in priority order (1 = highest). When multiple rules match, the highest priority rule takes precedence.

---

## TEAMS

### Overview

Teams allow you to organize users into groups for collaborative work. Each team has its own workspace with shared tasks and communication.

### Creating a Team

1. Navigate to **"Teams"** in the menu
2. Click **"Create Team"**
3. Fill in team details:
   - **Team Name**: Name of the team
   - **Description**: Team purpose/description
   - **Members**: Add team members by email
4. Click **"Create Team"**

### Team List View

```
┌─────────────────────────────────────────────────────────────┐
│  Teams                                    [+ Create Team]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Marketing Team                                      │   │
│  │  5 members  •  12 active tasks                       │   │
│  │  [View Team]                                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Design Team                                         │   │
│  │  3 members  •  8 active tasks                        │   │
│  │  [View Team]                                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Team Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Teams                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Marketing Team                                              │
│  Team workspace for marketing activities                    │   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Members (5)                                          │   │
│  │  [Avatar] John Doe - Owner                            │   │
│  │  [Avatar] Jane Smith                                  │   │
│  │  [Avatar] Bob Johnson                                 │   │
│  │  [+ Add Member]                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Team Tasks (12)                                      │   │
│  │  [Task Card 1]                                        │   │
│  │  [Task Card 2]                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Invite Members] [Team Settings]                           │
└─────────────────────────────────────────────────────────────┘
```

### Team Features

- **Member Management**: Add/remove team members
- **Team Tasks**: View all tasks assigned to the team
- **Team Messages**: Team-specific communication
- **Invitations**: Invite members via email with invite codes
- **Permissions**: Set member roles (Owner, Admin, Member)

---

## MESSAGES

### Overview

Messages enable direct communication between users. Send and receive messages, share files, and collaborate in real-time.

### Direct Messages

1. Navigate to **"Messages"** in the menu
2. Click **"New Message"** or select a contact
3. Type your message
4. Click **"Send"** or press Enter

### Messages UI

```
┌─────────────────────────────────────────────────────────────┐
│  Messages                                    [+ New Message] │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │ Conversations│  │  Conversation with John Doe        │  │
│  ├──────────────┤  ├────────────────────────────────────┤  │
│  │ John Doe     │  │                                     │  │
│  │ [Unread 3]   │  │  John: Hey, can you help with...   │  │
│  ├──────────────┤  │  2 hours ago                         │  │
│  │ Jane Smith   │  │                                     │  │
│  │              │  │  You: Sure, what do you need?       │  │
│  │              │  │  1 hour ago                         │  │
│  │              │  │                                     │  │
│  │              │  │  [Message Input]                   │  │
│  │              │  │  [Send]                            │  │
│  └──────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Message Features

- **Real-time Updates**: Messages appear instantly
- **Unread Indicators**: See unread message counts
- **File Attachments**: Attach files to messages
- **Message History**: View conversation history
- **Search**: Search messages by content

---

## CHANNELS

### Overview

Channels are topic-based communication spaces where team members can discuss specific subjects, share updates, and collaborate.

### Channel UI

```
┌─────────────────────────────────────────────────────────────┐
│  Channels                                    [+ New Channel] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  # general                                           │   │
│  │  Team-wide announcements and discussions             │   │
│  │  15 members  •  Last active: 2 hours ago             │   │
│  │  [Join Channel]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  # design                                            │   │
│  │  Design team discussions                             │   │
│  │  8 members  •  Last active: 5 minutes ago            │   │
│  │  [Join Channel]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Channel Features

- **Topic-based**: Organize discussions by topic
- **Member Management**: Control who can join
- **Message Threading**: Reply to specific messages
- **Notifications**: Get notified of new messages
- **Search**: Search channel messages

---

## MARKETPLACE

### Overview

The Marketplace connects buyers and sellers of services. Post listings, browse available services, and manage transactions.

### Marketplace UI

```
┌─────────────────────────────────────────────────────────────┐
│  Marketplace                                  [+ Post Listing]│
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Filter: All] [Filter: Design] [Filter: Dev]   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Logo Design Service                                │   │
│  │  Professional logo design for your brand            │   │
│  │  $500  •  ⭐ 4.8 (24 reviews)                       │   │
│  │  By: Design Studio                                  │   │
│  │  [View Details] [Contact Vendor]                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Website Development                                │   │
│  │  Full-stack website development                     │   │
│  │  $2,500  •  ⭐ 4.9 (45 reviews)                     │   │
│  │  By: WebDev Agency                                  │   │
│  │  [View Details] [Contact Vendor]                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Marketplace Features

- **Browse Listings**: View available services
- **Post Listings**: Create service listings
- **Bid on Projects**: Submit bids for projects
- **Vendor Profiles**: View vendor ratings and reviews
- **Transaction Management**: Track purchases and sales

---

## CONTACTS

### Overview

Contact Lists help you organize contacts into groups for easy management and communication.

### Contact Lists UI

```
┌─────────────────────────────────────────────────────────────┐
│  Contact Lists                            [+ New List]        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Clients                                             │   │
│  │  25 contacts                                         │   │
│  │  [View] [Edit] [Delete]                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Vendors                                             │   │
│  │  12 contacts                                         │   │
│  │  [View] [Edit] [Delete]                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Managing Contacts

1. **Create List**: Click "New List", enter name
2. **Add Members**: Click "Add Member", enter email/name
3. **Import Contacts**: Upload CSV file with contacts
4. **Remove Members**: Click member, then "Remove"
5. **Export**: Export list to CSV

---

## UI SPECIFICATIONS

### Design System

TaskJuggler uses the Fibonacco Design System v1.0 with a modern glassmorphism aesthetic.

### Color Palette

- **Primary**: #007AFF (Blue)
- **Success**: #34C759 (Green)
- **Warning**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)
- **Background**: #FFFFFF (Light) / #000000 (Dark)
- **Surface Glass**: rgba(255, 255, 255, 0.72) (Light) / rgba(44, 44, 46, 0.72) (Dark)

### Typography

- **Font Family**: SF Pro Display, Segoe UI, Roboto, Helvetica Neue
- **Display Large**: 40px
- **Headline**: 24px
- **Title**: 18px
- **Body**: 16px
- **Caption**: 12px

### Components

#### Button
- **Primary**: Blue background, white text
- **Secondary**: Transparent background, blue border
- **Ghost**: Transparent, text only
- **Sizes**: Small (36px), Medium (44px), Large (52px)

#### Card
- **Glass Effect**: Backdrop blur with semi-transparent background
- **Padding**: Small (16px), Medium (24px), Large (32px)
- **Border Radius**: 14px
- **Shadow**: Subtle elevation shadow

#### Badge
- **Status Colors**: Pending (Gray), In Progress (Orange), Completed (Green), Cancelled (Red)
- **Shape**: Pill-shaped with rounded corners
- **Size**: Small (24px), Medium (32px)

#### Input
- **Height**: 44px minimum (touch-friendly)
- **Border**: 1px solid border, blue on focus
- **Padding**: 12px horizontal, 12px vertical
- **Font Size**: 16px (prevents iOS zoom)

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Top Navigation Bar                      │
│  [Logo] [Menu Items] [User Avatar]      │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────┐ │
│  │          │  │                      │ │
│  │ Sidebar  │  │   Main Content      │ │
│  │          │  │                      │ │
│  │ • Tasks  │  │   [Page Content]    │ │
│  │ • Inbox  │  │                      │ │
│  │ • Teams  │  │                      │ │
│  │ • etc.   │  │                      │ │
│  │          │  │                      │ │
│  └──────────┘  └──────────────────────┘ │
└─────────────────────────────────────────┘
```

### Responsive Design

- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu, full-width content

### Dark Mode

TaskJuggler supports automatic dark mode based on system preferences. Colors automatically adjust for optimal contrast and readability.

---

## KEYBOARD SHORTCUTS

- **Ctrl/Cmd + K**: Quick search
- **Ctrl/Cmd + N**: New task
- **Ctrl/Cmd + T**: New team
- **Ctrl/Cmd + M**: New message
- **Esc**: Close modal/dialog
- **Tab**: Navigate between fields
- **Enter**: Submit form/send message

---

## TIPS & BEST PRACTICES

1. **Use Tags**: Tag tasks for easy filtering and organization
2. **Set Priorities**: Mark urgent tasks as High or Critical
3. **Create Teams**: Organize work by team for better collaboration
4. **Use Routing Rules**: Automate task assignment to save time
5. **Regular Inbox Check**: Process inbox items daily
6. **Team Communication**: Use channels for team-wide discussions
7. **Task Descriptions**: Write detailed descriptions for clarity
8. **Due Dates**: Set realistic due dates and update as needed

---

## SUPPORT

For help and support:
- **Email**: support@taskjuggler.com
- **Documentation**: docs.taskjuggler.com
- **Community**: community.taskjuggler.com

---

**TaskJuggler User Manual v1.0**  
*Last Updated: December 2025*
