<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration adds foreign key constraints to tasks table for new fields.
     * It runs after all referenced tables are created.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop existing foreign key for project_id if it exists (will be re-added)
            $table->dropForeign(['project_id']);

            // Re-add project_id foreign key (now nullable)
            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('set null');

            // Add foreign keys for new fields (only if tables exist)
            if (Schema::hasTable('teams')) {
                $table->foreign('team_id')
                    ->references('id')
                    ->on('teams')
                    ->onDelete('set null');
            }

            if (Schema::hasTable('routing_rules')) {
                $table->foreign('routing_rule_id')
                    ->references('id')
                    ->on('routing_rules')
                    ->onDelete('set null');
            }

            if (Schema::hasTable('assistant_channels')) {
                $table->foreign('source_channel_id')
                    ->references('id')
                    ->on('assistant_channels')
                    ->onDelete('set null');
            }

            if (Schema::hasTable('marketplace_vendors')) {
                $table->foreign('marketplace_vendor_id')
                    ->references('id')
                    ->on('marketplace_vendors')
                    ->onDelete('set null');
            }

            if (Schema::hasTable('marketplace_listings')) {
                $table->foreign('marketplace_listing_id')
                    ->references('id')
                    ->on('marketplace_listings')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropForeign(['routing_rule_id']);
            $table->dropForeign(['source_channel_id']);
            $table->dropForeign(['marketplace_vendor_id']);
            $table->dropForeign(['marketplace_listing_id']);
            $table->dropForeign(['project_id']);
        });
    }
};
