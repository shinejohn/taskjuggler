<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            
            // Identity
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            
            // Type: human, ai_agent, system, external_service
            $table->string('actor_type', 20)->default('human');
            
            // For human users - links to users table
            $table->uuid('user_id')->nullable();
            
            // For AI agents
            $table->string('ai_model', 100)->nullable();
            $table->string('ai_endpoint', 500)->nullable();
            $table->jsonb('ai_config')->default('{}');
            
            // Capabilities and qualifications
            $table->jsonb('capabilities')->default('[]');
            $table->jsonb('qualifications')->default('[]');
            $table->jsonb('performance_metrics')->default('{}');
            
            // Notification preferences
            $table->jsonb('notification_preferences')->default('{}');
            
            // Availability
            $table->jsonb('working_hours')->default('{}');
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->index(['organization_id', 'actor_type']);
            $table->index(['organization_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doers');
    }
};

