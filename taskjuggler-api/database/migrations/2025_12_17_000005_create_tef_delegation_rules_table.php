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
        Schema::create('delegation_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('delegator_id');
            $table->uuid('delegate_id');
            $table->json('scope')->default('{}'); // { task_types: [], target_actors: [], max_priority: "HIGH" }
            $table->json('constraints')->default('{}');
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index('delegator_id');
            $table->index('delegate_id');
            $table->index(['is_active'], 'idx_delegation_active')->where('is_active', true);
            
            // Foreign keys
            $table->foreign('delegator_id')->references('id')->on('actors')->onDelete('cascade');
            $table->foreign('delegate_id')->references('id')->on('actors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delegation_rules');
    }
};

