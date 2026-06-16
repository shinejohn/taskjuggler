<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matrix_channel_rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('channel', 50);
            $table->string('external_chat_id', 255);
            $table->string('matrix_room_id', 255);
            $table->timestampsTz();

            $table->unique(['user_id', 'channel', 'external_chat_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matrix_channel_rooms');
    }
};
