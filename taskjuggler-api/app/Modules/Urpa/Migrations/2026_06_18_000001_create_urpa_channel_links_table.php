<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_channel_links')) {
            return;
        }

        Schema::create('urpa_channel_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');

            // Channel + the external identities the connector talks to.
            $table->string('channel', 30);              // telegram, whatsapp, signal, slack, discord, google_chat, imessage
            $table->string('external_user_id', 255);    // sender id on the channel (who is messaging)
            $table->string('external_chat_id', 255);    // where the assistant sends replies back
            $table->string('display_name', 255)->nullable();

            // Optional per-user credentials (Option B). NULL = use the shared
            // platform bot/credentials configured on the connector (Option A).
            $table->json('credentials')->nullable();

            $table->boolean('is_active')->default(true);
            $table->boolean('auto_reply')->default(true);

            $table->timestamp('last_inbound_at')->nullable();
            $table->timestamp('last_outbound_at')->nullable();
            $table->timestamps();

            // A given external identity maps to exactly one Fibonacco user per channel.
            $table->unique(['channel', 'external_user_id']);
            $table->index(['user_id', 'channel']);

            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_channel_links');
    }
};
