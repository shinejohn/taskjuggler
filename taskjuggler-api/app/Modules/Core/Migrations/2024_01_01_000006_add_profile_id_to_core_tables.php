<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add profile_id to teams
        if (Schema::hasTable('teams') && !Schema::hasColumn('teams', 'profile_id')) {
            Schema::table('teams', function (Blueprint $table) {
                $table->uuid('profile_id')->nullable()->after('created_by');
                $table->index('profile_id');
                if (Schema::hasTable('profiles')) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                }
            });
        }

        // Add profile_id to routing_rules
        if (Schema::hasTable('routing_rules') && !Schema::hasColumn('routing_rules', 'profile_id')) {
            Schema::table('routing_rules', function (Blueprint $table) {
                $table->uuid('profile_id')->nullable()->after('user_id');
                $table->index('profile_id');
                if (Schema::hasTable('profiles')) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                }
            });
        }

        // Add profile_id to contact_lists
        if (Schema::hasTable('contact_lists') && !Schema::hasColumn('contact_lists', 'profile_id')) {
            Schema::table('contact_lists', function (Blueprint $table) {
                $table->uuid('profile_id')->nullable()->after('user_id');
                $table->index('profile_id');
                if (Schema::hasTable('profiles')) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                }
            });
        }

        // Add profile_id to assistant_channels
        if (Schema::hasTable('assistant_channels') && !Schema::hasColumn('assistant_channels', 'profile_id')) {
            Schema::table('assistant_channels', function (Blueprint $table) {
                $table->uuid('profile_id')->nullable()->after('user_id');
                $table->index('profile_id');
                if (Schema::hasTable('profiles')) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('teams') && Schema::hasColumn('teams', 'profile_id')) {
            Schema::table('teams', function (Blueprint $table) {
                $table->dropForeign(['profile_id']);
                $table->dropColumn('profile_id');
            });
        }

        if (Schema::hasTable('routing_rules') && Schema::hasColumn('routing_rules', 'profile_id')) {
            Schema::table('routing_rules', function (Blueprint $table) {
                $table->dropForeign(['profile_id']);
                $table->dropColumn('profile_id');
            });
        }

        if (Schema::hasTable('contact_lists') && Schema::hasColumn('contact_lists', 'profile_id')) {
            Schema::table('contact_lists', function (Blueprint $table) {
                $table->dropForeign(['profile_id']);
                $table->dropColumn('profile_id');
            });
        }

        if (Schema::hasTable('assistant_channels') && Schema::hasColumn('assistant_channels', 'profile_id')) {
            Schema::table('assistant_channels', function (Blueprint $table) {
                $table->dropForeign(['profile_id']);
                $table->dropColumn('profile_id');
            });
        }
    }
};

