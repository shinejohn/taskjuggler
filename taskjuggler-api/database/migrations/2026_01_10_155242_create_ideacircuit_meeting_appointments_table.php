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
        Schema::create('ideacircuit_meeting_appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            // Link to Task Juggler appointments table
            $table->uuid('appointment_id');
            $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('cascade');
            
            $table->timestampsTz();
            
            // Indexes
            $table->index('meeting_id');
            $table->index('appointment_id');
            $table->unique(['meeting_id', 'appointment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_appointments');
    }
};
