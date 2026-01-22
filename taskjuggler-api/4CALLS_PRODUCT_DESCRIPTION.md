# 4Calls.AI - Complete Product Description

## Executive Summary

4Calls.AI (formerly Coordinator) is an AI-powered virtual assistant platform designed for small and medium businesses (SMBs) to automate customer communications, appointment scheduling, and business operations through intelligent voice and text interactions. The platform enables businesses to deploy AI coordinators that handle inbound and outbound calls, manage calendars, interact with customers, and continuously learn from interactions to improve performance.

---

## Core Value Proposition

**4Calls.AI transforms how small businesses handle customer communications by providing:**
- **24/7 AI Receptionists** - Never miss a call or opportunity
- **Intelligent Scheduling** - Automated appointment booking and management
- **Outbound Campaigns** - Automated calling campaigns for follow-ups, confirmations, and lead generation
- **Continuous Learning** - AI that learns from every interaction to improve responses
- **Business Intelligence** - Analytics and insights into customer interactions and business patterns
- **Multi-Channel Support** - Phone calls, SMS, and future email/chat integration

---

## System Architecture

### Multi-Tenant Organization Model
- **Organizations** - Each business customer is an organization with its own:
  - Business profile (name, industry, contact info, business hours)
  - Subscription tier (starter, professional, enterprise)
  - Compliance modes (HIPAA, legal privilege, etc.)
  - Team members and permissions
  - Custom settings and configurations

### AI Coordinator Model
- **Coordinators** - AI virtual assistants configured with:
  - **Role Templates** - Pre-defined roles (Receptionist, Scheduler, Dispatcher, Relationship Manager, Business Strategist)
  - **Persona Templates** - Personality traits, communication style, voice characteristics
  - **Custom Configuration** - Business-specific prompts, scripts, greetings, and availability
  - **Voice Selection** - Integration with ElevenLabs for natural voice synthesis
  - **Status Management** - Active, paused, or inactive states

### AI Agent Architecture
- **AI Agents** - Runtime instances of coordinators deployed via Vapi.ai:
  - Agent authentication with secure credentials
  - Session management with permissions and restrictions
  - Platform integration (Vapi.ai for AI voice, AWS for telephony)
  - Version tracking and deployment management

---

## Core Features & Capabilities

### 1. AI Agent Authentication & Authorization

**Purpose**: Secure authentication and permission management for AI agents accessing business data.

**Key Components**:
- **Agent Authentication** (`POST /internal/ai/auth`)
  - Agent ID and secret verification
  - Organization validation
  - Session token generation (8-hour expiration)
  - Subscription status checking

- **Permission System**
  - Role-based permissions (read_profile, read_calendar, create_booking, etc.)
  - Tier-based restrictions (starter, growth, enterprise)
  - Compliance mode restrictions (HIPAA, legal privilege)
  - Agent type-specific capabilities

- **Session Management**
  - Session token validation
  - Token refresh mechanism
  - Last-used tracking
  - IP address and user agent logging

**Supported Agent Types**:
- **Receptionist** - Answer calls, answer FAQs, schedule appointments, create leads
- **Scheduler** - Calendar management, appointment booking, team coordination
- **Dispatcher** - Task creation, team assignment, resource allocation
- **Relationship Manager** - CRM access, customer history, relationship building
- **Business Strategist** - Financial data, analytics, strategic insights

---

### 2. Context Packet Delivery System

**Purpose**: Provide AI agents with comprehensive, up-to-date business knowledge in a structured, cacheable format.

**Architecture**:
- **Three-Tier Knowledge Model**:
  1. **Platform Knowledge** (Tier 1) - Universal capabilities, limitations, escalation phrases
  2. **Industry Knowledge** (Tier 2) - Industry-specific terminology, services, compliance notes
  3. **Business Profile** (Tier 3) - Business-specific information, FAQs, team, calendar, rules

**Key Features**:
- **Context Packet Generation** (`GET /internal/ai/context/{business_id}`)
  - Dynamic packet assembly from multiple data sources
  - Checksum generation for integrity verification
  - Version tracking and caching

