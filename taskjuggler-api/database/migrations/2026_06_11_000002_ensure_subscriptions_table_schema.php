<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Two create_subscriptions migrations exist historically:
 * - app/Modules/Core/Migrations/2024_01_01_000003 (real schema, uuid PK, team_id, ...)
 * - database/migrations/2026_01_16_025112 (stub: id + timestamps only)
 *
 * Depending on which ran first in a given environment, the table may have the
 * stub schema. The stub could never hold subscription data (no team_id/plan
 * columns), so rebuilding it is safe. This migration converges every
 * environment on the real schema required by ModuleAccess, Stripe webhooks,
 * and CRM provisioning.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('subscriptions') && Schema::hasColumn('subscriptions', 'team_id')) {
            return; // Real schema already in place.
        }

        Schema::dropIfExists('subscriptions');

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

            if (Schema::hasTable('teams')) {
                $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        // No structural rollback: the table is left with the converged schema.
        // Dropping it here would destroy live subscription rows.
    }
};
