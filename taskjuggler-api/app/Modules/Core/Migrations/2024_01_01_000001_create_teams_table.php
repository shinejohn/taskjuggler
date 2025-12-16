<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if table already exists
        if (Schema::hasTable('teams')) {
            return;
        }

        Schema::create('teams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->uuid('owner_id');
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('owner_id');
            
            // Only add foreign key if users table exists
            if (Schema::hasTable('users')) {
                $table->foreign('owner_id')->references('id')->on('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};