- **Caching & Invalidation**
  - 4-hour TTL (Time To Live)
  - 1-hour refresh interval
  - Event-based invalidation (business_profile_updated, faq_updated, calendar_changed)
  - Immediate invalidation for critical updates

- **Packet Contents**:
  - Platform capabilities and limitations
  - Industry terminology and common services
  - Business identity (name, contact, hours, service area)
  - Business FAQs (top 50, prioritized)
  - Team summary and availability
  - Calendar summary (next available slots, typical lead time)
  - Rules and boundaries (prohibited topics, escalation triggers, privacy rules)

**Use Cases**:
- AI agent initialization
- Real-time knowledge updates
- FAQ lookup during conversations
- Calendar availability queries
- Customer lookup and CRM access

---

### 3. Real-Time Operations

**Purpose**: Enable AI agents to perform live business operations during customer interactions.

#### 3.1 Calendar & Availability Management

**Features**:
- **Get Availability** (`GET /internal/ai/calendar/{business_id}/availability`)
  - Service type-based availability
  - Date range queries
  - Duration-based slot calculation
  - Business hours enforcement
  - Conflict detection with existing appointments

- **Calendar Summary**
  - Next available appointment slots
  - Typical lead time calculation
  - Same-day availability detection
  - Business hours validation

#### 3.2 Customer Lookup & CRM

**Features**:
- **Customer Lookup** (`GET /internal/ai/crm/{business_id}/customers/lookup`)
  - Phone number lookup
  - Email lookup
  - Name-based search
  - Customer history summary
  - Previous appointment count

- **Contact Management**
  - Automatic contact creation from calls
  - Contact deduplication
  - Last contacted tracking
  - Lifetime value tracking

#### 3.3 Appointment Booking

**Features**:
- **Create Booking** (`POST /internal/ai/calendar/{business_id}/bookings`)
  - Service type selection
  - Date/time scheduling
  - Customer information capture
  - Location type (in-person, phone, video)
  - Automatic contact creation/update
  - Coordinator attribution

- **Appointment Management**
  - Status tracking (scheduled, confirmed, completed, cancelled, no_show)
  - Cancellation with reason tracking
  - Reminder management
  - Assignment to team members

#### 3.4 Lead Creation

**Features**:
- **Create Lead** (`POST /internal/ai/crm/{business_id}/leads`)
  - Contact information capture
  - Interest tracking
  - Callback request handling
  - Source attribution (ai_coordinator)
  - Notes and context preservation

---

### 4. Campaign Management

**Purpose**: Automated outbound calling campaigns for appointment confirmations, follow-ups, surveys, and sales.

**Campaign Types**:
- **Appointment Confirmation** - Confirm upcoming appointments
- **Appointment Booking** - Proactive appointment scheduling
- **Survey** - Customer satisfaction and feedback collection
- **Sales** - Lead generation and conversion

**Key Features**:
- **Campaign Creation** (`POST /api/coordinator/organizations/{orgId}/campaigns`)
  - Name, type, and description
  - Coordinator assignment
  - Target contact selection (specific contacts or filters)
  - Target count limits
  - Custom scripts and prompts
  - Scheduling (start/end dates, rules)

- **Campaign Execution**
  - Status management (draft, scheduled, running, paused, completed, cancelled)
  - Contact processing queue
  - Call outcome tracking
  - Automatic statistics calculation

- **Campaign Statistics**:
  - Contacts processed
  - Contacts contacted
  - Contacts answered
  - Appointments booked
  - Appointments confirmed
  - Answer rate
  - Booking rate
  - Confirmation rate

- **Campaign Controls**:
  - Start/pause/resume
  - Real-time progress tracking
  - Automatic completion when targets met
  - Scheduled execution

**Filtering Options**:
- Contact status
- Tags
- Source
- Custom field criteria

---

### 5. Appointment Management

**Purpose**: Comprehensive appointment scheduling and management system.

**Features**:
- **Appointment Types**
  - Service definitions (name, description, duration, price)
  - Buffer times (before/after)
  - Availability rules
  - Confirmation requirements
  - Online booking settings

- **Appointment Lifecycle**:
  - **Scheduled** - Initial booking
  - **Confirmed** - Customer confirmed
  - **Completed** - Service delivered
  - **Cancelled** - Cancelled with reason
  - **No Show** - Customer didn't arrive

