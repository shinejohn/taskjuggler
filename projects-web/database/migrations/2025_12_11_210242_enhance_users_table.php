<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add new columns
            $table->uuid('organization_id')->nullable()->after('id');
            $table->string('phone', 50)->nullable();
            $table->boolean('phone_verified')->default(false);
            $table->string('timezone', 100)->default('UTC');
            $table->string('avatar')->nullable();
            $table->jsonb('notification_preferences')->nullable();
            $table->jsonb('skills')->nullable();
            $table->integer('capacity_hours_per_week')->default(40);
            $table->string('slack_user_id', 100)->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index('organization_id');
            $table->index('phone');
            $table->index('slack_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn([
                'organization_id',
                'phone',
                'phone_verified',
                'timezone',
                'avatar',
                'notification_preferences',
                'skills',
                'capacity_hours_per_week',
                'slack_user_id',
                'last_active_at',
                'deleted_at',
            ]);
        });
    }
};
