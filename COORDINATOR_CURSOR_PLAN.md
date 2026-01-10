# COORDINATOR - Cursor Implementation Plan
## AI-Powered Virtual Assistants for Task Juggler Platform

**Version:** 1.0  
**Created:** December 29, 2025  
**Purpose:** Complete implementation guide for building Coordinator within the Task Juggler ecosystem

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema (PostgreSQL)](#3-database-schema-postgresql)
4. [Laravel Backend Structure](#4-laravel-backend-structure)
5. [API Endpoints](#5-api-endpoints)
6. [Vue/Vite Frontend](#6-vuevite-frontend)
7. [Integration Points](#7-integration-points)
8. [Implementation Phases](#8-implementation-phases)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment](#10-deployment)

---

## 1. Project Overview

### 1.1 What is Coordinator?

Coordinator is an AI-powered virtual assistant platform that follows a "Hire a Role, Not a Platform" approach. Instead of selling abstract features or minutes, businesses hire AI assistants by selecting:
1. **A Role** - The function/service (e.g., "Appointment Scheduler", "Receptionist")
2. **A Persona** - The personality/character (e.g., "Marge" - seasoned, no-nonsense; "Sandy" - young, vivacious)

**Example:** You hire an "Appointment Scheduler" role with the "Marge" persona. Marge answers phone calls, texts, and emails from clients and schedules appointments in your shared calendar. She's a seasoned professional in her 50s who gets straight to the point and follows up reliably.

### 1.2 Core Value Propositions

- **Role-Based Services:** Hire specific functions (Appointment Scheduler, Receptionist, Dispatcher)
- **Selectable Personas:** Choose the personality that fits your business (Marge, Sandy, etc.)
- **Industry Knowledge:** Select industry for domain expertise (Dental, Plumbing, Restaurant, etc.)
- **Business Knowledge:** Automatically integrates your business information, FAQs, and survey data
- **Built-In CRM & Calendar:** Zero integration friction
- **60-Second Setup:** Fastest time-to-value in market
- **Multi-Channel:** Voice, SMS, Email (inbound & outbound)

### 1.3 Available Roles

**Roles define WHAT the AI does** - the function/service provided:

| Role | Direction | Price | Description |
|------|-----------|-------|-------------|
| Receptionist | Inbound | $49/mo | Answers calls, routes inquiries, provides general information |
| Appointment Scheduler | Inbound | $59/mo | Answers phone calls, texts, and emails from clients and schedules appointments in shared calendar |
| Dispatcher | Both | $59/mo | Schedules service calls, handles emergency requests, coordinates technician visits |
| Hostess | Inbound | $49/mo | Takes reservations, manages waitlists, handles restaurant inquiries |
| Appointment Confirmer | Outbound | $49/mo | Proactively calls customers to confirm upcoming appointments and reduce no-shows |
| Inside Sales Rep | Outbound | $79/mo | Reaches out to leads and prospects to book sales appointments and demos |
| Bill Collector | Outbound | $69/mo | Follows up on overdue invoices and secures payment commitments professionally |
| Support Agent | Inbound | $59/mo | Handles customer support inquiries, troubleshoots issues, escalates when needed |
| Product Introducer | Outbound | $59/mo | Announces new products, services, or promotions to existing customers |
| Survey Conductor | Outbound | $49/mo | Gathers customer feedback through phone surveys to improve service quality |
| Tip Line Operator | Inbound | $69/mo | Collects confidential tips and reports while maintaining anonymity |
| Reservation Confirmer | Outbound | $49/mo | Confirms restaurant and venue reservations to reduce no-shows |

### 1.4 Available Personas

**Personas define HOW the AI behaves** - the personality/character (selectable and reusable across roles):

| Persona | Age | Personality Traits | Communication Style | Best For |
|---------|-----|-------------------|---------------------|----------|
| Marge | 50s | Seasoned, no-nonsense, efficient, reliable | Gets straight to the point, follows up consistently | Professional services, medical, legal |
| Sandy | 20s-30s | Young, vivacious, energetic, enthusiastic | Friendly, makes people happy, loves her job | Retail, hospitality, customer-facing |
| Marcus | 40s | Professional, calm, methodical | Clear and structured, handles complex situations | Technical support, B2B services |
| Emma | 30s-40s | Warm, empathetic, patient | Listens carefully, builds rapport | Healthcare, counseling, sensitive situations |
| Alex | Any | Neutral, adaptable, versatile | Professional yet approachable | General purpose, diverse industries |

**Note:** Personas can be applied to any role. For example, you can have:
- "Marge" as an Appointment Scheduler (no-nonsense, efficient scheduling)
- "Sandy" as an Appointment Scheduler (vivacious, makes scheduling fun)
- "Marge" as a Receptionist (seasoned, professional front desk)
- "Sandy" as a Receptionist (energetic, welcoming front desk)

### 1.5 Role Bundles

| Bundle | Roles Included | Price | Target |
|--------|----------------|-------|--------|
| Appointment Pro | Scheduler + Confirmer | $89/mo | Dental, medical, salons |
| Restaurant Complete | Hostess + Res. Confirmer | $79/mo | Restaurants, venues |
| Service Business | Dispatcher + Confirmer | $89/mo | Plumbing, HVAC, trades |
| Full Front Desk | Receptionist + Scheduler + Confirmer | $129/mo | Professional services |
| Sales Engine | Inside Sales + Product Intro | $119/mo | Growth-focused SMBs |
| Cash Flow Pro | Bill Collector + Survey | $99/mo | AR-heavy businesses |
| Office Manager | Receptionist + Support + Scheduler | $139/mo | Full office replacement |

---

## 2. Architecture Overview

### 2.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  Vue 3 + Vite + TypeScript + Tailwind CSS + shadcn/ui           │
│  Pinia (State) + Vue Router + Axios                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  Laravel 11 + Sanctum Auth + API Resources                      │
│  Jobs/Queues + Events + Notifications                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│  PostgreSQL 16 + Redis (Cache/Queues)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  Vapi (Voice AI) + Twilio (SMS) + SendGrid (Email)              │
│  Stripe (Payments) + AWS S3 (Storage)                           │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
taskjuggler/
├── app/
│   ├── Coordinator/                    # Coordinator module
│   │   ├── Models/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Services/
│   │   ├── Jobs/
│   │   ├── Events/
│   │   └── Notifications/
│   └── ...
├── database/
│   └── migrations/
│       └── coordinator/                # Coordinator migrations
├── routes/
│   └── coordinator.php                 # Coordinator API routes
└── taskjuggler-web/
    └── src/
        └── coordinator/                # Coordinator frontend
            ├── components/
            ├── views/
            ├── stores/
            ├── composables/
            └── types/
```

---

## 3. Database Schema (PostgreSQL)

### 3.1 Migration Files

Create migrations in this order:

#### Migration 1: Core Tables (Organizations & Users)

```php
// database/migrations/coordinator/2025_12_29_000001_create_coordinator_organizations_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Organizations (Businesses using Coordinator)
        Schema::create('coord_organizations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Owner
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('industry'); // dental, plumbing, restaurant, legal, etc.
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('US');
            $table->string('timezone')->default('America/New_York');
            $table->json('business_hours')->nullable(); // Operating hours by day
            $table->json('settings')->nullable(); // General settings
            $table->string('subscription_tier')->default('starter'); // starter, growth, enterprise
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['industry']);
            $table->index(['subscription_tier']);
        });

        // Organization Members
        Schema::create('coord_organization_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('member'); // owner, admin, member
            $table->json('permissions')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->unique(['organization_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_organization_members');
        Schema::dropIfExists('coord_organizations');
    }
};
```

#### Migration 2: Roles & Personas

```php
// database/migrations/coordinator/2025_12_29_000002_create_coordinator_roles_and_personas_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Role Templates (System-defined) - WHAT the AI does
        Schema::create('coord_role_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // appointment_scheduler, receptionist, dispatcher, etc.
            $table->string('display_name'); // "Appointment Scheduler", "Receptionist"
            $table->text('description'); // Full description of what this role does
            $table->string('direction'); // inbound, outbound, both
            $table->decimal('base_price', 8, 2);
            $table->string('primary_goal'); // Brief goal statement
            $table->json('capabilities'); // List of what this role can do
            $table->json('channels'); // ['voice', 'sms', 'email']
            $table->json('suggested_industries')->nullable();
            $table->json('default_prompts'); // AI prompt templates for this role
            $table->json('default_scripts'); // Call/message scripts for this role
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['name']);
        });

        // Persona Templates (System-defined) - HOW the AI behaves
        Schema::create('coord_persona_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // marge, sandy, marcus, emma, alex
            $table->string('display_name'); // "Marge", "Sandy", "Marcus"
            $table->text('description'); // Full personality description
            $table->string('age_range')->nullable(); // "50s", "20s-30s", "40s"
            $table->json('personality_traits'); // ['seasoned', 'no-nonsense', 'efficient']
            $table->text('communication_style'); // How they communicate
            $table->json('best_for_industries')->nullable(); // Where this persona works best
            $table->string('gender')->nullable(); // male, female, neutral
            $table->string('voice_id')->nullable(); // Default Vapi voice ID
            $table->json('personality_prompts'); // AI prompts that define personality
            $table->json('example_greetings')->nullable(); // Example greetings
            $table->json('tone_guidelines')->nullable(); // Tone and style guidelines
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['name']);
        });

        // Coordinator Instances (Hired by Organizations) - Role + Persona combination
        Schema::create('coord_coordinators', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('role_template_id'); // WHAT they do
            $table->uuid('persona_template_id'); // WHO they are (personality)
            $table->string('display_name')->nullable(); // Custom name (e.g., "Marge the Scheduler")
            $table->string('voice_id')->nullable(); // Vapi voice ID (can override persona default)
            $table->text('custom_greeting')->nullable(); // Custom greeting (can override defaults)
            $table->json('custom_prompts')->nullable(); // Role-specific prompt overrides
            $table->json('custom_scripts')->nullable(); // Role-specific script overrides
            $table->json('availability')->nullable(); // When this coordinator works
            $table->string('status')->default('active'); // active, paused, inactive
            $table->decimal('monthly_price', 8, 2); // Based on role_template.base_price
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('role_template_id')
                ->references('id')
                ->on('coord_role_templates')
                ->onDelete('restrict');
                
            $table->foreign('persona_template_id')
                ->references('id')
                ->on('coord_persona_templates')
                ->onDelete('restrict');
                
            $table->index(['organization_id', 'status']);
            $table->index(['role_template_id', 'persona_template_id']);
        });

        // Role Bundles
        Schema::create('coord_bundles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // appointment_pro, restaurant_complete, etc.
            $table->string('display_name');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->decimal('savings_percentage', 5, 2);
            $table->json('target_industries');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Bundle-Role Pivot
        Schema::create('coord_bundle_roles', function (Blueprint $table) {
            $table->uuid('bundle_id');
            $table->uuid('role_template_id');
            
            $table->foreign('bundle_id')
                ->references('id')
                ->on('coord_bundles')
                ->onDelete('cascade');
                
            $table->foreign('role_template_id')
                ->references('id')
                ->on('coord_role_templates')
                ->onDelete('cascade');
                
            $table->primary(['bundle_id', 'role_template_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_bundle_roles');
        Schema::dropIfExists('coord_bundles');
        Schema::dropIfExists('coord_coordinators');
        Schema::dropIfExists('coord_persona_templates');
        Schema::dropIfExists('coord_role_templates');
    }
};
```

#### Migration 3: CRM (Contacts & Companies)

```php
// database/migrations/coordinator/2025_12_29_000003_create_coordinator_crm_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // CRM Contacts
        Schema::create('coord_contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('phone_secondary')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('US');
            $table->string('source')->nullable(); // manual, import, api, web_form
            $table->string('status')->default('active'); // active, inactive, do_not_contact
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('lifetime_value', 12, 2)->default(0);
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'email']);
            $table->index(['organization_id', 'phone']);
            $table->index(['organization_id', 'last_contacted_at']);
        });

        // Contact Interaction History
        Schema::create('coord_contact_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('contact_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('channel'); // voice, sms, email
            $table->string('direction'); // inbound, outbound
            $table->string('type'); // call, message, email
            $table->string('status'); // completed, missed, failed, pending
            $table->text('summary')->nullable();
            $table->string('outcome')->nullable(); // appointment_booked, callback_requested, etc.
            $table->json('metadata')->nullable(); // Duration, recording URL, etc.
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['contact_id', 'created_at']);
            $table->index(['coordinator_id', 'created_at']);
        });

        // Contact Follow-ups
        Schema::create('coord_contact_followups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('contact_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('assigned_to')->nullable(); // User ID
            $table->string('type'); // call, email, sms, task
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->text('description');
            $table->timestamp('due_at');
            $table->timestamp('completed_at')->nullable();
            $table->text('completion_notes')->nullable();
            $table->timestamps();
            
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['due_at', 'completed_at']);
        });

        // Business Information (Organization-specific knowledge)
        Schema::create('coord_business_information', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('category'); // hours, location, services, policies, etc.
            $table->string('key'); // hours, address, phone, services_offered, etc.
            $table->text('value'); // The actual information
            $table->text('description')->nullable();
            $table->integer('priority')->default(0); // Higher priority = more important
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'category', 'is_active']);
            $table->unique(['organization_id', 'key']);
        });

        // Surveys (Customer feedback collection)
        Schema::create('coord_surveys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('questions'); // Survey questions structure
            $table->string('trigger_type')->nullable(); // after_appointment, after_call, manual, etc.
            $table->json('trigger_conditions')->nullable(); // When to trigger survey
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Survey Responses
        Schema::create('coord_survey_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('survey_id');
            $table->uuid('contact_id')->nullable();
            $table->uuid('coordinator_id')->nullable(); // Which coordinator collected it
            $table->json('responses'); // Survey answers
            $table->text('notes')->nullable();
            $table->timestamp('completed_at');
            $table->timestamps();
            
            $table->foreign('survey_id')
                ->references('id')
                ->on('coord_surveys')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['survey_id', 'completed_at']);
            $table->index(['contact_id', 'completed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_contact_followups');
        Schema::dropIfExists('coord_contact_interactions');
        Schema::dropIfExists('coord_contacts');
    }
};
```

#### Migration 4: Calendar & Appointments

```php
// database/migrations/coordinator/2025_12_29_000004_create_coordinator_calendar_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Appointment Types
        Schema::create('coord_appointment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name'); // "Initial Consultation", "Cleaning", "Service Call"
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->default(60);
            $table->decimal('price', 10, 2)->nullable();
            $table->string('color')->default('#3B82F6'); // For calendar display
            $table->json('buffer_before')->nullable(); // Minutes before
            $table->json('buffer_after')->nullable(); // Minutes after
            $table->json('availability')->nullable(); // Specific availability rules
            $table->boolean('requires_confirmation')->default(true);
            $table->boolean('allow_online_booking')->default(true);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Appointments
        Schema::create('coord_appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('contact_id');
            $table->uuid('appointment_type_id')->nullable();
            $table->uuid('booked_by_coordinator_id')->nullable();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('status')->default('scheduled'); 
            // scheduled, confirmed, in_progress, completed, cancelled, no_show, rescheduled
            $table->string('location')->nullable();
            $table->string('location_type')->default('in_person'); // in_person, phone, video
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->json('reminders_sent')->nullable(); // Track sent reminders
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->foreign('appointment_type_id')
                ->references('id')
                ->on('coord_appointment_types')
                ->onDelete('set null');
                
            $table->foreign('booked_by_coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'starts_at']);
            $table->index(['organization_id', 'status']);
            $table->index(['contact_id', 'starts_at']);
        });

        // Availability Schedules
        Schema::create('coord_availability_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->boolean('is_default')->default(false);
            $table->json('weekly_hours'); // Hours for each day of week
            $table->json('exceptions')->nullable(); // Date-specific overrides
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // Blocked Time Slots
        Schema::create('coord_blocked_times', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->boolean('all_day')->default(false);
            $table->string('recurrence_rule')->nullable(); // RRULE for recurring blocks
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_blocked_times');
        Schema::dropIfExists('coord_availability_schedules');
        Schema::dropIfExists('coord_appointments');
        Schema::dropIfExists('coord_appointment_types');
    }
};
```

#### Migration 5: Communications (Calls, SMS, Email)

```php
// database/migrations/coordinator/2025_12_29_000005_create_coordinator_communications_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Phone Numbers
        Schema::create('coord_phone_numbers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('phone_number');
            $table->string('provider')->default('twilio'); // twilio, vapi
            $table->string('provider_id')->nullable(); // External ID
            $table->string('type')->default('local'); // local, toll_free
            $table->string('capabilities')->default('voice,sms'); // voice, sms, mms
            $table->uuid('assigned_coordinator_id')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('forwarding_rules')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('assigned_coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->unique(['phone_number']);
        });

        // Call Logs
        Schema::create('coord_call_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->uuid('phone_number_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_number');
            $table->string('to_number');
            $table->string('status'); // queued, ringing, in_progress, completed, busy, failed, no_answer
            $table->integer('duration_seconds')->default(0);
            $table->string('recording_url')->nullable();
            $table->text('transcript')->nullable();
            $table->json('transcript_segments')->nullable(); // Timestamped segments
            $table->text('ai_summary')->nullable();
            $table->string('outcome')->nullable();
            $table->json('metadata')->nullable(); // Provider-specific data
            $table->string('provider')->default('vapi');
            $table->string('provider_call_id')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('started_at');
            $table->timestamp('answered_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->foreign('phone_number_id')
                ->references('id')
                ->on('coord_phone_numbers')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['coordinator_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });

        // SMS Messages
        Schema::create('coord_sms_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->uuid('phone_number_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_number');
            $table->string('to_number');
            $table->text('body');
            $table->string('status'); // queued, sent, delivered, failed, received
            $table->json('media_urls')->nullable(); // For MMS
            $table->string('provider')->default('twilio');
            $table->string('provider_message_id')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });

        // Email Messages
        Schema::create('coord_email_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('from_email');
            $table->string('to_email');
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();
            $table->string('subject');
            $table->text('body_text')->nullable();
            $table->text('body_html')->nullable();
            $table->string('status'); // queued, sent, delivered, opened, clicked, bounced, failed
            $table->json('attachments')->nullable();
            $table->string('provider')->default('sendgrid');
            $table->string('provider_message_id')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'created_at']);
            $table->index(['contact_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_email_messages');
        Schema::dropIfExists('coord_sms_messages');
        Schema::dropIfExists('coord_call_logs');
        Schema::dropIfExists('coord_phone_numbers');
    }
};
```

#### Migration 6: Knowledge Base & FAQ

```php
// database/migrations/coordinator/2025_12_29_000006_create_coordinator_knowledge_base_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // FAQ Categories
        Schema::create('coord_faq_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // FAQ Items
        Schema::create('coord_faq_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('category_id')->nullable();
            $table->text('question');
            $table->text('answer');
            $table->json('keywords')->nullable(); // For AI matching
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->integer('use_count')->default(0); // Track usage
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('category_id')
                ->references('id')
                ->on('coord_faq_categories')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'is_active']);
        });

        // Prerecorded Audio Responses
        Schema::create('coord_audio_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('name');
            $table->text('transcript');
            $table->string('audio_url');
            $table->integer('duration_seconds');
            $table->string('type'); // greeting, faq, transfer, closing
            $table->string('trigger_keywords')->nullable(); // Comma-separated
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
        });

        // Industry Templates (System-defined industry knowledge)
        Schema::create('coord_industry_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('industry'); // dental, plumbing, restaurant, etc.
            $table->string('name'); // Display name
            $table->text('description')->nullable();
            $table->json('default_faq'); // Standard FAQ for industry
            $table->json('default_appointment_types');
            $table->json('default_scripts');
            $table->json('terminology'); // Industry-specific terms and phrases
            $table->json('common_questions'); // Common questions customers ask
            $table->json('knowledge_base'); // Industry knowledge snippets
            $table->json('best_practices')->nullable(); // Industry best practices
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['industry']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_industry_templates');
        Schema::dropIfExists('coord_audio_responses');
        Schema::dropIfExists('coord_faq_items');
        Schema::dropIfExists('coord_faq_categories');
    }
};
```

#### Migration 7: Billing & Subscriptions

```php
// database/migrations/coordinator/2025_12_29_000007_create_coordinator_billing_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Subscriptions
        Schema::create('coord_subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('stripe_subscription_id')->nullable();
            $table->string('status'); // active, past_due, cancelled, trialing
            $table->timestamp('current_period_start');
            $table->timestamp('current_period_end');
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'status']);
        });

        // Subscription Items (Individual roles/bundles)
        Schema::create('coord_subscription_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('subscription_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('bundle_id')->nullable();
            $table->string('stripe_subscription_item_id')->nullable();
            $table->decimal('price', 8, 2);
            $table->integer('quantity')->default(1);
            $table->timestamps();
            
            $table->foreign('subscription_id')
                ->references('id')
                ->on('coord_subscriptions')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
                
            $table->foreign('bundle_id')
                ->references('id')
                ->on('coord_bundles')
                ->onDelete('set null');
        });

        // Usage Tracking
        Schema::create('coord_usage_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('type'); // call, sms, email
            $table->integer('quantity')->default(1);
            $table->decimal('cost', 8, 4)->default(0);
            $table->date('usage_date');
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'usage_date']);
            $table->index(['coordinator_id', 'usage_date']);
        });

        // Invoices
        Schema::create('coord_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('stripe_invoice_id')->nullable();
            $table->string('number');
            $table->string('status'); // draft, open, paid, void, uncollectible
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency')->default('usd');
            $table->timestamp('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('pdf_url')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_invoices');
        Schema::dropIfExists('coord_usage_records');
        Schema::dropIfExists('coord_subscription_items');
        Schema::dropIfExists('coord_subscriptions');
    }
};
```

#### Migration 8: Analytics & Reporting

```php
// database/migrations/coordinator/2025_12_29_000008_create_coordinator_analytics_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Daily Metrics (Aggregated)
        Schema::create('coord_daily_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->date('date');
            
            // Call Metrics
            $table->integer('calls_total')->default(0);
            $table->integer('calls_answered')->default(0);
            $table->integer('calls_missed')->default(0);
            $table->integer('calls_outbound')->default(0);
            $table->integer('call_duration_total_seconds')->default(0);
            $table->decimal('call_duration_avg_seconds', 8, 2)->default(0);
            
            // SMS Metrics
            $table->integer('sms_sent')->default(0);
            $table->integer('sms_received')->default(0);
            $table->integer('sms_delivered')->default(0);
            
            // Email Metrics
            $table->integer('emails_sent')->default(0);
            $table->integer('emails_opened')->default(0);
            $table->integer('emails_clicked')->default(0);
            
            // Appointment Metrics
            $table->integer('appointments_booked')->default(0);
            $table->integer('appointments_confirmed')->default(0);
            $table->integer('appointments_cancelled')->default(0);
            $table->integer('appointments_no_show')->default(0);
            
            // Contact Metrics
            $table->integer('new_contacts')->default(0);
            $table->integer('contacts_reached')->default(0);
            
            // Cost Metrics
            $table->decimal('cost_calls', 10, 4)->default(0);
            $table->decimal('cost_sms', 10, 4)->default(0);
            $table->decimal('cost_total', 10, 4)->default(0);
            
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('cascade');
                
            $table->unique(['organization_id', 'coordinator_id', 'date']);
            $table->index(['organization_id', 'date']);
        });

        // Event Log (For detailed tracking)
        Schema::create('coord_event_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->uuid('contact_id')->nullable();
            $table->string('event_type'); // call.started, appointment.booked, sms.sent, etc.
            $table->string('event_category'); // call, sms, email, appointment, contact
            $table->json('event_data')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->index(['organization_id', 'event_type', 'created_at']);
            $table->index(['coordinator_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_event_logs');
        Schema::dropIfExists('coord_daily_metrics');
    }
};
```

#### Migration 9: Campaigns & Outbound

```php
// database/migrations/coordinator/2025_12_29_000009_create_coordinator_campaigns_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Outbound Campaigns
        Schema::create('coord_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // appointment_confirmation, payment_reminder, sales_outreach, survey, product_intro
            $table->string('channel'); // voice, sms, email
            $table->string('status')->default('draft'); // draft, scheduled, active, paused, completed
            $table->json('audience_filters')->nullable(); // Contact filters
            $table->json('schedule')->nullable(); // When to run
            $table->json('script')->nullable(); // Message/call script
            $table->integer('contact_limit')->nullable();
            $table->integer('daily_limit')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('completed_at')->nullable();
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
                
            $table->index(['organization_id', 'status']);
        });

        // Campaign Contacts
        Schema::create('coord_campaign_contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('campaign_id');
            $table->uuid('contact_id');
            $table->string('status')->default('pending'); // pending, in_progress, completed, failed, skipped
            $table->integer('attempt_count')->default(0);
            $table->string('outcome')->nullable();
            $table->json('attempt_history')->nullable();
            $table->timestamp('last_attempted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('campaign_id')
                ->references('id')
                ->on('coord_campaigns')
                ->onDelete('cascade');
                
            $table->foreign('contact_id')
                ->references('id')
                ->on('coord_contacts')
                ->onDelete('cascade');
                
            $table->unique(['campaign_id', 'contact_id']);
            $table->index(['campaign_id', 'status']);
        });

        // Campaign Metrics
        Schema::create('coord_campaign_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('campaign_id');
            $table->date('date');
            $table->integer('contacts_attempted')->default(0);
            $table->integer('contacts_reached')->default(0);
            $table->integer('contacts_completed')->default(0);
            $table->integer('contacts_failed')->default(0);
            $table->json('outcomes')->nullable(); // Breakdown by outcome
            $table->decimal('cost', 10, 4)->default(0);
            $table->timestamps();
            
            $table->foreign('campaign_id')
                ->references('id')
                ->on('coord_campaigns')
                ->onDelete('cascade');
                
            $table->unique(['campaign_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_campaign_metrics');
        Schema::dropIfExists('coord_campaign_contacts');
        Schema::dropIfExists('coord_campaigns');
    }
};
```

### 3.2 Seeders

```php
// database/seeders/CoordinatorSeeder.php

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CoordinatorSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedRoleTemplates();
        $this->seedPersonaTemplates();
        $this->seedBundles();
        $this->seedIndustryTemplates();
    }

    private function seedRoleTemplates(): void
    {
        $roles = [
            [
                'name' => 'receptionist',
                'display_name' => 'Receptionist',
                'description' => 'Answers incoming calls, routes inquiries, and provides general information about your business.',
                'direction' => 'inbound',
                'base_price' => 49.00,
                'primary_goal' => 'Answer calls, route inquiries',
                'capabilities' => ['answer_calls', 'route_calls', 'take_messages', 'provide_info', 'schedule_callbacks'],
                'suggested_industries' => ['dental', 'medical', 'legal', 'accounting', 'professional_services'],
            ],
            [
                'name' => 'appointment_scheduler',
                'display_name' => 'Appointment Scheduler',
                'description' => 'Books new appointments by checking availability and collecting customer information.',
                'direction' => 'inbound',
                'base_price' => 59.00,
                'primary_goal' => 'Book new appointments',
                'capabilities' => ['check_availability', 'book_appointments', 'collect_info', 'send_confirmations'],
                'suggested_industries' => ['dental', 'medical', 'salon', 'spa', 'consulting'],
            ],
            [
                'name' => 'dispatcher',
                'display_name' => 'Dispatcher',
                'description' => 'Schedules service calls, handles emergency requests, and coordinates technician visits.',
                'direction' => 'both',
                'base_price' => 59.00,
                'primary_goal' => 'Schedule service calls',
                'capabilities' => ['schedule_service', 'handle_emergencies', 'coordinate_visits', 'provide_estimates'],
                'suggested_industries' => ['plumbing', 'hvac', 'electrical', 'pest_control', 'home_services'],
            ],
            [
                'name' => 'hostess',
                'display_name' => 'Hostess',
                'description' => 'Takes reservations, manages waitlists, and handles restaurant inquiries.',
                'direction' => 'inbound',
                'base_price' => 49.00,
                'primary_goal' => 'Take reservations',
                'capabilities' => ['take_reservations', 'manage_waitlist', 'answer_menu_questions', 'handle_special_requests'],
                'suggested_industries' => ['restaurant', 'bar', 'cafe', 'venue'],
            ],
            [
                'name' => 'appointment_confirmer',
                'display_name' => 'Appointment Confirmer',
                'description' => 'Proactively calls customers to confirm upcoming appointments and reduce no-shows.',
                'direction' => 'outbound',
                'base_price' => 49.00,
                'primary_goal' => 'Reduce no-shows',
                'capabilities' => ['confirm_appointments', 'reschedule', 'send_reminders', 'update_records'],
                'suggested_industries' => ['dental', 'medical', 'salon', 'spa', 'consulting'],
            ],
            [
                'name' => 'inside_sales',
                'display_name' => 'Inside Sales Rep',
                'description' => 'Reaches out to leads and prospects to book sales appointments and demos.',
                'direction' => 'outbound',
                'base_price' => 79.00,
                'primary_goal' => 'Book sales appointments',
                'capabilities' => ['qualify_leads', 'book_demos', 'follow_up', 'nurture_prospects'],
                'suggested_industries' => ['saas', 'professional_services', 'real_estate', 'insurance'],
            ],
            [
                'name' => 'bill_collector',
                'display_name' => 'Bill Collector',
                'description' => 'Follows up on overdue invoices and secures payment commitments professionally.',
                'direction' => 'outbound',
                'base_price' => 69.00,
                'primary_goal' => 'Secure payment commitments',
                'capabilities' => ['follow_up_invoices', 'negotiate_payments', 'set_up_plans', 'record_commitments'],
                'suggested_industries' => ['accounting', 'medical', 'legal', 'professional_services'],
            ],
            [
                'name' => 'support_agent',
                'display_name' => 'Support Agent',
                'description' => 'Handles customer support inquiries, troubleshoots issues, and escalates when needed.',
                'direction' => 'inbound',
                'base_price' => 59.00,
                'primary_goal' => 'Resolve customer issues',
                'capabilities' => ['troubleshoot', 'answer_questions', 'escalate_issues', 'track_tickets'],
                'suggested_industries' => ['saas', 'ecommerce', 'technology', 'professional_services'],
            ],
            [
                'name' => 'product_introducer',
                'display_name' => 'Product Introducer',
                'description' => 'Announces new products, services, or promotions to existing customers.',
                'direction' => 'outbound',
                'base_price' => 59.00,
                'primary_goal' => 'Announce new offerings',
                'capabilities' => ['introduce_products', 'explain_features', 'book_consultations', 'track_interest'],
                'suggested_industries' => ['retail', 'professional_services', 'saas', 'healthcare'],
            ],
            [
                'name' => 'survey_conductor',
                'display_name' => 'Survey Conductor',
                'description' => 'Gathers customer feedback through phone surveys to improve service quality.',
                'direction' => 'outbound',
                'base_price' => 49.00,
                'primary_goal' => 'Gather customer feedback',
                'capabilities' => ['conduct_surveys', 'record_responses', 'identify_issues', 'thank_customers'],
                'suggested_industries' => ['healthcare', 'hospitality', 'retail', 'professional_services'],
            ],
            [
                'name' => 'tip_line_operator',
                'display_name' => 'Tip Line Operator',
                'description' => 'Collects confidential tips and reports while maintaining anonymity.',
                'direction' => 'inbound',
                'base_price' => 69.00,
                'primary_goal' => 'Collect confidential tips',
                'capabilities' => ['receive_tips', 'maintain_anonymity', 'categorize_reports', 'escalate_urgent'],
                'suggested_industries' => ['law_enforcement', 'corporate', 'education', 'healthcare'],
            ],
            [
                'name' => 'reservation_confirmer',
                'display_name' => 'Reservation Confirmer',
                'description' => 'Confirms restaurant and venue reservations to reduce no-shows.',
                'direction' => 'outbound',
                'base_price' => 49.00,
                'primary_goal' => 'Confirm reservations',
                'capabilities' => ['confirm_reservations', 'update_party_size', 'handle_cancellations', 'manage_waitlist'],
                'suggested_industries' => ['restaurant', 'bar', 'venue', 'entertainment'],
            ],
        ];

        foreach ($roles as $role) {
            DB::table('coord_role_templates')->insert([
                'id' => Str::uuid(),
                'name' => $role['name'],
                'display_name' => $role['display_name'],
                'description' => $role['description'],
                'direction' => $role['direction'],
                'base_price' => $role['base_price'],
                'primary_goal' => $role['primary_goal'],
                'capabilities' => json_encode($role['capabilities']),
                'suggested_industries' => json_encode($role['suggested_industries']),
                'default_prompts' => json_encode([]),
                'default_scripts' => json_encode([]),
                'is_active' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedPersonaTemplates(): void
    {
        $personas = [
            [
                'name' => 'marge',
                'display_name' => 'Marge',
                'description' => 'A seasoned professional in her 50s who is no-nonsense, gets straight to the point, and follows up reliably.',
                'age_range' => '50s',
                'personality_traits' => ['seasoned', 'no-nonsense', 'efficient', 'reliable', 'professional'],
                'communication_style' => 'Gets straight to the point, follows up consistently, no fluff',
                'best_for_industries' => ['dental', 'medical', 'legal', 'accounting', 'professional_services'],
                'gender' => 'female',
                'personality_prompts' => [
                    'You are Marge, a seasoned professional in your 50s.',
                    'You are direct, efficient, and get straight to the point.',
                    'You follow up reliably and don\'t waste time with small talk.',
                    'You are professional but warm, like a trusted office manager.',
                ],
                'example_greetings' => [
                    'Hello, this is Marge. How can I help you today?',
                    'Hi, Marge here. What can I do for you?',
                ],
            ],
            [
                'name' => 'sandy',
                'display_name' => 'Sandy',
                'description' => 'A young, vivacious, and energetic person who loves her job, is very nice, and makes people happy.',
                'age_range' => '20s-30s',
                'personality_traits' => ['young', 'vivacious', 'energetic', 'enthusiastic', 'friendly'],
                'communication_style' => 'Friendly, enthusiastic, makes people happy, loves her job',
                'best_for_industries' => ['retail', 'hospitality', 'restaurant', 'salon', 'spa'],
                'gender' => 'female',
                'personality_prompts' => [
                    'You are Sandy, a young and vivacious professional.',
                    'You are energetic, enthusiastic, and love your job.',
                    'You make people happy and bring positive energy to every interaction.',
                    'You are very nice and genuinely care about helping people.',
                ],
                'example_greetings' => [
                    'Hi there! This is Sandy, and I\'m so excited to help you today!',
                    'Hello! Sandy here - how can I make your day better?',
                ],
            ],
            [
                'name' => 'marcus',
                'display_name' => 'Marcus',
                'description' => 'A professional in his 40s who is calm, methodical, and handles complex situations with clarity.',
                'age_range' => '40s',
                'personality_traits' => ['professional', 'calm', 'methodical', 'clear', 'structured'],
                'communication_style' => 'Clear and structured, handles complex situations calmly',
                'best_for_industries' => ['technology', 'saas', 'b2b', 'consulting', 'technical_support'],
                'gender' => 'male',
                'personality_prompts' => [
                    'You are Marcus, a professional in your 40s.',
                    'You are calm, methodical, and handle complex situations with clarity.',
                    'You communicate in a structured, clear manner.',
                    'You are professional and build trust through competence.',
                ],
                'example_greetings' => [
                    'Hello, this is Marcus. How can I assist you today?',
                    'Good day, Marcus here. What can I help you with?',
                ],
            ],
            [
                'name' => 'emma',
                'display_name' => 'Emma',
                'description' => 'A warm, empathetic professional in her 30s-40s who listens carefully and builds rapport.',
                'age_range' => '30s-40s',
                'personality_traits' => ['warm', 'empathetic', 'patient', 'listener', 'caring'],
                'communication_style' => 'Listens carefully, builds rapport, shows empathy',
                'best_for_industries' => ['healthcare', 'counseling', 'wellness', 'education', 'sensitive_services'],
                'gender' => 'female',
                'personality_prompts' => [
                    'You are Emma, a warm and empathetic professional.',
                    'You listen carefully and build rapport with people.',
                    'You are patient and show genuine care and empathy.',
                    'You make people feel heard and understood.',
                ],
                'example_greetings' => [
                    'Hello, this is Emma. I\'m here to help - how can I assist you today?',
                    'Hi there, Emma here. I\'d love to hear how I can help you.',
                ],
            ],
            [
                'name' => 'alex',
                'display_name' => 'Alex',
                'description' => 'A versatile, adaptable professional who is neutral yet approachable, suitable for diverse industries.',
                'age_range' => null,
                'personality_traits' => ['versatile', 'adaptable', 'professional', 'approachable', 'neutral'],
                'communication_style' => 'Professional yet approachable, adapts to the situation',
                'best_for_industries' => null, // General purpose
                'gender' => 'neutral',
                'personality_prompts' => [
                    'You are Alex, a versatile and adaptable professional.',
                    'You are professional yet approachable.',
                    'You adapt your communication style to fit the situation.',
                    'You are neutral and work well across diverse industries.',
                ],
                'example_greetings' => [
                    'Hello, this is Alex. How can I help you today?',
                    'Hi, Alex here. What can I do for you?',
                ],
            ],
        ];

        foreach ($personas as $persona) {
            DB::table('coord_persona_templates')->insert([
                'id' => Str::uuid(),
                'name' => $persona['name'],
                'display_name' => $persona['display_name'],
                'description' => $persona['description'],
                'age_range' => $persona['age_range'] ?? null,
                'personality_traits' => json_encode($persona['personality_traits']),
                'communication_style' => $persona['communication_style'],
                'best_for_industries' => $persona['best_for_industries'] ? json_encode($persona['best_for_industries']) : null,
                'gender' => $persona['gender'],
                'personality_prompts' => json_encode($persona['personality_prompts']),
                'example_greetings' => json_encode($persona['example_greetings']),
                'tone_guidelines' => json_encode([]),
                'is_active' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedBundles(): void
    {
        $bundles = [
            [
                'name' => 'appointment_pro',
                'display_name' => 'Appointment Pro',
                'description' => 'Complete appointment management with scheduling and confirmation.',
                'price' => 89.00,
                'savings_percentage' => 17.59,
                'target_industries' => ['dental', 'medical', 'salon', 'spa'],
                'roles' => ['appointment_scheduler', 'appointment_confirmer'],
            ],
            [
                'name' => 'restaurant_complete',
                'display_name' => 'Restaurant Complete',
                'description' => 'Full reservation management for restaurants and venues.',
                'price' => 79.00,
                'savings_percentage' => 19.39,
                'target_industries' => ['restaurant', 'bar', 'venue'],
                'roles' => ['hostess', 'reservation_confirmer'],
            ],
            [
                'name' => 'service_business',
                'display_name' => 'Service Business',
                'description' => 'Dispatch and confirmation for service-based businesses.',
                'price' => 89.00,
                'savings_percentage' => 17.59,
                'target_industries' => ['plumbing', 'hvac', 'electrical', 'home_services'],
                'roles' => ['dispatcher', 'appointment_confirmer'],
            ],
            [
                'name' => 'full_front_desk',
                'display_name' => 'Full Front Desk',
                'description' => 'Complete front desk coverage with reception, scheduling, and confirmation.',
                'price' => 129.00,
                'savings_percentage' => 17.83,
                'target_industries' => ['professional_services', 'medical', 'dental', 'legal'],
                'roles' => ['receptionist', 'appointment_scheduler', 'appointment_confirmer'],
            ],
            [
                'name' => 'sales_engine',
                'display_name' => 'Sales Engine',
                'description' => 'Proactive sales outreach with lead qualification and product introductions.',
                'price' => 119.00,
                'savings_percentage' => 13.77,
                'target_industries' => ['saas', 'professional_services', 'real_estate'],
                'roles' => ['inside_sales', 'product_introducer'],
            ],
            [
                'name' => 'cash_flow_pro',
                'display_name' => 'Cash Flow Pro',
                'description' => 'AR recovery with collections and customer feedback.',
                'price' => 99.00,
                'savings_percentage' => 16.10,
                'target_industries' => ['accounting', 'medical', 'legal', 'professional_services'],
                'roles' => ['bill_collector', 'survey_conductor'],
            ],
            [
                'name' => 'office_manager',
                'display_name' => 'Office Manager',
                'description' => 'Full office replacement with reception, support, and scheduling.',
                'price' => 139.00,
                'savings_percentage' => 16.77,
                'target_industries' => ['professional_services', 'consulting', 'accounting'],
                'roles' => ['receptionist', 'support_agent', 'appointment_scheduler'],
            ],
        ];

        foreach ($bundles as $bundle) {
            $bundleId = Str::uuid();
            
            DB::table('coord_bundles')->insert([
                'id' => $bundleId,
                'name' => $bundle['name'],
                'display_name' => $bundle['display_name'],
                'description' => $bundle['description'],
                'price' => $bundle['price'],
                'savings_percentage' => $bundle['savings_percentage'],
                'target_industries' => json_encode($bundle['target_industries']),
                'is_active' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Link roles to bundle
            foreach ($bundle['roles'] as $roleName) {
                $roleTemplate = DB::table('coord_role_templates')
                    ->where('name', $roleName)
                    ->first();
                    
                if ($roleTemplate) {
                    DB::table('coord_bundle_roles')->insert([
                        'bundle_id' => $bundleId,
                        'role_template_id' => $roleTemplate->id,
                    ]);
                }
            }
        }
    }

    private function seedIndustryTemplates(): void
    {
        $industries = [
            [
                'industry' => 'dental',
                'name' => 'Dental Practice',
                'default_faq' => [
                    ['q' => 'What are your hours?', 'a' => 'We are open Monday through Friday from 8am to 5pm.'],
                    ['q' => 'Do you accept my insurance?', 'a' => 'We accept most major dental insurance plans. Let me take down your information and verify your coverage.'],
                    ['q' => 'Is there parking available?', 'a' => 'Yes, we have free parking available in the lot behind our building.'],
                ],
                'default_appointment_types' => [
                    ['name' => 'Cleaning', 'duration' => 60],
                    ['name' => 'New Patient Exam', 'duration' => 90],
                    ['name' => 'Follow-up', 'duration' => 30],
                    ['name' => 'Emergency', 'duration' => 45],
                ],
            ],
            [
                'industry' => 'plumbing',
                'name' => 'Plumbing Service',
                'default_faq' => [
                    ['q' => 'Do you handle emergencies?', 'a' => 'Yes, we offer 24/7 emergency service. There may be an after-hours fee.'],
                    ['q' => 'What areas do you serve?', 'a' => 'We serve the greater metropolitan area within a 30-mile radius.'],
                    ['q' => 'Do you provide estimates?', 'a' => 'Yes, we provide free estimates for most jobs.'],
                ],
                'default_appointment_types' => [
                    ['name' => 'Service Call', 'duration' => 120],
                    ['name' => 'Emergency', 'duration' => 60],
                    ['name' => 'Estimate', 'duration' => 60],
                ],
            ],
            [
                'industry' => 'restaurant',
                'name' => 'Restaurant',
                'default_faq' => [
                    ['q' => 'Do you take reservations?', 'a' => 'Yes, we accept reservations for parties of all sizes.'],
                    ['q' => 'What are your hours?', 'a' => 'We are open for dinner Tuesday through Sunday from 5pm to 10pm.'],
                    ['q' => 'Do you accommodate dietary restrictions?', 'a' => 'Yes, we can accommodate most dietary restrictions. Please let us know when making your reservation.'],
                ],
                'default_appointment_types' => [
                    ['name' => 'Reservation', 'duration' => 90],
                    ['name' => 'Private Event', 'duration' => 180],
                ],
            ],
        ];

        foreach ($industries as $industry) {
            DB::table('coord_industry_templates')->insert([
                'id' => Str::uuid(),
                'industry' => $industry['industry'],
                'name' => $industry['name'],
                'default_faq' => json_encode($industry['default_faq']),
                'default_appointment_types' => json_encode($industry['default_appointment_types']),
                'default_scripts' => json_encode([]),
                'terminology' => json_encode([]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
```

---

## 4. Laravel Backend Structure

### 4.1 Models

```
app/Coordinator/Models/
├── Organization.php
├── OrganizationMember.php
├── RoleTemplate.php
├── PersonaTemplate.php
├── Coordinator.php
├── Bundle.php
├── Contact.php
├── ContactInteraction.php
├── ContactFollowup.php
├── AppointmentType.php
├── Appointment.php
├── AvailabilitySchedule.php
├── BlockedTime.php
├── PhoneNumber.php
├── CallLog.php
├── SmsMessage.php
├── EmailMessage.php
├── FaqCategory.php
├── FaqItem.php
├── AudioResponse.php
├── IndustryTemplate.php
├── Subscription.php
├── SubscriptionItem.php
├── UsageRecord.php
├── Invoice.php
├── DailyMetric.php
├── EventLog.php
├── Campaign.php
├── CampaignContact.php
└── CampaignMetric.php
```

#### Example Model: Organization.php

```php
<?php

namespace App\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\User;

class Organization extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'coord_organizations';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'industry',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'timezone',
        'business_hours',
        'settings',
        'subscription_tier',
        'trial_ends_at',
    ];

    protected $casts = [
        'business_hours' => 'array',
        'settings' => 'array',
        'trial_ends_at' => 'datetime',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(OrganizationMember::class);
    }

    public function coordinators(): HasMany
    {
        return $this->hasMany(Coordinator::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function appointmentTypes(): HasMany
    {
        return $this->hasMany(AppointmentType::class);
    }

    public function phoneNumbers(): HasMany
    {
        return $this->hasMany(PhoneNumber::class);
    }

    public function callLogs(): HasMany
    {
        return $this->hasMany(CallLog::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latest();
    }

    public function faqItems(): HasMany
    {
        return $this->hasMany(FaqItem::class);
    }

    public function businessInformation(): HasMany
    {
        return $this->hasMany(BusinessInformation::class);
    }

    public function surveys(): HasMany
    {
        return $this->hasMany(Survey::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function dailyMetrics(): HasMany
    {
        return $this->hasMany(DailyMetric::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    public function scopeByIndustry($query, string $industry)
    {
        return $query->where('industry', $industry);
    }

    // Helpers
    public function isOnTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function hasActiveSubscription(): bool
    {
        return $this->subscription && $this->subscription->status === 'active';
    }
}
```

#### Example Model: PersonaTemplate.php

```php
<?php

namespace App\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PersonaTemplate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'coord_persona_templates';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'age_range',
        'personality_traits',
        'communication_style',
        'best_for_industries',
        'gender',
        'voice_id',
        'personality_prompts',
        'example_greetings',
        'tone_guidelines',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'personality_traits' => 'array',
        'best_for_industries' => 'array',
        'personality_prompts' => 'array',
        'example_greetings' => 'array',
        'tone_guidelines' => 'array',
    ];

    // Relationships
    public function coordinators(): HasMany
    {
        return $this->hasMany(Coordinator::class, 'persona_template_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helpers
    public function getDefaultGreeting(): string
    {
        if ($this->example_greetings && count($this->example_greetings) > 0) {
            return $this->example_greetings[0];
        }
        return "Hello, this is {$this->display_name}. How can I help you today?";
    }
}
```

#### Example Model: Coordinator.php

```php
<?php

namespace App\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coordinator extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'coord_coordinators';

    protected $fillable = [
        'organization_id',
        'role_template_id',
        'persona_template_id',
        'industry',
        'display_name',
        'voice_id',
        'custom_greeting',
        'custom_prompts',
        'custom_scripts',
        'availability',
        'status',
        'monthly_price',
        'activated_at',
    ];

    protected $casts = [
        'custom_prompts' => 'array',
        'custom_scripts' => 'array',
        'availability' => 'array',
        'monthly_price' => 'decimal:2',
        'activated_at' => 'datetime',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function roleTemplate(): BelongsTo
    {
        return $this->belongsTo(RoleTemplate::class);
    }

    public function personaTemplate(): BelongsTo
    {
        return $this->belongsTo(PersonaTemplate::class);
    }

    public function callLogs(): HasMany
    {
        return $this->hasMany(CallLog::class, 'coordinator_id');
    }

    public function smsMessages(): HasMany
    {
        return $this->hasMany(SmsMessage::class, 'coordinator_id');
    }

    public function emailMessages(): HasMany
    {
        return $this->hasMany(EmailMessage::class, 'coordinator_id');
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'coordinator_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Helpers
    public function getDisplayName(): string
    {
        if ($this->display_name) {
            return $this->display_name;
        }
        
        $persona = $this->personaTemplate;
        $role = $this->roleTemplate;
        
        return "{$persona->display_name} the {$role->display_name}";
    }

    public function getFullIntroduction(): string
    {
        $persona = $this->personaTemplate;
        $role = $this->roleTemplate;
        $org = $this->organization;
        
        if ($this->custom_greeting) {
            return $this->custom_greeting;
        }
        
        return "Hi, I'm {$persona->display_name}. I work for {$org->name}, and I {$role->primary_goal}. How can I help you today?";
    }

    public function getVoiceId(): string
    {
        return $this->voice_id ?? $this->personaTemplate->voice_id ?? 'default';
    }

    public function isAvailable(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if (!$this->availability) {
            return true;
        }

        // Check against availability schedule
        $now = now()->setTimezone($this->organization->timezone);
        $dayOfWeek = strtolower($now->format('l'));
        
        if (!isset($this->availability[$dayOfWeek])) {
            return false;
        }

        $hours = $this->availability[$dayOfWeek];
        $currentTime = $now->format('H:i');
        
        return $currentTime >= $hours['start'] && $currentTime <= $hours['end'];
    }
}
```

### 4.2 Services

```
app/Coordinator/Services/
├── OrganizationService.php
├── PersonaService.php
├── ContactService.php
├── AppointmentService.php
├── CalendarService.php
├── CommunicationService.php
├── VapiService.php           # Voice AI integration
├── TwilioService.php         # SMS integration
├── SendGridService.php       # Email integration
├── StripeService.php         # Billing integration
├── KnowledgeBaseService.php
├── CampaignService.php
├── AnalyticsService.php
├── OnboardingService.php     # 60-second setup flow
└── WebhookService.php        # External webhooks
```

#### Example Service: OnboardingService.php

```php
<?php

namespace App\Coordinator\Services;

use App\Coordinator\Models\Organization;
use App\Coordinator\Models\Coordinator;
use App\Coordinator\Models\RoleTemplate;
use App\Coordinator\Models\PersonaTemplate;
use App\Coordinator\Models\IndustryTemplate;
use App\Coordinator\Models\BusinessInformation;
use App\Coordinator\Models\FaqItem;
use App\Coordinator\Models\FaqCategory;
use App\Coordinator\Models\AppointmentType;
use App\Coordinator\Models\AvailabilitySchedule;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OnboardingService
{
    public function __construct(
        private VapiService $vapiService,
        private TwilioService $twilioService,
    ) {}

    /**
     * Complete 60-second setup flow
     */
    public function setupOrganization(array $data, User $user): Organization
    {
        return DB::transaction(function () use ($data, $user) {
            // 1. Create organization
            $organization = $this->createOrganization($data, $user);
            
            // 2. Apply industry template (for default FAQs, appointment types)
            $this->applyIndustryTemplate($organization, $data['industry']);
            
            // 3. Create coordinator (Role + Persona + Industry combination)
            $coordinator = $this->createCoordinator($organization, $data);
            
            // 4. Set up business information from poll responses
            if (!empty($data['poll_responses'])) {
                $this->createBusinessInformation($organization, $data['poll_responses']);
            }
            
            // 4. Generate FAQ from poll responses
            if (!empty($data['poll_responses'])) {
                $this->generateFaqFromPoll($organization, $data['poll_responses']);
            }
            
            // 5. Set up availability
            $this->createDefaultAvailability($organization, $data['business_hours'] ?? null);
            
            // 6. Provision phone number
            if ($data['provision_phone'] ?? true) {
                $this->provisionPhoneNumber($organization, $coordinator);
            }
            
            // 7. Create trial subscription
            $this->createTrialSubscription($organization, $coordinator);
            
            return $organization->fresh([
                'coordinators',
                'faqItems',
                'appointmentTypes',
                'phoneNumbers',
            ]);
        });
    }

    private function createOrganization(array $data, User $user): Organization
    {
        return Organization::create([
            'user_id' => $user->id,
            'name' => $data['business_name'],
            'slug' => Str::slug($data['business_name']) . '-' . Str::random(6),
            'industry' => $data['industry'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? $user->email,
            'website' => $data['website'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,
            'timezone' => $data['timezone'] ?? 'America/New_York',
            'business_hours' => $data['business_hours'] ?? $this->getDefaultBusinessHours(),
            'subscription_tier' => 'starter',
            'trial_ends_at' => now()->addDays(14),
        ]);
    }

    private function applyIndustryTemplate(Organization $organization, string $industry): void
    {
        $template = IndustryTemplate::where('industry', $industry)->first();
        
        if (!$template) {
            return;
        }

        // Create default FAQ items
        $category = FaqCategory::create([
            'organization_id' => $organization->id,
            'name' => 'General',
            'description' => 'Common questions about our business',
        ]);

        foreach ($template->default_faq as $index => $faq) {
            FaqItem::create([
                'organization_id' => $organization->id,
                'category_id' => $category->id,
                'question' => $faq['q'],
                'answer' => $faq['a'],
                'sort_order' => $index,
            ]);
        }

        // Create default appointment types
        foreach ($template->default_appointment_types as $index => $type) {
            AppointmentType::create([
                'organization_id' => $organization->id,
                'name' => $type['name'],
                'duration_minutes' => $type['duration'],
                'sort_order' => $index,
            ]);
        }
    }

    private function createCoordinator(Organization $organization, array $data): Coordinator
    {
        $roleTemplate = RoleTemplate::where('name', $data['role'])->firstOrFail();
        $personaTemplate = PersonaTemplate::where('name', $data['persona'])->firstOrFail();

        $coordinator = Coordinator::create([
            'organization_id' => $organization->id,
            'role_template_id' => $roleTemplate->id,
            'persona_template_id' => $personaTemplate->id,
            'display_name' => $data['display_name'] ?? null, // e.g., "Marge the Scheduler"
            'custom_greeting' => $data['greeting'] ?? null,
            'status' => 'active',
            'monthly_price' => $roleTemplate->base_price,
            'activated_at' => now(),
        ]);

        // Set up voice in Vapi (use persona default or custom)
        $voiceId = $this->vapiService->assignVoice($coordinator);
        $coordinator->update(['voice_id' => $voiceId]);

        return $coordinator;
    }

    // Note: Business information is now stored in coord_business_information table
    // FAQs can be created separately or generated from business information

    private function createDefaultAvailability(Organization $organization, ?array $hours): void
    {
        AvailabilitySchedule::create([
            'organization_id' => $organization->id,
            'name' => 'Default Schedule',
            'is_default' => true,
            'weekly_hours' => $hours ?? $this->getDefaultBusinessHours(),
        ]);
    }

    private function provisionPhoneNumber(Organization $organization, Coordinator $coordinator): void
    {
        $phoneNumber = $this->twilioService->provisionNumber($organization);
        
        $organization->phoneNumbers()->create([
            'phone_number' => $phoneNumber['number'],
            'provider' => 'twilio',
            'provider_id' => $phoneNumber['sid'],
            'type' => 'local',
            'capabilities' => 'voice,sms',
            'assigned_coordinator_id' => $coordinator->id,
            'is_primary' => true,
            'is_active' => true,
        ]);
    }

    private function createTrialSubscription(Organization $organization, Coordinator $coordinator): void
    {
        $subscription = $organization->subscriptions()->create([
            'status' => 'trialing',
            'current_period_start' => now(),
            'current_period_end' => now()->addDays(14),
            'trial_ends_at' => now()->addDays(14),
        ]);

        $subscription->items()->create([
            'coordinator_id' => $coordinator->id,
            'price' => $coordinator->monthly_price,
            'quantity' => 1,
        ]);
    }

    private function getDefaultBusinessHours(): array
    {
        return [
            'monday' => ['start' => '09:00', 'end' => '17:00'],
            'tuesday' => ['start' => '09:00', 'end' => '17:00'],
            'wednesday' => ['start' => '09:00', 'end' => '17:00'],
            'thursday' => ['start' => '09:00', 'end' => '17:00'],
            'friday' => ['start' => '09:00', 'end' => '17:00'],
            'saturday' => null,
            'sunday' => null,
        ];
    }

}
```

### 4.3 Controllers

```
app/Coordinator/Http/Controllers/
├── OrganizationController.php
├── PersonaController.php
├── ContactController.php
├── AppointmentController.php
├── CalendarController.php
├── CallController.php
├── SmsController.php
├── EmailController.php
├── FaqController.php
├── CampaignController.php
├── AnalyticsController.php
├── BillingController.php
├── OnboardingController.php
├── RoleTemplateController.php
├── BundleController.php
└── Webhooks/
    ├── VapiWebhookController.php
    ├── TwilioWebhookController.php
    └── StripeWebhookController.php
```

#### Example Controller: OnboardingController.php

```php
<?php

namespace App\Coordinator\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Coordinator\Services\OnboardingService;
use App\Coordinator\Http\Requests\OnboardingRequest;
use App\Coordinator\Http\Resources\OrganizationResource;
use Illuminate\Http\JsonResponse;

class OnboardingController extends Controller
{
    public function __construct(
        private OnboardingService $onboardingService
    ) {}

    /**
     * Complete the 60-second setup flow
     */
    public function setup(OnboardingRequest $request): JsonResponse
    {
        $organization = $this->onboardingService->setupOrganization(
            $request->validated(),
            $request->user()
        );

        return response()->json([
            'message' => 'Organization setup complete! Your Coordinator is ready.',
            'data' => new OrganizationResource($organization),
        ], 201);
    }

    /**
     * Get available roles for selection
     */
    public function getRoles(): JsonResponse
    {
        $roles = \App\Coordinator\Models\RoleTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $roles]);
    }

    /**
     * Get available personas for selection
     */
    public function getPersonas(): JsonResponse
    {
        $personas = \App\Coordinator\Models\PersonaTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $personas]);
    }

    /**
     * Get available industries
     */
    public function getIndustries(): JsonResponse
    {
        $industries = \App\Coordinator\Models\IndustryTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'industry', 'name', 'description']);

        return response()->json(['data' => $industries]);
    }

    /**
     * Get poll questions based on industry
     */
    public function getPollQuestions(string $industry): JsonResponse
    {
        $questions = $this->getQuestionsForIndustry($industry);

        return response()->json(['data' => $questions]);
    }

    private function getQuestionsForIndustry(string $industry): array
    {
        $commonQuestions = [
            [
                'key' => 'hours',
                'question' => 'What are your business hours?',
                'type' => 'text',
                'placeholder' => 'e.g., Mon-Fri 9am-5pm',
            ],
            [
                'key' => 'location',
                'question' => 'What is your business address?',
                'type' => 'text',
                'placeholder' => 'Full street address',
            ],
            [
                'key' => 'payment_methods',
                'question' => 'What payment methods do you accept?',
                'type' => 'multiselect',
                'options' => ['Cash', 'Credit Card', 'Debit', 'Check', 'Insurance', 'Financing'],
            ],
        ];

        $industryQuestions = [
            'dental' => [
                [
                    'key' => 'insurance',
                    'question' => 'What insurance plans do you accept?',
                    'type' => 'text',
                    'placeholder' => 'e.g., Most major plans, Delta Dental, Cigna',
                ],
                [
                    'key' => 'services',
                    'question' => 'What dental services do you offer?',
                    'type' => 'multiselect',
                    'options' => ['Cleanings', 'Fillings', 'Root Canals', 'Crowns', 'Whitening', 'Invisalign'],
                ],
            ],
            'plumbing' => [
                [
                    'key' => 'emergency',
                    'question' => 'Do you offer emergency services?',
                    'type' => 'boolean',
                ],
                [
                    'key' => 'service_area',
                    'question' => 'What areas do you serve?',
                    'type' => 'text',
                    'placeholder' => 'e.g., Within 30 miles of downtown',
                ],
            ],
            'restaurant' => [
                [
                    'key' => 'cuisine',
                    'question' => 'What type of cuisine do you serve?',
                    'type' => 'text',
                ],
                [
                    'key' => 'reservations',
                    'question' => 'Do you accept reservations?',
                    'type' => 'boolean',
                ],
            ],
        ];

        return array_merge(
            $commonQuestions,
            $industryQuestions[$industry] ?? []
        );
    }
}
```

### 4.4 API Resources

```
app/Coordinator/Http/Resources/
├── OrganizationResource.php
├── PersonaResource.php
├── ContactResource.php
├── AppointmentResource.php
├── CallLogResource.php
├── SmsMessageResource.php
├── CampaignResource.php
├── AnalyticsResource.php
└── Collections/
    ├── ContactCollection.php
    ├── AppointmentCollection.php
    └── CallLogCollection.php
```

### 4.5 Form Requests

```
app/Coordinator/Http/Requests/
├── OnboardingRequest.php
├── CreateCoordinatorRequest.php
├── UpdateCoordinatorRequest.php
├── CreateContactRequest.php
├── UpdateContactRequest.php
├── CreateAppointmentRequest.php
├── UpdateAppointmentRequest.php
├── CreateCampaignRequest.php
├── CreateBusinessInformationRequest.php
├── CreateSurveyRequest.php
└── ImportContactsRequest.php
```

---

## 5. API Endpoints

### 5.1 Route Definitions

```php
// routes/coordinator.php

<?php

use Illuminate\Support\Facades\Route;
use App\Coordinator\Http\Controllers\{
    OrganizationController,
    PersonaController,
    ContactController,
    AppointmentController,
    CalendarController,
    CallController,
    SmsController,
    EmailController,
    FaqController,
    CampaignController,
    AnalyticsController,
    BillingController,
    OnboardingController,
    RoleTemplateController,
    BundleController,
};

Route::prefix('coordinator')->middleware(['auth:sanctum'])->group(function () {

    // Onboarding (60-second setup)
    Route::prefix('onboarding')->group(function () {
        Route::get('roles', [OnboardingController::class, 'getRoles']);
        Route::get('personas', [OnboardingController::class, 'getPersonas']);
        Route::get('industries', [OnboardingController::class, 'getIndustries']);
        Route::get('poll-questions/{industry}', [OnboardingController::class, 'getPollQuestions']);
        Route::post('setup', [OnboardingController::class, 'setup']);
        // Setup flow: Select Role → Select Persona → Select Industry → Answer Poll (Business Info) → Create Coordinator
    });

    // Role Templates (Read-only)
    Route::get('role-templates', [RoleTemplateController::class, 'index']);
    Route::get('role-templates/{roleTemplate}', [RoleTemplateController::class, 'show']);

    // Persona Templates (Read-only)
    Route::get('persona-templates', [PersonaTemplateController::class, 'index']);
    Route::get('persona-templates/{personaTemplate}', [PersonaTemplateController::class, 'show']);

    // Bundles (Read-only)
    Route::get('bundles', [BundleController::class, 'index']);
    Route::get('bundles/{bundle}', [BundleController::class, 'show']);

    // Organizations
    Route::apiResource('organizations', OrganizationController::class);
    Route::post('organizations/{organization}/switch', [OrganizationController::class, 'switch']);

    // Organization-scoped routes
    Route::prefix('organizations/{organization}')->group(function () {
        
        // Coordinators (Role + Persona instances)
        Route::apiResource('coordinators', CoordinatorController::class);
        Route::post('coordinators/{coordinator}/activate', [CoordinatorController::class, 'activate']);
        Route::post('coordinators/{coordinator}/pause', [CoordinatorController::class, 'pause']);
        Route::post('coordinators/{coordinator}/test-call', [CoordinatorController::class, 'testCall']);

        // CRM - Contacts
        Route::apiResource('contacts', ContactController::class);
        Route::post('contacts/import', [ContactController::class, 'import']);
        Route::get('contacts/{contact}/interactions', [ContactController::class, 'interactions']);
        Route::get('contacts/{contact}/followups', [ContactController::class, 'followups']);
        Route::post('contacts/{contact}/followups', [ContactController::class, 'createFollowup']);

        // Calendar - Appointments
        Route::apiResource('appointments', AppointmentController::class);
        Route::post('appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
        Route::post('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        Route::post('appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
        Route::post('appointments/{appointment}/no-show', [AppointmentController::class, 'noShow']);

        // Calendar - Appointment Types
        Route::apiResource('appointment-types', AppointmentTypeController::class);

        // Calendar - Availability
        Route::get('availability', [CalendarController::class, 'availability']);
        Route::get('availability/slots', [CalendarController::class, 'availableSlots']);
        Route::apiResource('availability-schedules', AvailabilityScheduleController::class);
        Route::apiResource('blocked-times', BlockedTimeController::class);

        // Communications
        Route::prefix('calls')->group(function () {
            Route::get('/', [CallController::class, 'index']);
            Route::get('/{call}', [CallController::class, 'show']);
            Route::post('/initiate', [CallController::class, 'initiate']);
            Route::get('/{call}/recording', [CallController::class, 'recording']);
            Route::get('/{call}/transcript', [CallController::class, 'transcript']);
        });

        Route::prefix('sms')->group(function () {
            Route::get('/', [SmsController::class, 'index']);
            Route::get('/{message}', [SmsController::class, 'show']);
            Route::post('/send', [SmsController::class, 'send']);
            Route::get('/conversations/{contact}', [SmsController::class, 'conversation']);
        });

        Route::prefix('emails')->group(function () {
            Route::get('/', [EmailController::class, 'index']);
            Route::get('/{email}', [EmailController::class, 'show']);
            Route::post('/send', [EmailController::class, 'send']);
        });

        // Knowledge Base
        Route::apiResource('faq-categories', FaqCategoryController::class);
        Route::apiResource('faq-items', FaqController::class);
        Route::apiResource('audio-responses', AudioResponseController::class);
        
        // Business Information
        Route::apiResource('business-information', BusinessInformationController::class);
        Route::get('business-information/category/{category}', [BusinessInformationController::class, 'byCategory']);
        
        // Surveys
        Route::apiResource('surveys', SurveyController::class);
        Route::get('surveys/{survey}/responses', [SurveyController::class, 'responses']);
        Route::post('surveys/{survey}/submit', [SurveyController::class, 'submit']);

        // Campaigns
        Route::apiResource('campaigns', CampaignController::class);
        Route::post('campaigns/{campaign}/start', [CampaignController::class, 'start']);
        Route::post('campaigns/{campaign}/pause', [CampaignController::class, 'pause']);
        Route::post('campaigns/{campaign}/complete', [CampaignController::class, 'complete']);
        Route::get('campaigns/{campaign}/contacts', [CampaignController::class, 'contacts']);
        Route::get('campaigns/{campaign}/metrics', [CampaignController::class, 'metrics']);

        // Analytics & Reporting
        Route::prefix('analytics')->group(function () {
            Route::get('/dashboard', [AnalyticsController::class, 'dashboard']);
            Route::get('/calls', [AnalyticsController::class, 'calls']);
            Route::get('/appointments', [AnalyticsController::class, 'appointments']);
            Route::get('/personas/{persona}', [AnalyticsController::class, 'persona']);
            Route::get('/export', [AnalyticsController::class, 'export']);
        });

        // Billing
        Route::prefix('billing')->group(function () {
            Route::get('/subscription', [BillingController::class, 'subscription']);
            Route::post('/subscribe', [BillingController::class, 'subscribe']);
            Route::post('/cancel', [BillingController::class, 'cancel']);
            Route::get('/invoices', [BillingController::class, 'invoices']);
            Route::get('/usage', [BillingController::class, 'usage']);
            Route::post('/add-role', [BillingController::class, 'addRole']);
            Route::post('/remove-role', [BillingController::class, 'removeRole']);
        });

        // Phone Numbers
        Route::apiResource('phone-numbers', PhoneNumberController::class);
        Route::post('phone-numbers/provision', [PhoneNumberController::class, 'provision']);
    });
});

// Webhooks (No auth required - signature verification)
Route::prefix('webhooks/coordinator')->group(function () {
    Route::post('vapi', [Webhooks\VapiWebhookController::class, 'handle']);
    Route::post('twilio/voice', [Webhooks\TwilioWebhookController::class, 'voice']);
    Route::post('twilio/sms', [Webhooks\TwilioWebhookController::class, 'sms']);
    Route::post('stripe', [Webhooks\StripeWebhookController::class, 'handle']);
});
```

---

## 6. Vue/Vite Frontend

### 6.1 Directory Structure

```
taskjuggler-web/src/coordinator/
├── index.ts                    # Module entry point
├── router.ts                   # Coordinator routes
├── types/
│   ├── index.ts
│   ├── organization.ts
│   ├── persona.ts
│   ├── contact.ts
│   ├── appointment.ts
│   ├── call.ts
│   └── campaign.ts
├── stores/
│   ├── organization.ts
│   ├── persona.ts
│   ├── contact.ts
│   ├── appointment.ts
│   ├── calendar.ts
│   ├── communication.ts
│   └── analytics.ts
├── composables/
│   ├── useOrganization.ts
│   ├── usePersona.ts
│   ├── useContacts.ts
│   ├── useAppointments.ts
│   ├── useCalendar.ts
│   ├── useCommunication.ts
│   └── useAnalytics.ts
├── components/
│   ├── common/
│   │   ├── CoordinatorHeader.vue
│   │   ├── CoordinatorSidebar.vue
│   │   └── CoordinatorBreadcrumb.vue
│   ├── onboarding/
│   │   ├── OnboardingWizard.vue
│   │   ├── RoleSelector.vue
│   │   ├── IndustrySelector.vue
│   │   ├── PersonaCustomizer.vue
│   │   ├── BusinessPoll.vue
│   │   └── SetupComplete.vue
│   ├── personas/
│   │   ├── PersonaCard.vue
│   │   ├── PersonaList.vue
│   │   ├── PersonaEditor.vue
│   │   ├── PersonaAvatar.vue
│   │   └── PersonaStats.vue
│   ├── contacts/
│   │   ├── ContactList.vue
│   │   ├── ContactCard.vue
│   │   ├── ContactEditor.vue
│   │   ├── ContactTimeline.vue
│   │   ├── ContactImporter.vue
│   │   └── ContactSearch.vue
│   ├── calendar/
│   │   ├── CalendarView.vue
│   │   ├── AppointmentCard.vue
│   │   ├── AppointmentEditor.vue
│   │   ├── AvailabilityEditor.vue
│   │   ├── TimeSlotPicker.vue
│   │   └── CalendarFilters.vue
│   ├── communications/
│   │   ├── CallLog.vue
│   │   ├── CallDetail.vue
│   │   ├── SmsConversation.vue
│   │   ├── SmsComposer.vue
│   │   ├── EmailList.vue
│   │   └── CommunicationTimeline.vue
│   ├── campaigns/
│   │   ├── CampaignList.vue
│   │   ├── CampaignBuilder.vue
│   │   ├── CampaignMetrics.vue
│   │   └── AudienceSelector.vue
│   ├── analytics/
│   │   ├── DashboardOverview.vue
│   │   ├── MetricsCard.vue
│   │   ├── CallMetrics.vue
│   │   ├── AppointmentMetrics.vue
│   │   ├── PersonaPerformance.vue
│   │   └── ChartComponents/
│   │       ├── LineChart.vue
│   │       ├── BarChart.vue
│   │       └── PieChart.vue
│   ├── billing/
│   │   ├── SubscriptionManager.vue
│   │   ├── RoleSelector.vue
│   │   ├── BundleSelector.vue
│   │   ├── InvoiceList.vue
│   │   └── UsageDisplay.vue
│   └── faq/
│       ├── FaqManager.vue
│       ├── FaqEditor.vue
│       └── AudioResponseManager.vue
├── views/
│   ├── CoordinatorLayout.vue
│   ├── DashboardView.vue
│   ├── OnboardingView.vue
│   ├── PersonasView.vue
│   ├── PersonaDetailView.vue
│   ├── ContactsView.vue
│   ├── ContactDetailView.vue
│   ├── CalendarView.vue
│   ├── CommunicationsView.vue
│   ├── CallDetailView.vue
│   ├── CampaignsView.vue
│   ├── CampaignDetailView.vue
│   ├── AnalyticsView.vue
│   ├── SettingsView.vue
│   ├── BillingView.vue
│   └── KnowledgeBaseView.vue
└── api/
    ├── index.ts
    ├── organizations.ts
    ├── personas.ts
    ├── contacts.ts
    ├── appointments.ts
    ├── calls.ts
    ├── sms.ts
    ├── campaigns.ts
    └── analytics.ts
```

### 6.2 Router Configuration

```typescript
// taskjuggler-web/src/coordinator/router.ts

import type { RouteRecordRaw } from 'vue-router'

const coordinatorRoutes: RouteRecordRaw[] = [
  {
    path: '/coordinator',
    component: () => import('./views/CoordinatorLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/coordinator/dashboard'
      },
      {
        path: 'onboarding',
        name: 'coordinator-onboarding',
        component: () => import('./views/OnboardingView.vue'),
        meta: { title: 'Get Started with Coordinator' }
      },
      {
        path: 'dashboard',
        name: 'coordinator-dashboard',
        component: () => import('./views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'personas',
        name: 'coordinator-personas',
        component: () => import('./views/PersonasView.vue'),
        meta: { title: 'Your Coordinators' }
      },
      {
        path: 'personas/:id',
        name: 'coordinator-persona-detail',
        component: () => import('./views/PersonaDetailView.vue'),
        meta: { title: 'Coordinator Details' }
      },
      {
        path: 'contacts',
        name: 'coordinator-contacts',
        component: () => import('./views/ContactsView.vue'),
        meta: { title: 'Contacts' }
      },
      {
        path: 'contacts/:id',
        name: 'coordinator-contact-detail',
        component: () => import('./views/ContactDetailView.vue'),
        meta: { title: 'Contact Details' }
      },
      {
        path: 'calendar',
        name: 'coordinator-calendar',
        component: () => import('./views/CalendarView.vue'),
        meta: { title: 'Calendar' }
      },
      {
        path: 'communications',
        name: 'coordinator-communications',
        component: () => import('./views/CommunicationsView.vue'),
        meta: { title: 'Communications' }
      },
      {
        path: 'communications/calls/:id',
        name: 'coordinator-call-detail',
        component: () => import('./views/CallDetailView.vue'),
        meta: { title: 'Call Details' }
      },
      {
        path: 'campaigns',
        name: 'coordinator-campaigns',
        component: () => import('./views/CampaignsView.vue'),
        meta: { title: 'Campaigns' }
      },
      {
        path: 'campaigns/:id',
        name: 'coordinator-campaign-detail',
        component: () => import('./views/CampaignDetailView.vue'),
        meta: { title: 'Campaign Details' }
      },
      {
        path: 'analytics',
        name: 'coordinator-analytics',
        component: () => import('./views/AnalyticsView.vue'),
        meta: { title: 'Analytics' }
      },
      {
        path: 'knowledge-base',
        name: 'coordinator-knowledge-base',
        component: () => import('./views/KnowledgeBaseView.vue'),
        meta: { title: 'Knowledge Base' }
      },
      {
        path: 'billing',
        name: 'coordinator-billing',
        component: () => import('./views/BillingView.vue'),
        meta: { title: 'Billing' }
      },
      {
        path: 'settings',
        name: 'coordinator-settings',
        component: () => import('./views/SettingsView.vue'),
        meta: { title: 'Settings' }
      }
    ]
  }
]

export default coordinatorRoutes
```

### 6.3 Type Definitions

```typescript
// taskjuggler-web/src/coordinator/types/index.ts

export interface Organization {
  id: string
  user_id: number
  name: string
  slug: string
  industry: string
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  timezone: string
  business_hours: BusinessHours
  settings: OrganizationSettings
  subscription_tier: 'starter' | 'growth' | 'enterprise'
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface BusinessHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

export interface DayHours {
  start: string
  end: string
}

export interface OrganizationSettings {
  notifications?: NotificationSettings
  branding?: BrandingSettings
}

export interface RoleTemplate {
  id: string
  name: string
  display_name: string
  description: string
  direction: 'inbound' | 'outbound' | 'both'
  base_price: number
  primary_goal: string
  capabilities: string[]
  suggested_industries: string[]
}

export interface PersonaTemplate {
  id: string
  name: string
  display_name: string
  description: string
  age_range: string | null
  personality_traits: string[]
  communication_style: string
  best_for_industries: string[] | null
  gender: 'male' | 'female' | 'neutral' | null
  voice_id: string | null
  personality_prompts: string[]
  example_greetings: string[]
  tone_guidelines: Record<string, any> | null
  is_active: boolean
  sort_order: number
}

export interface Coordinator {
  id: string
  organization_id: string
  role_template_id: string
  role_template?: RoleTemplate
  persona_template_id: string
  persona_template?: PersonaTemplate
  industry: string // Industry knowledge component
  industry_template?: IndustryTemplate
  display_name: string | null
  voice_id: string | null
  custom_greeting: string | null
  custom_prompts: Record<string, any> | null
  custom_scripts: Record<string, any> | null
  availability: BusinessHours | null
  status: 'active' | 'paused' | 'inactive'
  monthly_price: number
  activated_at: string | null
  created_at: string
  updated_at: string
  // Computed
  knowledge_base?: {
    industry: {
      terminology: string[]
      common_questions: any[]
      knowledge_base: any[]
      default_faq: any[]
    }
    business: {
      information: Record<string, string>
      faqs: Array<{ question: string; answer: string; keywords: string[] }>
    }
  }
}

export interface Contact {
  id: string
  organization_id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  phone_secondary: string | null
  company: string | null
  job_title: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  source: string | null
  status: 'active' | 'inactive' | 'do_not_contact'
  tags: string[]
  custom_fields: Record<string, any> | null
  notes: string | null
  lifetime_value: number
  last_contacted_at: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  organization_id: string
  contact_id: string
  contact?: Contact
  appointment_type_id: string | null
  appointment_type?: AppointmentType
  booked_by_coordinator_id: string | null
  booked_by_coordinator?: Coordinator
  assigned_to_user_id: number | null
  title: string
  description: string | null
  starts_at: string
  ends_at: string
  status: AppointmentStatus
  location: string | null
  location_type: 'in_person' | 'phone' | 'video'
  notes: string | null
  cancellation_reason: string | null
  reminders_sent: string[] | null
  confirmed_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show' 
  | 'rescheduled'

export interface AppointmentType {
  id: string
  organization_id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number | null
  color: string
  requires_confirmation: boolean
  allow_online_booking: boolean
  is_active: boolean
}

export interface CallLog {
  id: string
  organization_id: string
  coordinator_id: string | null
  coordinator?: Coordinator
  contact_id: string | null
  contact?: Contact
  phone_number_id: string | null
  direction: 'inbound' | 'outbound'
  from_number: string
  to_number: string
  status: CallStatus
  duration_seconds: number
  recording_url: string | null
  transcript: string | null
  transcript_segments: TranscriptSegment[] | null
  ai_summary: string | null
  outcome: string | null
  cost: number
  started_at: string
  answered_at: string | null
  ended_at: string | null
  created_at: string
}

export type CallStatus = 
  | 'queued' 
  | 'ringing' 
  | 'in_progress' 
  | 'completed' 
  | 'busy' 
  | 'failed' 
  | 'no_answer'

export interface TranscriptSegment {
  speaker: 'assistant' | 'user'
  text: string
  timestamp: number
}

export interface Campaign {
  id: string
  organization_id: string
  coordinator_id: string
  coordinator?: Coordinator
  name: string
  description: string | null
  type: CampaignType
  channel: 'voice' | 'sms' | 'email'
  status: CampaignStatus
  audience_filters: Record<string, any> | null
  schedule: CampaignSchedule | null
  script: Record<string, any> | null
  contact_limit: number | null
  daily_limit: number | null
  starts_at: string | null
  ends_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type CampaignType = 
  | 'appointment_confirmation' 
  | 'payment_reminder' 
  | 'sales_outreach' 
  | 'survey' 
  | 'product_intro'

export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'active' 
  | 'paused' 
  | 'completed'

export interface CampaignSchedule {
  days: string[]
  start_time: string
  end_time: string
  timezone: string
}

export interface DashboardMetrics {
  calls_today: number
  calls_week: number
  appointments_today: number
  appointments_week: number
  contacts_total: number
  contacts_new_week: number
  no_show_rate: number
  avg_call_duration: number
}

export interface Bundle {
  id: string
  name: string
  display_name: string
  description: string
  price: number
  savings_percentage: number
  target_industries: string[]
  roles: RoleTemplate[]
}
```

### 6.4 Pinia Store Example

```typescript
// taskjuggler-web/src/coordinator/stores/organization.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Organization, Persona } from '../types'
import * as api from '../api/organizations'

export const useOrganizationStore = defineStore('coordinator-organization', () => {
  // State
  const currentOrganization = ref<Organization | null>(null)
  const organizations = ref<Organization[]>([])
  const personas = ref<Persona[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasOrganization = computed(() => !!currentOrganization.value)
  const isOnTrial = computed(() => {
    if (!currentOrganization.value?.trial_ends_at) return false
    return new Date(currentOrganization.value.trial_ends_at) > new Date()
  })
  const activePersonas = computed(() => 
    personas.value.filter(p => p.status === 'active')
  )

  // Actions
  async function fetchOrganizations() {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.getOrganizations()
      organizations.value = response.data
      if (organizations.value.length > 0 && !currentOrganization.value) {
        await setCurrentOrganization(organizations.value[0].id)
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function setCurrentOrganization(organizationId: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.getOrganization(organizationId)
      currentOrganization.value = response.data
      await fetchPersonas()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPersonas() {
    if (!currentOrganization.value) return
    
    try {
      const response = await api.getPersonas(currentOrganization.value.id)
      personas.value = response.data
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function createOrganization(data: Partial<Organization>) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.createOrganization(data)
      organizations.value.push(response.data)
      await setCurrentOrganization(response.data.id)
      return response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateOrganization(data: Partial<Organization>) {
    if (!currentOrganization.value) return
    
    isLoading.value = true
    error.value = null
    try {
      const response = await api.updateOrganization(currentOrganization.value.id, data)
      currentOrganization.value = response.data
      const index = organizations.value.findIndex(o => o.id === response.data.id)
      if (index !== -1) {
        organizations.value[index] = response.data
      }
      return response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function $reset() {
    currentOrganization.value = null
    organizations.value = []
    personas.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    currentOrganization,
    organizations,
    personas,
    isLoading,
    error,
    // Getters
    hasOrganization,
    isOnTrial,
    activePersonas,
    // Actions
    fetchOrganizations,
    setCurrentOrganization,
    fetchPersonas,
    createOrganization,
    updateOrganization,
    $reset,
  }
})
```

### 6.5 Component Examples

#### OnboardingWizard.vue

```vue
<!-- taskjuggler-web/src/coordinator/components/onboarding/OnboardingWizard.vue -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import RoleSelector from './RoleSelector.vue'
import IndustrySelector from './IndustrySelector.vue'
import PersonaCustomizer from './PersonaCustomizer.vue'
import BusinessPoll from './BusinessPoll.vue'
import SetupComplete from './SetupComplete.vue'
import { useOnboarding } from '../../composables/useOnboarding'

const router = useRouter()
const { setupOrganization, isLoading, error } = useOnboarding()

const currentStep = ref(1)
const totalSteps = 5

const formData = ref({
  role: '', // Step 1: Select Role
  persona: '', // Step 2: Select Persona Template
  industry: '', // Step 3: Select Industry
  display_name: '', // Optional custom name
  business_name: '',
  phone: '',
  email: '',
  poll_responses: {} as Record<string, any>, // Step 4: Business Information
})

const progress = computed(() => (currentStep.value / totalSteps) * 100)

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return !!formData.value.role // Role selected
    case 2: return !!formData.value.persona // Persona selected
    case 3: return !!formData.value.industry // Industry selected
    case 4: return !!formData.value.business_name // Business name required
    default: return true
  }
})

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function completeSetup() {
  try {
    const organization = await setupOrganization(formData.value)
    currentStep.value = 5 // Show completion
    setTimeout(() => {
      router.push('/coordinator/dashboard')
    }, 3000)
  } catch (e) {
    // Error handled by composable
  }
}

const stepTitles = [
  'Choose Your Coordinator',
  'Select Your Industry',
  'Customize Your Assistant',
  'Tell Us About Your Business',
  'Setup Complete!'
]
</script>

<template>
  <div class="min-h-screen bg-background py-12">
    <div class="container max-w-2xl mx-auto px-4">
      <!-- Progress -->
      <div class="mb-8">
        <div class="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {{ currentStep }} of {{ totalSteps }}</span>
          <span>{{ stepTitles[currentStep - 1] }}</span>
        </div>
        <Progress :model-value="progress" class="h-2" />
      </div>

      <!-- Step Content -->
      <Card>
        <CardHeader>
          <CardTitle>{{ stepTitles[currentStep - 1] }}</CardTitle>
          <CardDescription v-if="currentStep === 1">
            What function does your Coordinator need to perform? (e.g., Appointment Scheduler, Receptionist)
          </CardDescription>
          <CardDescription v-else-if="currentStep === 2">
            Choose a personality that fits your business. (e.g., Marge - seasoned professional, Sandy - vivacious)
          </CardDescription>
          <CardDescription v-else-if="currentStep === 3">
            Select your industry for domain expertise. (e.g., Dental, Plumbing, Restaurant)
          </CardDescription>
          <CardDescription v-else-if="currentStep === 4">
            Tell us about your business so your Coordinator can answer questions accurately.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RoleSelector
            v-if="currentStep === 1"
            v-model="formData.role"
          />

          <IndustrySelector
            v-else-if="currentStep === 2"
            v-model="formData.industry"
          />

          <PersonaCustomizer
            v-else-if="currentStep === 3"
            v-model:name="formData.persona_name"
            v-model:gender="formData.gender"
            v-model:personality="formData.personality"
            v-model:businessName="formData.business_name"
            v-model:phone="formData.phone"
            v-model:email="formData.email"
          />

          <BusinessPoll
            v-else-if="currentStep === 4"
            v-model="formData.poll_responses"
            :industry="formData.industry"
          />

          <SetupComplete
            v-else-if="currentStep === 5"
            :persona-name="formData.persona_name"
            :role="formData.role"
          />

          <!-- Error Display -->
          <div v-if="error" class="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {{ error }}
          </div>
        </CardContent>
      </Card>

      <!-- Navigation -->
      <div class="flex justify-between mt-6" v-if="currentStep < 5">
        <Button
          variant="outline"
          @click="prevStep"
          :disabled="currentStep === 1"
        >
          Back
        </Button>

        <Button
          v-if="currentStep < 4"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Continue
        </Button>

        <Button
          v-else
          @click="completeSetup"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Setting up...</span>
          <span v-else>Complete Setup</span>
        </Button>
      </div>
    </div>
  </div>
</template>
```

#### DashboardView.vue

```vue
<!-- taskjuggler-web/src/coordinator/views/DashboardView.vue -->

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Phone, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOrganizationStore } from '../stores/organization'
import { useAnalytics } from '../composables/useAnalytics'
import MetricsCard from '../components/analytics/MetricsCard.vue'
import PersonaCard from '../components/personas/PersonaCard.vue'
import CallLog from '../components/communications/CallLog.vue'

const router = useRouter()
const organizationStore = useOrganizationStore()
const { dashboardMetrics, recentCalls, fetchDashboardData, isLoading } = useAnalytics()

const hasSetup = computed(() => organizationStore.hasOrganization)

onMounted(async () => {
  if (hasSetup.value) {
    await fetchDashboardData()
  }
})

function goToOnboarding() {
  router.push('/coordinator/onboarding')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back! Here's what's happening with your Coordinators.
        </p>
      </div>
      <Button v-if="hasSetup" @click="router.push('/coordinator/coordinators')">
        Manage Coordinators
      </Button>
    </div>

    <!-- No Setup State -->
    <Card v-if="!hasSetup" class="border-dashed">
      <CardHeader class="text-center">
        <CardTitle>Get Started with Coordinator</CardTitle>
        <CardDescription>
          Set up your first AI assistant in under 60 seconds
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center">
        <Button size="lg" @click="goToOnboarding">
          Start Setup
        </Button>
      </CardContent>
    </Card>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Key Metrics -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Calls Today"
          :value="dashboardMetrics?.calls_today ?? 0"
          :change="12"
          changeType="increase"
          :icon="Phone"
        />
        <MetricsCard
          title="Appointments This Week"
          :value="dashboardMetrics?.appointments_week ?? 0"
          :change="8"
          changeType="increase"
          :icon="Calendar"
        />
        <MetricsCard
          title="Total Contacts"
          :value="dashboardMetrics?.contacts_total ?? 0"
          :change="dashboardMetrics?.contacts_new_week ?? 0"
          changeLabel="new this week"
          :icon="Users"
        />
        <MetricsCard
          title="No-Show Rate"
          :value="`${dashboardMetrics?.no_show_rate ?? 0}%`"
          :change="2"
          changeType="decrease"
          :icon="AlertCircle"
        />
      </div>

      <!-- Active Personas -->
      <Card>
        <CardHeader>
          <CardTitle>Your Coordinators</CardTitle>
          <CardDescription>
            Active AI assistants working for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PersonaCard
              v-for="persona in organizationStore.activePersonas"
              :key="persona.id"
              :persona="persona"
            />
          </div>
          <div v-if="organizationStore.activePersonas.length === 0" class="text-center py-8 text-muted-foreground">
            No active Coordinators. Add one to get started!
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <div class="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Latest interactions with your Coordinators</CardDescription>
          </CardHeader>
          <CardContent>
            <CallLog :calls="recentCalls" :limit="5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <!-- Appointment list component here -->
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
```

---

## 7. Integration Points

### 7.1 Platform Integration

Following the Task Juggler Integration Guide:

```typescript
// taskjuggler-web/src/coordinator/index.ts

import type { App } from 'vue'
import type { Router } from 'vue-router'
import coordinatorRoutes from './router'

export function setupCoordinator(app: App, router: Router) {
  // Register routes
  coordinatorRoutes.forEach(route => {
    router.addRoute(route)
  })

  // Register global components if needed
  // app.component('CoordinatorWidget', CoordinatorWidget)
}

export * from './types'
export * from './stores/organization'
export * from './composables/useOrganization'
```

### 7.2 Shared Components

Use the platform's base UI components:

```typescript
// Import from platform's component library
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { Table } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover } from '@/components/ui/popover'
import { Command } from '@/components/ui/command'
```

### 7.3 Authentication Integration

```typescript
// Use platform's auth store
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Check auth in routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

### 7.4 API Client Integration

```typescript
// taskjuggler-web/src/coordinator/api/index.ts

import { apiClient } from '@/utils/api'

const COORDINATOR_BASE = '/api/coordinator'

export async function get<T>(url: string, params?: Record<string, any>) {
  return apiClient.get<T>(`${COORDINATOR_BASE}${url}`, { params })
}

export async function post<T>(url: string, data?: any) {
  return apiClient.post<T>(`${COORDINATOR_BASE}${url}`, data)
}

export async function put<T>(url: string, data?: any) {
  return apiClient.put<T>(`${COORDINATOR_BASE}${url}`, data)
}

export async function del<T>(url: string) {
  return apiClient.delete<T>(`${COORDINATOR_BASE}${url}`)
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

**Database & Backend**
- [ ] Create all database migrations
- [ ] Run seeders for role templates, bundles, industry templates
- [ ] Implement core models with relationships
- [ ] Set up Laravel module structure
- [ ] Implement basic CRUD controllers

**Frontend Setup**
- [ ] Create Coordinator module structure
- [ ] Set up routing
- [ ] Create type definitions
- [ ] Set up Pinia stores
- [ ] Create base layout components

### Phase 2: Onboarding Flow (Weeks 4-5)

- [ ] Implement OnboardingService
- [ ] Create onboarding wizard components
- [ ] Role selector UI
- [ ] Industry selector UI
- [ ] Persona customizer
- [ ] Business poll generator
- [ ] Setup completion flow
- [ ] Trial subscription creation

### Phase 3: CRM & Contacts (Weeks 6-7)

- [ ] Contact CRUD operations
- [ ] Contact import (CSV, Excel)
- [ ] Contact search and filtering
- [ ] Contact detail view with timeline
- [ ] Follow-up management
- [ ] Tags and custom fields

### Phase 3.5: Business Knowledge (Week 7)

- [ ] Business Information CRUD
- [ ] FAQ management
- [ ] Survey creation and management
- [ ] Survey response collection
- [ ] Knowledge base integration (Industry + Business)
- [ ] AI prompt generation with knowledge base

### Phase 4: Calendar & Appointments (Weeks 8-9)

- [ ] Calendar view component
- [ ] Appointment booking flow
- [ ] Availability management
- [ ] Appointment types configuration
- [ ] Blocked time management
- [ ] Appointment status workflow

### Phase 5: Voice Integration (Weeks 10-11)

- [ ] Vapi service integration
- [ ] Call handling webhooks
- [ ] Call logging
- [ ] Recording storage (S3)
- [ ] Transcript processing
- [ ] AI summary generation

### Phase 6: Communications (Week 12)

- [ ] SMS integration (Twilio)
- [ ] Email integration (SendGrid)
- [ ] Communication timeline
- [ ] Conversation views

### Phase 7: Campaigns (Weeks 13-14)

- [ ] Campaign builder
- [ ] Audience selection
- [ ] Campaign execution engine
- [ ] Campaign metrics tracking
- [ ] Campaign status management

### Phase 8: Analytics & Billing (Weeks 15-16)

- [ ] Dashboard metrics aggregation
- [ ] Analytics charts and reports
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Usage tracking
- [ ] Invoice generation

### Phase 9: Polish & Testing (Weeks 17-18)

- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Documentation
- [ ] User acceptance testing

---

## 9. Testing Strategy

### 9.1 Backend Testing

```php
// tests/Feature/Coordinator/OnboardingTest.php

<?php

namespace Tests\Feature\Coordinator;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_complete_onboarding()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/coordinator/onboarding/setup', [
            'business_name' => 'Test Dental Office',
            'industry' => 'dental',
            'role' => 'appointment_scheduler',
            'persona_name' => 'Sally',
            'gender' => 'female',
            'personality' => 'friendly',
            'phone' => '555-123-4567',
            'email' => 'test@example.com',
            'poll_responses' => [
                'hours' => 'Mon-Fri 9am-5pm',
                'services' => 'Cleanings, Fillings, Root Canals',
            ],
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
                'data' => [
                    'id',
                    'name',
                    'industry',
                    'coordinators',
                ],
        ]);

        $this->assertDatabaseHas('coord_organizations', [
            'name' => 'Test Dental Office',
            'industry' => 'dental',
        ]);
    }

    public function test_user_can_get_available_roles()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/coordinator/onboarding/roles');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'display_name',
                    'direction',
                    'base_price',
                ],
            ],
        ]);
    }

    public function test_user_can_get_available_personas()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/coordinator/onboarding/personas');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'display_name',
                    'description',
                    'age_range',
                    'personality_traits',
                ],
            ],
        ]);
    }
}
```

### 9.2 Frontend Testing

```typescript
// taskjuggler-web/src/coordinator/__tests__/OnboardingWizard.spec.ts

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OnboardingWizard from '../components/onboarding/OnboardingWizard.vue'

describe('OnboardingWizard', () => {
  it('renders the first step correctly', () => {
    const wrapper = mount(OnboardingWizard, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(wrapper.text()).toContain('Choose Your Coordinator')
    expect(wrapper.find('[data-testid="role-selector"]').exists()).toBe(true)
  })

  it('progresses to next step when role is selected', async () => {
    const wrapper = mount(OnboardingWizard, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    // Select a role
    await wrapper.find('[data-testid="role-receptionist"]').trigger('click')
    await wrapper.find('[data-testid="continue-button"]').trigger('click')

    expect(wrapper.text()).toContain('Select Your Industry')
  })

  it('completes setup and redirects', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = mount(OnboardingWizard, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $router: mockRouter,
        },
      },
    })

    // Complete all steps...
    // Assert redirect
    expect(mockRouter.push).toHaveBeenCalledWith('/coordinator/dashboard')
  })
})
```

---

## 10. Deployment

### 10.1 Environment Variables

```env
# Coordinator Configuration
COORDINATOR_ENABLED=true

# Vapi Voice AI
VAPI_API_KEY=your-vapi-api-key
VAPI_WEBHOOK_SECRET=your-webhook-secret

# Twilio SMS
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+15551234567

# SendGrid Email
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=coordinator@yourdomain.com

# Stripe Billing
STRIPE_KEY=your-stripe-public-key
STRIPE_SECRET=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# AWS S3 (Recordings Storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=coordinator-recordings
```

### 10.2 Database Migration Command

```bash
# Run Coordinator migrations
php artisan migrate --path=database/migrations/coordinator

# Seed initial data
php artisan db:seed --class=CoordinatorSeeder
```

### 10.3 Queue Configuration

```php
// config/queue.php - Add Coordinator queues

'connections' => [
    'redis' => [
        // ...existing config...
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],

// Supervisor config for Coordinator workers
// /etc/supervisor/conf.d/coordinator-worker.conf
[program:coordinator-calls]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --queue=coordinator-calls --tries=3
autostart=true
autorestart=true
numprocs=4

[program:coordinator-sms]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --queue=coordinator-sms --tries=3
autostart=true
autorestart=true
numprocs=2

[program:coordinator-campaigns]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --queue=coordinator-campaigns --tries=3
autostart=true
autorestart=true
numprocs=2
```

### 10.4 Nginx Configuration

```nginx
# Webhook endpoints (no rate limiting)
location /api/webhooks/coordinator/ {
    try_files $uri $uri/ /index.php?$query_string;
}

# API endpoints
location /api/coordinator/ {
    try_files $uri $uri/ /index.php?$query_string;
    
    # Rate limiting
    limit_req zone=api burst=20 nodelay;
}
```

---

## Quick Reference Commands

```bash
# Create new Coordinator migration
php artisan make:migration create_coord_tablename_table --path=database/migrations/coordinator

# Create new Coordinator model
php artisan make:model Coordinator/Models/ModelName

# Create new Coordinator controller
php artisan make:controller Coordinator/Http/Controllers/ControllerName --api

# Run Coordinator tests
php artisan test --filter=Coordinator

# Clear Coordinator caches
php artisan cache:clear --tags=coordinator
```

---

## Summary

This comprehensive Cursor plan provides:

1. **Complete database schema** with 10+ migration files covering:
   - Organizations & members
   - Role Templates (what Coordinators do)
   - Persona Templates (how Coordinators behave)
   - Industry Templates (industry knowledge)
   - Coordinators (Role + Persona + Industry instances)
   - Business Information (organization-specific knowledge)
   - Surveys & Survey Responses
   - CRM, Calendar, Communications
   - Knowledge Base (FAQs)
   - Billing, Analytics, Campaigns

2. **Three Selectable Components:**
   - **Role** - Function/service (Appointment Scheduler, Receptionist, etc.)
   - **Persona** - Personality/character (Marge, Sandy, Marcus, etc.)
   - **Industry** - Domain expertise (Dental, Plumbing, Restaurant, etc.)

3. **Business Knowledge Integration:**
   - **Business Information** - Stored in `coord_business_information` table
   - **FAQs** - Organization-specific frequently asked questions
   - **Surveys** - Customer feedback collection

4. **Laravel backend structure** with models, services, controllers, API resources, and form requests

5. **Full API specification** with 70+ endpoints for all Coordinator functionality

6. **Vue/Vite frontend** with components, views, stores, composables, and type definitions

7. **Integration guide** for connecting with the Task Juggler platform

8. **18-week implementation timeline** broken into logical phases

9. **Testing and deployment** strategies

**Onboarding Flow:**
1. Select Role (what they do)
2. Select Persona (how they behave)
3. Select Industry (industry knowledge)
4. Provide Business Information (business-specific knowledge)
5. Coordinator Created (Role + Persona + Industry + Business Knowledge)

Use this document as the primary reference when building Coordinator in Cursor. Each section can be implemented independently, allowing for parallel development across backend and frontend teams.

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Author:** Claude AI Assistant