- **Appointment Operations**:
  - Create appointments (`POST /api/coordinator/organizations/{orgId}/appointments`)
  - Update appointments (`PUT /api/coordinator/organizations/{orgId}/appointments/{id}`)
  - Cancel appointments (`POST /api/coordinator/organizations/{orgId}/appointments/{id}/cancel`)
  - View today's appointments (`GET /api/coordinator/organizations/{orgId}/appointments/today`)
  - Filter by date range, status, coordinator, contact

- **Appointment Tracking**:
  - Coordinator attribution (which AI booked it)
  - User assignment (which human handles it)
  - Location tracking (onsite, phone, video)
  - Reminder tracking
  - Confirmation timestamps

---

### 6. Contact & CRM Management

**Purpose**: Centralized customer relationship management integrated with all interactions.

**Contact Features**:
- **Contact Records**:
  - Personal information (name, email, phone, secondary phone)
  - Company information (company, job title)
  - Address information (full address, city, state, postal code, country)
  - Source tracking (where contact came from)
  - Status management (active, inactive, etc.)
  - Tags and custom fields
  - Notes and lifetime value

- **Contact Operations**:
  - Create contacts (`POST /api/coordinator/organizations/{orgId}/contacts`)
  - Update contacts (`PUT /api/coordinator/organizations/{orgId}/contacts/{id}`)
  - Search and filter (`GET /api/coordinator/organizations/{orgId}/contacts`)
  - Bulk operations (bulk delete, bulk tag)
  - Last contacted tracking

- **Contact Relationships**:
  - Appointment history
  - Interaction history
  - Call history
  - Lifetime value calculation

---

### 7. Call Logging & Management

**Purpose**: Comprehensive call tracking, recording, and analysis.

**Call Features**:
- **Call Records**:
  - Direction (inbound, outbound)
  - Phone numbers (from/to)
  - Status (initiated, in-progress, completed, failed, no-answer)
  - Duration tracking
  - Recording URLs (AWS S3 storage)
  - Transcripts (AWS Transcribe)
  - AI-generated summaries
  - Outcomes (Appointment Booked, Confirmed, Inquiry Resolved, etc.)
  - Cost tracking
  - Provider information (AWS Connect, Vapi)

- **Call Operations**:
  - View call history (`GET /api/coordinator/organizations/{orgId}/calls`)
  - Search calls (by phone, contact name, number)
  - Filter by coordinator, direction, status, outcome, date range
  - View call details (`GET /api/coordinator/organizations/{orgId}/calls/{id}`)
  - Call statistics (`GET /api/coordinator/organizations/{orgId}/calls/stats`)

- **Call Statistics**:
  - Calls today
  - Average duration
  - Booking rate (calls that resulted in appointments)
  - Total calls (filtered by date range)
  - Answer rate
  - Cost analysis

- **Integration**:
  - AWS Connect for call routing
  - AWS S3 for recording storage
  - AWS Transcribe for speech-to-text
  - Vapi.ai for AI voice interactions
  - Communication module for unified telephony

#### 7.1 Inbound Call Management

**Current Implementation**:
- **Basic Inbound Call Handling**: AWS Connect webhooks receive inbound calls and create call records
- **Call Transfer**: Basic transfer functionality to AWS Connect queues or users (`transferCall()` method)
- **Call Status Tracking**: Real-time status updates (ringing, connected, ended)

**What's Missing (RingCentral-like Features)**:
- **IVR Menu Systems**: No application-level IVR menu configuration (relies on AWS Connect Contact Flows configured in AWS Console)
- **Call Routing Rules**: No time-based, caller ID-based, or custom routing rules configured in the application
- **Call Forwarding to External Numbers**: No ability to forward calls to external phone numbers (only internal transfers)
- **Voicemail Management**: No voicemail handling, transcription, or notification system
- **Call Queues**: No queue management UI or configuration (relies on AWS Connect queues)
- **Business Hours Routing**: No application-level business hours routing logic
- **After-Hours Handling**: No automated after-hours call handling or voicemail routing
- **Call Screening**: No call screening or call blocking features
- **Call Hold/Music on Hold**: No hold functionality or custom hold music
- **Call Conferencing**: No multi-party conference call capabilities
- **Call Recording Controls**: No per-call recording on/off controls
- **Call Analytics Dashboard**: Limited analytics compared to RingCentral's comprehensive dashboards

