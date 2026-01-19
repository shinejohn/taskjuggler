<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_sms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable(); // Nullable for system SMS
            $table->string('from_number', 50);
            $table->string('to_number', 50);
            $table->text('message');
            $table->enum('direction', ['inbound', 'outbound'])->default('outbound');
            $table->enum('status', ['pending', 'sent', 'delivered', 'failed', 'received'])->default('pending');
            $table->string('aws_message_id')->nullable()->unique(); // AWS SNS/Pinpoint message ID
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable(); // Additional SMS metadata
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('aws_message_id');
            $table->index(['user_id', 'status']);
            $table->index('created_at');

            if (Schema::hasTable('users')) {
                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_sms');
    }
};

