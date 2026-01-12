# TaskJuggler Database Schema
## Complete PostgreSQL Database Schema Documentation

**Database**: PostgreSQL 16  
**Last Updated**: December 2025  
**Total Tables**: 40+

---

## Table of Contents

1. [Core Tables](#core-tables)
2. [Authentication & Users](#authentication--users)
3. [AI Receptionist](#ai-receptionist)
4. [Tasks & Routing](#tasks--routing)
5. [Teams & Collaboration](#teams--collaboration)
6. [Marketplace](#marketplace)
7. [SiteHealth Scanner](#sitehealth-scanner)
8. [TEF (Task Exchange Format)](#tef-task-exchange-format)
9. [Appointments](#appointments)
10. [Messaging](#messaging)
11. [Notifications](#notifications)
12. [System Tables](#system-tables)

---

## Core Tables

### users
Primary user accounts table.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Subscription
    plan VARCHAR(50) DEFAULT 'free',
    plan_expires_at TIMESTAMPTZ NULL,
    stripe_customer_id VARCHAR(255) NULL,
    
    -- Settings (JSONB)
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
```

**Fields:**
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Hashed password
- `name`: User's full name
- `phone`: Phone number (optional)
- `timezone`: User's timezone
- `plan`: Subscription plan (free, pro, enterprise)
- `plan_expires_at`: When plan expires
- `stripe_customer_id`: Stripe customer ID for billing
- `settings`: JSONB for user preferences (includes MCP API keys)

**Relationships:**
- One-to-many: `assistant_channels`, `routing_rules`, `tasks` (as requestor/owner)
- One-to-many: `team_members`, `teams` (as creator)
- One-to-many: `marketplace_vendors`, `marketplace_listings`

---

### profiles
Extended user profiles (organizations, companies).

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'personal', -- 'personal', 'organization', 'company'
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    website VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_type ON profiles(type);
```

---

## Authentication & Users

### password_reset_tokens
Password reset token storage.

```sql
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);
```

### sessions
Laravel session storage.

```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);
```

### personal_access_tokens
Laravel Sanctum API tokens.

```sql
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT[],
    last_used_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_pat_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);
CREATE INDEX idx_pat_token ON personal_access_tokens(token);
```

---

## AI Receptionist

### assistant_channels
Communication channels (phone, email, SMS) for AI receptionist.

```sql
CREATE TABLE assistant_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_type VARCHAR(20) NOT NULL, -- 'phone', 'email', 'sms'
    
    -- Phone (Twilio)
    phone_number VARCHAR(20) NULL,
    twilio_sid VARCHAR(50) NULL,
    
    -- Email (SendGrid)
    email_address VARCHAR(255) NULL, -- username@assistant.taskjuggler.com
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    greeting_message TEXT NULL,
    voicemail_greeting TEXT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channels_user_id ON assistant_channels(user_id);
CREATE INDEX idx_channels_type ON assistant_channels(channel_type);
```

**Relationships:**
- Many-to-one: `users` (owner)
- One-to-many: `inbox_items` (source channel)

---

### inbox_items
Raw incoming communications before task creation.

```sql
CREATE TABLE inbox_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Source
    source_type VARCHAR(20) NOT NULL, -- 'phone', 'email', 'sms'
    source_id VARCHAR(255) NULL, -- External ID (Twilio SID, email message ID)
    channel_id UUID NULL REFERENCES assistant_channels(id),
    
    -- Sender
    from_identifier VARCHAR(255) NOT NULL, -- Phone or email
    from_name VARCHAR(255) NULL,
    
    -- Content
    subject VARCHAR(500) NULL,
    body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    
    -- AI Processing
    extracted_data JSONB NULL, -- Full AI extraction result
    processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    processing_error TEXT NULL,
    
    -- Routing
    routed_to_task_id UUID NULL, -- References tasks.id
    routing_rule_id UUID NULL, -- References routing_rules.id
    
    -- Auto-response
    auto_response_sent BOOLEAN DEFAULT false,
    auto_response_text TEXT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'unprocessed', -- 'unprocessed', 'processed', 'dismissed', 'created_task'
    
    received_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbox_user_status ON inbox_items(user_id, status);
CREATE INDEX idx_inbox_received ON inbox_items(received_at);
CREATE INDEX idx_inbox_channel ON inbox_items(channel_id);
```

**Relationships:**
- Many-to-one: `users` (owner)
- Many-to-one: `assistant_channels` (source channel)
- One-to-one: `tasks` (routed task)
- Many-to-one: `routing_rules` (matched rule)

---

### routing_rules
Deterministic routing rules for task assignment.

```sql
CREATE TABLE routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    priority INTEGER DEFAULT 100, -- Lower = evaluated first
    is_active BOOLEAN DEFAULT true,
    
    -- Conditions (JSONB)
    conditions JSONB NOT NULL, -- Array of condition objects
    
    -- Actions (JSONB)
    actions JSONB NOT NULL, -- What to do when matched
    
    -- Stats
    times_matched INTEGER DEFAULT 0,
    last_matched_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_routing_rules_user ON routing_rules(user_id, is_active, priority);
```

**Example conditions:**
```json
[
  {"field": "category", "operator": "equals", "value": "maintenance"},
  {"field": "priority", "operator": "greater_than", "value": 5}
]
```

**Example actions:**
```json
{
  "assign_to": "team_member",
  "team_member_id": "uuid",
  "notify": true,
  "create_task": true
}
```

---

## Tasks & Routing

### tasks
Core task management table.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Ownership
    requestor_id UUID NOT NULL REFERENCES users(id), -- Who needs it done
    owner_id UUID NULL REFERENCES users(id), -- Who's doing it (if user)
    team_id UUID NULL REFERENCES teams(id),
    team_member_id UUID NULL REFERENCES team_members(id), -- If team member
    marketplace_vendor_id UUID NULL REFERENCES marketplace_vendors(id), -- If vendor
    marketplace_listing_id UUID NULL REFERENCES marketplace_listings(id),
    
    -- Source tracking
    source_type VARCHAR(20) NULL, -- 'phone', 'email', 'sms', 'web', 'api'
    source_channel_id UUID NULL REFERENCES assistant_channels(id),
    source_channel VARCHAR(50) NULL,
    source_channel_ref TEXT NULL,
    metadata JSONB DEFAULT '{}',
    tags JSONB DEFAULT '[]',
    
    -- Process/Project integration
    process_id UUID NULL,
    process_step_id VARCHAR(255) NULL,
    project_id UUID NULL,
    
    -- Dates
    due_date TIMESTAMPTZ NULL,
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL -- Soft deletes
);

CREATE INDEX idx_tasks_requestor ON tasks(requestor_id);
CREATE INDEX idx_tasks_owner ON tasks(owner_id);
CREATE INDEX idx_tasks_team ON tasks(team_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_process ON tasks(process_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
```

**Relationships:**
- Many-to-one: `users` (requestor, owner)
- Many-to-one: `teams` (team assignment)
- Many-to-one: `team_members` (team member assignment)
- Many-to-one: `marketplace_vendors` (vendor assignment)
- Many-to-one: `marketplace_listings` (marketplace listing)
- Many-to-one: `assistant_channels` (source channel)
- One-to-many: `task_messages`, `task_actions`, `task_invitations`

---

### task_messages
Messages/comments on tasks.

```sql
CREATE TABLE task_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_messages_task ON task_messages(task_id);
CREATE INDEX idx_task_messages_user ON task_messages(user_id);
```

### task_message_reads
Read receipts for task messages.

```sql
CREATE TABLE task_message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES task_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    read_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(message_id, user_id)
);
```

### task_actions
Action history for tasks.

```sql
CREATE TABLE task_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- 'created', 'assigned', 'status_changed', 'commented', etc.
    action_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_actions_task ON task_actions(task_id);
CREATE INDEX idx_task_actions_user ON task_actions(user_id);
```

### task_invitations
Invitations to collaborate on tasks.

```sql
CREATE TABLE task_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_invitations_task ON task_invitations(task_id);
CREATE INDEX idx_task_invitations_code ON task_invitations(invite_code);
```

---

## Teams & Collaboration

### teams
Team/organization groups.

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NULL,
    avatar_url VARCHAR(500) NULL,
    created_by UUID NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_created_by ON teams(created_by);
```

### team_members
Membership in teams.

```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT false,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

### team_invitations
Team membership invitations.

```sql
CREATE TABLE team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_code ON team_invitations(invite_code);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
```

---

## Marketplace

### marketplace_vendors
Vendors (human or AI) in the marketplace.

```sql
CREATE TABLE marketplace_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Type
    vendor_type VARCHAR(20) NOT NULL, -- 'human', 'ai', 'hybrid'
    
    -- Human vendors
    user_id UUID NULL REFERENCES users(id),
    business_name VARCHAR(255) NULL,
    
    -- AI vendors
    ai_provider VARCHAR(50) NULL, -- 'internal', 'botjob', 'alphasite', 'external'
    ai_config JSONB NULL,
    
    -- Profile
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    logo_url VARCHAR(500) NULL,
    
    -- Services
    categories JSONB NULL, -- Array of category strings
    services JSONB DEFAULT '[]',
    
    -- Location (for human vendors)
    address VARCHAR(500) NULL,
    
    -- Pricing
    pricing_model VARCHAR(20) NULL, -- 'fixed', 'hourly', 'quote', 'per_task'
    base_rate DECIMAL(10, 2) NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Stats
    total_jobs INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) NULL,
    
    -- Stripe Connect
    stripe_account_id VARCHAR(255) NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendors_type ON marketplace_vendors(vendor_type, is_active);
CREATE INDEX idx_vendors_user ON marketplace_vendors(user_id);
```

### marketplace_listings
Job listings posted to marketplace.

```sql
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NULL REFERENCES tasks(id),
    requestor_id UUID NOT NULL REFERENCES users(id),
    
    -- Listing details
    title VARCHAR(500) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NULL,
    
    -- Requirements
    location_required BOOLEAN DEFAULT false,
    location JSONB NULL, -- {'lat': 123.45, 'lng': 67.89}
    location_radius_miles INTEGER NULL,
    
    -- Budget
    budget_type VARCHAR(20) NULL, -- 'fixed', 'hourly', 'quote'
    budget_min DECIMAL(10, 2) NULL,
    budget_max DECIMAL(10, 2) NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'assigned', 'completed', 'cancelled'
    
    -- Assignment
    assigned_vendor_id UUID NULL REFERENCES marketplace_vendors(id),
    assigned_at TIMESTAMPTZ NULL,
    
    -- Timing
    needed_by TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_status ON marketplace_listings(status);
CREATE INDEX idx_listings_category ON marketplace_listings(category);
CREATE INDEX idx_listings_requestor ON marketplace_listings(requestor_id);
```

### marketplace_bids
Bids on marketplace listings.

```sql
CREATE TABLE marketplace_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    
    -- Bid details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    message TEXT NULL,
    estimated_completion_days INTEGER NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'withdrawn'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bids_listing ON marketplace_bids(listing_id);
CREATE INDEX idx_bids_vendor ON marketplace_bids(vendor_id);
CREATE INDEX idx_bids_status ON marketplace_bids(status);
```

### ai_tool_configs
Configuration for AI tools in marketplace.

```sql
CREATE TABLE ai_tool_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_type VARCHAR(50) NOT NULL, -- 'api', 'webhook', 'function'
    config JSONB NOT NULL, -- Tool-specific configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_tools_vendor ON ai_tool_configs(vendor_id);
```

### ai_tool_executions
Execution history for AI tools.

```sql
CREATE TABLE ai_tool_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id),
    tool_config_id UUID NOT NULL REFERENCES ai_tool_configs(id),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    
    -- Execution
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    input_data JSONB NOT NULL,
    output_data JSONB NULL,
    error_message TEXT NULL,
    
    -- Timing
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_executions_task ON ai_tool_executions(task_id);
CREATE INDEX idx_ai_executions_vendor ON ai_tool_executions(vendor_id);
CREATE INDEX idx_ai_executions_status ON ai_tool_executions(status);
```

### transactions
Payment transactions for marketplace.

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NULL REFERENCES tasks(id),
    listing_id UUID NULL REFERENCES marketplace_listings(id),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    requestor_id UUID NOT NULL REFERENCES users(id),
    
    -- Payment
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL, -- 'stripe_connect', 'stripe', 'manual'
    stripe_payment_intent_id VARCHAR(255) NULL,
    stripe_transfer_id VARCHAR(255) NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_task ON transactions(task_id);
CREATE INDEX idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX idx_transactions_requestor ON transactions(requestor_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

## Contact Lists

### contact_lists
User-defined contact lists.

```sql
CREATE TABLE contact_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_lists_user ON contact_lists(user_id);
```

### contact_list_members
Members of contact lists.

```sql
CREATE TABLE contact_list_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_list_id UUID NOT NULL REFERENCES contact_lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    notes TEXT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_members_list ON contact_list_members(contact_list_id);
```

---

## SiteHealth Scanner

### sites
Websites being monitored.

```sql
CREATE TABLE sites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    auth_type VARCHAR(50) DEFAULT 'none', -- 'none', 'basic', 'bearer', 'cookie'
    auth_config JSON NULL,
    max_pages INTEGER NULL,
    checks JSON NULL, -- Which checks to run
    last_scan_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sites_user_id ON sites(user_id);
CREATE INDEX idx_sites_url ON sites(url);
```

### scans
Scan execution records.

```sql
CREATE TABLE scans (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NULL,
    pages_scanned INTEGER DEFAULT 0,
    total_pages INTEGER NULL,
    health_score INTEGER DEFAULT 0, -- 0-100
    category_scores JSON NULL, -- {'accessibility': 85, 'seo': 90, 'performance': 75, 'security': 95}
    issue_count INTEGER DEFAULT 0,
    error TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scans_site_id ON scans(site_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_started_at ON scans(started_at);
```

### issues
Issues found during scans.

```sql
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'accessibility', 'seo', 'performance', 'security'
    severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'fixed', 'ignored', 'false_positive'
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    page_url VARCHAR(1000) NOT NULL,
    selector VARCHAR(500) NULL, -- CSS selector
    html_context TEXT NULL,
    wcag_criteria JSON NULL, -- WCAG criteria violated
    fix_code TEXT NULL, -- Generated fix code
    fix_explanation TEXT NULL, -- Explanation of fix
    fix_confidence INTEGER NULL, -- 0-100 confidence in fix
    screenshot_url VARCHAR(500) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_issues_scan_id ON issues(scan_id);
CREATE INDEX idx_issues_site_id ON issues(site_id);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_status ON issues(status);
```

### scheduled_scans
Scheduled recurring scans.

```sql
CREATE TABLE scheduled_scans (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    schedule_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
    schedule_config JSON NULL, -- Cron expression or schedule details
    is_active BOOLEAN DEFAULT true,
    next_scan_at TIMESTAMPTZ NULL,
    last_run_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_scans_site_id ON scheduled_scans(site_id);
CREATE INDEX idx_scheduled_scans_next_scan ON scheduled_scans(next_scan_at);
```

---

## TEF (Task Exchange Format)

### actors
Actors in the TEF system (humans, AI agents, teams, IoT devices).

```sql
CREATE TABLE actors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type VARCHAR(50) NOT NULL, -- 'HUMAN', 'AI_AGENT', 'TEAM', 'IOT_DEVICE', 'IOT_GATEWAY'
    display_name VARCHAR(255) NOT NULL,
    capabilities JSON DEFAULT '[]',
    contact_methods JSON DEFAULT '[]',
    metadata JSON DEFAULT '{}',
    authentication JSON DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'PENDING_CLAIM', 'ACTIVE', 'SUSPENDED', 'DELETED'
    organization_id UUID NULL REFERENCES profiles(id) ON DELETE SET NULL,
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_actors_type ON actors(actor_type);
CREATE INDEX idx_actors_status ON actors(status);
CREATE INDEX idx_actors_organization ON actors(organization_id);
CREATE INDEX idx_actors_user ON actors(user_id);
-- GIN index for capabilities (PostgreSQL)
CREATE INDEX idx_actors_capabilities ON actors USING GIN(capabilities);
```

### relationships
Relationships between actors.

```sql
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_a_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    actor_b_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'OWNER', 'PEER', 'DELEGATE', 'WATCHER', 'VENDOR'
    permissions JSON DEFAULT '{}',
    established_via VARCHAR(50) NOT NULL, -- 'CLAIM_CODE', 'INVITATION', 'ORGANIZATION', 'API'
    trust_score DECIMAL(5, 2) DEFAULT 50.00,
    task_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(actor_a_id, actor_b_id)
);

CREATE INDEX idx_relationships_actor_a ON relationships(actor_a_id);
CREATE INDEX idx_relationships_actor_b ON relationships(actor_b_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);
```

### conversations
Conversations between actors.

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_a_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    actor_b_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    subject VARCHAR(500) NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(actor_a_id, actor_b_id)
);

CREATE INDEX idx_conversations_actor_a ON conversations(actor_a_id);
CREATE INDEX idx_conversations_actor_b ON conversations(actor_b_id);
```

### messages
Messages in conversations.

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_actor_id UUID NOT NULL REFERENCES actors(id),
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'task', 'file', 'system'
    content TEXT NOT NULL,
    metadata JSON DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_actor_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

### relationship_history
History of relationship changes.

```sql
CREATE TABLE relationship_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    changed_by_actor_id UUID NULL REFERENCES actors(id),
    change_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'permissions_changed', 'trust_updated'
    old_values JSON NULL,
    new_values JSON NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rel_history_relationship ON relationship_history(relationship_id);
CREATE INDEX idx_rel_history_created ON relationship_history(created_at);
```

### delegation_rules
Rules for automatic task delegation.

```sql
CREATE TABLE delegation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    delegatee_actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    conditions JSON NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delegation_rules_delegator ON delegation_rules(delegator_actor_id);
CREATE INDEX idx_delegation_rules_delegatee ON delegation_rules(delegatee_actor_id);
```

### claim_codes
Codes for claiming actors (TEF).

```sql
CREATE TABLE claim_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    code VARCHAR(32) UNIQUE NOT NULL,
    claimed_by_user_id UUID NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_claim_codes_code ON claim_codes(code);
CREATE INDEX idx_claim_codes_actor ON claim_codes(actor_id);
```

---

## Appointments

### appointment_types
Types of appointments users can book.

```sql
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration_minutes INTEGER DEFAULT 30,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    is_active BOOLEAN DEFAULT true,
    
    -- Booking settings
    buffer_before_minutes INTEGER DEFAULT 0,
    buffer_after_minutes INTEGER DEFAULT 0,
    advance_booking_days INTEGER DEFAULT 30,
    cancellation_hours INTEGER DEFAULT 24,
    
    -- Pricing
    price DECIMAL(10, 2) NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Public booking
    booking_slug VARCHAR(100) UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointment_types_user ON appointment_types(user_id, is_active);
CREATE INDEX idx_appointment_types_slug ON appointment_types(booking_slug);
```

### availability_slots
Available time slots for appointments.

```sql
CREATE TABLE availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSON NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_slots_type ON availability_slots(appointment_type_id);
CREATE INDEX idx_availability_slots_time ON availability_slots(start_time, end_time);
```

### appointments
Booked appointments.

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE CASCADE,
    user_id UUID NULL REFERENCES users(id), -- Booked by
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
    notes TEXT NULL,
    cancelled_at TIMESTAMPTZ NULL,
    cancellation_reason TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_type ON appointments(appointment_type_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_time ON appointments(start_time);
```

---

## Messaging

### direct_messages
Direct messages between users.

```sql
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX idx_direct_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX idx_direct_messages_created ON direct_messages(created_at);
```

---

## Notifications

### notifications
User notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'task_assigned', 'task_completed', 'message', 'marketplace_bid', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional data
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

---

## System Tables

### cache
Laravel cache table.

```sql
CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE INDEX idx_cache_expiration ON cache(expiration);
```

### cache_locks
Laravel cache locks.

```sql
CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);
```

### jobs
Laravel queue jobs.

```sql
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_jobs_queue ON jobs(queue);
CREATE INDEX idx_jobs_available ON jobs(available_at);
```

### job_batches
Laravel job batches.

```sql
CREATE TABLE job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);
```

---

## Entity Relationship Diagram

```
users
├── assistant_channels (1:N)
├── routing_rules (1:N)
├── tasks (1:N as requestor/owner)
├── teams (1:N as creator)
├── team_members (1:N)
├── marketplace_vendors (1:N)
├── marketplace_listings (1:N as requestor)
├── contact_lists (1:N)
├── sites (1:N)
├── profiles (1:1)
└── actors (1:1 via user_id)

tasks
├── task_messages (1:N)
├── task_actions (1:N)
├── task_invitations (1:N)
├── marketplace_listings (1:1)
└── ai_tool_executions (1:N)

teams
├── team_members (1:N)
└── team_invitations (1:N)

marketplace_vendors
├── marketplace_listings (1:N via assigned_vendor_id)
├── marketplace_bids (1:N)
└── ai_tool_configs (1:N)

sites
├── scans (1:N)
└── issues (1:N via site_id)

scans
└── issues (1:N)

actors
├── relationships (1:N as actor_a/actor_b)
├── conversations (1:N as actor_a/actor_b)
└── messages (1:N as sender)

relationships
└── relationship_history (1:N)
```

---

## Indexes Summary

### Primary Indexes
- All tables have UUID or BIGSERIAL primary keys
- Foreign keys are indexed for join performance

### Composite Indexes
- `idx_inbox_user_status`: (user_id, status) for inbox filtering
- `idx_routing_rules_user`: (user_id, is_active, priority) for rule evaluation
- `idx_notifications_read`: (user_id, is_read) for unread notifications
- `idx_team_members`: Unique (team_id, user_id)

### JSONB Indexes (PostgreSQL)
- `idx_actors_capabilities`: GIN index on capabilities JSONB
- Categories in marketplace_vendors can use GIN indexes if needed

---

## Data Types Reference

### UUID
- Used for: users, tasks, teams, marketplace entities, TEF entities
- Format: `gen_random_uuid()` default

### TIMESTAMPTZ
- Used for: All timestamps (timezone-aware)
- Format: `NOW()` default

### JSONB
- Used for: Settings, metadata, configurations, extracted data
- Benefits: Indexable, queryable, efficient storage

### VARCHAR
- Used for: Names, emails, URLs, short text
- Lengths vary by field

### TEXT
- Used for: Descriptions, messages, long text
- No length limit

### DECIMAL
- Used for: Prices, ratings, scores
- Format: `DECIMAL(10, 2)` for currency, `DECIMAL(3, 2)` for ratings

---

## Foreign Key Constraints

All foreign keys use:
- `ON DELETE CASCADE`: Child records deleted when parent deleted
- `ON DELETE SET NULL`: Foreign key set to NULL when parent deleted
- `ON DELETE RESTRICT`: Prevents deletion if children exist

---

## Migration Order

1. Core: `users`, `sessions`, `password_reset_tokens`
2. Auth: `personal_access_tokens`
3. Profiles: `profiles`
4. Channels: `assistant_channels`
5. Inbox: `inbox_items`
6. Routing: `routing_rules`
7. Teams: `teams`, `team_members`, `team_invitations`
8. Tasks: `tasks`, `task_messages`, `task_actions`, `task_invitations`
9. Marketplace: `marketplace_vendors`, `marketplace_listings`, `marketplace_bids`, `ai_tool_configs`, `ai_tool_executions`
10. Contacts: `contact_lists`, `contact_list_members`
11. Scanner: `sites`, `scans`, `issues`, `scheduled_scans`
12. TEF: `actors`, `relationships`, `conversations`, `messages`, `relationship_history`, `delegation_rules`, `claim_codes`
13. Appointments: `appointment_types`, `availability_slots`, `appointments`
14. Messaging: `direct_messages`
15. Notifications: `notifications`
16. Transactions: `transactions`
17. System: `cache`, `jobs`, `job_batches`

---

## Schema Version

**Current Version**: 1.0  
**Last Migration**: 2025_12_27_233457  
**Total Tables**: 40+  
**Database**: PostgreSQL 16

---

## Notes

- All timestamps use `TIMESTAMPTZ` for timezone awareness
- UUIDs are used for all primary keys (except scanner tables using BIGSERIAL)
- JSONB is used extensively for flexible data storage
- Soft deletes are used on `tasks` table (`deleted_at`)
- Indexes are optimized for common query patterns
- Foreign keys ensure referential integrity

---

**This schema supports:**
- ✅ User authentication and authorization
- ✅ AI Receptionist intake system
- ✅ Deterministic routing rules
- ✅ Task management with Requestor/Do-er model
- ✅ Team collaboration
- ✅ Marketplace (human + AI vendors)
- ✅ SiteHealth Scanner
- ✅ TEF (Task Exchange Format)
- ✅ Appointment booking
- ✅ Direct messaging
- ✅ Notifications
- ✅ Payment processing

---

**Generated**: December 28, 2025  
**For**: TaskJuggler Platform





