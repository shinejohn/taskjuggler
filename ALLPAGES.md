# All Pages — TaskJuggler Platform Apps

Source of truth for Playwright UI testing. Each route must have a smoke test.

## App Ports (Vite dev server)

| App | Port | Env Var |
|-----|------|---------|
| taskjuggler-web | 5173 | TASKJUGGLER_URL |
| coordinator-web | 3003 | COORDINATOR_URL |
| ideacircuit-web | 3004 | IDEACIRCUIT_URL |
| official-notice-web | 5175 | OFFICIAL_NOTICE_URL |
| process-web | 3001 | PROCESS_URL |
| projects-web | 3002 | PROJECTS_URL |
| scanner-web | 3002 | SCANNER_URL |
| urpa-web | 3004 | URPA_URL |

---

## 1. taskjuggler-web

| Path | Name | Auth |
|------|------|------|
| / | Home | no |
| /login | Login | no |
| /register | Register | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /profile | Profile | yes |
| /subscribe | Subscribe | yes |
| /dashboard | Dashboard | yes |
| /tasks | Tasks | yes |
| /tasks/new | Task Create | yes |
| /tasks/:id | Task Detail | yes |
| /inbox | Inbox | yes |
| /routing | Routing Rules | yes |
| /teams | Teams | yes |
| /teams/:id | Team Detail | yes |
| /messages | Messages | yes |
| /messages/:userId | Direct Message | yes |
| /channels | Channels | yes |
| /marketplace | Marketplace | yes |
| /contacts | Contacts | yes |
| /team | Team | yes |
| /test-results | Test Results | yes |

---

## 2. coordinator-web

| Path | Name | Auth |
|------|------|------|
| / | Landing | no |
| /login | Login | no |
| /register | Register | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /profile | Profile | yes |
| /subscribe | Subscribe | yes |
| /onboarding | Onboarding | yes |
| /dashboard | Dashboard | yes |
| /coordinators | Coordinators | yes |
| /coordinators/:id | Coordinator Detail | yes |
| /contacts | Contacts | yes |
| /appointments | Appointments | yes |
| /calls | Calls | yes |
| /calendar | Calendar | yes |
| /analytics | Analytics | yes |
| /billing | Billing | yes |
| /campaigns | Campaigns | yes |
| /settings | Settings | yes |
| /learning | Learning | yes |

---

## 3. ideacircuit-web

| Path | Name | Auth |
|------|------|------|
| / | Home | no |
| /login | Login | no |
| /signup | Sign Up | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /subscribe | Subscribe | yes |
| /presentation | Presentation | yes |
| /report | Report | yes |
| /marketing-report | Marketing Report | yes |
| /business-profile | Business Profile | yes |
| /data-analytics | Data Analytics | yes |
| /client-proposal | Client Proposal | yes |
| /ai-workflow | AI Workflow | yes |
| /files | Files | yes |
| /profile | Profile | yes |
| /schedule | Schedule | yes |

---

## 4. official-notice-web

| Path | Name | Auth |
|------|------|------|
| / | Home | no |
| /dashboard | Dashboard | yes |
| /milestones | Milestones | yes |
| /settings/team | Team Settings | yes |
| /settings/billing | Billing | yes |
| /areas/:id | Area Detail | yes |
| /documents/:id | Document Viewer | yes |
| /signing/:id | Signing Ceremony | yes |
| /login | Login | no |
| /register | Register | no |

---

## 5. process-web

| Path | Name | Auth |
|------|------|------|
| / | Home | no |
| /login | Login | no |
| /register | Register | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /profile | Profile | yes |
| /subscribe | Subscribe | yes |
| /processes | Processes | yes |
| /processes/new | Process New | yes |
| /processes/:id | Process Detail | yes |
| /processes/:id/edit | Process Edit | yes |
| /executions | Executions | yes |

---

## 6. projects-web

| Path | Name | Auth |
|------|------|------|
| / | Home | no |
| /login | Login | no |
| /register | Register | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /app | App Layout | yes |
| /app/profile | Profile | yes |
| /app/subscribe | Subscribe | yes |
| /app/projects | Projects | yes |
| /app/projects/new | Project New | yes |
| /app/projects/:id | Project Detail | yes |
| /app/projects/:id/edit | Project Edit | yes |
| /app/projects/:id/timeline | Project Timeline | yes |
| /app/projects/:id/board | Project Board | yes |

---

## 7. scanner-web

| Path | Name | Auth |
|------|------|------|
| / | Landing | no |
| /dashboard | Dashboard | yes |
| /login | Login | no |
| /register | Register | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /profile | Profile | yes |
| /subscribe | Subscribe | yes |
| /sites | Sites | yes |
| /sites/:id | Site Detail | yes |
| /scans/:id | Scan Detail | yes |
| /settings | Settings | yes |
| /upgrade | Upgrade (redirect → subscribe) | yes |

---

## 8. urpa-web

| Path | Name | Auth |
|------|------|------|
| / | Landing | no |
| /dashboard | Dashboard | yes |
| /login | Login | no |
| /signup | Sign Up | no |
| /forgot-password | Forgot Password | no |
| /reset-password | Reset Password | no |
| /profile | Profile | yes |
| /setup | Setup Wizard | yes |
| /subscribe | Subscribe | yes |
| /settings | Settings (redirect → profile) | yes |
| /calls | Calls (redirect → dashboard) | yes |
| /inbox | Inbox (redirect → dashboard) | yes |
| /calendar | Calendar (redirect → dashboard) | yes |
| /calls/:id | Call Detail | yes |
| /webhooks | Webhooks | yes |
| /doctor/patients | Doctor Patients (module) | yes |
