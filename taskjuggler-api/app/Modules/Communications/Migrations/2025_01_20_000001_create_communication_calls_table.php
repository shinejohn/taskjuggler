<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_calls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable(); // Nullable for system calls
            $table->string('caller_number', 50);
            $table->string('callee_number', 50);
            $table->enum('direction', ['inbound', 'outbound'])->default('inbound');
            $table->enum('status', ['initiated', 'ringing', 'connected', 'completed', 'failed', 'busy', 'no_answer', 'cancelled'])->default('initiated');
            $table->string('aws_connect_contact_id')->nullable()->unique(); // AWS Connect contact ID
            $table->text('recording_url')->nullable();
            $table->string('transcription_id')->nullable();
            $table->json('metadata')->nullable(); // Additional call metadata
            $table->timestamp('initiated_at')->nullable();
            $table->timestamp('connected_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('aws_connect_contact_id');
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
        Schema::dropIfExists('communication_calls');
    }
};

