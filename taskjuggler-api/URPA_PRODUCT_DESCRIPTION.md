# URPA - Complete Product Description

## Executive Summary

URPA (Unified Relationship & Personal Assistant) is an AI-powered personal assistant platform that unifies communication channels, manages activities, and provides intelligent assistance through voice and text interactions. URPA serves as a central hub for personal productivity, aggregating activities from multiple sources, managing contacts, handling phone calls with AI, and integrating with external systems like TaskJuggler and Fibonacci CRM/Publishing.

---

## Core Value Proposition

**URPA transforms personal productivity by providing:**
- **Unified Activity Feed** - Single inbox for emails, texts, tasks, calendar events, and more
- **AI Phone Assistant** - 24/7 AI receptionist that handles calls with natural voice interactions
- **Intelligent Task Management** - AI extracts tasks from conversations and syncs with TaskJuggler
- **Multi-Channel Integration** - Connect email, calendar, messaging, and storage services
- **Context-Aware AI** - AI assistant with rich context about your schedule, tasks, contacts, and business
- **Cost-Optimized Voice** - Pre-recorded voice responses reduce TTS costs while maintaining natural interactions
- **Cross-Platform Sync** - Bidirectional sync with TaskJuggler, Fibonacci CRM, and publishing systems

---

## System Architecture

### User-Centric Model
- **User-Based Scoping** - All resources scoped to individual users (not team-based)
- **User Profiles** - Subscription management, feature flags, usage limits
- **User Personas** - Customizable AI personalities per user
- **Direct Ownership** - Each user owns their data, contacts, activities, and integrations

### Core Components
- **Activities** - Unified feed of all communications and tasks
- **Contacts** - Centralized contact database
- **AI Sessions** - Conversational AI interactions
- **Phone Calls** - Call management with AI handling
- **Integrations** - External system connections
- **Artifacts** - AI-generated content
- **Voice Responses** - Pre-recorded audio responses

---

## Core Features & Capabilities

### 1. Unified Activity Feed

**Purpose**: Centralized inbox for all communications and tasks from multiple sources.

**Activity Types**:
- **Email** - Incoming emails from integrated accounts
- **Text/SMS** - Text messages and SMS
- **Task** - Tasks from various sources
- **Calendar** - Calendar events and appointments
- **Social** - Social media messages and notifications
- **Voicemail** - Voicemail transcriptions

**Key Features**:
- **Activity Aggregation** (`GET /api/urpa/activities`)
  - Unified view of all activities
  - Source tracking (gmail, outlook, slack, taskjuggler, etc.)
  - Activity timestamp preservation
  - Raw content storage for full context

- **Activity Management**:
  - Create activities (`POST /api/urpa/activities`)
  - Update activities (`PUT /api/urpa/activities/{id}`)
  - Mark as read (`PATCH /api/urpa/activities/{id}/read`)
  - Star/unstar (`PATCH /api/urpa/activities/{id}/star`)
  - Delete activities (`DELETE /api/urpa/activities/{id}`)

- **Filtering & Search**:
  - Filter by type (email, text, task, calendar, social, voicemail)
  - Filter by status (pending, urgent, completed, archived)
  - Filter by source (gmail, outlook, slack, etc.)
  - Filter unread items
  - Filter starred items
  - Search by title/description
  - Date range filtering

- **Activity Sync** (`POST /api/urpa/activities/sync`)
  - Sync activities from connected integrations
  - Background job processing
  - Incremental sync with cursor tracking
  - Error handling and retry logic

**Activity Status**:
- **Pending** - New, unprocessed activity
- **Urgent** - High-priority activity requiring attention
- **Completed** - Activity resolved or processed
- **Archived** - Activity archived for reference

**Activity Metadata**:
- Contact association
- External ID for sync tracking
- Raw content (full email body, message content, etc.)
- Activity timestamp (preserves original time)

---

### 2. AI Assistant System

**Purpose**: Conversational AI assistant with context awareness and function calling capabilities.

#### 2.1 AI Sessions

