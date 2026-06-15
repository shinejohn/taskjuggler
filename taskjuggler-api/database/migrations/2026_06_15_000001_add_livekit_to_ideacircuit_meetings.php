<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('ideacircuit_meetings')) {
            return;
        }

        Schema::table('ideacircuit_meetings', function (Blueprint $table) {
            if (! Schema::hasColumn('ideacircuit_meetings', 'livekit_room_name')) {
                $table->string('livekit_room_name')->nullable()->after('chime_media_placement');
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('ideacircuit_meetings') && Schema::hasColumn('ideacircuit_meetings', 'livekit_room_name')) {
            Schema::table('ideacircuit_meetings', function (Blueprint $table) {
                $table->dropColumn('livekit_room_name');
            });
        }
    }
};
