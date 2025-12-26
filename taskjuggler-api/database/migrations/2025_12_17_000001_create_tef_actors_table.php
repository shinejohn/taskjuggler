<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create actor_type enum (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            try {
                DB::statement("CREATE TYPE actor_type AS ENUM ('HUMAN', 'AI_AGENT', 'TEAM', 'IOT_DEVICE', 'IOT_GATEWAY')");
            } catch (\Exception $e) {
                // Enum might already exist
            }
            
            // Create actor_status enum
            try {
                DB::statement("CREATE TYPE actor_status AS ENUM ('PENDING_CLAIM', 'ACTIVE', 'SUSPENDED', 'DELETED')");
            } catch (\Exception $e) {
                // Enum might already exist
            }
        }

        Schema::create('actors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('actor_type', 50); // Using string instead of enum for Laravel compatibility
            $table->string('display_name');
            $table->json('capabilities')->default('[]');
            $table->json('contact_methods')->default('[]');
            $table->json('metadata')->default('{}');
            $table->json('authentication')->default('{}');
            $table->string('status', 50)->default('ACTIVE');
            $table->uuid('organization_id')->nullable();
            $table->uuid('user_id')->nullable(); // Link to users table if human actor
            $table->timestamps();
            
            $table->index('actor_type');
            $table->index('status');
            $table->index('organization_id');
            $table->index('user_id');
            
            // Foreign keys
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            }
            if (Schema::hasTable('profiles')) {
                $table->foreign('organization_id')->references('id')->on('profiles')->onDelete('set null');
            }
        });

        // GIN index for capabilities (PostgreSQL specific - only for production)
        if (config('database.default') === 'pgsql') {
            try {
                DB::statement('CREATE INDEX IF NOT EXISTS idx_actors_capabilities ON actors USING GIN(capabilities)');
            } catch (\Exception $e) {
                // Index might already exist or database doesn't support GIN
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actors');
        
        // Drop enums (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS actor_status');
            DB::statement('DROP TYPE IF EXISTS actor_type');
        }
    }
};