**Session Management**:
- **Create Session** (`POST /api/urpa/ai/sessions`)
  - Session types: chat, voice, video
  - Persona selection (professional, friendly, executive, creative)
  - AI request limit checking
  - Session initialization

- **Session Lifecycle**:
  - Active sessions for ongoing conversations
  - Message history tracking
  - Token usage tracking (input/output tokens)
  - Session completion (`PATCH /api/urpa/ai/sessions/{id}/complete`)

- **Session Context**:
  - User profile information
  - Recent activities
  - Calendar events
  - Pending tasks
  - Contact information
  - Business context (if applicable)

#### 2.2 AI Messaging

**Message Exchange** (`POST /api/urpa/ai/sessions/{id}/messages`):
- **User Messages**:
  - Text content
  - Voice input (with audio URL and transcript)
  - Message metadata

- **AI Responses**:
  - Context-aware responses
  - Token usage tracking
  - Response generation with persona
  - Function call execution

- **Message History** (`GET /api/urpa/ai/sessions/{id}/messages`):
  - Full conversation history
  - Role-based messages (user/assistant)
  - Timestamp tracking
  - Voice message support

#### 2.3 Function Calling

**Available Functions**:
- **schedule_appointment** - Schedule appointments or meetings
  - Parameters: date, time, duration, title, notes
  - Integration with calendar systems

- **create_task** - Create new tasks
  - Parameters: title, description, priority, due_date
  - Auto-sync to TaskJuggler if linked

- **send_email** - Send emails
  - Parameters: to, subject, body
  - Integration with email providers

- **lookup_contact** - Find contact information
  - Parameters: search (name, email, or phone)
  - Returns contact details

- **get_calendar** - Get calendar events
  - Parameters: start_date, end_date
  - Returns upcoming events

**Function Execution**:
- Automatic function detection in AI responses
- Parameter extraction and validation
- Function execution with user context
- Result return to AI for response generation
- Action tracking in call logs

#### 2.4 AI Artifacts

**Artifact Generation** (`POST /api/urpa/ai/artifacts`):
- **Artifact Types**:
  - **Code** - Programming code generation
  - **Document** - Documentation and written content
  - **Image** - Image descriptions and prompts
  - **File** - General file content

- **Artifact Features**:
  - Title and content
  - Language specification
  - Tags for organization
  - Storage management
  - File size tracking
  - Storage limit enforcement

- **Artifact Management** (`GET /api/urpa/ai/artifacts`):
  - List artifacts by type
  - Filter by language
  - Pagination support
  - Session association

#### 2.5 AI Task Extraction

**Task Extraction**:
- **Automatic Extraction** - AI identifies tasks from conversations
- **Task Creation** - Creates UrpaAiTask records
- **Task Sync** - Automatic sync to TaskJuggler
- **Task Management** (`GET /api/urpa/ai/tasks`):
  - List AI-generated tasks
  - Filter by status
  - Filter by sync status
  - Task completion tracking

**Task Properties**:
- Title and description
- Status (pending, completed)
- Source type and ID
- Due date
- TaskJuggler sync status
- Completion timestamp

---

### 3. Voice & Phone Integration

**Purpose**: AI-powered phone assistant with cost-optimized pre-recorded responses.

#### 3.1 Vapi.ai Integration

**Vapi Assistant Configuration**:
- **Assistant Creation** - Dynamic assistant creation per user
- **System Prompt Building** - Rich context-aware prompts
- **Voice Selection** - ElevenLabs voice integration
- **Function Integration** - Available functions exposed to Vapi
- **Webhook Handling** - Real-time event processing

**Call Management**:
- **Start Call** (`POST /api/urpa/voice/vapi/call`)
  - Assistant ID specification
  - Customer phone number
  - Metadata (user_id, contact_id, etc.)
  - Call initiation via Vapi API

- **Call Status** (`GET /api/urpa/voice/vapi/call/{callId}`)
  - Real-time call status
  - Duration tracking
  - Recording URLs
  - Transcript access

