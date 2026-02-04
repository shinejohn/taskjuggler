<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates table for storing user URPA mode preferences and settings
     */
    public function up(): void
    {
        Schema::create('urpa_mode_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Current and default mode
            $table->enum('current_mode', ['practice', 'business', 'personal', 'all'])->default('practice');
            $table->enum('default_mode', ['practice', 'business', 'personal', 'all'])->default('practice');
            
            // Unified view settings
            $table->boolean('unified_view_enabled')->default(true);
            $table->boolean('auto_switch_mode')->default(false);
            
            // Mode-specific notification preferences
            $table->json('notification_preferences')->nullable();
            
            // HIPAA settings
            $table->boolean('require_mode_confirm')->default(true);
            $table->integer('hipaa_session_timeout')->default(30); // minutes
            
            // Last activity tracking
            $table->timestamp('last_mode_switch')->nullable();
            $table->timestamp('last_practice_access')->nullable();
            
            $table->timestamps();
            
            // Ensure one settings record per user
            $table->unique('user_id');
        });
        
        // HIPAA audit log for mode switches and PHI access
        Schema::create('urpa_hipaa_audit_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Action details
            $table->string('action'); // MODE_SWITCH, PHI_ACCESS, DATA_EXPORT, etc.
            $table->string('resource_type')->nullable(); // patient, chart, prescription, etc.
            $table->unsignedBigInteger('resource_id')->nullable();
            
            // Mode context
            $table->enum('from_mode', ['practice', 'business', 'personal', 'all'])->nullable();
            $table->enum('to_mode', ['practice', 'business', 'personal', 'all'])->nullable();
            
            // Request metadata
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->json('additional_data')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes for audit queries
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
            $table->index(['resource_type', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('urpa_hipaa_audit_log');
        Schema::dropIfExists('urpa_mode_settings');
    }
};
