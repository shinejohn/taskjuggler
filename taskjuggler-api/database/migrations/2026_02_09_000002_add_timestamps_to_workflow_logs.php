<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('workflow_logs', function (Blueprint $table) {
            // Check if column exists, if not add it.
            // If created_at exists (from useCurrent), we might need to modify it or add updated_at
            if (!Schema::hasColumn('workflow_logs', 'updated_at')) {
                // If created_at exists, just add updated_at.
                // But tests suggest standard timestamps() behavior is desired.
                // However, older migration used timestamp('created_at')->useCurrent();
                // This creates a single column 'created_at'.
                // So adding 'updated_at' is enough.
                 $table->timestamp('updated_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workflow_logs', function (Blueprint $table) {
             $table->dropColumn('updated_at');
        });
    }
};