- **End Call** (`POST /api/urpa/voice/vapi/call/{callId}/end`)
  - Manual call termination
  - Status update
  - Call completion tracking

**Vapi Webhook Events** (`POST /api/urpa/voice/vapi/webhook`):
- **call-started** - Call initiation
- **call-ended** - Call completion
- **transcript-complete** - Transcript available
- **function-call** - Function execution requests
- **message** - Message events

#### 3.2 Pre-Recorded Voice Responses

**Purpose**: Cost optimization by using pre-recorded audio instead of TTS for common responses.

**Response Management**:
- **Response Storage** (`GET /api/urpa/voice/prerecorded`)
  - Category-based organization
  - Intent-based matching
  - Usage tracking
  - Active/inactive status

- **Response Selection** (`POST /api/urpa/voice/find-response`)
  - Intelligent matching algorithm
  - Context-aware selection
  - Confidence scoring
  - Fallback chain

- **Bulk Creation** (`POST /api/urpa/voice/prerecorded/bulk`)
  - Batch response creation
  - Category assignment
  - Trigger phrase configuration
  - Personalization slot support

**Response Properties**:
- **Category** - Response category (greeting, information, closing, etc.)
- **Intent** - Specific intent match
- **Text Content** - Response text
- **Audio URL** - Pre-recorded audio file
- **Trigger Phrases** - Phrases that trigger this response
- **Context Requirements** - Required context for response
- **Personalization Slots** - Dynamic content slots
- **Usage Count** - Analytics tracking

**Selection Algorithm**:
1. Exact intent match (highest priority)
2. Context requirement filtering
3. Trigger phrase matching
4. Fuzzy matching fallback
5. Category-based selection
6. Avoid recently used responses
7. Variation weight (prefer less-used responses)

**Cost Optimization**:
- Pre-recorded responses preferred when confidence > 70%
- TTS fallback for unmatched scenarios
- Usage analytics for optimization
- Response effectiveness tracking

#### 3.3 Phone Call Management

**Call Records** (`GET /api/urpa/phone/calls`):
- **Call Properties**:
  - Direction (inbound, outbound)
  - Caller and callee numbers
  - Status (ringing, in_progress, completed, missed, voicemail)
  - Duration tracking
  - AI handling flag
  - Persona used
  - Recording URLs
  - Transcripts
  - AI summaries
  - Actions taken (function calls executed)

- **Call Operations**:
  - Create call record (`POST /api/urpa/phone/calls`)
  - Update call (`PUT /api/urpa/phone/calls/{id}`)
  - Mark as completed (`PATCH /api/urpa/phone/calls/{id}/complete`)
  - View call details (`GET /api/urpa/phone/calls/{id}`)

- **Call Filtering**:
  - Filter by direction
  - Filter by status
  - Filter by AI handling
  - Filter by contact
  - Date range filtering

**Call Processing Flow**:
1. Call initiated (inbound or outbound)
2. Vapi webhook received
3. Call record created
4. AI assistant handles call
5. Function calls executed as needed
6. Transcript generated
7. AI summary created
8. Tasks extracted
9. Call completed and recorded

**Call Integration**:
- AWS Connect for call routing
- AWS S3 for recording storage
- AWS Transcribe for speech-to-text
- Vapi.ai for AI voice interactions
- Communication module for unified telephony

---

### 4. Contact Management

**Purpose**: Centralized contact database with activity tracking.

**Contact Features**:
- **Contact Records**:
  - Personal information (name, email, phone)
  - Company information (company, job title)
  - Source tracking (where contact came from)
  - External ID for sync tracking
  - Tags for organization
  - Notes and avatar URLs
  - Last contacted tracking

- **Contact Operations**:
  - List contacts (`GET /api/urpa/contacts`)
  - Create contact (`POST /api/urpa/contacts`)
  - Update contact (`PUT /api/urpa/contacts/{id}`)
  - Delete contact (`DELETE /api/urpa/contacts/{id}`)
  - Import contacts (`POST /api/urpa/contacts/import`)

