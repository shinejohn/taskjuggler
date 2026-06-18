<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Inbound Matrix events are deduped in PHP with a SELECT ... ->exists() check,
     * which races under concurrent appservice retries and can double-insert the same
     * event. Enforce idempotency at the database with partial unique indexes so a
     * duplicate event_id can never produce two rows.
     */
    public function up(): void
    {
        if (Schema::hasTable('task_messages') && Schema::hasColumn('task_messages', 'source_channel_ref')) {
            DB::statement(
                'CREATE UNIQUE INDEX IF NOT EXISTS task_messages_matrix_ref_unique '.
                "ON task_messages (source_channel_ref) ".
                "WHERE source_channel = 'matrix' AND source_channel_ref IS NOT NULL"
            );
        }

        if (Schema::hasTable('direct_messages') && Schema::hasColumn('direct_messages', 'source_channel_ref')) {
            DB::statement(
                'CREATE UNIQUE INDEX IF NOT EXISTS direct_messages_source_ref_unique '.
                'ON direct_messages (source_channel_ref) '.
                'WHERE source_channel_ref IS NOT NULL'
            );
        }
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS task_messages_matrix_ref_unique');
        DB::statement('DROP INDEX IF EXISTS direct_messages_source_ref_unique');
    }
};
