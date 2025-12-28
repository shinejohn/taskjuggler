# 4projects.ai User Manual
## Complete Guide to Project Management and Collaboration

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web Application

---

## TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Projects](#projects)
4. [Project Board (Kanban)](#project-board-kanban)
5. [Project Timeline](#project-timeline)
6. [Project Detail](#project-detail)
7. [Tasks](#tasks)
8. [Dashboard](#dashboard)
9. [UI Specifications](#ui-specifications)

---

## INTRODUCTION

4projects.ai is an AI-powered project management platform designed to help teams plan, execute, and deliver projects efficiently. With visual boards, timeline views, and intelligent task management, 4projects.ai streamlines project collaboration.

### Key Features

- **Kanban Boards**: Visual task management with drag-and-drop
- **Timeline View**: Gantt-style timeline for project planning
- **Task Management**: Create, assign, and track tasks
- **Team Collaboration**: Real-time collaboration features
- **AI Insights**: AI-powered project insights and recommendations
- **Project Templates**: Pre-built templates for common project types
- **Reporting**: Comprehensive project reports and analytics

---

## GETTING STARTED

### Creating an Account

1. Navigate to the 4projects.ai homepage
2. Click **"Get Started"** or **"Sign Up"**
3. Fill in your information:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: Create a strong password
   - **Confirm Password**: Re-enter your password
4. Click **"Create Account"**
5. Verify your email address (if required)

### Logging In

1. Navigate to the 4projects.ai login page
2. Enter your **Email** and **Password**
3. Click **"Login"**
4. You'll be redirected to your Projects dashboard

---

## PROJECTS

### Creating a Project

1. Navigate to **"Projects"** in the menu
2. Click **"New Project"**
3. Fill in project details:
   - **Project Name**: Name of the project
   - **Description**: Project description and goals
   - **Start Date**: Project start date
   - **End Date**: Project deadline
   - **Team Members**: Add team members
   - **Template**: Choose a project template (optional)
4. Click **"Create Project"**

### Projects List View

```
┌─────────────────────────────────────────────────────────────┐
│  Projects                                  [+ New Project]   │
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Filter: All] [Filter: Active] [View: Grid]    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Website Redesign                                   │   │
│  │  Complete website redesign project                  │   │
│  │  📅 Dec 1 - Jan 15  •  👥 5 members                │   │
│  │  Progress: ████████░░ 80%                            │   │
│  │  [Open Project]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Mobile App Development                             │   │
│  │  iOS and Android app development                    │   │
│  │  📅 Jan 1 - Mar 31  •  👥 8 members                │   │
│  │  Progress: ████░░░░░░ 40%                            │   │
│  │  [Open Project]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Project Status

- **Planning**: Project in planning phase
- **Active**: Project is actively being worked on
- **On Hold**: Project temporarily paused
- **Completed**: Project finished
- **Cancelled**: Project cancelled

---

## PROJECT BOARD (KANBAN)

### Overview

The Kanban board provides a visual representation of project tasks organized into columns representing different stages of work.

### Kanban Board UI

```
┌─────────────────────────────────────────────────────────────┐
│  Website Redesign - Kanban Board                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   To Do      │ │  In Progress │ │   Review     │       │
│  │   (5)        │ │     (3)      │ │     (2)      │       │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤       │
│  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │       │
│  │ │ Design   │ │ │ │ Develop │ │ │ │ Test    │ │       │
│  │ │ Homepage │ │ │ │ API     │ │ │ │ Features│ │       │
│  │ │          │ │ │ │         │ │ │ │         │ │       │
│  │ │ 👤 John  │ │ │ │ 👤 Jane │ │ │ │ 👤 Bob  │ │       │
│  │ │ 🔴 High  │ │ │ │ 🟡 Med  │ │ │ │ 🟢 Low  │ │       │
│  │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │       │
│  │              │ │              │ │              │       │
│  │ ┌──────────┐ │ │ ┌──────────┐ │ │              │       │
│  │ │ Design   │ │ │ │ Build    │ │ │              │       │
│  │ │ About    │ │ │ │ Database │ │ │              │       │
│  │ │          │ │ │ │          │ │ │              │       │
│  │ │ 👤 John  │ │ │ │ 👤 Jane │ │ │              │       │
│  │ │ 🟡 Med   │ │ │ │ 🔴 High │ │ │              │       │
│  │ └──────────┘ │ │ └──────────┘ │ │              │       │
│  │              │ │              │ │              │       │
│  │ [+ Add Task] │ │ [+ Add Task] │ │ [+ Add Task] │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                               │
│  ┌──────────────┐                                           │
│  │   Done       │                                           │
│  │   (12)       │                                           │
│  ├──────────────┤                                           │
│  │ [Completed tasks...]                                     │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Using the Kanban Board

1. **View Tasks**: Tasks appear as cards in columns
2. **Move Tasks**: Drag and drop tasks between columns
3. **Add Tasks**: Click "+ Add Task" in any column
4. **Edit Tasks**: Click on a task card to edit
5. **Filter**: Filter tasks by assignee, priority, or tags
6. **Search**: Search for specific tasks

### Task Card Information

- **Title**: Task name
- **Assignee**: Assigned team member (avatar)
- **Priority**: Color-coded priority (Red=High, Yellow=Medium, Green=Low)
- **Due Date**: Task deadline
- **Tags**: Category tags
- **Comments**: Comment count
- **Attachments**: File attachment count

### Customizing Columns

1. Click **"Board Settings"**
2. Add, remove, or rename columns
3. Set column limits (WIP limits)
4. Configure column colors
5. Save changes

---

## PROJECT TIMELINE

### Overview

The Timeline view shows project tasks and milestones in a Gantt-style chart, helping you visualize project schedule and dependencies.

### Timeline UI

```
┌─────────────────────────────────────────────────────────────┐
│  Website Redesign - Timeline                                │
├─────────────────────────────────────────────────────────────┤
│  [Zoom: Week] [Zoom: Month] [Today] [Export]                │
│                                                               │
│  Task                    │ Dec  │ Jan  │ Feb  │ Mar  │      │
│  ───────────────────────┼──────┼──────┼──────┼──────┤      │
│  Design Phase            │██████│      │      │      │      │
│    • Design Homepage     │████  │      │      │      │      │
│    • Design About        │  ████│      │      │      │      │
│                          │      │      │      │      │      │
│  Development Phase       │      │██████│██████│      │      │
│    • Build API           │      │██████│      │      │      │
│    • Build Frontend      │      │      │██████│      │      │
│                          │      │      │      │      │      │
│  Testing Phase           │      │      │      │██████│      │
│    • Test Features       │      │      │      │████  │      │
│    • Bug Fixes           │      │      │      │  ████│      │
│                          │      │      │      │      │      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Milestone: Launch Date                              │   │
│  │  ────────────────────────────────────────────────────│   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Timeline Features

- **Task Bars**: Visual representation of task duration
- **Dependencies**: Show task dependencies with arrows
- **Milestones**: Mark important project milestones
- **Zoom Controls**: Zoom in/out to see different time ranges
- **Today Marker**: Highlight current date
- **Drag to Reschedule**: Drag task bars to change dates
- **Critical Path**: Highlight critical path tasks

### Creating Dependencies

1. Click on a task
2. Click **"Add Dependency"**
3. Select the task this depends on
4. Choose dependency type:
   - **Finish to Start**: Task B starts when Task A finishes
   - **Start to Start**: Task B starts when Task A starts
   - **Finish to Finish**: Task B finishes when Task A finishes
   - **Start to Finish**: Task B finishes when Task A starts

---

## PROJECT DETAIL

### Project Overview

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Projects                                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Website Redesign                                            │
│  Complete website redesign project                           │
│  [Status: Active]                                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Project Info                                       │   │
│  │  • Start Date: December 1, 2025                     │   │
│  │  • End Date: January 15, 2026                       │   │
│  │  • Progress: 80%                                     │   │
│  │  • Budget: $50,000                                  │   │
│  │  • Team: 5 members                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Team Members                                       │   │
│  │  [Avatar] John Doe - Project Manager                │   │
│  │  [Avatar] Jane Smith - Designer                     │   │
│  │  [Avatar] Bob Johnson - Developer                   │   │
│  │  [+ Add Member]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Board View] [Timeline View] [Settings]                    │
└─────────────────────────────────────────────────────────────┘
```

### Project Settings

Configure project:
- **General**: Name, description, dates
- **Team**: Add/remove team members, set roles
- **Permissions**: Control who can edit/view
- **Notifications**: Set up project notifications
- **Integrations**: Connect external tools
- **Archive**: Archive completed projects

---

## TASKS

### Creating a Task

1. Navigate to a project
2. Click **"+ Add Task"** in the desired column
3. Fill in task details:
   - **Title**: Task name
   - **Description**: Detailed description
   - **Assignee**: Assign to team member
   - **Due Date**: Set deadline
   - **Priority**: Low, Medium, High
   - **Tags**: Add tags
   - **Estimated Time**: Time estimate
4. Click **"Create Task"**

### Task Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Board                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Design Homepage                                             │
│  [Status: In Progress] [Priority: High]                       │
│                                                               │
│  Description:                                                │
│  Design the new homepage layout with modern UI components... │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Details                                             │   │
│  │  • Assignee: Jane Smith                             │   │
│  │  • Due Date: December 20, 2025                      │   │
│  │  • Estimated: 8 hours                               │   │
│  │  • Time Spent: 4 hours                               │   │
│  │  • Tags: Design, Homepage                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Comments                                           │   │
│  │  [Comment Input]                                    │   │
│  │  [Post]                                            │   │
│  │                                                     │   │
│  │  • Jane: Started working on this                   │   │
│  │    2 hours ago                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Edit Task] [Delete Task]                                  │
└─────────────────────────────────────────────────────────────┘
```

### Task Actions

- **Edit**: Modify task details
- **Move**: Move to different column
- **Assign**: Assign to team member
- **Set Priority**: Change priority level
- **Add Comment**: Add comments and updates
- **Attach Files**: Attach files to task
- **Log Time**: Track time spent on task
- **Complete**: Mark task as done

---

## DASHBOARD

### Overview

The Dashboard provides an overview of all your projects, tasks, and team activity.

### Dashboard UI

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Projects │  │  Tasks   │  │  Team    │  │ Progress │   │
│  │    5     │  │   24     │  │    12    │  │   68%    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  My Projects                                         │   │
│  │  [Project Card 1]                                    │   │
│  │  [Project Card 2]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  My Tasks                                            │   │
│  │  [Task Card 1]                                       │   │
│  │  [Task Card 2]                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Recent Activity                                    │   │
│  │  • Task "Design Homepage" completed                  │   │
│  │  • New task assigned to you                           │   │
│  │  • Project "Website Redesign" updated                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Features

- **Project Overview**: See all your projects at a glance
- **Task Summary**: View your assigned tasks
- **Activity Feed**: Track recent project activity
- **Quick Actions**: Create new projects/tasks quickly
- **Statistics**: View project and task statistics

---

## UI SPECIFICATIONS

### Design System

4projects.ai uses the Fibonacco Design System v1.0 with a modern glassmorphism aesthetic.

### Color Palette

- **Primary**: #007AFF (Blue)
- **Success**: #34C759 (Green)
- **Warning**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)
- **Project Colors**: Custom colors per project

### Kanban Board Styling

- **Column Background**: Glass effect with subtle border
- **Task Card**: White/dark background with shadow
- **Card Hover**: Slight elevation on hover
- **Drag Preview**: Semi-transparent card while dragging
- **Drop Zone**: Highlighted column when dragging over

### Timeline Styling

- **Task Bar**: Colored bars representing task duration
- **Milestone**: Diamond-shaped markers
- **Dependency Line**: Curved arrow connecting tasks
- **Today Line**: Red vertical line marking today
- **Grid Lines**: Subtle grid for date alignment

### Typography

- **Project Title**: 24px, bold
- **Task Title**: 16px, medium
- **Body Text**: 14px, regular
- **Labels**: 12px, medium

---

## KEYBOARD SHORTCUTS

- **Ctrl/Cmd + N**: New project
- **Ctrl/Cmd + T**: New task
- **Ctrl/Cmd + K**: Quick search
- **Space**: Pan timeline
- **Scroll**: Zoom timeline
- **Delete**: Delete selected task
- **Esc**: Close modal

---

## TIPS & BEST PRACTICES

1. **Use Templates**: Start projects from templates
2. **Set Priorities**: Mark urgent tasks as High priority
3. **Track Time**: Log time to improve estimates
4. **Use Tags**: Tag tasks for easy filtering
5. **Set Dependencies**: Link related tasks
6. **Regular Updates**: Update task status regularly
7. **Team Communication**: Use comments for updates
8. **Review Timeline**: Check timeline for conflicts

---

## SUPPORT

For help and support:
- **Email**: support@4projects.ai
- **Documentation**: docs.4projects.ai
- **Community**: community.4projects.ai

---

**4projects.ai User Manual v1.0**  
*Last Updated: December 2025*
