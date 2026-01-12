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
            
            // Subscription & Compliance (from protocol Part 1.4)
            $table->string('subscription_tier')->default('starter'); // starter, growth, enterprise
            $table->json('compliance_modes')->nullable(); // hipaa, legal_privilege, etc.
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