- **Contact Relationships**:
  - Activity history
  - Phone call history
  - Last contacted timestamp
  - Source attribution

- **Contact Search**:
  - Search by name, email, phone
  - Filter by source
  - Tag-based filtering

---

### 5. Integration System

**Purpose**: Connect external systems and sync data bidirectionally.

#### 5.1 Integration Types

**Supported Integration Types**:
- **Email** - Gmail, Outlook, etc.
- **Messaging** - Slack, Teams, etc.
- **Calendar** - Google Calendar, Outlook Calendar
- **Social** - Social media platforms
- **Voicemail** - Voicemail systems
- **Tasks** - Task management systems
- **Storage** - Dropbox, Google Drive, etc.

#### 5.2 Integration Management

**Integration Operations**:
- **List Integrations** (`GET /api/urpa/integrations`)
  - View all connected integrations
  - Status tracking
  - Last sync timestamps

- **Create Integration** (`POST /api/urpa/integrations`)
  - Integration type selection
  - Provider specification
  - OAuth token storage (encrypted)
  - Configuration settings

- **Update Integration** (`PUT /api/urpa/integrations/{id}`)
  - Configuration updates
  - Status management

- **Delete Integration** (`DELETE /api/urpa/integrations/{id}`)
  - Disconnect integration
  - Cleanup sync data

- **Sync Integration** (`POST /api/urpa/integrations/{id}/sync`)
  - Manual sync trigger
  - Background job processing
  - Sync status tracking

- **Sync Status** (`GET /api/urpa/integrations/{id}/sync-status`)
  - Last sync timestamp
  - Sync errors
  - Sync cursor (for incremental sync)

#### 5.3 OAuth Integration

**OAuth Flow**:
- **Initiate OAuth** (`GET /api/urpa/integrations/oauth/{provider}/redirect`)
  - Supported providers: Google, Microsoft, Slack, Dropbox
  - State token generation (CSRF protection)
  - Redirect URL generation
  - Scope configuration

- **OAuth Callback** (`GET /api/urpa/integrations/oauth/{provider}/callback`)
  - Code exchange for tokens
  - Token encryption and storage
  - Integration creation/update
  - Session cleanup

**Token Management**:
- Encrypted token storage
- Refresh token support
- Token expiration tracking
- Automatic token refresh (planned)

#### 5.4 TaskJuggler Integration

**Purpose**: Bidirectional sync between URPA and TaskJuggler task management.

**Integration Features**:
- **Link Account** (`POST /api/urpa/integrations/taskjuggler/link`)
  - Link URPA user to TaskJuggler user
  - Sync configuration (tasks, projects)
  - Auto-create tasks flag

- **Link Status** (`GET /api/urpa/integrations/taskjuggler/status`)
  - Check if accounts are linked
  - View link configuration

- **Sync Tasks** (`POST /api/urpa/integrations/taskjuggler/sync`)
  - Sync URPA AI tasks to TaskJuggler
  - Sync TaskJuggler tasks to URPA activities
  - Incremental sync support

- **Get Tasks** (`GET /api/urpa/integrations/taskjuggler/tasks`)
  - Fetch tasks from TaskJuggler
  - Create URPA activities from tasks
  - Status mapping

- **Create Task** (`POST /api/urpa/integrations/taskjuggler/tasks`)
  - Create task in TaskJuggler from URPA
  - Auto-link to URPA AI task
  - Sync status tracking

**Sync Behavior**:
- URPA AI tasks → TaskJuggler tasks (one-way)
- TaskJuggler tasks → URPA activities (one-way)
- Status mapping (pending, urgent, completed, archived)
- External ID tracking for deduplication

#### 5.5 Fibonacci Integration

**Purpose**: Integration with Fibonacci CRM and Publishing systems.

**Fibonacci CRM Integration**:
- **Link CRM** (`POST /api/urpa/integrations/fibonacci/crm/link`)
  - Link to Fibonacci business
  - Sync configuration (FAQs, polls, business info)

