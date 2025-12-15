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
        if (!Schema::hasTable('tasks')) {
            return;
        }

        Schema::table('tasks', function (Blueprint $table) {
            // Only add source_channel if it doesn't exist
            // Note: source_channel may already exist from module migration
            if (!Schema::hasColumn('tasks', 'source_channel')) {
                $table->text('source_channel')->nullable();
            }
            // Add source_channel_ref if it doesn't exist
            if (!Schema::hasColumn('tasks', 'source_channel_ref')) {
                // PostgreSQL doesn't support ->after(), so we'll add it without positioning
                $table->text('source_channel_ref')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('tasks')) {
            return;
        }

        Schema::table('tasks', function (Blueprint $table) {
            // Only drop columns if they exist
            $columnsToDrop = [];
            if (Schema::hasColumn('tasks', 'source_channel_ref')) {
                $columnsToDrop[] = 'source_channel_ref';
            }
            // Note: We don't drop source_channel here because it might be part of the base schema
            // If you need to drop it, do it manually or in a separate migration
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
