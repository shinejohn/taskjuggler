<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // FAQ Categories
        Schema::create('coord_faq_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });

        // FAQ Items
        Schema::create('coord_faq_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('category_id')->nullable();
            $table->text('question');
            $table->text('answer');
            $table->json('keywords')->nullable(); // For AI matching
            $table->string('priority')->default('medium'); // high, medium, low
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->integer('use_count')->default(0); // Track usage
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('category_id')
                ->references('id')
                ->on('coord_faq_categories')
                ->onDelete('set null');
                
            $table->index(['organization_id', 'is_active']);
        });

        // Prerecorded Audio Responses
        Schema::create('coord_audio_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id')->nullable();
            $table->string('name');
            $table->text('transcript');
            $table->string('audio_url');
            $table->integer('duration_seconds');
            $table->string('trigger_phrase')->nullable(); // When to use this response
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('coordinator_id')
                ->references('id')
                ->on('coord_coordinators')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_audio_responses');
        Schema::dropIfExists('coord_faq_items');
        Schema::dropIfExists('coord_faq_categories');
    }
};




