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
        Schema::create('appointment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->default(30); // Duration in minutes
            $table->string('color', 7)->default('#3B82F6'); // Hex color for calendar
            $table->boolean('is_active')->default(true);
            
            // Booking settings
            $table->integer('buffer_before_minutes')->default(0); // Buffer time before appointment
            $table->integer('buffer_after_minutes')->default(0); // Buffer time after appointment
            $table->integer('advance_booking_days')->default(30); // How many days in advance can be booked
            $table->integer('cancellation_hours')->default(24); // Hours before appointment for cancellation
            
            // Pricing (optional)
            $table->decimal('price', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            
            // Public booking link
            $table->string('booking_slug', 100)->unique();
            $table->boolean('is_public')->default(true);
            
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
            $table->index('booking_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_types');
    }
};
