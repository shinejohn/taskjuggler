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
            // Add source_channel_ref if it doesn't exist
            // Note: source_channel, source_type, and source_channel_id are already in the module migration
            if (!Schema::hasColumn('tasks', 'source_channel_ref')) {
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
            // Only drop source_channel_ref if it exists
            // Note: source_channel, source_type, and source_channel_id are part of the base schema
            if (Schema::hasColumn('tasks', 'source_channel_ref')) {
                $table->dropColumn('source_channel_ref');
            }
        });
    }
};
