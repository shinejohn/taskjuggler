<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_recordings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('call_id');
            $table->string('s3_bucket');
            $table->string('s3_key'); // Full S3 key path
            $table->integer('duration_seconds')->nullable();
            $table->string('transcription_id')->nullable(); // AWS Transcribe job ID
            $table->text('transcription_text')->nullable(); // Cached transcription
            $table->enum('status', ['uploading', 'available', 'transcribing', 'transcribed', 'failed'])->default('uploading');
            $table->json('metadata')->nullable(); // Additional recording metadata
            $table->timestamps();

            $table->index('call_id');
            $table->index('transcription_id');
            $table->index(['call_id', 'status']);

            if (Schema::hasTable('communication_calls')) {
                $table->foreign('call_id')
                    ->references('id')
                    ->on('communication_calls')
                    ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_recordings');
    }
};

