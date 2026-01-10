-- TaskJuggler Database Schema
-- PostgreSQL 16
-- Generated: December 28, 2025
-- 
-- This file contains the complete database schema as SQL DDL statements.
-- Run migrations instead for Laravel compatibility, but this serves as reference.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================
-- CORE TABLES
-- ============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    plan VARCHAR(50) DEFAULT 'free',
    plan_expires_at TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity);

-- Personal Access Tokens (Laravel Sanctum)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT[],
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pat_tokenable ON personal_access_tokens(tokenable_type, tokenable_id);
CREATE INDEX IF NOT EXISTS idx_pat_token ON personal_access_tokens(token);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_default ON profiles(user_id, is_default);

-- ============================================
-- AI RECEPTIONIST
-- ============================================

-- Assistant Channels
CREATE TABLE IF NOT EXISTS assistant_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_type VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    twilio_sid VARCHAR(50),
    email_address VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    greeting_message TEXT,
    voicemail_greeting TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON assistant_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON assistant_channels(channel_type);

-- Inbox Items
CREATE TABLE IF NOT EXISTS inbox_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(20) NOT NULL,
    source_id VARCHAR(255),
    channel_id UUID REFERENCES assistant_channels(id),
    from_identifier VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    subject VARCHAR(500),
    body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    extracted_data JSONB,
    processing_status VARCHAR(20) DEFAULT 'pending',
    processing_error TEXT,
    routed_to_task_id UUID,
    routing_rule_id UUID,
    auto_response_sent BOOLEAN DEFAULT false,
    auto_response_text TEXT,
    status VARCHAR(20) DEFAULT 'unprocessed',
    received_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inbox_user_status ON inbox_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_inbox_received ON inbox_items(received_at);
CREATE INDEX IF NOT EXISTS idx_inbox_channel ON inbox_items(channel_id);

-- Routing Rules
CREATE TABLE IF NOT EXISTS routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    times_matched INTEGER DEFAULT 0,
    last_matched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routing_rules_user ON routing_rules(user_id, is_active, priority);

