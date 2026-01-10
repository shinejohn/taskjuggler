<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates tables for Fibonacco AI-SMB Context Protocol:
     * - AI Agent Identity & Authentication (Part 1)
     * - Context Packets (Part 2)
     * - Learning & Experience Capture (Part 4)
     * - Persona Configuration & Entity Consensus (Part 8)
     */
    public function up(): void
    {
        // ============================================
        // PART 1: AI AGENT IDENTITY & AUTHENTICATION
        // ============================================
        
        // AI Agent Instances (deployed agents)
        Schema::create('coord_ai_agents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id'); // Links to coord_coordinators
            
            // Agent Identity (from protocol Part 1.1)
            $table->string('agent_id')->unique(); // e.g., "ai-receptionist-mia-001"
            $table->string('agent_type'); // receptionist, scheduler, dispatcher, etc.
            $table->string('agent_name'); // e.g., "Mia"
            $table->string('version')->default('1.0.0');
            $table->string('platform')->nullable(); // alphasite, botjob, command_center, etc.
            $table->string('deployment_id')->nullable();
            
            // Capabilities (from protocol Part 1.1)
            $table->json('capabilities')->nullable(); // Functions, channels, languages
            
            // Authentication (from protocol Part 1.2)
            $table->string('agent_secret_hash'); // Encrypted secret for authentication
            $table->timestamp('last_authenticated_at')->nullable();
            
            // Status
            $table->string('status')->default('active'); // active, paused, inactive, suspended
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'agent_type']);
            $table->index(['agent_id']);
        });
        
        // AI Agent Sessions (from protocol Part 1.2)
        Schema::create('coord_ai_agent_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('agent_id');
            $table->uuid('organization_id');
            
            // Session Token (JWT or similar)
            $table->string('session_token')->unique();
            $table->string('session_type')->default('customer_interaction'); // customer_interaction, admin, etc.
            
            // Permissions & Scope (from protocol Part 1.3)
            $table->json('permissions')->nullable(); // read_profile, read_faqs, create_booking, etc.
            $table->json('restrictions')->nullable(); // no_financial, no_employee_personal, etc.
            
            // Expiration
            $table->timestamp('expires_at');
            $table->timestamp('last_used_at')->nullable();
            
            // Metadata
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('cascade');
                
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['session_token']);
            $table->index(['agent_id', 'expires_at']);
        });
        
        // ============================================
        // PART 2: CONTEXT PACKETS
        // ============================================
        
        // Context Packet Versions (from protocol Part 2.2)
        Schema::create('coord_context_packets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('agent_id')->nullable(); // Specific agent, or null for organization-wide
            
            // Packet Header (from protocol Part 2.2)
            $table->string('packet_id')->unique(); // e.g., "ctx-2025-01-02-bobs-plumbing-123-abc"
            $table->string('version')->default('1.0');
            $table->string('checksum')->nullable(); // SHA256 checksum
            
            // Tier 1: Platform Knowledge (same for all businesses)
            $table->json('platform_knowledge')->nullable();
            
            // Tier 2: Industry Knowledge (same for all businesses in industry)
            $table->string('industry_id')->nullable();
            $table->json('industry_knowledge')->nullable();
            
            // Tier 3: Business Knowledge (specific to this SMB)
            $table->json('business_profile')->nullable();
            $table->json('business_faqs')->nullable();
            $table->json('team')->nullable();
            $table->json('calendar_summary')->nullable();
            
            // Conversation Context (for ongoing sessions)
            $table->json('conversation_context')->nullable();
            
            // Rules & Boundaries (from protocol Part 2.2)
            $table->json('rules')->nullable(); // prohibited_topics, escalation_triggers, privacy_rules
            
            // Cache Control (from protocol Part 2.3)
            $table->integer('ttl_seconds')->default(14400); // 4 hours default
            $table->integer('refresh_after_seconds')->default(3600); // 1 hour soft refresh
            $table->json('invalidation_events')->nullable();
            
            // Metadata
            $table->timestamp('generated_at');
            $table->timestamp('expires_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'agent_id', 'is_active']);
            $table->index(['packet_id']);
            $table->index(['expires_at']);
        });
        
        // Context Packet Cache Invalidation Events (from protocol Part 2.4)
        Schema::create('coord_context_invalidations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('context_packet_id')->nullable();
            
            // Event Details
            $table->string('event_type'); // business_profile_updated, faq_updated, calendar_changed, etc.
            $table->json('sections_affected')->nullable(); // Which sections of packet invalidated
            $table->string('urgency')->default('next_refresh'); // immediate, next_refresh
            
            // Delivery Status
            $table->string('delivery_method')->default('websocket_push'); // websocket_push, poll
            $table->boolean('delivered')->default(false);
            $table->timestamp('delivered_at')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('context_packet_id')
                ->references('id')
                ->on('coord_context_packets')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'delivered', 'created_at']);
            $table->index(['event_type', 'urgency']);
        });
        
        // ============================================
        // PART 4: LEARNING & EXPERIENCE CAPTURE
        // ============================================
        
        // AI Interactions Log (from protocol Part 4.1)
        Schema::create('coord_ai_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('agent_id');
            $table->uuid('contact_id')->nullable();
            $table->uuid('session_id')->nullable();
            
            // Interaction Details (from protocol Part 3.5)
            $table->string('interaction_id')->unique(); // e.g., "int-2025-01-02-001"
            $table->string('channel'); // phone, chat, sms, email
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration_seconds')->default(0);
            
            // Customer Context
            $table->boolean('customer_identified')->default(false);
            $table->json('customer_info')->nullable(); // Name, phone, etc. (anonymized for learning)
            
            // Intent & Outcome (from protocol Part 3.5)
            $table->json('intent')->nullable(); // primary, secondary, confidence
            $table->json('outcome')->nullable(); // type, success, booking_id, etc.
            $table->text('conversation_summary')->nullable();
            
            // Transcript Reference (stored separately for privacy)
            $table->string('transcript_reference')->nullable();
            
            // Sentiment Analysis
            $table->json('sentiment')->nullable(); // overall, start, end
            
            // FAQs Used (from protocol Part 3.5)
            $table->json('faqs_used')->nullable(); // Which FAQs were referenced
            
            // Unknown Questions (from protocol Part 4.2)
            $table->json('unknown_questions')->nullable(); // Questions AI couldn't answer
            
            // Agent Info
            $table->string('agent_version')->nullable();
            
            // Learning Flags
            $table->boolean('analyzed_for_learning')->default(false);
            $table->timestamp('analyzed_at')->nullable();
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->foreign('session_id')
                ->references('id')
                ->on('coord_ai_agent_sessions')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'started_at']);
            $table->index(['agent_id', 'analyzed_for_learning']);
            $table->index(['interaction_id']);
        });
        
        // FAQ Suggestions (from protocol Part 4.2)
        Schema::create('coord_faq_suggestions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('agent_id')->nullable();
            
            // Suggestion Details (from protocol Part 4.2)
            $table->string('question'); // The question customers are asking
            $table->text('proposed_answer')->nullable(); // AI-generated or blank
            $table->text('context')->nullable(); // Conversation context
            
            // Frequency & Priority (from protocol Part 4.2)
            $table->integer('frequency')->default(1); // How many times asked
            $table->string('priority')->default('medium'); // high, medium, low
            $table->timestamp('first_asked_at');
            $table->timestamp('last_asked_at');
            
            // Question Clustering (for grouping similar questions)
            $table->uuid('cluster_id')->nullable(); // Groups similar questions
            $table->string('canonical_question')->nullable(); // Suggested canonical form
            
            // Status
            $table->string('status')->default('pending_review'); // pending_review, approved, rejected, dismissed
            $table->uuid('approved_faq_id')->nullable(); // If approved, link to FAQ
            
            // Business Owner Review
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'status', 'priority']);
            $table->index(['cluster_id']);
        });
        
        // Business Experience Data (from protocol Part 4.3)
        Schema::create('coord_business_experience', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            
            // Customer Patterns (from protocol Part 4.3)
            $table->json('customer_patterns')->nullable(); // busy_times, common_services, seasonal_patterns
            
            // Conversation Patterns
            $table->json('conversation_patterns')->nullable(); // avg_duration, conversion_rate, objections, successful_responses
            
            // FAQ Effectiveness (from protocol Part 4.3)
            $table->json('faq_effectiveness')->nullable(); // most_used, needs_improvement
            
            // Customer Vocabulary (from protocol Part 4.3)
            $table->json('customer_vocabulary')->nullable(); // Terms customers use mapped to services
            
            // Aggregation Period
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('interaction_count')->default(0);
            
            // Last Updated
            $table->timestamp('last_analyzed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->unique(['organization_id', 'period_start', 'period_end']);
            $table->index(['organization_id', 'period_end']);
        });
        
        // ============================================
        // PART 8: PERSONA CONFIGURATION & ENTITY CONSENSUS
        // ============================================
        
        // Persona Configurations (from protocol Part 8.3)
        Schema::create('coord_persona_configurations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id');
            $table->uuid('agent_id')->nullable();
            
            // Configuration Version (from protocol Part 8.9)
            $table->string('version_id')->unique(); // e.g., "config-v23"
            $table->uuid('parent_version_id')->nullable(); // For versioning
            
            // Persona Identity (from protocol Part 8.3)
            $table->json('identity')->nullable(); // name, display_name, role, avatar_url
            
            // Personality (from protocol Part 8.3)
            $table->json('personality')->nullable(); // core_traits, emotional_range, humor
            
            // Communication Style (from protocol Part 8.3)
            $table->json('communication')->nullable(); // formality, pacing, verbosity, language
            
            // Voice Settings (from protocol Part 8.3)
            $table->json('voice')->nullable(); // voice_id, pitch, speed, emphasis_style
            
            // Behavioral Rules (from protocol Part 8.3)
            $table->json('behavior')->nullable(); // greeting_style, objection_handling, upselling, closing_style
            
            // Prompt Templates (from protocol Part 8.3)
            $table->json('prompts')->nullable(); // greetings, service_responses, objection_responses, closings, recovery
            
            // Approval Status (from protocol Part 8.6)
            $table->string('approval_status')->default('pending'); // pending, approved, rejected
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            
            // Effectiveness Tracking (from protocol Part 8.9)
            $table->json('baseline_metrics')->nullable(); // conversion_rate, satisfaction_score, escalation_rate
            $table->json('current_metrics')->nullable();
            $table->date('review_date')->nullable();
            
            // Metadata
            $table->boolean('is_active')->default(false); // Only one active per coordinator
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'coordinator_id', 'is_active']);
            $table->index(['version_id']);
        });
        
        // Entity Consensus Requests (from protocol Part 8.5)
        Schema::create('coord_consensus_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id');
            $table->uuid('persona_configuration_id')->nullable();
            
            // Consensus Details (from protocol Part 8.5)
            $table->string('consensus_id')->unique(); // e.g., "consensus-2025-01-02-001"
            $table->string('initiated_by'); // ai_agent, command_center
            $table->string('category'); // persona_configuration, prompt_update, behavior_change
            $table->string('specific_element')->nullable(); // e.g., "prompts.objection_responses.price_concern"
            
            // Positions (from protocol Part 8.5)
            $table->json('ai_agent_position')->nullable(); // proposal, reasoning, evidence_strength
            $table->json('command_center_position')->nullable(); // current, requirements, flexibility
            
            // Conflict Type (from protocol Part 8.5)
            $table->string('conflict_type')->nullable(); // no_conflict, soft_conflict, hard_conflict, safety_override
            
            // Proposed Resolution (from protocol Part 8.5)
            $table->json('proposed_resolution')->nullable(); // merged_proposal, satisfies_ai_goals, satisfies_cc_requirements
            
            // Status
            $table->string('status')->default('pending'); // pending, auto_resolved, manual_review, resolved, rejected
            $table->boolean('requires_smb_approval')->default(true);
            
            // Resolution
            $table->json('resolution')->nullable();
            $table->foreignId('resolved_by_user_id')->nullable()->constrained('users');
            $table->timestamp('resolved_at')->nullable();
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
                
            $table->foreign('persona_configuration_id')
                ->references('id')
                ->on('coord_persona_configurations')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'status']);
            $table->index(['consensus_id']);
        });
        
        // Configuration Suggestions (from protocol Part 8.4)
        Schema::create('coord_configuration_suggestions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id');
            $table->uuid('agent_id')->nullable();
            
            // Suggestion Details (from protocol Part 8.4)
            $table->string('suggestion_id')->unique();
            $table->string('type'); // prompt_adaptation, persona_adjustment, behavior_change
            $table->string('category'); // effectiveness_improvement, customer_feedback, ai_self_improvement
            $table->string('priority')->default('medium'); // high, medium, low
            
            // Current vs Proposed (from protocol Part 8.4)
            $table->json('current_config')->nullable(); // path, value
            $table->json('proposed_config')->nullable(); // path, value
            
            // Evidence (from protocol Part 8.4)
            $table->json('evidence')->nullable(); // based_on, current_rate, predicted_rate, confidence, sample_conversations
            $table->text('reasoning')->nullable();
            
            // Status
            $table->string('status')->default('pending_review'); // pending_review, approved, rejected, dismissed
            $table->boolean('requires_approval')->default(true);
            $table->boolean('auto_apply_eligible')->default(false);
            
            // Review
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'status', 'priority']);
            $table->index(['suggestion_id']);
        });
        
        // AI Agent Feedback (from protocol Part 3.5)
        Schema::create('coord_ai_feedback', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('interaction_id');
            $table->uuid('organization_id');
            
            // Feedback Details (from protocol Part 3.5)
            $table->string('feedback_type'); // customer_satisfaction, business_review
            $table->integer('rating')->nullable(); // 1-5 scale
            $table->string('source')->nullable(); // post_call_survey, manual, etc.
            $table->text('comments')->nullable();
            
            $table->timestamps();
            
            $table->foreign('interaction_id')
                ->references('id')
                ->on('coord_ai_interactions')
                ->onDelete('cascade');
                
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'feedback_type', 'created_at']);
        });
        
        // Audit Trail (from protocol Part 5.2)
        Schema::create('coord_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('agent_id')->nullable();
            $table->uuid('session_id')->nullable();
            
            // Event Details (from protocol Part 5.2)
            $table->string('event_type'); // context_requested, customer_lookup, data_accessed, data_created, data_modified
            $table->string('resource_type')->nullable(); // customer, appointment, faq, etc.
            $table->uuid('resource_id')->nullable();
            
            // What Was Accessed
            $table->json('data_accessed')->nullable(); // What sections/fields
            $table->text('justification')->nullable(); // Why this access was needed
            
            // Actor
            $table->string('actor_type'); // ai_agent, user, system
            $table->uuid('actor_id')->nullable();
            
            // Compliance
            $table->boolean('contains_phi')->default(false); // HIPAA flag
            $table->boolean('contains_pii')->default(false);
            $table->string('compliance_mode')->nullable(); // hipaa, legal_privilege, etc.
            
            // Metadata
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('agent_id')
                ->references('id')
                ->on('coord_ai_agents')
                ->onDelete('set null');
                
            $table->foreign('session_id')
                ->references('id')
                ->on('coord_ai_agent_sessions')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'event_type', 'created_at']);
            $table->index(['agent_id', 'created_at']);
            $table->index(['resource_type', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coord_audit_logs');
        Schema::dropIfExists('coord_ai_feedback');
        Schema::dropIfExists('coord_configuration_suggestions');
        Schema::dropIfExists('coord_consensus_requests');
        Schema::dropIfExists('coord_persona_configurations');
        Schema::dropIfExists('coord_business_experience');
        Schema::dropIfExists('coord_faq_suggestions');
        Schema::dropIfExists('coord_ai_interactions');
        Schema::dropIfExists('coord_context_invalidations');
        Schema::dropIfExists('coord_context_packets');
        Schema::dropIfExists('coord_ai_agent_sessions');
        Schema::dropIfExists('coord_ai_agents');
    }
};