**Note**: Many of these features can be implemented using AWS Connect's Contact Flow system, but they must be configured in AWS Console rather than through the 4Calls application interface. The application currently focuses on AI agent interactions (via Vapi) rather than traditional PBX features.

---

### 8. Learning & Experience Capture

**Purpose**: Continuous learning system that analyzes interactions to improve AI performance and business insights.

#### 8.1 Interaction Logging

**Features**:
- **Interaction Records** (`POST /internal/ai/interactions/{business_id}`)
  - Channel tracking (phone, chat, SMS, email)
  - Duration and timestamps
  - Customer identification
  - Intent extraction
  - Outcome tracking
  - Conversation summaries
  - Transcript references
  - Sentiment analysis
  - FAQs used
  - Unknown questions

- **Feedback Collection** (`POST /internal/ai/interactions/{interaction_id}/feedback`)
  - Customer satisfaction ratings
  - Business review ratings
  - Comments and source tracking

#### 8.2 FAQ Suggestion System

**Features**:
- **Automatic FAQ Discovery**:
  - Unknown question tracking
  - Frequency analysis
  - Context preservation
  - Similarity detection (fuzzy matching)
  - Priority calculation (high, medium, low)

- **FAQ Suggestion Workflow**:
  1. Question asked multiple times (frequency >= 2)
  2. System creates FAQ suggestion
  3. Proposed answer generation from context
  4. Business owner review
  5. Approval/rejection/dismissal
  6. Approved FAQs added to knowledge base

- **FAQ Effectiveness Tracking**:
  - Usage frequency
  - Success rate (led to booking)
  - Improvement suggestions
  - Most used FAQs

#### 8.3 Business Experience Analysis

**Features**:
- **Customer Patterns**:
  - Busy times analysis
  - Common services requested
  - Day-of-week distribution
  - Peak hours identification

- **Conversation Patterns**:
  - Average call duration
  - Booking conversion rate
  - Common objections
  - Successful response patterns
  - Total interactions

- **Period-Based Analysis**:
  - Configurable time periods
  - Trend identification
  - Comparative analysis
  - Last analyzed tracking

---

### 9. Persona Configuration & Consensus

**Purpose**: Manage AI coordinator personalities and resolve conflicts between AI agent preferences and business owner preferences.

**Features**:
- **Persona Configuration**:
  - Identity (name, role, background)
  - Personality traits (core traits, emotional range)
  - Communication style (tone, formality, language)
  - Voice configuration (voice ID, speed, pitch)
  - Behavior rules
  - Custom prompts and scripts

- **Configuration Workflow**:
  1. AI agent registration with default persona
  2. Business owner customizations
  3. Configuration merging (consensus)
  4. Conflict detection (hard/soft/no conflict)
  5. Approval workflow
  6. Version tracking

- **Consensus System**:
  - Conflict identification
  - AI agent position vs. command center position
  - Conflict type determination
  - SMB approval requirements
  - Resolution tracking

- **Version Management**:
  - Parent-child version relationships
  - Baseline metrics tracking
  - Current metrics comparison
  - Review date scheduling
  - Active configuration management

---

### 10. Analytics & Reporting

**Purpose**: Comprehensive business intelligence and performance metrics.

**Dashboard Metrics** (`GET /api/coordinator/organizations/{orgId}/dashboard/metrics`):
- **Calls Today**:
  - Current day call count
  - Trend comparison (vs. yesterday)
  - Percentage change

- **Appointments This Week**:
  - Weekly appointment count
  - Trend comparison (vs. last week)
  - Percentage change

- **Total Contacts**:
  - Cumulative contact database size

- **No-Show Rate**:
  - Last 30 days no-show percentage
  - Trend comparison (improving/worsening)

**Analytics Service** (`AnalyticsService`):
- **Call Analytics**:
  - Total calls (inbound/outbound)
  - Answer rate
  - Average duration
  - Appointments booked
  - Booking rate
  - Total cost

