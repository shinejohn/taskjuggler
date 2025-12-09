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
        Schema::create('ai_tool_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('vendor_id');
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors')->onDelete('cascade');
            
            // Execution
            $table->string('provider', 50); // 'openrouter', 'direct', 'webhook'
            $table->string('model', 100)->nullable();
            $table->string('api_endpoint', 500)->nullable();
            $table->text('api_key_encrypted')->nullable();
            
            // Input/Output
            $table->jsonb('input_schema');
            $table->jsonb('output_schema');
            $table->text('prompt_template')->nullable();
            
            // Limits
            $table->integer('max_execution_time')->default(300);
            $table->integer('max_tokens')->default(4000);
            $table->integer('retry_count')->default(3);
            
            // Behavior
            $table->boolean('auto_execute')->default(true);
            $table->boolean('requires_approval')->default(false);
            
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_configs');
    }
};
