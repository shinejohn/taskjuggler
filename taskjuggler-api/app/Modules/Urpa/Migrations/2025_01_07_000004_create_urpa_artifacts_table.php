<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_artifacts')) {
            return;
        }

        Schema::create('urpa_artifacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('session_id')->nullable(); // Will reference urpa_ai_sessions after it's created
            
            // Artifact Type
            $table->string('artifact_type', 20); // code, document, image, file
            
            // Content
            $table->string('title', 255);
            $table->text('content')->nullable();
            $table->string('language', 50)->nullable(); // For code artifacts
            
            // Storage
            $table->string('storage_provider', 20)->nullable(); // local, dropbox, google_drive
            $table->text('storage_path')->nullable();
            $table->bigInteger('file_size_bytes')->nullable();
            
            // Metadata
            $table->json('tags')->default('[]');
            
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('session_id');
            $table->index('artifact_type');
            
            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_artifacts');
    }
};