- **Get Business Profile** (`GET /api/urpa/integrations/fibonacci/crm/business/{businessId}`)
  - Business information retrieval
  - Profile data access

- **Get FAQs** (`GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/faqs`)
  - FAQ retrieval from Fibonacci CRM
  - FAQ management

- **Sync FAQs** (`POST /api/urpa/integrations/fibonacci/crm/business/{businessId}/sync-faqs`)
  - Sync FAQs to URPA voice responses
  - Automatic voice response creation
  - FAQ-to-response mapping

- **Get Polls** (`GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/polls`)
  - Active polls retrieval
  - Poll data access

**Fibonacci Publishing Integration**:
- **Link Publishing** (`POST /api/urpa/integrations/fibonacci/publishing/link`)
  - Link to publishing team
  - Enable content request features

- **Get Publishing Team** (`GET /api/urpa/integrations/fibonacci/publishing/team/{teamId}`)
  - Team information
  - Team configuration

- **Create Content Request** (`POST /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects`)
  - Content type (blog, social, email, ad)
  - Topic and tone specification
  - Target audience
  - Keywords and deadline
  - Assignment options

- **Get Content Projects** (`GET /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects`)
  - List content projects
  - Filter by status
  - Project details

---

### 6. Context Building System

**Purpose**: Build rich, context-aware prompts for AI interactions.

**Context Components**:
- **User Context**:
  - User name, email, phone
  - User profile information
  - Subscription tier
  - Default persona

- **Contact Context** (for calls):
  - Contact name, email, phone
  - Company and job title
  - Previous interactions
  - Relationship history

- **Calendar Context**:
  - Upcoming events
  - Availability
  - Schedule conflicts
  - Event details

- **Tasks Context**:
  - Pending tasks
  - Task priorities
  - Due dates
  - Task status

- **Business Context** (if applicable):
  - Business name and industry
  - Business hours
  - Contact information
  - Service offerings

- **Recent Activity**:
  - Recent communications
  - Recent tasks
  - Recent interactions

- **Time Context**:
  - Current time and date
  - Timezone
  - Time of day (morning, afternoon, evening, night)

**System Prompt Building**:
- Persona-specific instructions
- Context section assembly
- Available actions listing
- Response strategy guidelines
- Privacy and security rules

**Context Usage**:
- AI chat sessions
- Phone call handling
- Task extraction
- Function calling
- Artifact generation

---

### 7. User Profiles & Personas

**Purpose**: User subscription management and AI personality customization.

#### 7.1 User Profiles

**Profile Features**:
- **Subscription Management**:
  - Subscription tier (starter, professional, enterprise)
  - Subscription status tracking
  - Subscription dates

- **Feature Flags**:
  - Text assistant enabled
  - Phone assistant enabled
  - Feature availability

- **Usage Limits**:
  - AI requests limit
  - AI requests used (tracking)
  - Storage limit (GB)
  - Storage used (GB)

- **Configuration**:
  - Default persona
  - Theme preferences
  - Widget visibility settings
  - Phone number configuration

**Usage Enforcement**:
- AI request limit checking
- Storage limit validation
- Feature access control
- Subscription status validation

#### 7.2 User Personas

**Persona Management**:
- **Persona Types**:
  - Professional - Professional, courteous, concise
  - Friendly - Warm, friendly, conversational
  - Executive - Direct, strategic, high-level focus
  - Creative - Imaginative, inspiring, creative solutions

- **Persona Properties**:
  - Persona name and description
  - Voice ID (ElevenLabs)
  - Custom system prompt
  - Default persona flag

- **Persona Usage**:
  - AI session persona selection
  - Phone call persona assignment
  - Context-aware persona application

---

### 8. Activity Sync Services

**Purpose**: Bidirectional sync with external systems for activity aggregation.

**Sync Architecture**:
- **Background Jobs** - Queue-based sync processing
- **Incremental Sync** - Cursor-based incremental updates
- **Error Handling** - Retry logic and error tracking
- **Sync Status** - Last sync timestamp and error tracking

