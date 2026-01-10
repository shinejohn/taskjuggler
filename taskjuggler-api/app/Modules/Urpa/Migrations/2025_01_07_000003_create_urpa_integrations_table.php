<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_integrations')) {
            return;
        }

        Schema::create('urpa_integrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            
            // Integration Type
            $table->string('integration_type', 50); // email, messaging, calendar, social, voicemail, tasks, storage
            $table->string('provider', 50); // gmail, outlook, slack, google_calendar, etc.
            
            // Status
            $table->string('status', 20)->default('pending'); // pending, connected, error, disconnected
            
            // OAuth Tokens (encrypted)
            $table->text('access_token_encrypted')->nullable();
            $table->text('refresh_token_encrypted')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            
            // Configuration
            $table->json('config')->default('{}'); // Provider-specific config (IMAP settings, etc.)
            
            // Sync Status
            $table->timestamp('last_sync_at')->nullable();
            $table->text('sync_cursor')->nullable(); // For incremental sync
            $table->text('sync_error')->nullable();
            
            // Timestamps
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'integration_type', 'provider']);
            $table->index('user_id');
            $table->index(['integration_type', 'provider']);
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });

        Schema::create('urpa_taskjuggler_link', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('urpa_user_id');
            $table->uuid('taskjuggler_user_id')->nullable(); // May be same or different user
            
            // Sync Settings
            $table->boolean('sync_tasks')->default(true);
            $table->boolean('sync_projects')->default(true);
            $table->boolean('auto_create_tasks')->default(true); // Create TJ tasks from URPA activities
            
            // Cross-sell tracking
            $table->boolean('urpa_originated')->default(false); // User came from URPA
            $table->boolean('tj_originated')->default(false);   // User came from TaskJuggler
            
            $table->timestamp('created_at')->useCurrent();
            
            if (Schema::hasTable('users')) {
                $table->foreign('urpa_user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });

        Schema::create('urpa_fibonacci_link', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('urpa_user_id');
            $table->uuid('fibonacci_business_id')->nullable();
            
            // Sync Settings
            $table->boolean('sync_faqs')->default(true);
            $table->boolean('sync_polls')->default(true);
            $table->boolean('sync_business_info')->default(true);
            
            // Publishing Integration
            $table->boolean('publishing_enabled')->default(false);
            $table->uuid('publishing_team_id')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            if (Schema::hasTable('users')) {
                $table->foreign('urpa_user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_fibonacci_link');
        Schema::dropIfExists('urpa_taskjuggler_link');
        Schema::dropIfExists('urpa_integrations');
    }
};

