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
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('invite_code', 50)->nullable()->unique()->after('id');
            $table->timestampTz('invite_expires_at')->nullable()->after('invite_code');
        });

        // Add index for invite code lookups
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('invite_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['invite_code']);
            $table->dropColumn(['invite_code', 'invite_expires_at']);
        });
    }
};