**Sync Sources**:
- Email providers (Gmail, Outlook)
- Calendar systems (Google Calendar, Outlook)
- Messaging platforms (Slack, Teams)
- Task management (TaskJuggler)
- Social media platforms
- Voicemail systems

**Sync Process**:
1. Integration configured
2. Sync job queued
3. Fetch activities from source
4. Check for duplicates (external_id)
5. Create URPA activities
6. Update sync cursor
7. Mark sync complete

**Sync Configuration**:
- Sync frequency
- Sync direction (inbound, outbound, bidirectional)
- Activity type filtering
- Date range limits

---

## Technical Integration

### AWS Communications Infrastructure
- **AWS Connect** - Call routing and management
- **AWS SNS/Pinpoint** - SMS sending and receiving
- **AWS Transcribe** - Speech-to-text transcription
- **AWS S3** - Call recording and artifact storage
- **Phone Number Service** - Number provisioning

### AI Voice Platform
- **Vapi.ai** - AI voice interactions and conversation management
- **ElevenLabs** - Text-to-speech synthesis
- **Voice Selection** - Custom voice IDs per persona

### AI Services
- **OpenRouter** - AI model access (GPT-4o, Claude, etc.)
- **Model Selection** - Configurable AI models
- **Token Tracking** - Input/output token usage
- **Temperature Control** - Response creativity control

### Database Architecture
- **PostgreSQL 16** - Primary database
- **UUID Primary Keys** - All entities use UUIDs
- **JSONB Fields** - Flexible data storage (metadata, config, raw_content)
- **Indexes** - Optimized queries (user_id, activity_timestamp, external_id)

### API Architecture
- **RESTful API** - Standard HTTP methods
- **Laravel Sanctum** - Authentication
- **User Scoping** - All resources scoped to user_id
- **API Resources** - Response transformation
- **Request Validation** - Input validation

---

## Data Models

### Core Entities

1. **UrpaUserProfile** - User subscription and preferences
2. **UrpaUserPersona** - AI personality configurations
3. **UrpaActivity** - Unified activity feed items
4. **UrpaContact** - Contact records
5. **UrpaIntegration** - External system integrations
6. **UrpaAiSession** - AI conversation sessions
7. **UrpaAiMessage** - AI conversation messages
8. **UrpaAiTask** - AI-generated tasks
9. **UrpaArtifact** - AI-generated artifacts (code, documents, etc.)
10. **UrpaPhoneCall** - Phone call records
11. **UrpaVoiceResponse** - Pre-recorded voice responses
12. **UrpaTaskjugglerLink** - TaskJuggler integration link
13. **UrpaFibonacciLink** - Fibonacci CRM/Publishing integration link

---

## API Endpoints Summary

### Activities (9 endpoints)
- `GET /api/urpa/activities` - List activities
- `POST /api/urpa/activities` - Create activity
- `POST /api/urpa/activities/sync` - Sync from integrations
- `GET /api/urpa/activities/{id}` - Get activity
- `PUT /api/urpa/activities/{id}` - Update activity
- `PATCH /api/urpa/activities/{id}/read` - Mark as read
- `PATCH /api/urpa/activities/{id}/star` - Toggle star
- `DELETE /api/urpa/activities/{id}` - Delete activity

### Contacts (6 endpoints)
- `GET /api/urpa/contacts` - List contacts
- `POST /api/urpa/contacts` - Create contact
- `POST /api/urpa/contacts/import` - Import contacts
- `GET /api/urpa/contacts/{id}` - Get contact
- `PUT /api/urpa/contacts/{id}` - Update contact
- `DELETE /api/urpa/contacts/{id}` - Delete contact

### AI Assistant (7 endpoints)
- `GET /api/urpa/ai/sessions` - List AI sessions
- `POST /api/urpa/ai/sessions` - Create session
- `GET /api/urpa/ai/sessions/{id}/messages` - Get messages
- `POST /api/urpa/ai/sessions/{id}/messages` - Send message
- `PATCH /api/urpa/ai/sessions/{id}/complete` - Complete session
- `GET /api/urpa/ai/artifacts` - List artifacts
- `POST /api/urpa/ai/artifacts` - Generate artifact
- `GET /api/urpa/ai/tasks` - List AI tasks

