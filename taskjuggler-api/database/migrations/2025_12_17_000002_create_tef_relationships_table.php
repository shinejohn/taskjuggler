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
        // Create relationship_type enum (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            try {
                DB::statement("CREATE TYPE relationship_type AS ENUM ('OWNER', 'PEER', 'DELEGATE', 'WATCHER', 'VENDOR')");
            } catch (\Exception $e) {
                // Enum might already exist
            }
            
            // Create established_via enum
            try {
                DB::statement("CREATE TYPE established_via AS ENUM ('CLAIM_CODE', 'INVITATION', 'ORGANIZATION', 'API')");
            } catch (\Exception $e) {
                // Enum might already exist
            }
        }

        Schema::create('relationships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('actor_a_id');
            $table->uuid('actor_b_id');
            $table->string('relationship_type', 50); // Using string instead of enum
            $table->json('permissions')->default('{}');
            $table->string('established_via', 50); // Using string instead of enum
            $table->decimal('trust_score', 5, 2)->default(50.00);
            $table->integer('task_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->unique(['actor_a_id', 'actor_b_id'], 'unique_relationship');
            $table->index('actor_a_id');
            $table->index('actor_b_id');
            $table->index('relationship_type');
            
            // Foreign keys
            $table->foreign('actor_a_id')->references('id')->on('actors')->onDelete('cascade');
            $table->foreign('actor_b_id')->references('id')->on('actors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relationships');
        
        // Drop enums (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS established_via');
            DB::statement('DROP TYPE IF EXISTS relationship_type');
        }
    }
};

