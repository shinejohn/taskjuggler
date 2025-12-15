<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('profiles')) {
            return;
        }

        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('name'); // e.g., "Work", "Family", "Client 2", "Business 1"
            $table->string('slug')->nullable(); // URL-friendly identifier
            $table->text('description')->nullable();
            $table->string('color')->default('#3b82f6'); // For UI differentiation
            $table->string('icon')->nullable(); // Emoji or icon identifier
            $table->boolean('is_default')->default(false);
            $table->jsonb('settings')->nullable(); // Profile-specific settings
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index(['user_id', 'is_default']);
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