### Voice & Phone (7 endpoints)
- `GET /api/urpa/voice/prerecorded` - Get pre-recorded responses
- `POST /api/urpa/voice/find-response` - Find matching response
- `POST /api/urpa/voice/prerecorded/bulk` - Bulk create responses
- `POST /api/urpa/voice/vapi/webhook` - Vapi webhook (no auth)
- `POST /api/urpa/voice/vapi/call` - Start call
- `POST /api/urpa/voice/vapi/call/{id}/end` - End call
- `GET /api/urpa/voice/vapi/call/{id}` - Get call status

### Phone Calls (4 endpoints)
- `GET /api/urpa/phone/calls` - List calls
- `POST /api/urpa/phone/calls` - Create call record
- `GET /api/urpa/phone/calls/{id}` - Get call
- `PUT /api/urpa/phone/calls/{id}` - Update call
- `PATCH /api/urpa/phone/calls/{id}/complete` - Complete call

### Integrations (9 endpoints)
- `GET /api/urpa/integrations` - List integrations
- `POST /api/urpa/integrations` - Create integration
- `GET /api/urpa/integrations/{id}` - Get integration
- `PUT /api/urpa/integrations/{id}` - Update integration
- `DELETE /api/urpa/integrations/{id}` - Delete integration
- `POST /api/urpa/integrations/{id}/sync` - Sync integration
- `GET /api/urpa/integrations/{id}/sync-status` - Get sync status
- `GET /api/urpa/integrations/oauth/{provider}/redirect` - OAuth redirect
- `GET /api/urpa/integrations/oauth/{provider}/callback` - OAuth callback

### TaskJuggler Integration (5 endpoints)
- `GET /api/urpa/integrations/taskjuggler/status` - Get link status
- `POST /api/urpa/integrations/taskjuggler/link` - Link account
- `POST /api/urpa/integrations/taskjuggler/sync` - Sync tasks
- `GET /api/urpa/integrations/taskjuggler/tasks` - Get tasks
- `POST /api/urpa/integrations/taskjuggler/tasks` - Create task

### Fibonacci Integration (8 endpoints)
- `GET /api/urpa/integrations/fibonacci/status` - Get link status
- `POST /api/urpa/integrations/fibonacci/crm/link` - Link CRM
- `GET /api/urpa/integrations/fibonacci/crm/business/{businessId}` - Get business profile
- `GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/faqs` - Get FAQs
- `POST /api/urpa/integrations/fibonacci/crm/business/{businessId}/sync-faqs` - Sync FAQs
- `GET /api/urpa/integrations/fibonacci/crm/business/{businessId}/polls` - Get polls
- `POST /api/urpa/integrations/fibonacci/publishing/link` - Link publishing
- `GET /api/urpa/integrations/fibonacci/publishing/team/{teamId}` - Get publishing team
- `POST /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects` - Create content request
- `GET /api/urpa/integrations/fibonacci/publishing/teams/{teamId}/projects` - Get content projects

**Total: 63 API endpoints**

---

## Use Cases

### 1. Personal Productivity Professional
- **Unified Inbox**: All emails, texts, and tasks in one place
- **AI Assistant**: Chat-based AI for quick questions and task creation
- **Task Management**: AI extracts tasks from conversations, syncs to TaskJuggler
- **Calendar Integration**: Schedule appointments via AI function calls
- **Contact Management**: Centralized contact database with activity history

### 2. Business Owner with Phone Assistant
- **AI Phone Receptionist**: 24/7 call handling with Vapi
- **Pre-Recorded Responses**: Cost-optimized common responses
- **Call Transcription**: All calls transcribed and summarized
- **Task Extraction**: Tasks created from phone conversations
- **Contact Auto-Creation**: Contacts created from calls

