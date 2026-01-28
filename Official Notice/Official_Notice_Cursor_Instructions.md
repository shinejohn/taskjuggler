# Official Notice - Complete Cursor Development Instructions

## Project Overview

**Official Notice** is transaction infrastructure that ensures everyone who needs to know about a deadline knows — and everyone who needs a document has it.

**Core Philosophy:**
- The document is the evidence
- The deadline is the value
- The team is everyone in the deal

**Tagline:** "You've been officially noticed."

---

## What We Are Building

### NOT Building:
- Contract lifecycle management (CLM) tool
- Contract creation platform
- Deal room that closes when the deal closes
- Another AI contract tool

### ARE Building:
- **Multi-party** transaction infrastructure
- **Deadline-centric** notification platform
- **Persistent** deal rooms that live for the life of agreements
- **Accessible** platform from free to enterprise

---

## Three User Types

### 1. ATTORNEYS (Create & Share)
- Create and share documents with clients
- Stay connected through the life of agreements
- Multi-client dashboard
- Firm branding on notifications

### 2. BUSINESS (Manage & Track)
- Track deadlines across locations and teams
- Receive documents from attorneys
- Multi-location management
- Team coordination

### 3. PERSONAL/FAMILY (Store & Protect)
- One place for every important document
- Receive from attorneys, add own documents
- Family sharing
- Emergency access designation

---

## Tech Stack

### Frontend
```
- Vue 3 (Composition API)
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Shadcn-vue (UI components)
- Vue Router
- Pinia (state management)
- VueUse (composables)
- Axios (HTTP client)
- VuePDF (document viewing)
```

### Backend
```
- Laravel 11
- PHP 8.3+
- PostgreSQL
- Laravel Sanctum (API authentication)
- Laravel Horizon (queues)
- Laravel Scheduler (cron jobs)
- Spatie packages (permissions, media library)
```

### External Services
```
- OpenAI API - Document analysis, deadline extraction, summaries
- Stripe - Payments and subscriptions
- Stripe Identity - ID verification (step 1 of virtual notary)
- AWS Rekognition - Facial recognition (step 2 of virtual notary)
- AWS S3 - Document storage
- SendGrid/Mailgun - Email notifications
- Twilio - SMS notifications
- Firebase/Pusher - Push notifications & real-time
```

### Infrastructure
```
- Laravel Forge or Vapor for deployment
- PostgreSQL (AWS RDS or similar)
- Redis for caching and queues
- S3 for file storage
```

---

## Pricing Model

**CRITICAL: $9.99/month, no exceptions. No free tiers for ongoing service.**

The principle: Ongoing notifications and peace of mind for decades should be paid from the start.

### Individual/Family Plans
| Plan | Price | Features |
|------|-------|----------|
| Personal | $9.99/mo | Unlimited documents, notifications, AI features |
| Family | $19.99/mo | Up to 10 family members, emergency access |

### Business Plans
| Plan | Price | Features |
|------|-------|----------|
| Professional | $29/mo | 10 users, multi-channel notifications |
| Business | $99/mo | 50 users, multi-location, API access |
| Enterprise | Custom | Unlimited, white-label, dedicated support |

### Attorney Plans
| Plan | Price | Features |
|------|-------|----------|
| Solo | $49/mo | 25 clients, firm branding |
| Firm | $149/mo | 100 clients, 5 attorneys |
| Enterprise | Custom | Unlimited, white-label, API |

### Prepaid Pricing Options
Allow customers to pay upfront for extended periods at discounted rates:
- 5 years prepaid: 10% discount
- 10 years prepaid: 15% discount
- 20 years prepaid: 20% discount
- 50 years prepaid: 25% discount

---

## Database Schema (Laravel Migrations)

### Migration Files

