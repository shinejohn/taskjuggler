<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->string('type', 50);
            $table->string('title');
            $table->text('body')->nullable();
            $table->jsonb('data')->nullable();
            
            // Delivery
            $table->jsonb('channels')->nullable(); // ['push', 'email', 'sms'] - using JSONB instead of TEXT[]
            $table->timestampTz('sent_at')->nullable();
            $table->timestampTz('read_at')->nullable();
            
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
