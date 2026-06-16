<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('direct_messages')) {
            return;
        }

        if (Schema::hasColumn('direct_messages', 'source_channel_ref')) {
            return;
        }

        Schema::table('direct_messages', function (Blueprint $table) {
            $table->string('source_channel_ref')->nullable()->after('content');
            $table->index('source_channel_ref');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('direct_messages')) {
            return;
        }

        if (! Schema::hasColumn('direct_messages', 'source_channel_ref')) {
            return;
        }

        Schema::table('direct_messages', function (Blueprint $table) {
            $table->dropIndex(['source_channel_ref']);
            $table->dropColumn('source_channel_ref');
        });
    }
};
