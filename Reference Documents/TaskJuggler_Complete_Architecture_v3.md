# Task Juggler - Complete System Architecture v3
## AI Receptionist + Task Management + Marketplace with AI Tools

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Core Concepts](#core-concepts)
4. [Technical Stack](#technical-stack)
5. [AI Receptionist System](#ai-receptionist-system)
6. [Routing Engine](#routing-engine)
7. [Marketplace System](#marketplace-system)
8. [Database Schema](#database-schema)
9. [API Structure](#api-structure)
10. [External Integrations](#external-integrations)
11. [Pricing & Billing](#pricing--billing)
12. [Deployment Architecture](#deployment-architecture)

---

## Executive Summary

Task Juggler is a comprehensive task management platform with three interconnected systems:

1. **AI Receptionist** - Receives communications (calls, emails, SMS), extracts task information using AI, and routes based on deterministic user-defined rules
2. **Task Management** - Core task creation, assignment, tracking with Requestor/Do-er model
3. **Marketplace** - Two-sided marketplace with human vendors AND AI tools that can execute work

**Key Principle:** AI extracts and classifies. Rules route. Humans (or AI tools) execute.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TASK JUGGLER                                    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                         INTAKE CHANNELS                                │ │
│  │                                                                       │ │
│  │   📞 Phone          📧 Email           💬 SMS          🌐 Web/App    │ │
│  │   (Forwarded)       (Forwarded)        (Twilio)        (Direct)      │ │
│  │                                                                       │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
│                                  │                                         │
│                                  ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      AI RECEPTIONIST                                   │ │
│  │                                                                       │ │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │ │
│  │   │ UNDERSTAND  │ → │   EXTRACT   │ → │  CLASSIFY   │              │ │
│  │   │             │    │             │    │             │              │ │
│  │   │ Parse NLP   │    │ Names       │    │ Category    │              │ │
│  │   │ Intent      │    │ Phones      │    │ Urgency     │              │ │
│  │   │ Context     │    │ Addresses   │    │ Keywords    │              │ │
│  │   └─────────────┘    └─────────────┘    └─────────────┘              │ │
│  │                                                                       │ │
│  │   ⚠️  DOES NOT ROUTE - ONLY EXTRACTS AND TAGS                        │ │
│  │                                                                       │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
│                                  │                                         │
│                                  ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      ROUTING ENGINE                                    │ │
│  │                                                                       │ │
│  │   100% DETERMINISTIC - User-Defined Rules Only                        │ │
│  │                                                                       │ │
│  │   IF category = "maintenance" → Route to Mike                         │ │
│  │   IF category = "legal" AND type = "lease" → Route to AI LeaseBot    │ │
│  │   IF keywords contain "emergency" → Priority URGENT + notify owner   │ │
│  │   IF no match → Route to self                                        │ │
│  │                                                                       │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
│                                  │                                         │
│              ┌───────────────────┼───────────────────┐                     │
│              ▼                   ▼                   ▼                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐  │
│  │                 │ │                 │ │                             │  │
│  │   SELF          │ │   TEAM          │ │   MARKETPLACE               │  │
│  │                 │ │                 │ │                             │  │
│  │   Owner's       │ │   Internal      │ │   ┌───────────────────┐    │  │
│  │   Task List     │ │   Staff         │ │   │  Human Vendors    │    │  │
│  │                 │ │                 │ │   │  • Plumbers       │    │  │
│  │                 │ │   • Mike        │ │   │  • Electricians   │    │  │
│  │                 │ │   • Sarah       │ │   │  • VAs            │    │  │
│  │                 │ │   • Lisa        │ │   │  • Designers      │    │  │
│  │                 │ │                 │ │   ├───────────────────┤    │  │
│  │                 │ │                 │ │   │  AI Tools         │    │  │
│  │                 │ │                 │ │   │  • LeaseBot       │    │  │
│  │                 │ │                 │ │   │  • ResearchAI     │    │  │
│  │                 │ │                 │ │   │  • BotJob.ai      │    │  │
│  │                 │ │                 │ │   │  • AlphaSite.ai   │    │  │
│  │                 │ │                 │ │   │  • 4Projects.ai   │    │  │
│  │                 │ │                 │ │   └───────────────────┘    │  │
│  │                 │ │                 │ │                             │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Task Model

Every task has:
- **Requestor** - Who needs it done (usually the Task Juggler account owner)
- **Do-er/Owner** - Who will do it (self, team member, or marketplace vendor)
- **Source** - Where it came from (phone, email, SMS, web, API)
- **Status** - pending, accepted, in_progress, completed, cancelled

### 2. AI Receptionist Role

The AI Receptionist **ONLY**:
- Understands natural language
- Extracts structured data (names, phones, addresses, dates)
- Classifies into categories
- Identifies urgency signals
- Creates a task summary

The AI Receptionist **DOES NOT**:
- Decide who gets the task
- Set priorities (rules do this)
- Make judgment calls
- Execute any work

### 3. Deterministic Routing

All routing decisions are made by **user-defined rules**:
- Rules are evaluated in priority order
- First matching rule wins
- No AI judgment in routing
- 100% predictable: same input = same output

### 4. Marketplace Vendor Types

| Type | Description | Execution |
|------|-------------|-----------|
| **Human** | Real people (plumbers, VAs, etc.) | Manual - accept job, do work |
| **AI Tool** | Automated AI services | Automatic - receives task, returns deliverable |
| **Hybrid** | AI-assisted human | AI does draft, human reviews/completes |

---

## Technical Stack

### Backend
- **Framework**: Laravel 11
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis
- **Hosting**: Railway

### Frontend (Web)
- **Framework**: Vue 3 + Vite
- **State**: Pinia
- **UI**: Tailwind CSS + Headless UI
- **Real-time**: Laravel Echo + Pusher (or Soketi)

### Mobile
- **Framework**: React Native + Expo
- **State**: Zustand + React Query
- **Push**: Expo Notifications

### External Services
- **Voice/SMS**: Twilio
- **Email**: SendGrid (inbound parse)
- **AI**: OpenRouter (GPT-4o, Claude)
- **Payments**: Stripe Connect

---

## AI Receptionist System

### Intake Channels

#### 1. Phone (Twilio Voice)

```
User sets up call forwarding:
  Personal phone → Twilio number (when no answer)
                         ↓
              AI Receptionist answers
              "Hi, this is [Name]'s assistant..."
                         ↓
              Records voicemail
              Transcribes (Twilio or Whisper)
                         ↓
              Webhook to Laravel
              → ProcessVoicemail job
```

#### 2. Email (SendGrid Inbound Parse)

```
User forwards email to:
  [username]@assistant.taskjuggler.com
                         ↓
              SendGrid receives
              Parses headers, body, attachments
                         ↓
              Webhook to Laravel
              → ProcessEmail job
```

#### 3. SMS (Twilio Messaging)

```
External person texts:
  User's Twilio number
                         ↓
              Twilio receives
              Webhook with body, from number
                         ↓
              Laravel processes
              → ProcessSms job
```

#### 4. User Commands

Users can also command their assistant:
- Call their own assistant number
- Email their assistant
- Text their assistant

The system detects if the sender IS the user and switches to **command mode**.

### AI Extraction Schema

```json
{
  "summary": "AC repair needed - Unit 4B not cooling",
  "category": "maintenance",
  "subcategory": "hvac",
  "keywords": ["ac", "broken", "not cooling", "hot", "repair"],
  "urgency_indicators": ["it's been 3 days", "90 degrees"],
  "sentiment": "frustrated",
  
  "contact": {
    "name": "John Smith",
    "phone": "555-123-4567",
    "email": "john@email.com"
  },
  
  "location": {
    "address": "123 Main Street",
    "unit": "4B",
    "city": "Tampa",
    "state": "FL",
    "zip": "33601"
  },
  
  "dates_mentioned": ["Tuesday", "this week"],
  "times_mentioned": ["morning", "before noon"],
  
  "source": "phone",
  "original_transcript": "Hi, this is John Smith calling about..."
}
```

### AI Extraction Prompt

```
You are a data extraction assistant for a task management system.

Your job is to extract structured information from incoming messages (phone calls, emails, SMS).

You ONLY extract and classify. You do NOT decide what to do with the message.

For every message, extract:
1. A brief summary (10 words max) suitable for a task title
2. Category (one of: maintenance, scheduling, billing, sales, support, legal, research, general)
3. Subcategory (more specific classification)
4. Keywords (relevant terms from the message)
5. Urgency indicators (phrases suggesting time sensitivity)
6. Sentiment (positive, neutral, negative, frustrated, urgent)
7. Contact information (name, phone, email if mentioned)
8. Location information (address, unit, city, state, zip if mentioned)
9. Any dates or times mentioned

Respond ONLY with valid JSON matching the schema. Do not include any other text.
```

---

## Routing Engine

### Rule Structure

```yaml
Rule:
  id: uuid
  name: "Maintenance to Mike"
  description: "All maintenance requests go to maintenance staff"
  priority: 10  # Lower = higher priority
  is_active: true
  
  conditions:
    match_type: "all"  # "all" or "any"
    rules:
      - field: "category"
        operator: "in"
        value: ["maintenance", "repair"]
      - field: "keywords"
        operator: "contains_any"
        value: ["broken", "fix", "leak"]
  
  actions:
    create_task: true
    requestor: "owner"  # Task is FROM the account owner
    assignee_type: "team_member"  # "self", "team_member", "marketplace"
    assignee_id: "uuid-of-mike"
    priority: "normal"  # "low", "normal", "high", "urgent"
    notifications:
      - type: "immediate"
        recipient: "assignee"
      - type: "digest"
        recipient: "owner"
    auto_response: "Thanks! Our maintenance team will contact you within 24 hours."
    tags: ["maintenance", "tenant-request"]
```

### Condition Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | category equals "maintenance" |
| `not_equals` | Not equal | category not_equals "spam" |
| `in` | In list | category in ["maintenance", "repair"] |
| `not_in` | Not in list | source not_in ["spam"] |
| `contains` | String contains | summary contains "urgent" |
| `contains_any` | Contains any keyword | keywords contains_any ["emergency", "urgent"] |
| `contains_all` | Contains all keywords | keywords contains_all ["plumbing", "leak"] |
| `greater_than` | Numeric comparison | urgency_score greater_than 7 |
| `time_between` | Time range | current_time time_between ["18:00", "08:00"] |
| `caller_in_list` | Contact list match | caller caller_in_list "vip_clients" |

### Assignee Types

| Type | Description | Behavior |
|------|-------------|----------|
| `self` | Account owner | Task goes to owner's list |
| `team_member` | Internal staff | Task assigned to specific team member |
| `marketplace_human` | Human vendor | Posted to marketplace, vendors can bid/accept |
| `marketplace_ai` | AI tool | Automatically executed by AI service |
| `marketplace_auto` | Auto-match | System finds best vendor (human or AI) |

### Rule Evaluation Flow

```php
class RuleEngine
{
    public function evaluate(ExtractedData $data): RoutingDecision
    {
        // Load rules in priority order
        $rules = $this->loadActiveRules();
        
        foreach ($rules as $rule) {
            if ($this->matchesConditions($rule, $data)) {
                return $this->buildDecision($rule, $data);
            }
        }
        
        // Default: assign to self
        return $this->defaultDecision($data);
    }
    
    private function matchesConditions(Rule $rule, ExtractedData $data): bool
    {
        $conditions = $rule->conditions;
        $results = [];
        
        foreach ($conditions['rules'] as $condition) {
            $results[] = $this->evaluateCondition($condition, $data);
        }
        
        // "all" = AND, "any" = OR
        return $conditions['match_type'] === 'all' 
            ? !in_array(false, $results)
            : in_array(true, $results);
    }
}
```

---

## Marketplace System

### Vendor Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      MARKETPLACE VENDORS                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    HUMAN VENDORS                         │   │
│  │                                                         │   │
│  │  • Have user accounts                                   │   │
│  │  • Set their own availability                           │   │
│  │  • Accept/decline jobs manually                         │   │
│  │  • Set pricing (hourly, fixed, quote)                   │   │
│  │  • Service area (geographic)                            │   │
│  │  • Reviews and ratings                                  │   │
│  │                                                         │   │
│  │  Examples: Plumbers, Electricians, VAs, Designers       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     AI TOOLS                             │   │
│  │                                                         │   │
│  │  • No user account (system managed)                     │   │
│  │  • Always available                                     │   │
│  │  • Auto-execute when assigned                           │   │
│  │  • Fixed pricing per execution                          │   │
│  │  • No geographic limits                                 │   │
│  │  • Quality based on output validation                   │   │
│  │                                                         │   │
│  │  Types:                                                 │   │
│  │  ├─ Internal AI Tools (built into Task Juggler)        │   │
│  │  │   • Document Generator                               │   │
│  │  │   • Research Assistant                               │   │
│  │  │   • Data Entry Bot                                   │   │
│  │  │                                                      │   │
│  │  └─ External AI Services (API integrations)            │   │
│  │      • BotJob.ai - Task automation                      │   │
│  │      • AlphaSite.ai - Website generation                │   │
│  │      • 4Projects.ai - Project management                │   │
│  │      • Custom integrations via webhook                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Tool Execution Flow

```
Task routed to AI Tool
         ↓
┌─────────────────────────────────────┐
│  1. VALIDATE INPUT                  │
│     • Check required fields         │
│     • Verify data quality           │
│     • Estimate cost                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  2. EXECUTE                         │
│     • Internal: Run AI pipeline     │
│     • External: Call vendor API     │
│     • Timeout: 5 min default        │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  3. PROCESS OUTPUT                  │
│     • Validate deliverable          │
│     • Generate files if needed      │
│     • Store results                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  4. COMPLETE TASK                   │
│     • Attach deliverable to task    │
│     • Mark task complete            │
│     • Notify requestor              │
│     • Process billing               │
└─────────────────────────────────────┘
```

### AI Tool Configuration

```json
{
  "id": "uuid",
  "name": "LeaseBot",
  "type": "ai",
  "description": "Generates residential lease agreements",
  
  "categories": ["legal"],
  "services": ["lease_generation", "lease_amendment"],
  
  "execution": {
    "provider": "internal",
    "model": "gpt-4o",
    "max_tokens": 8000,
    "timeout_seconds": 120,
    "auto_execute": true
  },
  
  "input_schema": {
    "required": ["property_address", "landlord_name", "tenant_name", "rent_amount", "lease_term"],
    "optional": ["pet_policy", "parking", "utilities_included", "special_terms"]
  },
  
  "output_schema": {
    "type": "document",
    "format": "pdf",
    "additional_outputs": ["docx"]
  },
  
  "pricing": {
    "model": "fixed",
    "price": 15.00,
    "currency": "USD"
  }
}
```

### External AI Service Integration

```json
{
  "id": "uuid",
  "name": "BotJob.ai",
  "type": "ai",
  "description": "AI-powered task automation platform",
  
  "categories": ["automation", "data_entry", "research", "content"],
  
  "execution": {
    "provider": "external",
    "api_endpoint": "https://api.botjob.ai/v1/tasks",
    "auth_type": "api_key",
    "webhook_url": "https://api.taskjuggler.com/webhooks/botjob/{task_id}"
  },
  
  "input_mapping": {
    "task_title": "$.summary",
    "task_description": "$.original_transcript",
    "category": "$.category",
    "metadata": {
      "contact": "$.contact",
      "location": "$.location"
    }
  },
  
  "output_mapping": {
    "deliverable_url": "$.result.file_url",
    "status": "$.status",
    "completion_notes": "$.result.summary"
  },
  
  "pricing": {
    "model": "per_task",
    "api_pricing": true,
    "markup_percentage": 10
  }
}
```

---

## Database Schema

### Core Tables

```sql
-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Subscription
    plan VARCHAR(50) DEFAULT 'free',
    plan_expires_at TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255),
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ASSISTANT CHANNELS
-- ============================================

CREATE TABLE assistant_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    channel_type VARCHAR(20) NOT NULL,  -- 'phone', 'email', 'sms'
    
    -- Phone (Twilio)
    phone_number VARCHAR(20),
    twilio_sid VARCHAR(50),
    
    -- Email (SendGrid)
    email_address VARCHAR(255),  -- username@assistant.taskjuggler.com
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    greeting_message TEXT,
    voicemail_greeting TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS
-- ============================================

CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- The boss
    
    -- Member info (may or may not have TJ account)
    user_id UUID REFERENCES users(id),  -- If they have an account
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(100),
    
    -- Task receiving
    can_receive_tasks BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT LISTS
-- ============================================

CREATE TABLE contact_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,  -- "VIP Clients", "Tenants", "Suppliers"
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_list_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROUTING RULES
-- ============================================

CREATE TABLE routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INT DEFAULT 100,  -- Lower = evaluated first
    is_active BOOLEAN DEFAULT true,
    
    -- Conditions (JSON)
    conditions JSONB NOT NULL,
    
    -- Actions (JSON)
    actions JSONB NOT NULL,
    
    -- Stats
    times_matched INT DEFAULT 0,
    last_matched_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TASKS
-- ============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Ownership
    requestor_id UUID REFERENCES users(id),  -- Who needs it done
    owner_id UUID REFERENCES users(id),       -- Who's doing it (if user)
    team_member_id UUID REFERENCES team_members(id),  -- If team member
    marketplace_vendor_id UUID REFERENCES marketplace_vendors(id),  -- If vendor
    
    -- Source tracking
    source_type VARCHAR(20),  -- 'phone', 'email', 'sms', 'web', 'api'
    source_channel_id UUID REFERENCES assistant_channels(id),
    extracted_data JSONB,      -- Full AI extraction
    routing_rule_id UUID REFERENCES routing_rules(id),
    
    -- Contact (the person who made the request)
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Location
    location_address VARCHAR(500),
    location_unit VARCHAR(50),
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(20),
    location_coords GEOGRAPHY(POINT, 4326),
    
    -- Dates
    due_date TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Marketplace specific
    marketplace_listing_id UUID REFERENCES marketplace_listings(id),
    
    -- Deliverables
    deliverables JSONB DEFAULT '[]',
    
    -- Metadata
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INBOX ITEMS (Pre-task)
-- ============================================

CREATE TABLE inbox_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Source
    source_type VARCHAR(20) NOT NULL,
    source_id VARCHAR(255),  -- External ID (Twilio SID, email message ID)
    channel_id UUID REFERENCES assistant_channels(id),
    
    -- Sender
    from_identifier VARCHAR(255),  -- Phone or email
    from_name VARCHAR(255),
    
    -- Content
    subject VARCHAR(500),
    body TEXT,
    attachments JSONB DEFAULT '[]',
    
    -- AI Processing
    extracted_data JSONB,
    processing_status VARCHAR(20) DEFAULT 'pending',
    processing_error TEXT,
    
    -- Routing
    routed_to_task_id UUID REFERENCES tasks(id),
    routing_rule_id UUID REFERENCES routing_rules(id),
    
    -- Auto-response
    auto_response_sent BOOLEAN DEFAULT false,
    auto_response_text TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'unprocessed',
    
    received_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETPLACE VENDORS
-- ============================================

CREATE TABLE marketplace_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Type
    vendor_type VARCHAR(20) NOT NULL,  -- 'human', 'ai', 'hybrid'
    
    -- Human vendors
    user_id UUID REFERENCES users(id),
    business_name VARCHAR(255),
    
    -- AI vendors
    ai_provider VARCHAR(50),  -- 'internal', 'botjob', 'alphasite', 'external'
    ai_config JSONB,
    
    -- Profile
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    
    -- Services
    categories TEXT[],
    services JSONB DEFAULT '[]',
    
    -- Location (for human vendors)
    service_area GEOGRAPHY(POLYGON, 4326),
    address VARCHAR(500),
    
    -- Pricing
    pricing_model VARCHAR(20),  -- 'fixed', 'hourly', 'quote', 'per_task'
    base_rate DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Stats
    total_jobs INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Stripe
    stripe_account_id VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI TOOL CONFIGURATIONS
-- ============================================

CREATE TABLE ai_tool_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES marketplace_vendors(id) ON DELETE CASCADE,
    
    -- Execution
    provider VARCHAR(50) NOT NULL,  -- 'openrouter', 'direct', 'webhook'
    model VARCHAR(100),
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT,
    
    -- Input/Output
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    prompt_template TEXT,
    
    -- Limits
    max_execution_time INT DEFAULT 300,
    max_tokens INT DEFAULT 4000,
    retry_count INT DEFAULT 3,
    
    -- Behavior
    auto_execute BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETPLACE LISTINGS
-- ============================================

CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    requestor_id UUID REFERENCES users(id),
    
    -- Listing details
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Requirements
    location_required BOOLEAN DEFAULT false,
    location GEOGRAPHY(POINT, 4326),
    location_radius_miles INT,
    
    -- Budget
    budget_type VARCHAR(20),  -- 'fixed', 'hourly', 'quote'
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'open',  -- 'open', 'assigned', 'completed', 'cancelled'
    
    -- Assignment
    assigned_vendor_id UUID REFERENCES marketplace_vendors(id),
    assigned_at TIMESTAMPTZ,
    
    -- Timing
    needed_by TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETPLACE BIDS
-- ============================================

CREATE TABLE marketplace_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES marketplace_vendors(id),
    
    -- Bid details
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    estimated_completion TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected', 'withdrawn'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI TOOL EXECUTIONS
-- ============================================

CREATE TABLE ai_tool_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    vendor_id UUID REFERENCES marketplace_vendors(id),
    config_id UUID REFERENCES ai_tool_configs(id),
    
    -- Input
    input_data JSONB NOT NULL,
    
    -- Execution
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Output
    output_data JSONB,
    deliverable_urls TEXT[],
    error_message TEXT,
    
    -- Cost
    tokens_used INT,
    cost DECIMAL(10,4),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    
    -- Delivery
    channels TEXT[],  -- ['push', 'email', 'sms']
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BILLING & TRANSACTIONS
-- ============================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    type VARCHAR(50) NOT NULL,  -- 'subscription', 'marketplace', 'ai_tool', 'usage'
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Related entities
    task_id UUID REFERENCES tasks(id),
    vendor_id UUID REFERENCES marketplace_vendors(id),
    execution_id UUID REFERENCES ai_tool_executions(id),
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    
    status VARCHAR(20) DEFAULT 'pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_tasks_requestor ON tasks(requestor_id);
CREATE INDEX idx_tasks_owner ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created ON tasks(created_at DESC);

CREATE INDEX idx_inbox_user_status ON inbox_items(user_id, status);
CREATE INDEX idx_inbox_received ON inbox_items(received_at DESC);

CREATE INDEX idx_routing_rules_user ON routing_rules(user_id, is_active, priority);

CREATE INDEX idx_vendors_type ON marketplace_vendors(vendor_type, is_active);
CREATE INDEX idx_vendors_categories ON marketplace_vendors USING GIN(categories);

CREATE INDEX idx_listings_status ON marketplace_listings(status);
CREATE INDEX idx_listings_category ON marketplace_listings(category);
```

---

## API Structure

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/user
```

### Tasks

```
GET    /api/tasks                    # List tasks
POST   /api/tasks                    # Create task
GET    /api/tasks/{id}               # Get task
PUT    /api/tasks/{id}               # Update task
DELETE /api/tasks/{id}               # Delete task
POST   /api/tasks/{id}/complete      # Mark complete
POST   /api/tasks/{id}/assign        # Assign to someone
```

### Inbox

```
GET    /api/inbox                    # List inbox items
GET    /api/inbox/{id}               # Get inbox item
POST   /api/inbox/{id}/process       # Manually process
POST   /api/inbox/{id}/dismiss       # Dismiss item
POST   /api/inbox/{id}/create-task   # Create task from item
```

### Routing Rules

```
GET    /api/routing-rules            # List rules
POST   /api/routing-rules            # Create rule
GET    /api/routing-rules/{id}       # Get rule
PUT    /api/routing-rules/{id}       # Update rule
DELETE /api/routing-rules/{id}       # Delete rule
POST   /api/routing-rules/reorder    # Reorder priorities
POST   /api/routing-rules/test       # Test rule against sample data
```

### Team

```
GET    /api/team                     # List team members
POST   /api/team                     # Add team member
GET    /api/team/{id}                # Get team member
PUT    /api/team/{id}                # Update team member
DELETE /api/team/{id}                # Remove team member
```

### Contact Lists

```
GET    /api/contact-lists            # List contact lists
POST   /api/contact-lists            # Create list
GET    /api/contact-lists/{id}       # Get list with members
PUT    /api/contact-lists/{id}       # Update list
DELETE /api/contact-lists/{id}       # Delete list
POST   /api/contact-lists/{id}/members      # Add member
DELETE /api/contact-lists/{id}/members/{m}  # Remove member
```

### Assistant Channels

```
GET    /api/channels                 # List channels
POST   /api/channels/phone           # Provision phone number
POST   /api/channels/email           # Create email address
PUT    /api/channels/{id}            # Update channel settings
DELETE /api/channels/{id}            # Deactivate channel
```

### Marketplace

```
# Listings
GET    /api/marketplace/listings             # Browse listings
POST   /api/marketplace/listings             # Create listing
GET    /api/marketplace/listings/{id}        # Get listing
POST   /api/marketplace/listings/{id}/bid    # Submit bid
POST   /api/marketplace/listings/{id}/assign # Assign vendor

# Vendors
GET    /api/marketplace/vendors              # Browse vendors
GET    /api/marketplace/vendors/{id}         # Get vendor profile
POST   /api/marketplace/vendors              # Register as vendor
PUT    /api/marketplace/vendors/{id}         # Update vendor profile

# Vendor Dashboard
GET    /api/vendor/dashboard                 # Vendor stats
GET    /api/vendor/jobs                      # Vendor's jobs
GET    /api/vendor/earnings                  # Earnings report
```

### Webhooks (Internal)

```
POST   /api/webhooks/twilio/voice/{user_id}
POST   /api/webhooks/twilio/voicemail/{user_id}
POST   /api/webhooks/twilio/transcription/{user_id}
POST   /api/webhooks/twilio/sms/{user_id}
POST   /api/webhooks/sendgrid/inbound
POST   /api/webhooks/stripe
POST   /api/webhooks/ai-tool/{vendor_id}     # External AI tool callbacks
```

---

## External Integrations

### Twilio Configuration

```php
// config/services.php
'twilio' => [
    'sid' => env('TWILIO_ACCOUNT_SID'),
    'token' => env('TWILIO_AUTH_TOKEN'),
    'phone' => env('TWILIO_PHONE_NUMBER'),
    'verify_webhook' => env('TWILIO_VERIFY_WEBHOOK', true),
],
```

### SendGrid Configuration

```php
// config/services.php
'sendgrid' => [
    'api_key' => env('SENDGRID_API_KEY'),
    'inbound_domain' => env('SENDGRID_INBOUND_DOMAIN', 'assistant.taskjuggler.com'),
    'webhook_secret' => env('SENDGRID_WEBHOOK_SECRET'),
],
```

### OpenRouter Configuration

```php
// config/services.php
'openrouter' => [
    'api_key' => env('OPENROUTER_API_KEY'),
    'base_url' => 'https://openrouter.ai/api/v1',
    'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'openai/gpt-4o'),
    'extraction_model' => env('OPENROUTER_EXTRACTION_MODEL', 'openai/gpt-4o'),
],
```

### Stripe Configuration

```php
// config/services.php
'stripe' => [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    'connect' => [
        'client_id' => env('STRIPE_CONNECT_CLIENT_ID'),
    ],
],
```

---

## Pricing & Billing

### Subscription Tiers

| Feature | Free | Starter ($15) | Pro ($35) | Business ($75) |
|---------|------|---------------|-----------|----------------|
| Tasks | 50/mo | Unlimited | Unlimited | Unlimited |
| Team Members | 0 | 2 | 10 | Unlimited |
| **AI Receptionist** | | | | |
| Email inbox | ❌ | ✅ | ✅ | ✅ |
| Emails/month | - | 100 | 500 | Unlimited |
| Phone forwarding | ❌ | ❌ | ✅ | ✅ |
| Voicemails/month | - | - | 50 | Unlimited |
| Dedicated phone | ❌ | ❌ | +$10/mo | ✅ |
| SMS inbox | ❌ | ❌ | 100/mo | Unlimited |
| **Routing** | | | | |
| Routing rules | 1 | 5 | 20 | Unlimited |
| Contact lists | 0 | 3 | 10 | Unlimited |
| Auto-responses | ❌ | Basic | Custom | Custom |
| **Marketplace** | | | | |
| Post listings | ❌ | ✅ | ✅ | ✅ |
| Use AI tools | ❌ | ✅ | ✅ | ✅ |

### Marketplace Fees

| Party | Fee |
|-------|-----|
| Buyer | 5% service fee |
| Human Vendor | 10% commission |
| AI Tool | Pass-through + 10% markup |

---

## Deployment Architecture

### Railway Services

```yaml
services:
  # Main Laravel Application
  - name: api
    type: web
    env: production
    buildCommand: composer install --no-dev && npm install && npm run build
    startCommand: php artisan serve --host=0.0.0.0 --port=$PORT
    envVars:
      - APP_ENV=production
      - APP_KEY=<secret>
      - DATABASE_URL=<from postgres service>
      - REDIS_URL=<from redis service>
    
  # Queue Worker
  - name: worker
    type: worker
    startCommand: php artisan queue:work --tries=3 --timeout=300
    envVars:
      - QUEUE_CONNECTION=redis
    
  # Scheduler
  - name: scheduler
    type: cron
    schedule: "* * * * *"
    command: php artisan schedule:run

  # PostgreSQL
  - name: postgres
    type: postgresql
    
  # Redis
  - name: redis
    type: redis
```

### Environment Variables

```bash
# App
APP_NAME="Task Juggler"
APP_ENV=production
APP_KEY=base64:xxxxx
APP_DEBUG=false
APP_URL=https://api.taskjuggler.com

# Database
DB_CONNECTION=pgsql
DATABASE_URL=postgres://user:pass@host:5432/taskjuggler

# Redis
REDIS_URL=redis://default:pass@host:6379

# Queue
QUEUE_CONNECTION=redis

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxx

# OpenRouter
OPENROUTER_API_KEY=sk-or-xxxxx
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o

# Stripe
STRIPE_KEY=pk_live_xxxxx
STRIPE_SECRET=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Pusher (for real-time)
PUSHER_APP_ID=xxxxx
PUSHER_APP_KEY=xxxxx
PUSHER_APP_SECRET=xxxxx
PUSHER_APP_CLUSTER=us2
```

---

## Summary

Task Juggler is a three-part system:

1. **AI Receptionist** - Intelligent intake across phone, email, SMS
2. **Deterministic Routing** - User-defined rules control task flow
3. **Marketplace** - Human vendors AND AI tools execute work

The AI's role is limited to understanding and extraction. All routing decisions are deterministic based on user rules. This creates a predictable, controllable system that users can trust.

The marketplace enables scaling beyond internal capacity by connecting to both human service providers and automated AI tools that can execute work immediately.
