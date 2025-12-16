<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('tasks') && !Schema::hasColumn('tasks', 'profile_id')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->uuid('profile_id')->nullable();
                $table->index('profile_id');
                if (Schema::hasTable('profiles')) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('tasks') && Schema::hasColumn('tasks', 'profile_id')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->dropForeign(['profile_id']);
                $table->dropColumn('profile_id');
            });
        }
    }
};

