# SiteHealth Scanner User Manual
## Complete Guide to Website Health Monitoring and Issue Detection

**Version:** 1.0  
**Last Updated:** December 2025  
**Platform:** Web Application

---

## TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Sites](#sites)
5. [Scans](#scans)
6. [Issues](#issues)
7. [Reports](#reports)
8. [Settings](#settings)
9. [UI Specifications](#ui-specifications)

---

## INTRODUCTION

SiteHealth Scanner is a comprehensive website testing service that identifies accessibility violations, broken functionality, SEO issues, and performance problems. With AI-powered fix generation and continuous monitoring, SiteHealth Scanner helps you maintain healthy, compliant websites.

### Key Features

- **Automated Scanning**: Scan websites for accessibility, SEO, performance, and security issues
- **AI-Powered Fixes**: Generate code fixes using Claude AI
- **Health Scores**: Track overall website health with category scores
- **Issue Management**: Organize, filter, and track issues
- **Scheduled Scans**: Set up automatic recurring scans
- **Detailed Reports**: Download comprehensive PDF reports
- **Multi-Site Management**: Monitor multiple websites from one dashboard

---

## GETTING STARTED

### Creating an Account

1. Navigate to the SiteHealth Scanner login page
2. Click **"Sign Up"** or **"Create Account"**
3. Fill in your information:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: Create a strong password
   - **Confirm Password**: Re-enter your password
4. Click **"Create Account"**
5. Verify your email address (if required)

### Logging In

1. Navigate to the SiteHealth Scanner login page
2. Enter your **Email** and **Password**
3. Click **"Login"**
4. You'll be redirected to your Dashboard

---

## DASHBOARD

### Overview

The Dashboard provides an overview of all your sites, recent scans, and overall health statistics.

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  SiteHealth                    [User Avatar] [Menu]          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Dashboard                                    [+ Add Site]   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Sites   │  │  Scans   │  │  Issues  │  │  Health  │   │
│  │    5     │  │   24     │  │   18     │  │   85%    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Your Sites                                          │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  example.com                                 │   │   │
│  │  │  https://example.com                        │   │   │
│  │  │  Health: ████████░░ 85%  •  Issues: 3       │   │   │
│  │  │  Last scan: 2 hours ago                      │   │   │
│  │  │  [Scan Now] [View Details]                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  mysite.com                                 │   │   │
│  │  │  https://mysite.com                         │   │   │
│  │  │  Health: ██████░░░░ 62%  •  Issues: 12      │   │   │
│  │  │  Last scan: 1 day ago                        │   │   │
│  │  │  [Scan Now] [View Details]                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Sites Needing Attention                            │   │
│  │  2 sites have health scores below 70                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Features

- **Statistics Cards**: Quick overview of sites, scans, issues, and average health
- **Site Cards**: Visual cards showing each site's health score and status
- **Recent Scans**: List of recent scan activities
- **Sites Needing Attention**: Alerts for sites with low health scores
- **Quick Actions**: Add new sites, start scans

---

## SITES

### Adding a Site

1. Navigate to **"Sites"** in the menu
2. Click **"+ Add Site"**
3. Fill in site details:
   - **Site Name**: Descriptive name for the site
   - **Site URL**: Full URL (e.g., https://example.com)
   - **Authentication** (optional):
     - **None**: Public site
     - **Basic Auth**: Username and password
     - **Cookie**: Cookie name and value
     - **Header**: Header name and value
   - **Scan Settings**:
     - **Max Pages**: Maximum pages to scan (default: 50)
     - **Checks**: Select which checks to run
4. Click **"Add Site"**

### Add Site Modal UI

```
┌─────────────────────────────────────────────────────────────┐
│  Add New Site                                    [X]          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Site Name *                                                 │
│  [My Website                                    ]            │
│                                                               │
│  Site URL *                                                   │
│  [https://example.com                          ]            │
│                                                               │
│  ────────────────────────────────────────────────────────    │
│  Authentication                                              │
│  [None ▼]                                                    │
│                                                               │
│  ────────────────────────────────────────────────────────    │
│  Scan Settings                                               │
│  Max Pages to Scan                                           │
│  [50                                    ]                    │
│                                                               │
│  [Cancel]                              [Add Site]            │
└─────────────────────────────────────────────────────────────┘
```

### Sites List View

```
┌─────────────────────────────────────────────────────────────┐
│  Sites                                        [+ Add Site]   │
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Filter: All] [Filter: Needs Attention]        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  example.com                                         │   │
│  │  https://example.com                                 │   │
│  │                                                       │   │
│  │  Health Score: 85                                    │   │
│  │  Issues: 3  •  Last Scan: 2 hours ago                │   │
│  │                                                       │   │
│  │  [Scan Now] [View Details]                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  mysite.com                                         │   │
│  │  https://mysite.com                                 │   │
│  │                                                       │   │
│  │  Health Score: 62                                    │   │
│  │  Issues: 12  •  Last Scan: 1 day ago                 │   │
│  │                                                       │   │
│  │  [Scan Now] [View Details]                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Site Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Sites                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  example.com                                                 │
│  https://example.com                                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Health Score: 85                                    │   │
│  │  [Circular Progress Indicator]                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Recent Scans                                        │   │
│  │                                                       │   │
│  │  • Dec 27, 2025 10:30 AM - Completed                 │   │
│  │    Health: 85  •  3 issues found                      │   │
│  │    [View Results]                                    │   │
│  │                                                       │   │
│  │  • Dec 26, 2025 9:15 AM - Completed                  │   │
│  │    Health: 82  •  5 issues found                      │   │
│  │    [View Results]                                    │   │
│  │                                                       │   │
│  │  [Start New Scan]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Open Issues (3)                                     │   │
│  │                                                       │   │
│  │  [Issue Card 1]                                      │   │
│  │  [Issue Card 2]                                      │   │
│  │  [Issue Card 3]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## SCANS

### Starting a Scan

1. Navigate to a site's detail page
2. Click **"Start New Scan"** or **"Scan Now"**
3. Optionally configure scan settings:
   - **Max Pages**: Limit pages scanned
   - **Checks**: Select specific checks to run
4. Click **"Start Scan"**
5. Scan will begin processing (status: Running)
6. Monitor progress in real-time
7. When complete, view results

### Scan Status

- **Pending**: Scan queued, waiting to start
- **Running**: Scan in progress
- **Completed**: Scan finished successfully
- **Failed**: Scan encountered an error

### Scan Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Sites                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Scan Results                                                │
│  Started: Dec 27, 2025 10:30 AM                              │
│  Completed: Dec 27, 2025 10:32 AM                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Overall Health Score: 85                           │   │
│  │  [Large Circular Progress Indicator]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Category Scores                                    │   │
│  │                                                       │   │
│  │  Accessibility: 90                                   │   │
│  │  SEO: 85                                             │   │
│  │  Performance: 80                                     │   │
│  │  Security: 95                                        │   │
│  │  Functionality: 85                                   │   │
│  │  Best Practice: 80                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Issues Found (3)                                    │   │
│  │                                                       │   │
│  │  [Issue Card 1]                                      │   │
│  │  [Issue Card 2]                                      │   │
│  │  [Issue Card 3]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Download Report]                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## ISSUES

### Issue Categories

- **Accessibility**: WCAG compliance issues, screen reader problems
- **SEO**: Missing meta tags, poor heading structure, missing alt text
- **Performance**: Slow load times, large images, inefficient code
- **Security**: HTTPS issues, security headers, mixed content
- **Functionality**: Broken links, form errors, JavaScript errors
- **Best Practice**: Code quality, best practices violations

### Issue Severities

- **Critical**: Must fix immediately, blocks functionality
- **Serious**: Should fix soon, impacts user experience
- **Moderate**: Should fix, minor impact
- **Minor**: Nice to fix, minimal impact

### Issue Card UI

```
┌─────────────────────────────────────────────────────────────┐
│  Missing Alt Text                                            │
│  Images must have alt text for accessibility                 │
│                                                               │
│  [Severity: Moderate] [Category: Accessibility]              │
│                                                               │
│  [Expand ▼]                                                  │
│                                                               │
│  ────────────────────────────────────────────────────────    │
│  Page: https://example.com/page                              │
│  Selector: img.logo                                          │
│                                                               │
│  HTML Context:                                               │
│  <img src="logo.png" class="logo">                          │
│                                                               │
│  WCAG Criteria: 1.1.1 (Non-text Content)                    │
│                                                               │
│  [Generate Fix] [Ignore] [Mark Fixed]                        │
└─────────────────────────────────────────────────────────────┘
```

### Generating Fixes

1. Click on an issue to view details
2. Click **"Generate Fix"**
3. AI analyzes the issue and generates a fix
4. Review the generated fix:
   - **Before**: Current code
   - **After**: Fixed code
   - **Explanation**: Why the fix works
   - **Confidence**: AI confidence score (0-100%)
5. Click **"Copy Fix"** to copy the code
6. Apply the fix to your website
7. Click **"Mark Fixed"** when done

### Fix Preview UI

```
┌─────────────────────────────────────────────────────────────┐
│  Code Fix                                        [Copy]       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Before:                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <img src="logo.png" class="logo">                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  After:                                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <img src="logo.png" class="logo"                    │   │
│  │      alt="Company Logo">                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Explanation:                                                 │
│  Added alt attribute to provide text alternative for         │
│  screen readers. This ensures accessibility compliance.      │
│                                                               │
│  Confidence: 95%                                              │
└─────────────────────────────────────────────────────────────┘
```

### Managing Issues

- **Filter**: Filter by category, severity, or status
- **Search**: Search issues by title or message
- **Bulk Actions**: Select multiple issues and update status
- **Ignore**: Mark issues as ignored (won't show in reports)
- **Mark Fixed**: Mark issues as fixed after applying fixes

---

## REPORTS

### Downloading Reports

1. Navigate to a scan detail page
2. Click **"Download Report"**
3. PDF report will download with:
   - Executive summary
   - Health scores by category
   - List of all issues
   - Recommendations
   - Compliance certificates

### Report Contents

- **Cover Page**: Site information and scan date
- **Executive Summary**: Overall health score and key findings
- **Category Breakdown**: Scores for each category
- **Issues List**: Detailed list of all issues found
- **Recommendations**: Prioritized action items
- **Compliance**: WCAG compliance status
- **Appendix**: Technical details and screenshots

---

## SETTINGS

### Account Settings

- **Profile**: Update name and email
- **Password**: Change password
- **Notifications**: Configure email notifications
- **API Keys**: Manage API access keys

### Scan Settings

- **Default Max Pages**: Set default page limit
- **Default Checks**: Select default checks to run
- **Scheduled Scans**: Set up recurring scans
- **Notification Preferences**: When to receive alerts

---

## UI SPECIFICATIONS

### Design System

SiteHealth Scanner uses the Fibonacco Design System v1.0 with a modern glassmorphism aesthetic.

### Color Palette

- **Primary**: #10B981 (Green - represents health)
- **Critical**: #EF4444 (Red)
- **Serious**: #F59E0B (Orange)
- **Moderate**: #3B82F6 (Blue)
- **Minor**: #6B7280 (Gray)

### Health Score Indicator

- **Circular Progress**: SVG-based circular progress indicator
- **Score Colors**:
  - 90-100: Green (Healthy)
  - 70-89: Blue (Good)
  - 50-69: Orange (Needs Work)
  - 0-49: Red (Critical)
- **Sizes**: Small (80px), Medium (120px), Large (160px)

### Component Styling

- **Site Card**: Glass effect card with health score display
- **Issue Card**: Expandable card with severity color coding
- **Fix Preview**: Code block with syntax highlighting
- **Status Badges**: Color-coded badges for scan status

### Typography

- **Site Name**: 18px, bold
- **Health Score**: 24px-40px, bold
- **Issue Title**: 16px, medium
- **Body Text**: 14px, regular

---

## KEYBOARD SHORTCUTS

- **Ctrl/Cmd + N**: Add new site
- **Ctrl/Cmd + S**: Start scan
- **Ctrl/Cmd + K**: Quick search
- **Esc**: Close modal
- **Tab**: Navigate between fields

---

## TIPS & BEST PRACTICES

1. **Regular Scans**: Set up scheduled scans for continuous monitoring
2. **Fix Critical Issues First**: Prioritize critical and serious issues
3. **Use AI Fixes**: Generate fixes for faster resolution
4. **Monitor Trends**: Track health scores over time
5. **Review Reports**: Download and review PDF reports regularly
6. **Organize Sites**: Use descriptive names for easy identification
7. **Set Up Notifications**: Get alerted when issues are found
8. **Compare Scans**: Compare current scan with previous to track improvements

---

## SUPPORT

For help and support:
- **Email**: support@sitehealth.com
- **Documentation**: docs.sitehealth.com
- **Community**: community.sitehealth.com

---

**SiteHealth Scanner User Manual v1.0**  
*Last Updated: December 2025*
