<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_user_profiles')) {
            return;
        }

        Schema::create('urpa_user_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            
            // Subscription
            $table->string('subscription_tier', 20)->default('starter'); // starter, professional, business, enterprise
            $table->string('subscription_status', 20)->default('active');
            $table->timestamp('subscription_started_at')->nullable();
            $table->timestamp('subscription_ends_at')->nullable();
            
            // Add-ons
            $table->boolean('has_text_assistant')->default(false);
            $table->boolean('has_phone_assistant')->default(false);
            
            // Phone Numbers (if subscribed)
            $table->string('phone_number', 20)->nullable();
            $table->string('phone_number_sid', 50)->nullable(); // Twilio SID
            
            // Usage Limits (based on tier)
            $table->integer('ai_requests_limit')->default(1000);
            $table->integer('ai_requests_used')->default(0);
            $table->decimal('storage_limit_gb', 10, 2)->default(10);
            $table->decimal('storage_used_gb', 10, 2)->default(0);
            
            // Preferences
            $table->string('default_persona', 20)->default('professional');
            $table->string('theme', 10)->default('dark');
            $table->json('widget_visibility')->default('{"travel": true, "goals": true, "aiTasks": true, "files": true, "phone": true}');
            
            $table->timestamps();
            
            $table->index('user_id');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });

        Schema::create('urpa_user_personas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('persona_type', 20); // professional, creative, analytical, casual, custom
            $table->string('name', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('voice_id', 100)->nullable(); // Vapi voice ID
            $table->text('system_prompt')->nullable();
            $table->boolean('is_default')->default(false);
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->unique(['user_id', 'persona_type']);
            $table->index('user_id');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_user_personas');
        Schema::dropIfExists('urpa_user_profiles');
    }
};

