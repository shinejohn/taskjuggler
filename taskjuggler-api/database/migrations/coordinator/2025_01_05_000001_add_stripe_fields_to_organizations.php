<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coord_organizations', function (Blueprint $table) {
            if (!Schema::hasColumn('coord_organizations', 'stripe_customer_id')) {
                $table->string('stripe_customer_id')->nullable()->after('subscription_tier');
            }
            if (!Schema::hasColumn('coord_organizations', 'stripe_subscription_id')) {
                $table->string('stripe_subscription_id')->nullable()->after('stripe_customer_id');
            }
            if (!Schema::hasColumn('coord_organizations', 'stripe_payment_method_id')) {
                $table->string('stripe_payment_method_id')->nullable()->after('stripe_subscription_id');
            }
            if (!Schema::hasColumn('coord_organizations', 'subscription_status')) {
                $table->string('subscription_status')->nullable()->after('stripe_payment_method_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('coord_organizations', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_customer_id',
                'stripe_subscription_id',
                'stripe_payment_method_id',
                'subscription_status',
            ]);
        });
    }
};