-- ============================================
-- TASKS
-- ============================================

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    requestor_id UUID NOT NULL REFERENCES users(id),
    owner_id UUID REFERENCES users(id),
    team_id UUID,
    team_member_id UUID,
    marketplace_vendor_id UUID,
    marketplace_listing_id UUID,
    source_type VARCHAR(20),
    source_channel_id UUID REFERENCES assistant_channels(id),
    source_channel VARCHAR(50),
    source_channel_ref TEXT,
    metadata JSONB DEFAULT '{}',
    tags JSONB DEFAULT '[]',
    process_id UUID,
    process_step_id VARCHAR(255),
    project_id UUID,
    due_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_requestor ON tasks(requestor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_owner ON tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_process ON tasks(process_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

-- Task Messages
CREATE TABLE IF NOT EXISTS task_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_messages_task ON task_messages(task_id);
CREATE INDEX IF NOT EXISTS idx_task_messages_user ON task_messages(user_id);

-- Task Message Reads
CREATE TABLE IF NOT EXISTS task_message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES task_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Task Actions
CREATE TABLE IF NOT EXISTS task_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_actions_task ON task_actions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_actions_user ON task_actions(user_id);

-- Task Invitations
CREATE TABLE IF NOT EXISTS task_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_invitations_task ON task_invitations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_invitations_code ON task_invitations(invite_code);

-- ============================================
-- TEAMS
-- ============================================

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    avatar_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT false,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- Team Invitations
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    invite_code VARCHAR(32) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_code ON team_invitations(invite_code);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);

-- ============================================
-- MARKETPLACE
-- ============================================

-- Marketplace Vendors
CREATE TABLE IF NOT EXISTS marketplace_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_type VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES users(id),
    business_name VARCHAR(255),
    ai_provider VARCHAR(50),
    ai_config JSONB,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    categories JSONB,
    services JSONB DEFAULT '[]',
    address VARCHAR(500),
    pricing_model VARCHAR(20),
    base_rate DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    total_jobs INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),
    stripe_account_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_type ON marketplace_vendors(vendor_type, is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_user ON marketplace_vendors(user_id);

-- Marketplace Listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    requestor_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    location_required BOOLEAN DEFAULT false,
    location JSONB,
    location_radius_miles INTEGER,
    budget_type VARCHAR(20),
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'open',
    assigned_vendor_id UUID REFERENCES marketplace_vendors(id),
    assigned_at TIMESTAMPTZ,
    needed_by TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_requestor ON marketplace_listings(requestor_id);

-- Marketplace Bids
CREATE TABLE IF NOT EXISTS marketplace_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    message TEXT,
    estimated_completion_days INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bids_listing ON marketplace_bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_bids_vendor ON marketplace_bids(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON marketplace_bids(status);

-- AI Tool Configs
CREATE TABLE IF NOT EXISTS ai_tool_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_tools_vendor ON ai_tool_configs(vendor_id);

-- AI Tool Executions
CREATE TABLE IF NOT EXISTS ai_tool_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id),
    tool_config_id UUID NOT NULL REFERENCES ai_tool_configs(id),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    status VARCHAR(20) DEFAULT 'pending',
    input_data JSONB NOT NULL,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_executions_task ON ai_tool_executions(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_executions_vendor ON ai_tool_executions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ai_executions_status ON ai_tool_executions(status);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    listing_id UUID REFERENCES marketplace_listings(id),
    vendor_id UUID NOT NULL REFERENCES marketplace_vendors(id),
    requestor_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_task ON transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_requestor ON transactions(requestor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================
-- CONTACT LISTS
-- ============================================

-- Contact Lists
CREATE TABLE IF NOT EXISTS contact_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_lists_user ON contact_lists(user_id);

-- Contact List Members
CREATE TABLE IF NOT EXISTS contact_list_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_list_id UUID NOT NULL REFERENCES contact_lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_members_list ON contact_list_members(contact_list_id);

-- ============================================
-- SITEHEALTH SCANNER
-- ============================================

-- Sites
CREATE TABLE IF NOT EXISTS sites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    auth_type VARCHAR(50) DEFAULT 'none',
    auth_config JSON,
    max_pages INTEGER,
    checks JSON,
    last_scan_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_url ON sites(url);

-- Scans
CREATE TABLE IF NOT EXISTS scans (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    pages_scanned INTEGER DEFAULT 0,
    total_pages INTEGER,
    health_score INTEGER DEFAULT 0,
    category_scores JSON,
    issue_count INTEGER DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scans_site_id ON scans(site_id);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_scans_started_at ON scans(started_at);

-- Issues
CREATE TABLE IF NOT EXISTS issues (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    page_url VARCHAR(1000) NOT NULL,
    selector VARCHAR(500),
    html_context TEXT,
    wcag_criteria JSON,
    fix_code TEXT,
    fix_explanation TEXT,
    fix_confidence INTEGER,
    screenshot_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issues_scan_id ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_issues_site_id ON issues(site_id);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);

-- Scheduled Scans
CREATE TABLE IF NOT EXISTS scheduled_scans (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    schedule_type VARCHAR(50) NOT NULL,
    schedule_config JSON,
    is_active BOOLEAN DEFAULT true,
    next_scan_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_scans_site_id ON scheduled_scans(site_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_next_scan ON scheduled_scans(next_scan_at);

-- ============================================
-- TEF (Task Exchange Format)
-- ============================================

-- Actors
CREATE TABLE IF NOT EXISTS actors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type VARCHAR(50) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    capabilities JSON DEFAULT '[]',
    contact_methods JSON DEFAULT '[]',
    metadata JSON DEFAULT '{}',
    authentication JSON DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    organization_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actors_type ON actors(actor_type);
CREATE INDEX IF NOT EXISTS idx_actors_status ON actors(status);
CREATE INDEX IF NOT EXISTS idx_actors_organization ON actors(organization_id);
CREATE INDEX IF NOT EXISTS idx_actors_user ON actors(user_id);
CREATE INDEX IF NOT EXISTS idx_actors_capabilities ON actors USING GIN(capabilities);

-- Relationships
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_a_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    actor_b_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    permissions JSON DEFAULT '{}',
    established_via VARCHAR(50) NOT NULL,
    trust_score DECIMAL(5, 2) DEFAULT 50.00,
    task_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(actor_a_id, actor_b_id)
);

CREATE INDEX IF NOT EXISTS idx_relationships_actor_a ON relationships(actor_a_id);
CREATE INDEX IF NOT EXISTS idx_relationships_actor_b ON relationships(actor_b_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON relationships(relationship_type);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    participants JSON NOT NULL,
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_task ON conversations(task_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL,
    source_actor_id UUID NOT NULL REFERENCES actors(id),
    target_actor_id UUID NOT NULL REFERENCES actors(id),
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    payload JSON NOT NULL,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_task ON messages(task_id);
CREATE INDEX IF NOT EXISTS idx_messages_source ON messages(source_actor_id);
CREATE INDEX IF NOT EXISTS idx_messages_target ON messages(target_actor_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- Relationship History
CREATE TABLE IF NOT EXISTS relationship_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    changed_by_actor_id UUID REFERENCES actors(id),
    change_type VARCHAR(50) NOT NULL,
    old_values JSON,
    new_values JSON,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rel_history_relationship ON relationship_history(relationship_id);
CREATE INDEX IF NOT EXISTS idx_rel_history_created ON relationship_history(created_at);

-- Delegation Rules
CREATE TABLE IF NOT EXISTS delegation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    delegatee_actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    conditions JSON NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delegation_rules_delegator ON delegation_rules(delegator_actor_id);
CREATE INDEX IF NOT EXISTS idx_delegation_rules_delegatee ON delegation_rules(delegatee_actor_id);

-- Claim Codes
CREATE TABLE IF NOT EXISTS claim_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    code VARCHAR(32) UNIQUE NOT NULL,
    claimed_by_user_id UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claim_codes_code ON claim_codes(code);
CREATE INDEX IF NOT EXISTS idx_claim_codes_actor ON claim_codes(actor_id);

-- ============================================
-- APPOINTMENTS
-- ============================================

-- Appointment Types
CREATE TABLE IF NOT EXISTS appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    buffer_before_minutes INTEGER DEFAULT 0,
    buffer_after_minutes INTEGER DEFAULT 0,
    advance_booking_days INTEGER DEFAULT 30,
    cancellation_hours INTEGER DEFAULT 24,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    booking_slug VARCHAR(100) UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointment_types_user ON appointment_types(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_types_slug ON appointment_types(booking_slug);

-- Availability Slots
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSON,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_slots_type ON availability_slots(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_time ON availability_slots(start_time, end_time);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(start_time);

-- ============================================
-- MESSAGING
-- ============================================

-- Direct Messages
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created ON direct_messages(created_at);

-- ============================================
-- NOTIFICATIONS
-- ============================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    channels JSONB,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ============================================
-- SYSTEM TABLES
-- ============================================

-- Cache
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_expiration ON cache(expiration);

-- Cache Locks
CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_queue ON jobs(queue);
CREATE INDEX IF NOT EXISTS idx_jobs_available ON jobs(available_at);

-- Job Batches
CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT,
    cancelled_at INTEGER,
    created_at INTEGER NOT NULL,
    finished_at INTEGER
);

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Add foreign keys that may not be in migrations
-- (Some are added conditionally based on table existence)

-- Tasks foreign keys
ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS fk_tasks_team 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS fk_tasks_team_member 
    FOREIGN KEY (team_member_id) REFERENCES team_members(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS fk_tasks_marketplace_vendor 
    FOREIGN KEY (marketplace_vendor_id) REFERENCES marketplace_vendors(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT IF NOT EXISTS fk_tasks_marketplace_listing 
    FOREIGN KEY (marketplace_listing_id) REFERENCES marketplace_listings(id) ON DELETE SET NULL;

-- Inbox items foreign keys
ALTER TABLE inbox_items ADD CONSTRAINT IF NOT EXISTS fk_inbox_task 
    FOREIGN KEY (routed_to_task_id) REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE inbox_items ADD CONSTRAINT IF NOT EXISTS fk_inbox_routing_rule 
    FOREIGN KEY (routing_rule_id) REFERENCES routing_rules(id) ON DELETE SET NULL;

-- Marketplace foreign keys
ALTER TABLE marketplace_listings ADD CONSTRAINT IF NOT EXISTS fk_listings_task 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE marketplace_listings ADD CONSTRAINT IF NOT EXISTS fk_listings_vendor 
    FOREIGN KEY (assigned_vendor_id) REFERENCES marketplace_vendors(id) ON DELETE SET NULL;

ALTER TABLE marketplace_bids ADD CONSTRAINT IF NOT EXISTS fk_bids_listing 
    FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE;
ALTER TABLE marketplace_bids ADD CONSTRAINT IF NOT EXISTS fk_bids_vendor 
    FOREIGN KEY (vendor_id) REFERENCES marketplace_vendors(id) ON DELETE CASCADE;

ALTER TABLE ai_tool_configs ADD CONSTRAINT IF NOT EXISTS fk_ai_tools_vendor 
    FOREIGN KEY (vendor_id) REFERENCES marketplace_vendors(id) ON DELETE CASCADE;

ALTER TABLE ai_tool_executions ADD CONSTRAINT IF NOT EXISTS fk_ai_executions_task 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE ai_tool_executions ADD CONSTRAINT IF NOT EXISTS fk_ai_executions_tool 
    FOREIGN KEY (tool_config_id) REFERENCES ai_tool_configs(id) ON DELETE CASCADE;
ALTER TABLE ai_tool_executions ADD CONSTRAINT IF NOT EXISTS fk_ai_executions_vendor 
    FOREIGN KEY (vendor_id) REFERENCES marketplace_vendors(id) ON DELETE CASCADE;

ALTER TABLE transactions ADD CONSTRAINT IF NOT EXISTS fk_transactions_task 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT IF NOT EXISTS fk_transactions_listing 
    FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT IF NOT EXISTS fk_transactions_vendor 
    FOREIGN KEY (vendor_id) REFERENCES marketplace_vendors(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT IF NOT EXISTS fk_transactions_requestor 
    FOREIGN KEY (requestor_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT IF NOT EXISTS fk_transactions_execution 
    FOREIGN KEY (execution_id) REFERENCES ai_tool_executions(id) ON DELETE SET NULL;

-- TEF foreign keys
ALTER TABLE relationships ADD CONSTRAINT IF NOT EXISTS fk_relationships_actor_a 
    FOREIGN KEY (actor_a_id) REFERENCES actors(id) ON DELETE CASCADE;
ALTER TABLE relationships ADD CONSTRAINT IF NOT EXISTS fk_relationships_actor_b 
    FOREIGN KEY (actor_b_id) REFERENCES actors(id) ON DELETE CASCADE;

ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_conversation 
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_task 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_source 
    FOREIGN KEY (source_actor_id) REFERENCES actors(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_target 
    FOREIGN KEY (target_actor_id) REFERENCES actors(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_reply 
    FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL;

ALTER TABLE relationship_history ADD CONSTRAINT IF NOT EXISTS fk_rel_history_relationship 
    FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE;
ALTER TABLE relationship_history ADD CONSTRAINT IF NOT EXISTS fk_rel_history_changed_by 
    FOREIGN KEY (changed_by_actor_id) REFERENCES actors(id) ON DELETE SET NULL;

ALTER TABLE delegation_rules ADD CONSTRAINT IF NOT EXISTS fk_delegation_delegator 
    FOREIGN KEY (delegator_actor_id) REFERENCES actors(id) ON DELETE CASCADE;
ALTER TABLE delegation_rules ADD CONSTRAINT IF NOT EXISTS fk_delegation_delegatee 
    FOREIGN KEY (delegatee_actor_id) REFERENCES actors(id) ON DELETE CASCADE;

ALTER TABLE claim_codes ADD CONSTRAINT IF NOT EXISTS fk_claim_codes_actor 
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE;
ALTER TABLE claim_codes ADD CONSTRAINT IF NOT EXISTS fk_claim_codes_user 
    FOREIGN KEY (claimed_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Appointment foreign keys
ALTER TABLE availability_slots ADD CONSTRAINT IF NOT EXISTS fk_availability_type 
    FOREIGN KEY (appointment_type_id) REFERENCES appointment_types(id) ON DELETE CASCADE;

ALTER TABLE appointments ADD CONSTRAINT IF NOT EXISTS fk_appointments_type 
    FOREIGN KEY (appointment_type_id) REFERENCES appointment_types(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD CONSTRAINT IF NOT EXISTS fk_appointments_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Primary user accounts';
COMMENT ON TABLE tasks IS 'Core task management';
COMMENT ON TABLE teams IS 'Team/organization groups';
COMMENT ON TABLE marketplace_vendors IS 'Vendors (human or AI) in marketplace';
COMMENT ON TABLE sites IS 'Websites being monitored by SiteHealth Scanner';
COMMENT ON TABLE actors IS 'Actors in TEF system (humans, AI, teams, IoT)';
COMMENT ON TABLE relationships IS 'Relationships between actors in TEF';

-- ============================================
-- END OF SCHEMA
-- ============================================





