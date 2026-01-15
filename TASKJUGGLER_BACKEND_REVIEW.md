# TaskJuggler Backend System - Complete Review
**Generated:** January 13, 2026  
**Framework:** Laravel 12.0  
**Database:** PostgreSQL 16  
**PHP Version:** 8.2+

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Modules](#modules)
5. [Core Features](#core-features)
6. [Services & Integrations](#services--integrations)
7. [Authentication & Authorization](#authentication--authorization)
8. [Middleware](#middleware)
9. [Events & Jobs](#events--jobs)
10. [Key Models & Relationships](#key-models--relationships)
11. [Infrastructure](#infrastructure)

---

## Architecture Overview

### Technology Stack
- **Framework:** Laravel 12.0 (PHP 8.2+)
- **Database:** PostgreSQL 16 (UUID primary keys, JSONB fields)
- **Authentication:** Laravel Sanctum (API tokens)
- **Queue:** Database queue driver (Redis available)
- **Cache:** Database cache (Redis available)
- **Broadcasting:** Pusher (real-time events)
- **File Storage:** S3-compatible storage

### Architecture Pattern
- **Modular Architecture:** Feature-based modules in `app/Modules/`
- **API-First:** RESTful API endpoints
- **Multi-Tenancy:** Team-based with profile context
- **Event-Driven:** Laravel events for async processing
- **Service Layer:** Business logic in Services directory

### Key Design Principles
1. **Requestor/Do-er Model:** Tasks separate who needs it done from who does it
2. **Team Context:** Multi-tenant with team-scoped resources
3. **Profile Context:** Users can have multiple profiles (personal, organization, company)
4. **Modular:** Features organized into modules (Core, Tasks, Urpa, Coordinator, etc.)
5. **Extensible:** TEF (Task Exchange Format) for interoperability

---

## Database Schema

### Total Tables: 40+

#### Core Tables
- **users** - User accounts with subscription info
- **profiles** - Extended profiles (personal/organization/company)
- **teams** - Team/organization groups
- **team_members** - Team membership with admin flags
- **team_invitations** - Team invitation system

#### Authentication
- **personal_access_tokens** - Sanctum API tokens
- **sessions** - Laravel session storage
- **password_reset_tokens** - Password reset

#### Tasks & Routing
- **tasks** - Core task management (UUID, soft deletes)
- **task_messages** - Task comments/messages
- **task_actions** - Task action history
- **task_invitations** - Task collaboration invitations
- **routing_rules** - Deterministic routing rules (JSONB conditions/actions)
- **inbox_items** - Raw incoming communications before task creation

#### AI Receptionist
- **assistant_channels** - Communication channels (phone, email, SMS)
- **inbox_items** - Incoming messages with AI extraction

#### Marketplace
- **marketplace_vendors** - Vendors (human/AI/hybrid)
- **marketplace_listings** - Job listings
- **marketplace_bids** - Bids on listings
- **ai_tool_configs** - AI tool configurations
- **ai_tool_executions** - AI tool execution history
- **transactions** - Payment transactions (Stripe Connect)

#### SiteHealth Scanner
- **scanner_sites** - Websites being monitored (team-scoped)
- **scanner_scans** - Scan execution records (team-scoped)
- **scanner_issues** - Issues found during scans (team-scoped, task_id for integration)
- **scheduled_scans** - Recurring scan schedules

#### TEF (Task Exchange Format)
- **actors** - Actors (HUMAN, AI_AGENT, TEAM, IOT_DEVICE)
- **relationships** - Relationships between actors with trust scores
- **conversations** - Conversations between actors
- **messages** - Messages in conversations
- **relationship_history** - Relationship change history
- **delegation_rules** - Automatic task delegation rules
- **claim_codes** - Codes for claiming actors

#### Appointments
- **appointment_types** - Types of appointments
- **availability_slots** - Available time slots
- **appointments** - Booked appointments

#### Messaging & Notifications
- **direct_messages** - Direct messages between users
- **notifications** - User notifications (in-app)

#### Contacts
- **contact_lists** - User-defined contact lists
- **contact_list_members** - Members of contact lists

#### Coordinator Module
- **coordinator_organizations** - Organizations using Coordinator
- **coordinator_coordinators** - AI coordinators
- **coordinator_contacts** - CRM contacts
- **coordinator_call_logs** - Call history
- **coordinator_appointments** - Appointments
- **coordinator_campaigns** - Marketing campaigns
- **coordinator_context_packets** - Context packets for AI agents
- **coordinator_ai_interactions** - AI interaction logs

#### IdeaCircuit Module
- **ideacircuit_meetings** - Meeting records
- **ideacircuit_meeting_participants** - Meeting participants
- **ideacircuit_meeting_messages** - Meeting messages
- **ideacircuit_meeting_notes** - Meeting notes
- **ideacircuit_meeting_transcripts** - Meeting transcripts

#### URPA Module
- **urpa_activities** - Activity feed
- **urpa_contacts** - Contacts
- **urpa_integrations** - External integrations
- **urpa_voice_responses** - Pre-recorded voice responses

#### System Tables
- **cache** - Laravel cache
- **cache_locks** - Cache locks
- **jobs** - Queue jobs
- **job_batches** - Job batches

### Key Schema Features
- **UUID Primary Keys:** Most tables use UUIDs (except scanner tables use BIGSERIAL)
- **JSONB Fields:** Flexible data storage (settings, metadata, extracted_data, conditions, actions)
- **Timestamps:** All use TIMESTAMPTZ for timezone awareness
- **Soft Deletes:** Tasks table supports soft deletes
- **Foreign Keys:** Proper referential integrity with CASCADE/SET NULL
- **Indexes:** Optimized for common query patterns

---

## API Endpoints

### Base URL
`/api`

### Authentication
- **Method:** Laravel Sanctum (Bearer tokens)
- **Header:** `Authorization: Bearer {token}`
- **Team Context:** `X-Team-ID` header for team-scoped endpoints

### Core Module Routes (`/api`)

#### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/user` - Get current user (requires auth)
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/google/url` - Google OAuth URL
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/push-token` - Register push notification token

#### Profiles (`/profiles`)
- `GET /profiles` - List user profiles
- `POST /profiles` - Create profile
- `GET /profiles/{id}` - Get profile
- `PUT /profiles/{id}` - Update profile
- `DELETE /profiles/{id}` - Delete profile
- `POST /profiles/{id}/set-default` - Set default profile

### Tasks Module Routes (`/api/tasks`)

#### Task CRUD
- `GET /tasks` - List tasks (filtered by profile/team)
- `POST /tasks` - Create task
- `GET /tasks/{id}` - Get task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

#### Task Actions
- `POST /tasks/{id}/complete` - Mark task complete
- `POST /tasks/{id}/accept` - Accept task assignment
- `POST /tasks/{id}/decline` - Decline task assignment
- `POST /tasks/{id}/watch` - Watch task
- `POST /tasks/{id}/assign` - Assign task

#### Task Timeline
- `GET /tasks/{id}/timeline` - Get task timeline
- `PUT /tasks/{id}/timeline` - Update timeline

#### Task Invitations
- `POST /tasks/{id}/invite` - Create invitation
- `GET /tasks/{id}/invite/{code}` - Get invitation by code
- `POST /tasks/{id}/invite/{code}/accept` - Accept invitation
- `POST /tasks/{id}/invite/{code}/decline` - Decline invitation

#### Task Export
- `GET /tasks/{id}/export/ical` - Export as iCal
- `POST /tasks/export/ical` - Export multiple as iCal
- `POST /tasks/export/csv` - Export as CSV
- `POST /tasks/export/pdf` - Export as PDF
- `GET /tasks/{id}/calendar/google` - Google Calendar URL
- `GET /tasks/{id}/calendar/outlook` - Outlook Calendar URL

#### Task Exchange Format (TEF)
- `GET /tasks/{id}/tef` - Get task as TEF
- `GET /tasks/{id}/export/tef` - Export TEF file
- `GET /tasks/{id}/tef/envelope` - TEF 2.0.0 envelope
- `POST /tasks/import/tef` - Import TEF

#### Task Messages
- `GET /tasks/{id}/messages` - Get task messages
- `POST /tasks/{id}/messages` - Send message
- `POST /tasks/{id}/messages/read` - Mark messages read
- `GET /tasks/{id}/messages/unread` - Get unread count

### Inbox Routes (`/api/inbox`)
- `GET /inbox` - List inbox items
- `GET /inbox/{id}` - Get inbox item
- `POST /inbox/{id}/process` - Process inbox item
- `POST /inbox/{id}/dismiss` - Dismiss inbox item
- `POST /inbox/{id}/create-task` - Create task from inbox item

### Routing Rules (`/api/routing-rules`)
- `GET /routing-rules` - List routing rules
- `POST /routing-rules` - Create routing rule
- `GET /routing-rules/{id}` - Get routing rule
- `PUT /routing-rules/{id}` - Update routing rule
- `DELETE /routing-rules/{id}` - Delete routing rule
- `POST /routing-rules/reorder` - Reorder rules
- `POST /routing-rules/test` - Test routing rule

### Teams (`/api/teams`)
- `GET /teams` - List teams
- `POST /teams` - Create team
- `GET /teams/{id}` - Get team
- `PUT /teams/{id}` - Update team
- `DELETE /teams/{id}` - Delete team
- `GET /teams/{id}/members` - Get team members
- `POST /teams/{id}/invite` - Invite member
- `DELETE /teams/{id}/members/{userId}` - Remove member
- `POST /teams/{id}/leave` - Leave team
- `GET /teams/{id}/tasks` - Get team tasks
- `POST /teams/join/{code}` - Accept team invitation
- `GET /teams/invite/{code}` - Get invitation (public)

### Channels (`/api/channels`)
- `GET /channels` - List channels
- `POST /channels/phone` - Provision phone channel (Twilio)
- `POST /channels/email` - Create email channel (SendGrid)
- `PUT /channels/{id}` - Update channel
- `DELETE /channels/{id}` - Delete channel

### Marketplace (`/api/marketplace`)
- `GET /marketplace/listings` - List marketplace listings
- `POST /marketplace/listings` - Create listing
- `GET /marketplace/listings/{id}` - Get listing
- `POST /marketplace/listings/{id}/bid` - Place bid
- `POST /marketplace/listings/{id}/assign` - Assign listing

- `GET /marketplace/vendors` - List vendors
- `GET /marketplace/vendors/{id}` - Get vendor
- `POST /marketplace/vendors` - Create vendor
- `PUT /marketplace/vendors/{id}` - Update vendor

- `GET /vendor/dashboard` - Vendor dashboard
- `GET /vendor/jobs` - Vendor jobs
- `GET /vendor/earnings` - Vendor earnings

### Contact Lists (`/api/contact-lists`)
- `GET /contact-lists` - List contact lists
- `POST /contact-lists` - Create contact list
- `GET /contact-lists/{id}` - Get contact list
- `PUT /contact-lists/{id}` - Update contact list
- `DELETE /contact-lists/{id}` - Delete contact list
- `POST /contact-lists/{id}/members` - Add member
- `DELETE /contact-lists/{id}/members/{memberId}` - Remove member
- `POST /contact-lists/import` - Import contacts

### Appointments (`/api/appointments`)
- `GET /appointment-types` - List appointment types
- `POST /appointment-types` - Create appointment type
- `GET /appointment-types/{id}` - Get appointment type
- `PUT /appointment-types/{id}` - Update appointment type
- `DELETE /appointment-types/{id}` - Delete appointment type

- `GET /availability-slots` - List availability slots
- `POST /availability-slots` - Create availability slot
- `GET /availability-slots/{id}` - Get availability slot
- `PUT /availability-slots/{id}` - Update availability slot
- `DELETE /availability-slots/{id}` - Delete availability slot

- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `GET /appointments/{id}` - Get appointment
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Delete appointment
- `POST /appointments/{id}/confirm` - Confirm appointment

### Public Booking (`/api/public/booking`)
- `GET /public/booking/{slug}` - Get appointment type (public)
- `GET /public/booking/{slug}/slots` - Get available slots (public)
- `POST /public/booking/{slug}/book` - Book appointment (public)

### Direct Messages (`/api/messages`)
- `GET /messages/conversations` - List conversations
- `GET /messages/unread` - Get unread count
- `GET /messages/with/{userId}` - Get messages with user
- `POST /messages/to/{userId}` - Send message

### TEF 2.0.0 API (`/api/tef/v1`)

#### Actors
- `POST /tef/v1/actors` - Register actor
- `POST /tef/v1/actors/claim` - Claim actor
- `GET /tef/v1/actors/{id}` - Get actor
- `PUT /tef/v1/actors/{id}` - Update actor
- `DELETE /tef/v1/actors/{id}` - Delete actor
- `GET /tef/v1/actors/{id}/capabilities` - Get capabilities
- `POST /tef/v1/actors/{id}/authenticate` - Authenticate actor

#### Relationships
- `POST /tef/v1/relationships` - Create relationship
- `GET /tef/v1/relationships` - List relationships
- `GET /tef/v1/relationships/{id}` - Get relationship
- `PUT /tef/v1/relationships/{id}` - Update relationship
- `DELETE /tef/v1/relationships/{id}` - Delete relationship
- `GET /tef/v1/relationships/{id}/history` - Get relationship history
- `GET /tef/v1/relationships/{id}/trust-score` - Get trust score
- `PUT /tef/v1/relationships/{id}/trust-score` - Update trust score
- `POST /tef/v1/relationships/{id}/trust-score/recalculate` - Recalculate trust score

#### Messages
- `POST /tef/v1/messages` - Send message
- `GET /tef/v1/messages` - List messages
- `GET /tef/v1/messages/{id}` - Get message
- `POST /tef/v1/messages/{id}/read` - Mark message read

#### Conversations
- `GET /tef/v1/conversations/{id}` - Get conversation
- `GET /tef/v1/conversations/task/{taskId}` - Get conversation by task

### IoT Devices (`/api/iot/devices`)
- `POST /iot/devices/register` - Register device
- `POST /iot/devices/claim` - Claim device
- `GET /iot/devices` - List devices
- `GET /iot/devices/{id}` - Get device
- `PUT /iot/devices/{id}/capabilities` - Update capabilities
- `POST /iot/devices/{id}/claim-code` - Generate claim code
- `POST /iot/devices/{id}/send-task` - Send task to device
- `DELETE /iot/devices/{id}` - Delete device

### AI Agents (`/api/ai/agents`)
- `POST /ai/agents/register` - Register AI agent
- `POST /ai/agents/claim` - Claim AI agent
- `GET /ai/agents` - List agents
- `GET /ai/agents/{id}` - Get agent
- `PUT /ai/agents/{id}/capabilities` - Update capabilities
- `POST /ai/agents/{id}/claim-code` - Generate claim code
- `POST /ai/agents/{id}/delegate-task` - Delegate task to agent
- `DELETE /ai/agents/{id}` - Delete agent

### Scanner Module (`/api/scanner`)

#### Legacy (User-based)
- `GET /scanner/dashboard` - Dashboard stats
- `GET /scanner/sites` - List sites
- `POST /scanner/sites` - Create site
- `GET /scanner/sites/{id}` - Get site
- `PUT /scanner/sites/{id}` - Update site
- `DELETE /scanner/sites/{id}` - Delete site
- `POST /scanner/sites/{id}/scan` - Start scan
- `GET /scanner/sites/{id}/scans` - List scans
- `GET /scanner/scans/{id}` - Get scan
- `GET /scanner/scans/{id}/report` - Get scan report
- `GET /scanner/issues` - List issues
- `GET /scanner/issues/{id}` - Get issue
- `PUT /scanner/issues/{id}` - Update issue
- `POST /scanner/issues/{id}/fix` - Generate AI fix
- `POST /scanner/issues/bulk` - Bulk update issues

#### Team-based (New)
- `GET /scanner/dashboard` - Team dashboard stats
- `GET /scanner/usage` - Usage statistics
- `GET /scanner/sites` - List team sites
- `POST /scanner/sites` - Create site (with limit check)
- `GET /scanner/sites/{id}` - Get site
- `PUT /scanner/sites/{id}` - Update site
- `DELETE /scanner/sites/{id}` - Delete site
- `GET /scanner/sites/{id}/scans` - List scans
- `POST /scanner/sites/{id}/scan` - Start scan (with limit check)
- `GET /scanner/scans/{id}` - Get scan
- `GET /scanner/scans/{id}/report` - Get scan report
- `GET /scanner/issues` - List issues
- `GET /scanner/issues/{id}` - Get issue
- `PUT /scanner/issues/{id}` - Update issue
- `POST /scanner/issues/bulk` - Bulk update issues
- `POST /scanner/issues/{id}/fix` - Generate AI fix
- `GET /scanner/mcp/keys` - List MCP API keys
- `POST /scanner/mcp/keys` - Create MCP API key
- `DELETE /scanner/mcp/keys/{id}` - Revoke MCP API key

### MCP (Model Context Protocol) (`/api/mcp`)
- `POST /mcp/register` - Register MCP server
- `POST /mcp/login` - Login MCP server
- `POST /mcp/validate-key` - Validate API key
- `POST /mcp/get-token` - Get token from API key
- `GET /mcp/api-key` - Get API key (requires auth)
- `POST /mcp/api-key/regenerate` - Regenerate API key (requires auth)

### URPA Module (`/api/urpa`)

#### Activities
- `GET /urpa/activities` - List activities
- `POST /urpa/activities` - Create activity
- `POST /urpa/activities/sync` - Sync activities
- `GET /urpa/activities/{id}` - Get activity
- `PUT /urpa/activities/{id}` - Update activity
- `PATCH /urpa/activities/{id}/read` - Mark as read
- `PATCH /urpa/activities/{id}/star` - Toggle star
- `DELETE /urpa/activities/{id}` - Delete activity

#### Contacts
- `GET /urpa/contacts` - List contacts
- `POST /urpa/contacts` - Create contact
- `POST /urpa/contacts/import` - Import contacts
- `GET /urpa/contacts/{id}` - Get contact
- `PUT /urpa/contacts/{id}` - Update contact
- `DELETE /urpa/contacts/{id}` - Delete contact

#### AI
- `GET /urpa/ai/sessions` - List AI sessions
- `POST /urpa/ai/sessions` - Create AI session
- `GET /urpa/ai/sessions/{id}/messages` - Get session messages
- `POST /urpa/ai/sessions/{id}/messages` - Send message
- `PATCH /urpa/ai/sessions/{id}/complete` - Complete session
- `GET /urpa/ai/artifacts` - List artifacts
- `POST /urpa/ai/artifacts` - Generate artifact
- `GET /urpa/ai/tasks` - List AI tasks

#### Voice
- `GET /urpa/voice/prerecorded` - Get prerecorded responses
- `POST /urpa/voice/find-response` - Find response
- `POST /urpa/voice/prerecorded/bulk` - Bulk create responses
- `POST /urpa/voice/prerecorded/{id}/used` - Log usage
- `POST /urpa/voice/vapi/webhook` - Vapi webhook (no auth)
- `POST /urpa/voice/vapi/call` - Start call
- `POST /urpa/voice/vapi/call/{id}/end` - End call
- `GET /urpa/voice/vapi/call/{id}` - Get call status

#### Phone
- `GET /urpa/phone/calls` - List calls
- `POST /urpa/phone/calls` - Create call
- `GET /urpa/phone/calls/{id}` - Get call
- `PUT /urpa/phone/calls/{id}` - Update call
- `PATCH /urpa/phone/calls/{id}/complete` - Complete call

#### Integrations
- `GET /urpa/integrations` - List integrations
- `POST /urpa/integrations` - Create integration
- `GET /urpa/integrations/{id}` - Get integration
- `PUT /urpa/integrations/{id}` - Update integration
- `DELETE /urpa/integrations/{id}` - Delete integration
- `POST /urpa/integrations/{id}/sync` - Sync integration
- `GET /urpa/integrations/{id}/sync-status` - Get sync status
- `GET /urpa/integrations/oauth/{provider}/redirect` - OAuth redirect
- `GET /urpa/integrations/oauth/{provider}/callback` - OAuth callback

#### TaskJuggler Integration
- `GET /urpa/integrations/taskjuggler/status` - Get status
- `POST /urpa/integrations/taskjuggler/link` - Link account
- `POST /urpa/integrations/taskjuggler/sync` - Sync tasks
- `GET /urpa/integrations/taskjuggler/tasks` - List tasks
- `POST /urpa/integrations/taskjuggler/tasks` - Create task

#### Fibonacci Integration
- `GET /urpa/integrations/fibonacci/status` - Get status
- `POST /urpa/integrations/fibonacci/crm/link` - Link CRM
- `GET /urpa/integrations/fibonacci/crm/business/{id}` - Get business profile
- `GET /urpa/integrations/fibonacci/crm/business/{id}/faqs` - Get FAQs
- `POST /urpa/integrations/fibonacci/crm/business/{id}/sync-faqs` - Sync FAQs
- `GET /urpa/integrations/fibonacci/crm/business/{id}/polls` - Get polls
- `POST /urpa/integrations/fibonacci/publishing/link` - Link publishing
- `GET /urpa/integrations/fibonacci/publishing/team/{id}` - Get publishing team
- `GET /urpa/integrations/fibonacci/publishing/teams/{id}/projects` - Get projects
- `POST /urpa/integrations/fibonacci/publishing/teams/{id}/projects` - Create content request

### Coordinator Module (`/api/coordinator`)

#### Internal AI Agent Routes (`/api/internal/ai`)
- `POST /internal/ai/auth` - Authenticate AI agent
- `POST /internal/ai/auth/refresh` - Refresh token
- `GET /internal/ai/context/{business_id}` - Get context packet
- `GET /internal/ai/context/{business_id}/refresh` - Refresh context
- `GET /internal/ai/calendar/{business_id}/availability` - Get availability
- `GET /internal/ai/crm/{business_id}/customers/lookup` - Lookup customer
- `POST /internal/ai/calendar/{business_id}/bookings` - Create booking
- `POST /internal/ai/crm/{business_id}/leads` - Create lead
- `POST /internal/ai/interactions/{business_id}` - Log interaction
- `POST /internal/ai/interactions/{id}/feedback` - Log feedback

#### Public Coordinator Routes (`/api/coordinator`)
- `GET /coordinator/organizations` - List organizations
- `POST /coordinator/organizations` - Create organization
- `GET /coordinator/organizations/{id}` - Get organization
- `PUT /coordinator/organizations/{id}` - Update organization
- `DELETE /coordinator/organizations/{id}` - Delete organization

- `GET /coordinator/organizations/{orgId}/coordinators` - List coordinators
- `POST /coordinator/organizations/{orgId}/coordinators` - Create coordinator
- `GET /coordinator/coordinators/{id}` - Get coordinator
- `PUT /coordinator/coordinators/{id}` - Update coordinator
- `DELETE /coordinator/coordinators/{id}` - Delete coordinator

- `GET /coordinator/organizations/{orgId}/dashboard/metrics` - Get metrics
- `GET /coordinator/organizations/{orgId}/dashboard/recent-calls` - Get recent calls
- `GET /coordinator/organizations/{orgId}/dashboard/today-appointments` - Get today's appointments

- `GET /coordinator/organizations/{orgId}/contacts` - List contacts
- `POST /coordinator/organizations/{orgId}/contacts` - Create contact
- `GET /coordinator/organizations/{orgId}/contacts/{id}` - Get contact
- `PUT /coordinator/organizations/{orgId}/contacts/{id}` - Update contact
- `DELETE /coordinator/organizations/{orgId}/contacts/{id}` - Delete contact
- `POST /coordinator/organizations/{orgId}/contacts/bulk-delete` - Bulk delete
- `POST /coordinator/organizations/{orgId}/contacts/bulk-tag` - Bulk tag

- `GET /coordinator/organizations/{orgId}/calls` - List calls
- `GET /coordinator/organizations/{orgId}/calls/stats` - Get call stats
- `GET /coordinator/organizations/{orgId}/calls/{id}` - Get call

- `GET /coordinator/organizations/{orgId}/appointments` - List appointments
- `GET /coordinator/organizations/{orgId}/appointments/today` - Get today's appointments
- `POST /coordinator/organizations/{orgId}/appointments` - Create appointment
- `GET /coordinator/organizations/{orgId}/appointments/{id}` - Get appointment
- `PUT /coordinator/organizations/{orgId}/appointments/{id}` - Update appointment
- `DELETE /coordinator/organizations/{orgId}/appointments/{id}` - Delete appointment
- `POST /coordinator/organizations/{orgId}/appointments/{id}/cancel` - Cancel appointment

- `GET /coordinator/organizations/{orgId}/campaigns` - List campaigns
- `POST /coordinator/organizations/{orgId}/campaigns` - Create campaign
- `GET /coordinator/organizations/{orgId}/campaigns/{id}` - Get campaign
- `PUT /coordinator/organizations/{orgId}/campaigns/{id}` - Update campaign
- `DELETE /coordinator/organizations/{orgId}/campaigns/{id}` - Delete campaign
- `POST /coordinator/organizations/{orgId}/campaigns/{id}/start` - Start campaign
- `POST /coordinator/organizations/{orgId}/campaigns/{id}/pause` - Pause campaign
- `GET /coordinator/organizations/{orgId}/campaigns/{id}/stats` - Get campaign stats

- `GET /coordinator/organizations/{orgId}/billing` - Get billing info
- `GET /coordinator/organizations/{orgId}/billing/history` - Get billing history
- `PUT /coordinator/organizations/{orgId}/billing/payment-method` - Update payment method
- `POST /coordinator/organizations/{orgId}/billing/cancel` - Cancel subscription

#### Onboarding (`/api/coordinator/onboarding`)
- `GET /coordinator/onboarding/role-templates` - Get role templates
- `GET /coordinator/onboarding/persona-templates` - Get persona templates
- `POST /coordinator/onboarding/complete` - Complete onboarding

### Performance (`/api/performance`)
- `GET /performance/cache/stats` - Get cache statistics
- `POST /performance/cache/warm-up` - Warm up cache
- `DELETE /performance/cache/user` - Clear user cache

### Test Results (`/api/test-results`)
- `POST /test-results/run` - Run tests
- `GET /test-results/latest` - Get latest results
- `GET /test-results/all` - Get all results
- `GET /test-results/{filename}` - Get specific result

### Test Fix (`/api/test-fix`)
- `POST /test-fix/analyze` - Analyze test failures
- `POST /test-fix/apply` - Apply fixes

### Webhooks (`/webhooks`)

#### Twilio
- `POST /webhooks/twilio/voice/{user}` - Voice webhook
- `POST /webhooks/twilio/recording/{user}` - Recording webhook
- `POST /webhooks/twilio/transcription/{user}` - Transcription webhook
- `POST /webhooks/twilio/sms/{user}` - SMS webhook

#### SendGrid
- `POST /webhooks/sendgrid/inbound` - Inbound email webhook

---

## Modules

### Core Module (`app/Modules/Core`)
**Purpose:** Foundation authentication, users, profiles, teams

**Models:**
- `User` - User accounts
- `Profile` - Extended profiles (personal/organization/company)
- `Team` - Teams/organizations

**Controllers:**
- `AuthController` - Authentication (register, login, logout, password reset, OAuth)
- `ProfileController` - Profile management

**Features:**
- User authentication (email/password, Google OAuth)
- Multi-profile support (personal, organization, company)
- Team management
- Profile limits based on subscription plan
- Default profile selection

**Routes:** `/api/auth/*`, `/api/profiles/*`

---

### Tasks Module (`app/Modules/Tasks`)
**Purpose:** Task management system

**Models:**
- `Task` - Core task model
- `TaskMessage` - Task comments/messages
- `TaskAction` - Task action history
- `TaskInvitation` - Task collaboration invitations

**Controllers:**
- `TaskController` - Task CRUD and actions

**Features:**
- Requestor/Do-er model (who needs it vs who does it)
- Task status workflow (pending, accepted, in_progress, completed, cancelled)
- Task color states (blue, green, yellow, red) based on due date
- Task invitations with invite codes
- Task messages/comments
- Task export (iCal, CSV, PDF)
- Task Exchange Format (TEF) import/export
- Calendar integration (Google, Outlook)
- Task timeline
- Task assignment (user, team member, marketplace vendor)

**Routes:** `/api/tasks/*`

---

### URPA Module (`app/Modules/Urpa`)
**Purpose:** Unified Relationship & Activity Platform

**Models:**
- `Activity` - Activity feed
- `Contact` - Contacts
- `Integration` - External integrations
- `VoiceResponse` - Pre-recorded voice responses

**Controllers:**
- `ActivityController` - Activity feed
- `ContactController` - Contact management
- `AiController` - AI sessions and artifacts
- `VoiceController` - Voice response management
- `PhoneController` - Phone call management
- `IntegrationController` - Integration management
- `TaskJugglerController` - TaskJuggler integration
- `FibonacciController` - Fibonacci CRM/Publishing integration

**Features:**
- Activity feed with read/unread status
- Contact management
- AI conversation sessions
- Pre-recorded voice responses
- Vapi integration for voice calls
- External integrations (OAuth flows)
- TaskJuggler integration
- Fibonacci CRM and Publishing integration

**Routes:** `/api/urpa/*`

---

### Coordinator Module (`app/Modules/Coordinator`)
**Purpose:** AI Virtual Assistant coordination system

**Models:**
- `Organization` - Organizations using Coordinator
- `Coordinator` - AI coordinators
- `Contact` - CRM contacts
- `CallLog` - Call history
- `Appointment` - Appointments
- `Campaign` - Marketing campaigns
- `ContextPacket` - Context packets for AI agents
- `AiInteraction` - AI interaction logs

**Controllers:**
- `OrganizationController` - Organization management
- `CoordinatorController` - Coordinator management
- `ContactController` - Contact management
- `CallLogController` - Call log management
- `AppointmentController` - Appointment management
- `CampaignController` - Campaign management
- `ContextPacketController` - Context packet management
- `AiInteractionController` - AI interaction logging
- `DashboardController` - Dashboard metrics
- `BillingController` - Billing management
- `OnboardingController` - Onboarding flow
- `RealTimeOperationsController` - Real-time operations

**Features:**
- AI agent authentication
- Context packet system for AI agents
- Real-time operations (calendar, CRM, bookings, leads)
- AI interaction logging and feedback
- Call logging and analytics
- Appointment management
- Marketing campaigns
- Billing integration

**Routes:** `/api/coordinator/*`, `/api/internal/ai/*`

---

### SiteHealth/Scanner Module (`app/Modules/SiteHealth` + `app/Http/Controllers/Scanner`)
**Purpose:** Website accessibility and health scanning

**Note:** Scanner functionality exists in two implementations:
1. **Legacy (User-based):** `app/Modules/SiteHealth/` - Each user has their own sites/scans (user_id scoped)
2. **New (Team-based):** `app/Http/Controllers/Scanner/` - Teams share sites/scans under one subscription (team_id scoped)

**Team-based means:** Multiple team members can access and manage the same sites/scans. Subscription limits (e.g., 10 sites, 100 scans/month) are enforced at the team level, not per user. All team members share the same quota.

**Models:**
- `Site` - Websites being monitored (both user_id and team_id supported)
- `Scan` - Scan execution records
- `Issue` - Issues found during scans (includes task_id for integration)
- `ScheduledScan` - Recurring scan schedules

**Legacy Controllers (SiteHealth Module):**
- `SiteController` - Site management (user-based)
- `ScanController` - Scan management (user-based)
- `IssueController` - Issue management (user-based)
- `DashboardController` - Dashboard stats (user-based)

**New Controllers (Scanner - Team-based):**
- `ScannerSiteController` - Site management (team-based, with limits)
- `ScannerScanController` - Scan management (team-based, with limits)
- `ScannerIssueController` - Issue management (team-based)
- `ScannerDashboardController` - Dashboard stats (team-based)
- `ScannerUsageController` - Usage statistics (team-based)
- `ScannerMcpController` - MCP API key management

**Services:**
- `FixGeneratorService` - AI-powered fix generation

**Jobs:**
- `ProcessScan` - Process scan asynchronously

**Middleware:**
- `TeamContext` - Extract team from X-Team-ID header
- `CheckScannerLimits` - Enforce subscription limits (sites, scans/month)

**Features:**
- Website monitoring
- Accessibility scanning (WCAG compliance)
- SEO scanning
- Performance scanning
- Security scanning
- AI-powered fix generation
- Scheduled scans
- Scan reports
- Team-scoped resources (multiple team members share sites/scans)
- Subscription limits enforced at team level (free: 3 sites/10 scans, pro: 10 sites/100 scans, etc.)
- MCP API key management

**Routes:** 
- Legacy: `/api/scanner/*` (user-based, no team context)
- New: `/api/scanner/*` (team-based, requires TeamContext middleware)

---

### Processes Module (`app/Modules/Processes`)
**Status:** ✅ **FULLY IMPLEMENTED**

**Models:**
- `Process` - Process definitions (team-scoped, profile-scoped, optional project link)
- `ProcessStep` - Steps within processes (order, step_type, config)
- `ProcessExecution` - Execution tracking records

**Controllers:**
- `ProcessController` - Full CRUD API with publish/execute endpoints
- `ProcessStepController` - Step management API
- `ProcessExecutionController` - Execution tracking API

**Services:**
- `ProcessExecutionService` - Comprehensive step execution logic:
  - Action steps (log, update status)
  - Condition steps (if/then logic)
  - Delay steps
  - Notification steps
  - Webhook steps
  - Create/Update task steps
- `ProcessTriggerService` - Trigger management

**Database Tables:**
- `processes` - UUID, team_id, profile_id, name, slug, status (draft/active/archived), trigger_type, trigger_config, project_id
- `process_steps` - UUID, process_id, name, order, step_type, config
- `process_executions` - UUID, process_id, task_id, project_id, status, execution_data, step_results

**API Routes:** `/api/processes/*` (requires `auth:sanctum` + `TeamContext` middleware)
- `GET /api/processes` - List processes (with filters, search, pagination)
- `POST /api/processes` - Create process
- `GET /api/processes/{id}` - Get process
- `PUT /api/processes/{id}` - Update process
- `DELETE /api/processes/{id}` - Delete process
- `POST /api/processes/{id}/publish` - Publish process (draft → active)
- `POST /api/processes/{id}/execute` - Execute process
- `GET /api/processes/{process}/steps` - List steps
- `POST /api/processes/{process}/steps` - Create step
- `GET /api/processes/{process}/executions` - List executions
- `GET /api/processes/executions/{id}` - Get execution

**Features:**
- Team-scoped processes (multiple team members can access)
- Profile-scoped (optional)
- Project-linked (optional)
- Process status: draft, active, archived
- Trigger types: manual, task_created, task_updated, schedule, webhook
- Step types: action, condition, delay, notification, webhook, create_task, update_task
- Execution tracking with step-by-step results
- Slug auto-generation (unique within team)

---

### Projects Module (`app/Modules/Projects`)
**Status:** ✅ **FULLY IMPLEMENTED**

**Models:**
- `Project` - Project definitions (team-scoped, profile-scoped, owner, methodology, status, budget, health_score)
- `ProjectMember` - Many-to-many relationship with roles and allocation percentages

**Controllers:**
- `ProjectController` - Full CRUD API with stats endpoint

**Database Tables:**
- `projects` - UUID, team_id, profile_id, owner_id, name, code, description, methodology, status, priority, dates, budget, settings, tags, health_score
- `project_members` - UUID, project_id, user_id, role, allocation_percentage

**API Routes:** `/api/projects/*` (requires `auth:sanctum` + `TeamContext` middleware)
- `GET /api/projects` - List projects (with filters, search, pagination, scoped to user's projects)
- `POST /api/projects` - Create project (auto-adds creator as owner member)
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/stats` - Project statistics (task stats, health score)

**Features:**
- Team-scoped projects (multiple team members can access)
- Profile-scoped (optional)
- Project owner (user who created it)
- Project members with roles (owner, admin, member, viewer) and allocation percentages
- Methodologies: hybrid, agile, waterfall, kanban, scrum
- Status: planning, active, on_hold, completed, cancelled
- Priority: low, medium, high, urgent
- Budget tracking (budget vs budget_spent)
- Health score calculation (based on task completion and overdue tasks)
- Task statistics (total, pending, active, completed, overdue, completion_rate)
- Project code (short identifier, max 10 chars)
- Tags and settings (JSONB)
- Relationships: tasks, processes
- ✅ **Database Migrations:**
  - `create_projects_table` (UUID, organization_id, owner_id, name, code, description, methodology, status, priority, dates, budget, settings, tags, health_score)
  - `create_project_members_table` (UUID, project_id, user_id, role, allocation_percentage)
- ✅ **API Routes:** `/api/projects/*`, `/api/projects/{project}/members/*`, `/api/projects/{project}/tasks/*`
- ✅ **Frontend:** Vue store (`projects-web/src/stores/projects.ts`) and API client (`projects-web/src/api/projects.ts`)
- ✅ **Integration:** Tasks nested under projects (`/api/projects/{project}/tasks`)

**Key Features:**
- Project methodologies (hybrid, agile, waterfall, etc.)
- Project health scoring
- Budget tracking
- Member management with roles and allocation
- Task statistics and completion tracking
- Milestone support (via frontend API, backend may need implementation)

**Key Differences:**
- `projects-web` uses `organization_id` for multi-tenancy
- `taskjuggler-api` uses `team_id` and `profile_id` for multi-tenancy
- `projects-web` has `owner_id` (user who owns the project)
- Code would need to be adapted/ported to match `taskjuggler-api`'s architecture

**What This Means:**
The Projects module functionality **exists but is in a different application**. The frontend in `scanner-web` already references `project_id` in `CreateTaskModal.vue`, but the backend API doesn't exist in `taskjuggler-api`. To use it, the code would need to be ported from `projects-web` and adapted to match the team/profile-based multi-tenancy model.

**Planned Functionality (Inferred from Architecture):**
Based on the module name and TaskJuggler's architecture, this module would likely handle:
- Project management (collections of related tasks)
- Project templates and structures
- Project timelines and milestones
- Project team assignments
- Project progress tracking
- Integration with tasks (tasks could belong to projects)
- Project-based reporting and analytics

**Frontend Readiness:**
- ✅ Frontend already references `project_id` in `CreateTaskModal.vue`
- ✅ Frontend attempts to fetch projects from `/api/projects` (gracefully handles 404)
- ✅ Tasks store accepts `project_id` parameter
- ✅ AppSwitcher references "4projects.ai" (separate app - `projects-web`)
- ⚠️ **Gap:** Frontend expects projects API but backend doesn't exist in `taskjuggler-api`
- ✅ **Note:** Full implementation exists in `projects-web` application - could be ported

**To Implement:**
1. Create database migrations for projects tables
   - `projects` table (id, name, description, team_id, profile_id, status, etc.)
   - `project_members` table (many-to-many with users/teams)
   - `project_tasks` relationship (or add project_id to tasks table)
2. Create Project model(s) in `app/Modules/Projects/Models/`
3. Create ProjectController with CRUD operations
4. Create ProjectService for business logic
5. Register routes in `routes/api.php`:
   ```php
   Route::prefix('projects')->group(function () {
       Route::get('/', [ProjectController::class, 'index']);
       Route::post('/', [ProjectController::class, 'store']);
       Route::get('/{id}', [ProjectController::class, 'show']);
       Route::put('/{id}', [ProjectController::class, 'update']);
       Route::delete('/{id}', [ProjectController::class, 'destroy']);
   });
   ```
6. Create API endpoints for project management
7. Add `project_id` column to `tasks` table (if not exists)
8. Add project relationships to Team and Profile models
9. Update Task model to include project relationship

---

## Core Features

### 1. Task Management
- **Requestor/Do-er Model:** Tasks separate who needs it done from who does it
- **Multiple Assignment Types:** Can assign to user, team member, or marketplace vendor
- **Status Workflow:** pending → accepted → in_progress → completed
- **Color States:** Visual indicators based on due date (blue, green, yellow, red)
- **Task Invitations:** Share tasks via invite codes
- **Task Messages:** Comments and communication on tasks
- **Task Export:** iCal, CSV, PDF formats
- **TEF Support:** Task Exchange Format for interoperability

### 2. AI Receptionist
- **Multi-Channel:** Phone (Twilio), Email (SendGrid), SMS (Twilio)
- **Inbox System:** Raw incoming communications before task creation
- **AI Extraction:** Extract structured data from unstructured messages
- **Routing Rules:** Deterministic routing based on conditions
- **Auto-Response:** Automatic responses to incoming messages

### 3. Team Collaboration
- **Teams:** Multi-user teams with admin roles
- **Team Invitations:** Invite users to teams via codes
- **Team-Scoped Resources:** Tasks, sites, scans scoped to teams
- **Profile Context:** Teams belong to profiles (organizations)

### 4. Marketplace
- **Vendor Types:** Human, AI, or hybrid vendors
- **Listings:** Post tasks to marketplace
- **Bidding:** Vendors can bid on listings
- **AI Tools:** Configure and execute AI tools
- **Payments:** Stripe Connect integration for payments

### 5. SiteHealth Scanner
- **Website Monitoring:** Monitor multiple websites
- **Accessibility Scanning:** WCAG compliance checking
- **AI Fix Generation:** Generate code fixes for issues
- **Scheduled Scans:** Recurring scan schedules
- **Team-Scoped:** Sites and scans belong to teams
- **Subscription Limits:** Site and scan limits based on plan

### 6. TEF (Task Exchange Format)
- **Actor System:** Humans, AI agents, teams, IoT devices
- **Relationships:** Relationships between actors with trust scores
- **Conversations:** Message-based conversations
- **Delegation Rules:** Automatic task delegation
- **Claim Codes:** Secure actor claiming system

### 7. Appointments
- **Appointment Types:** Define appointment types
- **Availability Slots:** Define available time slots
- **Public Booking:** Public booking pages with slugs
- **Recurring Slots:** Support for recurring availability

### 8. Notifications
- **In-App Notifications:** User notifications
- **Push Notifications:** Push token support
- **Notification Types:** Task assignments, messages, marketplace bids, etc.

### 9. Direct Messaging
- **User-to-User:** Direct messages between users
- **Read Receipts:** Track message reads
- **Unread Counts:** Unread message counts

### 10. Contact Lists
- **Contact Management:** Create and manage contact lists
- **Import:** Import contacts from CSV
- **Members:** Add members to contact lists

---

## Services & Integrations

### External Services

#### Twilio
- **Voice:** Phone calls, voicemail, transcription
- **SMS:** SMS messaging
- **Webhooks:** Voice, recording, transcription, SMS

#### SendGrid
- **Email:** Inbound email processing
- **Webhooks:** Inbound email webhooks

#### Stripe
- **Payments:** Customer management, subscriptions
- **Stripe Connect:** Marketplace vendor payments

#### Pusher
- **Broadcasting:** Real-time event broadcasting
- **Channels:** Private channels for users/teams

#### Redis (Optional)
- **Cache:** Caching layer
- **Queue:** Queue driver option
- **Sessions:** Session storage option

### Internal Services

#### AI Services
- `OpenRouterService` - OpenRouter API integration
- `TaskExtractor` - Extract structured data from messages
- `DelegationEngine` - Task delegation logic
- `AiAgentRegistrationService` - AI agent registration
- `McpServerService` - Model Context Protocol server

#### Routing Services
- `RuleEngine` - Routing rule evaluation
- `ConditionEvaluator` - Condition evaluation
- `RoutingDecision` - Routing decision logic

#### Task Services
- `TaskStateMachine` - Task state transitions
- `TaskInvitationService` - Task invitation management
- `TaskMessageService` - Task message management

#### TEF Services
- `ActorService` - Actor management
- `RelationshipService` - Relationship management
- `TrustScoringService` - Trust score calculation
- `TEFMessageFactory` - TEF message creation
- `TEFValidator` - TEF validation

#### Notification Services
- `NotificationService` - Notification management

#### Message Router
- `MessageRouter` - Route messages to appropriate channels
- **Adapters:** Email, SMS, Slack, In-App

#### Marketplace Services
- `VendorMatcher` - Match vendors to listings
- `AiToolExecutor` - Execute AI tools

#### Scanner Services
- `FixGeneratorService` - Generate AI fixes for issues

#### IoT Services
- `DeviceRegistrationService` - IoT device registration
- `MqttBrokerService` - MQTT broker integration
- `CoapMatterService` - CoAP/Matter protocol support

#### Calendar Services
- `CalendarService` - Calendar integration

#### Booking Services
- `BookingService` - Appointment booking logic

#### Contact Services
- `ContactImportService` - Import contacts

#### Export Services
- `TaskExportService` - Export tasks to various formats

#### Performance Services
- `CacheService` - Cache management

#### IdeaCircuit Services
- `ChimeService` - Amazon Chime integration

---

## Authentication & Authorization

### Authentication Methods
1. **Laravel Sanctum:** API token authentication
2. **Google OAuth:** Social authentication
3. **Password Reset:** Email-based password reset

### Authorization
- **Middleware:** `auth:sanctum` for protected routes
- **Team Context:** `TeamContext` middleware for team-scoped routes
- **Profile Context:** `ProfileContext` middleware for profile-scoped routes
- **Module Access:** `ModuleAccess` middleware for module access control
- **Policies:** Laravel policies for resource authorization

### Subscription Plans
- **Free:** Basic features, limited limits
- **Pro:** Enhanced features, higher limits
- **Business:** Team features, even higher limits
- **Enterprise:** Unlimited features and limits

### Plan Limits (Scanner Example)
- **Free:** 3 sites, 10 scans/month
- **Pro:** 10 sites, 100 scans/month
- **Business:** 50 sites, 500 scans/month
- **Enterprise:** Unlimited

---

## Middleware

### Core Middleware
- **AppContext** - Application context middleware
- **ProfileContext** - Profile context middleware
- **TeamContext** - Team context middleware (extracts X-Team-ID header)
- **ModuleAccess** - Module access control
- **CheckScannerLimits** - Check subscription limits for scanner operations

### Security Middleware
- **ValidateTwilioSignature** - Validate Twilio webhook signatures
- **ValidateSendGridSignature** - Validate SendGrid webhook signatures

---

## Events & Jobs

### Events
- `TaskCreated` - Task created
- `TaskAssigned` - Task assigned
- `TaskCompleted` - Task completed
- `InboxItemReceived` - Inbox item received
- `AiToolCompleted` - AI tool execution completed
- `IdeaCircuit/MeetingEnded` - Meeting ended
- `IdeaCircuit/MessageReceived` - Message received
- `IdeaCircuit/NoteCreated` - Note created
- `IdeaCircuit/ParticipantJoined` - Participant joined
- `IdeaCircuit/ParticipantLeft` - Participant left

### Jobs
- `RouteTask` - Route task based on rules
- `ProcessEmail` - Process incoming email
- `ProcessSms` - Process incoming SMS
- `ProcessVoicemail` - Process voicemail
- `ExecuteAiTool` - Execute AI tool
- `ProcessScan` - Process website scan (SiteHealth)

---

## Key Models & Relationships

### User Model
**Relationships:**
- `tasks()` - Tasks where user is requestor
- `assignedTasks()` - Tasks assigned to user
- `teams()` - Teams user belongs to
- `profiles()` - User profiles
- `routingRules()` - Routing rules
- `assistantChannels()` - Communication channels
- `inboxItems()` - Inbox items
- `notifications()` - Notifications
- `marketplaceVendors()` - Marketplace vendors
- `appointmentTypes()` - Appointment types

**Key Methods:**
- `isPro()` - Check if user has Pro plan
- `getPhoneChannel()` - Get active phone channel
- `getEmailChannel()` - Get active email channel
- `canCreateProfile()` - Check profile limit
- `getProfileLimit()` - Get profile limit based on plan

### Task Model
**Relationships:**
- `requestor()` - User who needs it done
- `owner()` - User doing it (if user)
- `teamMember()` - Team member doing it (if team member)
- `marketplaceVendor()` - Vendor doing it (if vendor)
- `team()` - Team task belongs to
- `profile()` - Profile task belongs to
- `messages()` - Task messages
- `actions()` - Task action history
- `invitations()` - Task invitations
- `sourceChannel()` - Source communication channel
- `routingRule()` - Matched routing rule

**Key Methods:**
- `assignTo()` - Assign task to user/team member/vendor
- `markCompleted()` - Mark task as completed
- `addDeliverable()` - Add deliverable to task
- `updateColorState()` - Update color state based on due date
- `calculateColorState()` - Calculate color state

**Status Constants:**
- `STATUS_PENDING`, `STATUS_ACCEPTED`, `STATUS_IN_PROGRESS`, `STATUS_COMPLETED`, `STATUS_CANCELLED`, `STATUS_OVERDUE`

**Color States:**
- `COLOR_BLUE` (normal/default)
- `COLOR_GREEN` (completed)
- `COLOR_YELLOW` (due soon, within 24 hours)
- `COLOR_RED` (overdue)

### Team Model
**Relationships:**
- `creator()` - User who created team
- `profile()` - Profile team belongs to
- `members()` - Team members
- `admins()` - Team admins
- `tasks()` - Tasks assigned to team
- `invitations()` - Pending invitations

**Key Methods:**
- `hasMember()` - Check if user is member
- `hasAdmin()` - Check if user is admin
- `addMember()` - Add member to team
- `removeMember()` - Remove member from team

### Profile Model
**Relationships:**
- `user()` - User who owns profile
- `teams()` - Teams belonging to profile

**Types:**
- `personal` - Personal profile
- `organization` - Organization profile
- `company` - Company profile

---

## Infrastructure

### Deployment
- **Platform:** AWS (ECS, S3, CloudFront, CodeBuild, CodePipeline)
- **Container:** Docker
- **Database:** PostgreSQL 16 (Railway/AWS RDS)
- **Queue:** Database queue (Redis optional)
- **Cache:** Database cache (Redis optional)
- **Storage:** S3-compatible storage

### CI/CD
- **CodeBuild:** Automated builds
- **CodePipeline:** CI/CD pipeline
- **GitHub Integration:** Webhook triggers
- **Docker:** Containerized deployments

### Monitoring
- **Logging:** Laravel logging
- **Performance:** Cache statistics endpoints
- **Test Results:** Test results API

### Environment
- **PHP:** 8.2+
- **Laravel:** 12.0
- **PostgreSQL:** 16
- **Node.js:** For frontend builds

---

## Key Integrations

### Twilio
- Voice calls, SMS, voicemail transcription
- Webhook signature validation
- Phone number provisioning

### SendGrid
- Inbound email processing
- Webhook signature validation
- Email channel creation

### Stripe
- Customer management
- Subscription management
- Stripe Connect for marketplace

### Pusher
- Real-time event broadcasting
- Private channels

### OpenRouter
- AI model access
- Task extraction
- Fix generation

### Vapi
- Voice AI calls
- Call management

### Amazon Chime
- Meeting management (IdeaCircuit)

### MCP (Model Context Protocol)
- MCP server registration
- API key management
- Token generation

---

## Summary

### Strengths
1. **Modular Architecture:** Well-organized module structure
2. **Comprehensive API:** Extensive RESTful API coverage
3. **Multi-Tenancy:** Team and profile-based multi-tenancy
4. **Flexible Schema:** JSONB fields for extensibility
5. **Event-Driven:** Async processing via events and jobs
6. **Service Layer:** Clean separation of concerns
7. **TEF Support:** Interoperability via Task Exchange Format
8. **Multiple Integrations:** Twilio, SendGrid, Stripe, Pusher, etc.

### Areas for Improvement
1. **Documentation:** API documentation could be enhanced (Scramble available)
2. **Testing:** More comprehensive test coverage
3. **Subscription System:** Subscription table structure needs clarification
4. **Processes/Projects Modules:** 
   - **Status:** Directory structure exists but completely empty in `taskjuggler-api` (no implementation)
   - **Impact:** Frontend references project_id in CreateTaskModal but backend has no projects table/API
   - **Priority:** Medium - Needed for task organization and project management features
   - **Effort:** Medium - **Implementation exists in `projects-web`** - needs porting and adaptation
   - **Note:** Both Processes and Projects modules are fully implemented in `projects-web` application:
     - Full CRUD APIs
     - Database migrations
     - Models with relationships
     - Services (ProcessExecutionService)
     - Frontend stores and API clients
     - **Key difference:** `projects-web` uses `organization_id`, `taskjuggler-api` uses `team_id`/`profile_id`
5. **IdeaCircuit Module:** Structure unclear (meetings exist but module directory missing)

### Architecture Highlights
- **Requestor/Do-er Model:** Unique task assignment model
- **Team Context:** Multi-tenant with team-scoped resources
- **Profile Context:** Multi-profile support for users
- **Modular Design:** Feature-based modules
- **TEF:** Task Exchange Format for interoperability
- **Event-Driven:** Async processing via events/jobs

---

**Total API Endpoints:** 200+  
**Total Database Tables:** 40+  
**Total Modules:** 7 (Core, Tasks, Urpa, Coordinator, SiteHealth/Scanner, Processes, Projects)  
**Total Services:** 40+  
**Total Models:** 39+

**Note:** Scanner is part of SiteHealth module - there are two implementations:
- **Legacy:** User-based (`app/Modules/SiteHealth/`) - Each user has their own sites/scans
- **New:** Team-based (`app/Http/Controllers/Scanner/`) - Teams share sites/scans under one subscription; multiple team members can access the same resources; limits are enforced at the team level  

---

**Review Completed:** January 13, 2026

