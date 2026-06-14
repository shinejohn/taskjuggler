<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_taskjuggler_link')) {
            Schema::table('urpa_taskjuggler_link', function (Blueprint $table) {
                // The original create migration only set created_at (useCurrent),
                // so Eloquent's automatic timestamps fail on update(). Add updated_at.
                if (! Schema::hasColumn('urpa_taskjuggler_link', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }

                // Tracks the last successful bidirectional sync for this link.
                if (! Schema::hasColumn('urpa_taskjuggler_link', 'last_synced_at')) {
                    $table->timestamp('last_synced_at')->nullable();
                }
            });
        }

        // urpa_ai_tasks was also created with only created_at, but its model
        // (UrpaAiTask) has Eloquent timestamps enabled — every insert/update
        // (e.g. markAsSynced) fails without updated_at.
        if (Schema::hasTable('urpa_ai_tasks') && ! Schema::hasColumn('urpa_ai_tasks', 'updated_at')) {
            Schema::table('urpa_ai_tasks', function (Blueprint $table) {
                $table->timestamp('updated_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('urpa_ai_tasks') && Schema::hasColumn('urpa_ai_tasks', 'updated_at')) {
            Schema::table('urpa_ai_tasks', function (Blueprint $table) {
                $table->dropColumn('updated_at');
            });
        }

        if (Schema::hasTable('urpa_taskjuggler_link')) {
            Schema::table('urpa_taskjuggler_link', function (Blueprint $table) {
                if (Schema::hasColumn('urpa_taskjuggler_link', 'last_synced_at')) {
                    $table->dropColumn('last_synced_at');
                }

                if (Schema::hasColumn('urpa_taskjuggler_link', 'updated_at')) {
                    $table->dropColumn('updated_at');
                }
            });
        }
    }
};
