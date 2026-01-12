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
        Schema::create('ideacircuit_meeting_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->foreign('meeting_id')->references('id')->on('ideacircuit_meetings')->onDelete('cascade');
            
            // Link to Task Juggler tasks table
            $table->uuid('task_id');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            
            $table->timestampsTz();
            
            // Indexes
            $table->index('meeting_id');
            $table->index('task_id');
            $table->unique(['meeting_id', 'task_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideacircuit_meeting_tasks');
    }
};