### 3. Content Creator with Fibonacci Integration
- **Content Requests**: Create content requests via AI
- **FAQ Sync**: Sync FAQs from Fibonacci CRM to voice responses
- **Publishing Integration**: Manage content projects
- **Cross-Platform Sync**: Unified workflow across platforms

### 4. Executive Assistant
- **Multi-Channel Management**: Handle emails, calls, tasks, calendar
- **Context-Aware AI**: AI knows schedule, tasks, and priorities
- **Function Calling**: AI can schedule, create tasks, send emails
- **Activity Tracking**: Complete activity history
- **Integration Hub**: Connect all productivity tools

---

## Key Differentiators

### 1. Unified Activity Feed
- **Single Source of Truth** - All communications in one place
- **Source Preservation** - Maintains original source and metadata
- **Cross-Channel Search** - Search across all activity types
- **Unified Status** - Consistent status management

### 2. Cost-Optimized Voice AI
- **Pre-Recorded Responses** - Reduces TTS costs significantly
- **Intelligent Matching** - Context-aware response selection
- **Confidence Scoring** - Only use TTS when necessary
- **Usage Analytics** - Track response effectiveness

### 3. Context-Aware AI
- **Rich Context Building** - Comprehensive user context
- **Function Calling** - AI can execute actions
- **Persona Customization** - Multiple AI personalities
- **Session Memory** - Conversation history maintained

### 4. Seamless Integrations
- **TaskJuggler Sync** - Bidirectional task sync
- **Fibonacci Integration** - CRM and publishing integration
- **OAuth Support** - Easy integration setup
- **Incremental Sync** - Efficient data synchronization

### 5. User-Centric Design
- **Individual Ownership** - Each user owns their data
- **Privacy First** - User-scoped data isolation
- **Customizable** - Personas, themes, preferences
- **Usage Tracking** - Transparent usage limits

---

## Subscription Tiers

### Starter Tier
- Basic AI assistant (text)
- Limited AI requests (1,000/month)
- Basic activity feed
- Contact management
- Limited integrations

### Professional Tier
- Full AI assistant (text + voice)
- Increased AI requests (10,000/month)
- Phone assistant enabled
- Unlimited activities
- All integrations
- Pre-recorded voice responses
- TaskJuggler sync

### Enterprise Tier
- Unlimited AI requests
- Priority support
- Custom integrations
- Advanced analytics
- Dedicated support
- Custom personas
- Extended storage

---

## Security & Privacy

### Data Security
- **Encrypted Tokens** - OAuth tokens encrypted at rest
- **User Isolation** - All data scoped to user_id
- **Access Control** - User-based authentication
- **Secure Storage** - AWS S3 for recordings and artifacts

### Privacy Features
- **User Ownership** - Users own all their data
- **Data Portability** - Export capabilities
- **Integration Control** - Users control integrations
- **Activity Privacy** - Activities only visible to user

---

## Future Enhancements

### Planned Features
- **Email Integration** - Full email sending/receiving
- **Calendar Sync** - Bidirectional calendar sync
- **Multi-Language Support** - Internationalization
- **Advanced Analytics** - Usage analytics and insights
- **Mobile App** - Native mobile applications
- **Real-Time Notifications** - Push notifications
- **Voice Cloning** - Custom voice creation
- **Advanced Function Calling** - More function types
- **Workflow Automation** - Automated workflows
- **Team Collaboration** - Shared contacts and activities (future)

---

## Summary

URPA is a comprehensive personal assistant platform that unifies communication channels, provides intelligent AI assistance, and integrates seamlessly with external productivity systems. The platform combines unified activity management, AI-powered voice and text interactions, cost-optimized voice responses, and deep integrations with TaskJuggler and Fibonacci systems to deliver a complete personal productivity solution.

The system is designed with user privacy and data ownership at its core, providing individual users with complete control over their data, integrations, and AI personalities while maintaining seamless synchronization with external systems for maximum productivity.

URPA serves as the central hub for personal productivity, enabling users to manage all their communications, tasks, and activities from a single, intelligent interface powered by context-aware AI.

