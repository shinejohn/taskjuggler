<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matrix_direct_rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_low_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('user_high_id')->constrained('users')->cascadeOnDelete();
            $table->string('matrix_room_id');
            $table->timestamps();

            $table->unique(['user_low_id', 'user_high_id']);
            $table->index('matrix_room_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matrix_direct_rooms');
    }
};
