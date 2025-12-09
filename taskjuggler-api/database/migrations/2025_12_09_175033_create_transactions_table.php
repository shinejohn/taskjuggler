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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            
            $table->string('type', 50); // 'subscription', 'marketplace', 'ai_tool', 'usage'
            
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            
            // Related entities
            $table->uuid('task_id')->nullable();
            $table->foreign('task_id')->references('id')->on('tasks');
            $table->uuid('vendor_id')->nullable();
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors');
            $table->uuid('execution_id')->nullable();
            $table->foreign('execution_id')->references('id')->on('ai_tool_executions');
            
            // Stripe
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('stripe_transfer_id')->nullable();
            
            $table->string('status', 20)->default('pending');
            
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
