<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('routing_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id'); // Add organization for multi-tenancy
            
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->integer('priority')->default(100); // Lower = evaluated first
            $table->boolean('is_active')->default(true);
            
            // Conditions (JSON)
            $table->jsonb('conditions');
            
            // Actions (JSON)
            $table->jsonb('actions');
            
            // Stats
            $table->integer('times_matched')->default(0);
            $table->timestampTz('last_matched_at')->nullable();
            
            $table->timestampsTz();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['user_id', 'is_active', 'priority']);
            $table->index(['organization_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routing_rules');
    }
};
