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
        Schema::create('availability_slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Day of week (0 = Sunday, 6 = Saturday) or null for one-time slots
            $table->integer('day_of_week')->nullable(); // 0-6 or null
            
            // Time range
            $table->time('start_time');
            $table->time('end_time');
            
            // Date range for recurring slots
            $table->date('start_date')->nullable(); // When this availability starts
            $table->date('end_date')->nullable(); // When this availability ends (null = indefinite)
            
            // One-time slot (specific date)
            $table->date('specific_date')->nullable(); // For one-time availability
            
            // Timezone
            $table->string('timezone', 50)->default('UTC');
            
            // Status
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
            $table->index(['day_of_week', 'is_active']);
            $table->index('specific_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
    }
};
