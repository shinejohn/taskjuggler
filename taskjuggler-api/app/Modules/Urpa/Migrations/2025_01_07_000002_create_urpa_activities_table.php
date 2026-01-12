<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_activities')) {
            return;
        }

        Schema::create('urpa_contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            
            // Basic Info
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('company', 255)->nullable();
            $table->string('job_title', 255)->nullable();
            
            // Source
            $table->string('source', 50)->nullable(); // google, outlook, csv, manual
            $table->string('external_id', 255)->nullable();
            
            // Metadata
            $table->json('tags')->default('[]');
            $table->text('notes')->nullable();
            $table->text('avatar_url')->nullable();
            
            // Timestamps
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('email');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });

        Schema::create('urpa_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            
            // Activity Type
            $table->string('activity_type', 20); // email, text, task, calendar, social, voicemail
            $table->string('source', 50)->nullable(); // gmail, outlook, slack, google_calendar, etc.
            
            // Content
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->json('raw_content')->nullable(); // Original data from source
            
            // Status
            $table->string('status', 20)->default('pending'); // pending, urgent, completed, archived
            $table->boolean('is_read')->default(false);
            $table->boolean('is_starred')->default(false);
            
            // Related entities
            $table->uuid('contact_id')->nullable();
            $table->string('external_id', 255)->nullable(); // ID from external system
            
            // Timestamps
            $table->timestamp('activity_timestamp');
            $table->timestamps();
            
            $table->index(['user_id', 'activity_type']);
            $table->index('activity_timestamp');
            $table->index(['user_id', 'status']);
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasTable('urpa_contacts')) {
                $table->foreign('contact_id')->references('id')->on('urpa_contacts')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_activities');
        Schema::dropIfExists('urpa_contacts');
    }
};

