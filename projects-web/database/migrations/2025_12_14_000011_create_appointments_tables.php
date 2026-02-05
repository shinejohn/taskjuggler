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
            $table->uuid('organization_id');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->string('color', 7)->default('#3B82F6');
            $table->boolean('is_active')->default(true);
            $table->integer('buffer_before_minutes')->default(0);
            $table->integer('buffer_after_minutes')->default(0);
            $table->integer('advance_booking_days')->default(30);
            $table->integer('cancellation_hours')->default(24);
            $table->decimal('price', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('booking_slug', 100)->unique();
            $table->boolean('is_public')->default(true);
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['user_id', 'is_active']);
            $table->index('booking_slug');
        });

        Schema::create('availability_slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('appointment_type_id');
            $table->uuid('user_id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->foreign('appointment_type_id')
                ->references('id')
                ->on('appointment_types')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['appointment_type_id', 'date', 'is_available']);
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('appointment_type_id');
            $table->uuid('user_id'); // Provider
            $table->uuid('organization_id');
            $table->uuid('availability_slot_id')->nullable();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone')->nullable();
            $table->timestampTz('scheduled_at');
            $table->integer('duration_minutes');
            $table->string('status', 20)->default('pending'); // pending, confirmed, completed, cancelled
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestampsTz();

            $table->foreign('appointment_type_id')
                ->references('id')
                ->on('appointment_types')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('availability_slot_id')
                ->references('id')
                ->on('availability_slots')
                ->onDelete('set null');

            $table->index(['user_id', 'scheduled_at']);
            $table->index(['organization_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('availability_slots');
        Schema::dropIfExists('appointment_types');
    }
};
