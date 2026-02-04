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
        Schema::table('doctors_patients', function (Blueprint $table) {
            $table->foreignUuid('user_id')->nullable()->after('organization_id')->constrained('users')->onDelete('set null');
            $table->string('portal_status', 20)->default('inactive')->after('user_id'); // inactive, invited, active, blocked
            $table->timestamp('portal_last_login_at')->nullable()->after('portal_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors_patients', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'portal_status', 'portal_last_login_at']);
        });
    }
};
