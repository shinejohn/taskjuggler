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
        // Create history_event_type enum (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            try {
                DB::statement("CREATE TYPE history_event_type AS ENUM (
                    'TASK_SENT', 'TASK_ACCEPTED', 'TASK_REJECTED',
                    'TASK_COMPLETED', 'TASK_CANCELLED', 'TASK_DISPUTED'
                )");
            } catch (\Exception $e) {
                // Enum might already exist
            }
            
            // Create task_outcome enum
            try {
                DB::statement("CREATE TYPE task_outcome AS ENUM ('SUCCESS', 'FAILURE', 'CANCELLED', 'DISPUTED')");
            } catch (\Exception $e) {
                // Enum might already exist
            }
        }

        Schema::create('relationship_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('relationship_id');
            $table->uuid('actor_a_id');
            $table->uuid('actor_b_id');
            $table->uuid('task_id')->nullable();
            $table->string('event_type', 50); // Using string instead of enum
            $table->string('outcome', 50)->nullable(); // Using string instead of enum
            $table->integer('response_time_ms')->nullable();
            $table->integer('completion_time_ms')->nullable();
            $table->json('metadata')->default('{}');
            $table->timestamps();
            
            $table->index('relationship_id');
            $table->index('task_id');
            $table->index('created_at');
            
            // Foreign keys
            $table->foreign('relationship_id')->references('id')->on('relationships')->onDelete('cascade');
            $table->foreign('actor_a_id')->references('id')->on('actors');
            $table->foreign('actor_b_id')->references('id')->on('actors');
            if (Schema::hasTable('tasks')) {
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relationship_history');
        
        // Drop enums (PostgreSQL only)
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP TYPE IF EXISTS task_outcome');
            DB::statement('DROP TYPE IF EXISTS history_event_type');
        }
    }
};