- **Appointment Analytics**:
  - Total appointments
  - Confirmation rate
  - Completion rate
  - Cancellation rate
  - No-show rate

- **Contact Analytics**:
  - Total contacts
  - New contacts (period-based)
  - Contacts with appointments

- **Coordinator Performance**:
  - Calls per coordinator
  - Answer rate per coordinator
  - Appointments booked per coordinator
  - Booking rate per coordinator
  - Average duration per coordinator

- **Trends**:
  - Daily/weekly call trends
  - Daily/weekly appointment trends
  - Time-series data for visualization

**Recent Activity**:
- Recent calls (`GET /api/coordinator/organizations/{orgId}/dashboard/recent-calls`)
- Today's appointments (`GET /api/coordinator/organizations/{orgId}/dashboard/today-appointments`)

---

### 11. Billing & Subscription Management

**Purpose**: Stripe-integrated subscription and billing management.

**Features**:
- **Subscription Tiers**:
  - Starter
  - Professional
  - Enterprise

- **Billing Operations**:
  - Get billing information (`GET /api/coordinator/organizations/{orgId}/billing`)
  - View billing history (`GET /api/coordinator/organizations/{orgId}/billing/history`)
  - Update payment method (`PUT /api/coordinator/organizations/{orgId}/billing/payment-method`)
  - Cancel subscription (`POST /api/coordinator/organizations/{orgId}/billing/cancel`)

- **Usage-Based Pricing**:
  - Base subscription price
  - Per-coordinator pricing
  - Monthly cost calculation
  - Usage tracking

- **Payment Management**:
  - Stripe customer creation
  - Payment method storage
  - Invoice history
  - Subscription status tracking
  - Trial period management

---

### 12. Onboarding System

**Purpose**: Streamlined setup process for new businesses.

**Onboarding Flow** (`POST /api/coordinator/onboarding/complete`):
1. **Organization Setup**:
   - Business name and industry
   - Contact information
   - Address and location
   - Timezone and business hours

2. **Role Template Selection** (`GET /api/coordinator/onboarding/role-templates`):
   - Browse available roles
   - View role descriptions and capabilities
   - Select appropriate role

3. **Persona Template Selection** (`GET /api/coordinator/onboarding/persona-templates`):
   - Browse persona options
   - View personality traits and communication styles
   - Select matching persona

4. **Coordinator Configuration**:
   - Display name
   - Custom greeting
   - Custom prompts
   - Voice selection

5. **Business Information**:
   - Services offered
   - Business description
   - Additional details

**Result**:
- Organization created
- Coordinator created and activated
- Ready for AI agent deployment

---

## Technical Integration

### AWS Communications Infrastructure
- **AWS Connect** - Call routing and contact center services
- **AWS SNS/Pinpoint** - SMS sending and receiving
- **AWS Transcribe** - Speech-to-text transcription
- **AWS S3** - Call recording storage
- **Phone Number Service** - Number provisioning (Twilio or AWS)

### AI Voice Platform
- **Vapi.ai** - AI voice interactions and conversation management
- **ElevenLabs** - Text-to-speech synthesis
- **Voice Selection** - Custom voice IDs per coordinator

### Database Architecture
- **PostgreSQL 16** - Primary database
- **UUID Primary Keys** - All entities use UUIDs
- **JSONB Fields** - Flexible data storage (metadata, config, etc.)
- **Soft Deletes** - Data retention
- **Indexes** - Optimized queries

### API Architecture
- **RESTful API** - Standard HTTP methods
- **Laravel Sanctum** - Authentication
- **Team Context Middleware** - Multi-tenant isolation
- **API Resources** - Response transformation
- **Request Validation** - Input validation

---

## Data Models

### Core Entities

1. **Organization** - Business customer
2. **Coordinator** - AI virtual assistant configuration
3. **AiAgent** - Runtime AI agent instance
4. **AiAgentSession** - Active agent session
5. **Contact** - Customer/contact record
6. **Appointment** - Scheduled appointment
7. **AppointmentType** - Service definition
8. **CallLog** - Call record
9. **Campaign** - Outbound calling campaign
10. **AiInteraction** - Interaction log
11. **ContextPacket** - Business knowledge packet
12. **PersonaConfiguration** - AI personality configuration
13. **FaqSuggestion** - Suggested FAQ from interactions
14. **BusinessExperience** - Analyzed business patterns
15. **ConsensusRequest** - Configuration conflict resolution
16. **AuditLog** - Compliance and security audit trail

