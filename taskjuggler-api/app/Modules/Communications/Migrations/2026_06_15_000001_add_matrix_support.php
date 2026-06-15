<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matrix_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('matrix_user_id')->unique();
            $table->text('access_token')->nullable();
            $table->string('device_id')->nullable();
            $table->timestampTz('provisioned_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        if (Schema::hasTable('conversations')) {
            Schema::table('conversations', function (Blueprint $table) {
                if (! Schema::hasColumn('conversations', 'matrix_room_id')) {
                    $table->string('matrix_room_id')->nullable()->after('task_id');
                    $table->index('matrix_room_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('conversations') && Schema::hasColumn('conversations', 'matrix_room_id')) {
            Schema::table('conversations', function (Blueprint $table) {
                $table->dropIndex(['matrix_room_id']);
                $table->dropColumn('matrix_room_id');
            });
        }

        Schema::dropIfExists('matrix_accounts');
    }
};
