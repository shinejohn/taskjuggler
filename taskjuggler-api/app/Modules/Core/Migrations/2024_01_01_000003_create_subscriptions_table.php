<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if table already exists (from existing migrations)
        if (Schema::hasTable('subscriptions')) {
            return;
        }

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id');
            $table->string('plan')->default('free');
            $table->string('status')->default('active');
            $table->string('stripe_subscription_id')->nullable();
            $table->string('stripe_customer_id')->nullable();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
            
            $table->index('team_id');
            
            // Only add foreign key if teams table exists
            if (Schema::hasTable('teams')) {
                $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};