---

## API Endpoints Summary

### Public/Internal AI Agent Endpoints
- `POST /internal/ai/auth` - Agent authentication
- `POST /internal/ai/auth/refresh` - Session refresh
- `GET /internal/ai/context/{business_id}` - Get context packet
- `GET /internal/ai/context/{business_id}/refresh` - Force refresh context
- `GET /internal/ai/calendar/{business_id}/availability` - Get availability
- `GET /internal/ai/crm/{business_id}/customers/lookup` - Lookup customer
- `POST /internal/ai/calendar/{business_id}/bookings` - Create booking
- `POST /internal/ai/crm/{business_id}/leads` - Create lead
- `POST /internal/ai/interactions/{business_id}` - Log interaction
- `POST /internal/ai/interactions/{interaction_id}/feedback` - Log feedback

### Business Owner Endpoints (49 total routes)
- **Organizations**: List, create, update
- **Coordinators**: List, create, update, delete
- **Appointments**: List, create, update, cancel, delete, today's appointments
- **Contacts**: List, create, update, delete, bulk operations
- **Calls**: List, view, statistics
- **Campaigns**: List, create, update, delete, start, pause, statistics
- **Dashboard**: Metrics, recent calls, today's appointments
- **Billing**: View, history, payment method, cancel
- **Onboarding**: Complete, role templates, persona templates

---

## Compliance & Security

### Compliance Modes
- **HIPAA** - Healthcare data protection
- **Legal Privilege** - Attorney-client privilege protection
- **Custom Compliance** - Configurable compliance rules

### Security Features
- **Agent Authentication** - Secure credential verification
- **Session Management** - Token-based sessions with expiration
- **Permission System** - Role and tier-based access control
- **Audit Logging** - Comprehensive audit trail
- **Data Isolation** - Multi-tenant data separation
- **PII/PHI Tracking** - Sensitive data identification

---

## Use Cases

### 1. Dental Practice
- **Receptionist Coordinator** handles:
  - Appointment scheduling
  - Insurance verification questions
  - Office hours and location
  - Emergency availability
- **Campaigns** for:
  - Appointment confirmations
  - Post-treatment follow-ups
  - Recall reminders

### 2. Plumbing Service
- **Dispatcher Coordinator** handles:
  - Service call scheduling
  - Emergency dispatch
  - Technician availability
  - Pricing inquiries
- **Campaigns** for:
  - Service follow-ups
  - Maintenance reminders
  - Customer satisfaction surveys

### 3. Legal Practice
- **Receptionist Coordinator** handles:
  - Consultation scheduling
  - Practice area questions
  - Attorney availability
  - Initial intake
- **Compliance**: Legal privilege mode enabled

### 4. Restaurant
- **Receptionist Coordinator** handles:
  - Reservation management
  - Menu inquiries
  - Hours and location
  - Special event booking
- **Campaigns** for:
  - Reservation confirmations
  - Special event promotions

---

## Future Enhancements

### Planned Features
- **Email Integration** - Email handling and responses
- **Chat Integration** - Web chat and messaging
- **Multi-Language Support** - Internationalization
- **Advanced Analytics** - Predictive analytics and insights
- **Integration Marketplace** - Third-party integrations (CRM, calendar, etc.)
- **Custom AI Models** - Business-specific AI training
- **Video Calls** - Video appointment support
- **Team Collaboration** - Human-AI handoff workflows

---

## Summary

4Calls.AI is a comprehensive AI-powered business communication platform that enables small businesses to automate customer interactions, manage appointments, run campaigns, and gain insights from every customer touchpoint. The system combines advanced AI voice technology with robust business operations management, continuous learning capabilities, and comprehensive analytics to deliver a complete solution for modern business communication needs.

The platform is designed with scalability, security, and compliance in mind, supporting multiple industries and use cases while maintaining the flexibility to customize AI personalities and behaviors to match each business's unique brand and requirements.