```php
// database/migrations/2024_01_01_000001_create_users_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->enum('account_type', ['individual', 'family', 'business', 'attorney']);
            $table->enum('subscription_tier', [
                'personal', 'family', 'professional', 'business', 'enterprise',
                'attorney_solo', 'attorney_firm', 'attorney_enterprise'
            ])->default('personal');
            $table->enum('subscription_status', ['active', 'trial', 'past_due', 'cancelled', 'expired'])->default('trial');
            $table->string('stripe_customer_id')->nullable()->unique();
            $table->string('stripe_subscription_id')->nullable();
            $table->json('notification_preferences')->default('{}');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index('email');
            $table->index('stripe_customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

```php
// database/migrations/2024_01_01_000002_create_parties_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('party_type', ['individual', 'organization']);
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->json('address')->nullable();
            $table->timestamps();
            
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parties');
    }
};
```

```php
// database/migrations/2024_01_01_000003_create_user_party_links_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_party_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('party_id')->constrained()->onDelete('cascade');
            $table->enum('relationship', ['self', 'employer', 'client', 'family_member', 'caregiver', 'representative']);
            $table->timestamps();
            
            $table->unique(['user_id', 'party_id']);
            $table->index('user_id');
            $table->index('party_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_party_links');
    }
};
```

```php
// database/migrations/2024_01_01_000004_create_transactions_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->enum('transaction_type', [
                'commercial_lease', 'residential_lease', 'will_trust', 'power_of_attorney',
                'visa_immigration', 'insurance_policy', 'vendor_contract', 'employment_agreement',
                'service_agreement', 'franchise_agreement', 'custom'
            ]);
            $table->enum('status', ['draft', 'active', 'pending', 'expired', 'terminated', 'archived'])->default('draft');
            $table->date('effective_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->foreignUuid('created_by_id')->constrained('users');
            $table->json('metadata')->default('{}');
            $table->timestamps();
            
            $table->index('created_by_id');
            $table->index('transaction_type');
            $table->index('status');
            $table->index('expiration_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

```php
// database/migrations/2024_01_01_000005_create_transaction_parties_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_parties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('party_id')->constrained()->onDelete('cascade');
            $table->enum('role', [
                // Commercial Lease
                'landlord', 'tenant', 'landlord_attorney', 'tenant_attorney', 
                'property_manager', 'broker', 'guarantor',
                // Will/Trust
                'grantor', 'trustee', 'beneficiary', 'executor',
                // Visa/Immigration
                'applicant', 'sponsor', 'employer',
                // Insurance
                'policyholder', 'insured', 'insurance_agent',
                // Generic
                'party_a', 'party_b', 'attorney', 'witness', 'other'
            ]);
            $table->enum('access_level', ['view', 'edit', 'admin'])->default('view');
            $table->foreignUuid('added_by_id')->constrained('users');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            $table->unique(['transaction_id', 'party_id', 'role']);
            $table->index('transaction_id');
            $table->index('party_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_parties');
    }
};
```

```php
// database/migrations/2024_01_01_000006_create_documents_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('transaction_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size');
            $table->integer('version')->default(1);
            $table->boolean('is_primary')->default(false);
            $table->foreignUuid('uploaded_by_id')->constrained('users');
            $table->text('ai_summary')->nullable();
            $table->json('ai_extracted_data')->nullable();
            $table->timestamps();
            
            $table->index('transaction_id');
            $table->index('uploaded_by_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
```

```php
// database/migrations/2024_01_01_000007_create_document_signatures_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_signatures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('document_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('party_id')->constrained();
            $table->timestamp('signed_at')->nullable();
            $table->text('signature_data')->nullable();
            $table->foreignUuid('identity_verification_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index('document_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_signatures');
    }
};
```

```php
// database/migrations/2024_01_01_000008_create_milestones_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('document_id')->nullable()->constrained();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('milestone_type', [
                'expiration', 'renewal_window_open', 'renewal_window_close',
                'payment_due', 'notice_required', 'review_recommended',
                'compliance_deadline', 'visa_expiration', 'license_renewal',
                'insurance_renewal', 'custom'
            ]);
            $table->date('milestone_date');
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_rule')->nullable();
            $table->enum('status', ['upcoming', 'notified', 'passed', 'completed', 'cancelled'])->default('upcoming');
            $table->enum('visibility', ['all_parties', 'specific_parties', 'private'])->default('all_parties');
            $table->foreignUuid('created_by_id')->constrained('users');
            $table->boolean('ai_extracted')->default(false);
            $table->float('ai_confidence')->nullable();
            $table->timestamps();
            
            $table->index('transaction_id');
            $table->index('milestone_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milestones');
    }
};
```

```php
// database/migrations/2024_01_01_000009_create_notification_rules_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('milestone_id')->constrained()->onDelete('cascade');
            $table->integer('days_before');
            $table->json('notification_channels');
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('created_by_id')->constrained('users');
            $table->timestamps();
            
            $table->index('milestone_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_rules');
    }
};
```

```php
// database/migrations/2024_01_01_000010_create_notifications_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rule_id')->nullable()->constrained('notification_rules')->onDelete('set null');
            $table->foreignUuid('milestone_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['scheduled', 'processing', 'sent', 'partially_sent', 'failed', 'cancelled'])->default('scheduled');
            $table->timestamp('scheduled_for');
            $table->timestamp('sent_at')->nullable();
            $table->json('channels_used');
            $table->timestamps();
            
            $table->index('milestone_id');
            $table->index('scheduled_for');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
```

```php
// database/migrations/2024_01_01_000011_create_notification_recipients_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_recipients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('notification_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('party_id')->constrained();
            $table->enum('channel', ['email', 'sms', 'push']);
            $table->enum('delivery_status', ['pending', 'delivered', 'bounced', 'failed', 'unsubscribed'])->default('pending');
            $table->timestamp('delivered_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
            
            $table->index('notification_id');
            $table->index('party_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_recipients');
    }
};
```

```php
// database/migrations/2024_01_01_000012_create_identity_verifications_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('identity_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->string('stripe_identity_session_id')->nullable();
            $table->string('stripe_verification_status')->nullable();
            $table->json('aws_rekognition_result')->nullable();
            $table->float('face_match_confidence')->nullable();
            $table->enum('verification_status', ['pending', 'id_verified', 'face_match_pending', 'verified', 'failed', 'expired'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('verification_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('identity_verifications');
    }
};
```

```php
// database/migrations/2024_01_01_000013_create_life_check_settings_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('life_check_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->onDelete('cascade');
            $table->boolean('is_enabled')->default(false);
            $table->integer('check_frequency_days')->default(30);
            $table->integer('grace_period_days')->default(7);
            $table->timestamp('last_check_sent_at')->nullable();
            $table->timestamp('last_response_at')->nullable();
            $table->timestamp('next_check_due')->nullable();
            $table->integer('consecutive_missed')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('life_check_settings');
    }
};
```

```php
// database/migrations/2024_01_01_000014_create_life_check_contacts_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('life_check_contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('life_check_settings_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('relationship');
            $table->integer('notify_order')->default(1);
            $table->text('message')->nullable();
            $table->timestamps();
            
            $table->index('life_check_settings_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('life_check_contacts');
    }
};
```

```php
// database/migrations/2024_01_01_000015_create_life_check_history_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('life_check_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('life_check_settings_id')->constrained()->onDelete('cascade');
            $table->enum('check_type', ['scheduled', 'manual', 'grace_period_warning', 'final_warning']);
            $table->timestamp('sent_at');
            $table->timestamp('responded_at')->nullable();
            $table->string('response_method')->nullable();
            $table->enum('status', ['sent', 'responded', 'missed', 'contacts_notified']);
            $table->timestamps();
            
            $table->index('life_check_settings_id');
            $table->index('sent_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('life_check_history');
    }
};
```

```php
// database/migrations/2024_01_01_000016_create_audit_logs_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained();
            $table->string('entity_type');
            $table->uuid('entity_id');
            $table->string('action');
            $table->json('changes')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['entity_type', 'entity_id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
```

---

## Laravel Models

```php
// app/Models/User.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'email', 'password', 'name', 'phone', 'account_type',
        'subscription_tier', 'subscription_status', 'stripe_customer_id',
        'stripe_subscription_id', 'notification_preferences',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'notification_preferences' => 'array',
    ];

    public function partyLinks(): HasMany
    {
        return $this->hasMany(UserPartyLink::class);
    }

    public function parties()
    {
        return $this->belongsToMany(Party::class, 'user_party_links')
            ->withPivot('relationship')->withTimestamps();
    }

    public function createdTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'created_by_id');
    }

    public function uploadedDocuments(): HasMany
    {
        return $this->hasMany(Document::class, 'uploaded_by_id');
    }

    public function lifeCheckSettings(): HasOne
    {
        return $this->hasOne(LifeCheckSettings::class);
    }

    public function identityVerifications(): HasMany
    {
        return $this->hasMany(IdentityVerification::class);
    }

    public function isAdmin(): bool
    {
        return in_array($this->account_type, ['attorney', 'business']);
    }
}
```

```php
// app/Models/Party.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Party extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['party_type', 'name', 'email', 'phone', 'address'];

    protected $casts = ['address' => 'array'];

    public function userLinks(): HasMany
    {
        return $this->hasMany(UserPartyLink::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_party_links')
            ->withPivot('relationship')->withTimestamps();
    }

    public function transactionParties(): HasMany
    {
        return $this->hasMany(TransactionParty::class);
    }

    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'transaction_parties')
            ->withPivot(['role', 'access_level', 'is_primary'])->withTimestamps();
    }
}
```

```php
// app/Models/Transaction.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name', 'transaction_type', 'status', 'effective_date',
        'expiration_date', 'created_by_id', 'metadata',
    ];

    protected $casts = [
        'effective_date' => 'date',
        'expiration_date' => 'date',
        'metadata' => 'array',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function transactionParties(): HasMany
    {
        return $this->hasMany(TransactionParty::class);
    }

    public function parties()
    {
        return $this->belongsToMany(Party::class, 'transaction_parties')
            ->withPivot(['role', 'access_level', 'is_primary', 'added_by_id'])
            ->withTimestamps();
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    public function upcomingMilestones()
    {
        return $this->milestones()
            ->where('status', 'upcoming')
            ->where('milestone_date', '>=', now())
            ->orderBy('milestone_date');
    }
}
```

```php
// app/Models/Milestone.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transaction_id', 'document_id', 'name', 'description',
        'milestone_type', 'milestone_date', 'is_recurring', 'recurrence_rule',
        'status', 'visibility', 'created_by_id', 'ai_extracted', 'ai_confidence',
    ];

    protected $casts = [
        'milestone_date' => 'date',
        'is_recurring' => 'boolean',
        'ai_extracted' => 'boolean',
        'ai_confidence' => 'float',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function notificationRules(): HasMany
    {
        return $this->hasMany(NotificationRule::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function getDaysUntilAttribute(): int
    {
        return now()->diffInDays($this->milestone_date, false);
    }
}
```

```php
// app/Models/Document.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transaction_id', 'name', 'description', 'file_path', 'file_type',
        'file_size', 'version', 'is_primary', 'uploaded_by_id',
        'ai_summary', 'ai_extracted_data',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'ai_extracted_data' => 'array',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    public function signatures(): HasMany
    {
        return $this->hasMany(DocumentSignature::class);
    }
}
```

```php
// app/Models/LifeCheckSettings.php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LifeCheckSettings extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id', 'is_enabled', 'check_frequency_days', 'grace_period_days',
        'last_check_sent_at', 'last_response_at', 'next_check_due', 'consecutive_missed',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'last_check_sent_at' => 'datetime',
        'last_response_at' => 'datetime',
        'next_check_due' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(LifeCheckContact::class)->orderBy('notify_order');
    }

    public function history(): HasMany
    {
        return $this->hasMany(LifeCheckHistory::class)->orderBy('sent_at', 'desc');
    }
}
```

---

## Laravel API Routes

```php
// routes/api.php

<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\IdentityController;
use App\Http\Controllers\Api\LifeCheckController;
use App\Http\Controllers\Api\MilestoneController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PartyController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Webhooks (no auth)
Route::post('/webhooks/stripe', [WebhookController::class, 'handleStripe']);

// Life Check response (public with code)
Route::post('/life-check/respond-public', [LifeCheckController::class, 'respondPublic']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/notification-preferences', [UserController::class, 'updateNotificationPreferences']);

    // Dashboard
    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('/dashboard/upcoming-deadlines', [DashboardController::class, 'upcomingDeadlines']);
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    Route::get('/transactions/{transaction}/parties', [TransactionController::class, 'parties']);
    Route::post('/transactions/{transaction}/parties', [TransactionController::class, 'addParty']);
    Route::delete('/transactions/{transaction}/parties/{party}', [TransactionController::class, 'removeParty']);
    Route::get('/transactions/{transaction}/documents', [TransactionController::class, 'documents']);
    Route::get('/transactions/{transaction}/milestones', [TransactionController::class, 'milestones']);
    Route::get('/transactions/{transaction}/timeline', [TransactionController::class, 'timeline']);

    // Documents
    Route::post('/documents/upload', [DocumentController::class, 'upload']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    Route::post('/documents/{document}/analyze', [DocumentController::class, 'analyze']);
    Route::get('/documents/{document}/signatures', [DocumentController::class, 'signatures']);
    Route::post('/documents/{document}/sign', [DocumentController::class, 'sign']);

    // Milestones
    Route::apiResource('milestones', MilestoneController::class);
    Route::get('/milestones-upcoming', [MilestoneController::class, 'upcoming']);
    Route::get('/milestones-calendar', [MilestoneController::class, 'calendar']);

    // Notifications
    Route::get('/notifications/rules', [NotificationController::class, 'rules']);
    Route::post('/notifications/rules', [NotificationController::class, 'createRule']);
    Route::put('/notifications/rules/{rule}', [NotificationController::class, 'updateRule']);
    Route::delete('/notifications/rules/{rule}', [NotificationController::class, 'deleteRule']);
    Route::get('/notifications/history', [NotificationController::class, 'history']);
    Route::post('/notifications/test', [NotificationController::class, 'test']);

    // Parties
    Route::apiResource('parties', PartyController::class);
    Route::get('/parties/{party}/transactions', [PartyController::class, 'transactions']);
    Route::post('/parties/invite', [PartyController::class, 'invite']);

    // Identity Verification
    Route::post('/identity/start-verification', [IdentityController::class, 'startVerification']);
    Route::get('/identity/status/{sessionId}', [IdentityController::class, 'status']);
    Route::post('/identity/face-match', [IdentityController::class, 'faceMatch']);

    // Life Check
    Route::get('/life-check/settings', [LifeCheckController::class, 'settings']);
    Route::put('/life-check/settings', [LifeCheckController::class, 'updateSettings']);
    Route::post('/life-check/enable', [LifeCheckController::class, 'enable']);
    Route::post('/life-check/disable', [LifeCheckController::class, 'disable']);
    Route::get('/life-check/contacts', [LifeCheckController::class, 'contacts']);
    Route::post('/life-check/contacts', [LifeCheckController::class, 'addContact']);
    Route::put('/life-check/contacts/{contact}', [LifeCheckController::class, 'updateContact']);
    Route::delete('/life-check/contacts/{contact}', [LifeCheckController::class, 'deleteContact']);
    Route::post('/life-check/respond', [LifeCheckController::class, 'respond']);
    Route::get('/life-check/history', [LifeCheckController::class, 'history']);

    // Billing
    Route::get('/billing/subscription', [BillingController::class, 'subscription']);
    Route::post('/billing/create-checkout-session', [BillingController::class, 'createCheckoutSession']);
    Route::post('/billing/create-portal-session', [BillingController::class, 'createPortalSession']);
    Route::get('/billing/invoices', [BillingController::class, 'invoices']);
    Route::post('/billing/prepay', [BillingController::class, 'prepay']);

    // AI Services
    Route::post('/ai/analyze-document', [AiController::class, 'analyzeDocument']);
    Route::post('/ai/extract-dates', [AiController::class, 'extractDates']);
    Route::post('/ai/summarize', [AiController::class, 'summarize']);
});
```

---

## Laravel Services

```php
// app/Services/DocumentAnalysisService.php

<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class DocumentAnalysisService
{
    public function analyzeDocument(string $documentText): array
    {
        $systemPrompt = <<<PROMPT
You are a legal document analysis AI. Analyze the provided document and extract:

1. SUMMARY: A plain-language summary (2-3 sentences)
2. PARTIES: All parties mentioned with their roles, contact info if present
3. DATES: All critical dates including:
   - Effective/start dates
   - Expiration dates
   - Renewal windows (when renewal notice must be given)
   - Payment due dates (recurring)
   - Notice deadlines
4. KEY TERMS: Important terms like payment amounts, penalties, conditions
5. DOCUMENT TYPE: Classify the document type

For dates, identify if they are recurring. If so, provide RRULE format.

Respond in JSON format with keys: summary, parties, dates, keyTerms, documentType, confidence
PROMPT;

        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $documentText],
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.1,
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }

    public function extractDates(string $documentText): array
    {
        $systemPrompt = <<<PROMPT
Extract ALL dates and deadlines from this document. For each date:
- date: ISO format (YYYY-MM-DD)
- type: expiration|renewal_window_open|renewal_window_close|payment_due|notice_required|review_recommended|compliance_deadline|custom
- description: Brief description
- isRecurring: true/false
- recurrenceRule: RRULE if recurring
- confidence: 0-1

Return as JSON with "dates" array.
PROMPT;

        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $documentText],
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.1,
        ]);

        $result = json_decode($response->choices[0]->message->content, true);
        return $result['dates'] ?? [];
    }

    public function generateSummary(string $documentText): string
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Summarize this legal document in 2-3 sentences using plain language. Focus on key parties, purpose, and important dates.',
                ],
                ['role' => 'user', 'content' => $documentText],
            ],
            'temperature' => 0.3,
        ]);

        return $response->choices[0]->message->content;
    }
}
```

```php
// app/Services/NotificationService.php

<?php

namespace App\Services;

use App\Models\Milestone;
use App\Models\Notification;
use App\Models\NotificationRecipient;
use App\Models\NotificationRule;
use App\Mail\DeadlineNotification;
use Illuminate\Support\Facades\Mail;
use Twilio\Rest\Client as TwilioClient;

class NotificationService
{
    public const DEFAULT_SCHEDULE = [90, 60, 30, 14, 7, 1, 0];

    protected TwilioClient $twilio;

    public function __construct()
    {
        $this->twilio = new TwilioClient(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function createDefaultRules(Milestone $milestone, string $createdById): void
    {
        foreach (self::DEFAULT_SCHEDULE as $daysBefore) {
            NotificationRule::create([
                'milestone_id' => $milestone->id,
                'days_before' => $daysBefore,
                'notification_channels' => ['email', 'push'],
                'is_active' => true,
                'created_by_id' => $createdById,
            ]);
        }
    }

    public function scheduleNotifications(Milestone $milestone): void
    {
        $rules = $milestone->notificationRules()->where('is_active', true)->get();

        foreach ($rules as $rule) {
            $scheduledFor = $milestone->milestone_date->copy()->subDays($rule->days_before);

            if ($scheduledFor->isFuture()) {
                Notification::create([
                    'rule_id' => $rule->id,
                    'milestone_id' => $milestone->id,
                    'status' => 'scheduled',
                    'scheduled_for' => $scheduledFor,
                    'channels_used' => $rule->notification_channels,
                ]);
            }
        }
    }

    public function sendNotification(Notification $notification): void
    {
        $notification->update(['status' => 'processing']);

        $milestone = $notification->milestone->load('transaction.parties');
        $parties = $milestone->transaction->parties;

        $allSuccessful = true;

        foreach ($parties as $party) {
            foreach ($notification->channels_used as $channel) {
                $recipient = NotificationRecipient::create([
                    'notification_id' => $notification->id,
                    'party_id' => $party->id,
                    'channel' => $channel,
                    'delivery_status' => 'pending',
                ]);

                $success = match ($channel) {
                    'email' => $this->sendEmail($party, $milestone),
                    'sms' => $this->sendSms($party, $milestone),
                    'push' => $this->sendPush($party, $milestone),
                    default => false,
                };

                $recipient->update([
                    'delivery_status' => $success ? 'delivered' : 'failed',
                    'delivered_at' => $success ? now() : null,
                ]);

                if (!$success) $allSuccessful = false;
            }
        }

        $notification->update([
            'status' => $allSuccessful ? 'sent' : 'partially_sent',
            'sent_at' => now(),
        ]);
    }

    protected function sendEmail($party, Milestone $milestone): bool
    {
        if (!$party->email) return false;

        try {
            Mail::to($party->email)->send(new DeadlineNotification($milestone, $party));
            return true;
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }

    protected function sendSms($party, Milestone $milestone): bool
    {
        if (!$party->phone) return false;

        try {
            $daysUntil = $milestone->days_until;
            $message = $daysUntil === 0
                ? "⚠️ DEADLINE TODAY: {$milestone->name} for {$milestone->transaction->name}"
                : "📅 Reminder: {$milestone->name} due in {$daysUntil} days";

            $this->twilio->messages->create($party->phone, [
                'from' => config('services.twilio.from'),
                'body' => $message,
            ]);

            return true;
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }

    protected function sendPush($party, Milestone $milestone): bool
    {
        // Firebase/Pusher implementation
        return true;
    }
}
```

```php
// app/Services/LifeCheckService.php

<?php

namespace App\Services;

use App\Models\LifeCheckSettings;
use App\Models\LifeCheckHistory;
use App\Models\User;
use App\Mail\LifeCheckMail;
use App\Mail\LifeCheckContactAlert;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Twilio\Rest\Client as TwilioClient;

class LifeCheckService
{
    protected TwilioClient $twilio;

    public function __construct()
    {
        $this->twilio = new TwilioClient(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function sendCheck(User $user): void
    {
        $settings = $user->lifeCheckSettings;
        if (!$settings || !$settings->is_enabled) return;

        $code = Str::random(32);

        cache()->put(
            "life_check:{$user->id}:{$code}",
            true,
            now()->addDays($settings->grace_period_days + 1)
        );

        LifeCheckHistory::create([
            'life_check_settings_id' => $settings->id,
            'check_type' => 'scheduled',
            'sent_at' => now(),
            'status' => 'sent',
        ]);

        Mail::to($user->email)->send(new LifeCheckMail($user, $code));

        if ($user->phone) {
            $this->twilio->messages->create($user->phone, [
                'from' => config('services.twilio.from'),
                'body' => "Official Notice Life Check: Confirm you're OK at " .
                    config('app.frontend_url') . "/life-check/respond?code={$code}",
            ]);
        }

        $settings->update([
            'last_check_sent_at' => now(),
            'next_check_due' => now()->addDays($settings->check_frequency_days),
        ]);
    }

    public function respond(User $user, string $code, string $method = 'link'): bool
    {
        if (!cache()->has("life_check:{$user->id}:{$code}")) return false;

        $settings = $user->lifeCheckSettings;
        if (!$settings) return false;

        $pendingCheck = LifeCheckHistory::where('life_check_settings_id', $settings->id)
            ->where('status', 'sent')
            ->latest('sent_at')
            ->first();

        if ($pendingCheck) {
            $pendingCheck->update([
                'responded_at' => now(),
                'response_method' => $method,
                'status' => 'responded',
            ]);
        }

        $settings->update([
            'last_response_at' => now(),
            'consecutive_missed' => 0,
        ]);

        cache()->forget("life_check:{$user->id}:{$code}");

        return true;
    }

    public function processExpired(): void
    {
        $expired = LifeCheckSettings::where('is_enabled', true)
            ->whereNotNull('last_check_sent_at')
            ->whereRaw('(last_response_at < last_check_sent_at OR last_response_at IS NULL)')
            ->where('last_check_sent_at', '<', now()->subDays(7))
            ->with(['user', 'contacts'])
            ->get();

        foreach ($expired as $settings) {
            $settings->increment('consecutive_missed');

            LifeCheckHistory::create([
                'life_check_settings_id' => $settings->id,
                'check_type' => 'final_warning',
                'sent_at' => now(),
                'status' => 'contacts_notified',
            ]);

            foreach ($settings->contacts as $contact) {
                Mail::to($contact->email)->send(
                    new LifeCheckContactAlert($settings->user, $contact)
                );

                if ($contact->phone) {
                    $this->twilio->messages->create($contact->phone, [
                        'from' => config('services.twilio.from'),
                        'body' => "ALERT: {$settings->user->name} has not responded to their Official Notice Life Check.",
                    ]);
                }
            }
        }
    }
}
```

---

## Vue Frontend Structure

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── components.json          # shadcn-vue config
├── package.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   └── notifications.ts
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useDocuments.ts
│   │   ├── useMilestones.ts
│   │   ├── useParties.ts
│   │   ├── useNotifications.ts
│   │   ├── useLifeCheck.ts
│   │   └── useIdentity.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── date.ts
│   ├── types/
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/               # shadcn-vue
│   │   ├── layout/
│   │   ├── transactions/
│   │   ├── documents/
│   │   ├── milestones/
│   │   ├── parties/
│   │   ├── notifications/
│   │   ├── life-check/
│   │   ├── identity/
│   │   ├── billing/
│   │   └── shared/
│   ├── layouts/
│   │   ├── AuthLayout.vue
│   │   └── DashboardLayout.vue
│   ├── views/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── documents/
│   │   ├── milestones/
│   │   ├── parties/
│   │   ├── notifications/
│   │   ├── life-check/
│   │   ├── settings/
│   │   └── admin/
│   └── assets/
│       └── styles/
│           └── main.css
```

---

## Vue Router

```typescript
// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth (public)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guest: true }
    },
    {
      path: '/life-check/respond',
      name: 'life-check-respond',
      component: () => import('@/views/life-check/RespondView.vue'),
      meta: { guest: true }
    },

    // Protected
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
        { path: 'transactions', name: 'transactions', component: () => import('@/views/transactions/TransactionsView.vue') },
        { path: 'transactions/new', name: 'transaction-create', component: () => import('@/views/transactions/TransactionCreateView.vue') },
        { path: 'transactions/:id', name: 'transaction-detail', component: () => import('@/views/transactions/TransactionDetailView.vue') },
        { path: 'documents', name: 'documents', component: () => import('@/views/documents/DocumentsView.vue') },
        { path: 'milestones', name: 'milestones', component: () => import('@/views/milestones/MilestonesView.vue') },
        { path: 'milestones/calendar', name: 'calendar', component: () => import('@/views/milestones/CalendarView.vue') },
        { path: 'parties', name: 'parties', component: () => import('@/views/parties/PartiesView.vue') },
        { path: 'life-check', name: 'life-check', component: () => import('@/views/life-check/LifeCheckView.vue') },
        { path: 'settings/profile', name: 'settings-profile', component: () => import('@/views/settings/ProfileView.vue') },
        { path: 'settings/billing', name: 'settings-billing', component: () => import('@/views/settings/BillingView.vue') },
      ]
    },
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
```

---

## Pinia Store

```typescript
// src/stores/auth.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => 
    user.value?.account_type === 'attorney' || user.value?.account_type === 'business'
  )

  async function login(email: string, password: string) {
    const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password })
    user.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
  }

  async function register(data: { name: string; email: string; password: string; account_type: string }) {
    const response = await api.post<{ user: User; token: string }>('/auth/register', data)
    user.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await api.get<User>('/auth/me')
    } catch {
      await logout()
    }
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout, fetchUser }
})
```

---

## Environment Variables

```env
# Backend (.env)
APP_NAME="Official Notice"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=official_notice
DB_USERNAME=postgres
DB_PASSWORD=

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

OPENAI_API_KEY=sk-...

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=official-notice-documents

TWILIO_SID=AC...
TWILIO_TOKEN=
TWILIO_FROM=+1234567890

MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=
```

```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Official Notice"
VITE_STRIPE_KEY=pk_test_...
```

---

## Getting Started

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Queue Worker
php artisan queue:work

# Scheduler (for cron)
php artisan schedule:work
```

---

## Remember

**"You've been officially noticed."**

The document is the evidence. The deadline is the value. The team is everyone in the deal.
