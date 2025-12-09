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
        Schema::create('ai_tool_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->foreign('task_id')->references('id')->on('tasks');
            $table->uuid('vendor_id');
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors');
            $table->uuid('config_id');
            $table->foreign('config_id')->references('id')->on('ai_tool_configs');
            
            // Input
            $table->jsonb('input_data');
            
            // Execution
            $table->string('status', 20)->default('pending');
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('completed_at')->nullable();
            
            // Output
            $table->jsonb('output_data')->nullable();
            $table->jsonb('deliverable_urls')->nullable(); // Using JSONB instead of TEXT[] for Laravel compatibility
            $table->text('error_message')->nullable();
            
            // Cost
            $table->integer('tokens_used')->nullable();
            $table->decimal('cost', 10, 4)->nullable();
            
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_executions');
    }
};
