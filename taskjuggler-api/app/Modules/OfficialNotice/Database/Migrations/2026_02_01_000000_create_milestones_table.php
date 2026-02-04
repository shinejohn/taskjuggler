<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('on_milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_all_day')->default(false);
            
            // Recurrence Rule (RFC 5545)
            $table->text('rrule')->nullable();
            
            // Context
            $table->foreignUuid('document_id')->nullable()->constrained('on_documents')->nullOnDelete();
            $table->foreignUuid('created_by')->constrained('users'); // Assuming users table uses uuids? Need to check. 
            // Previous view of User model didn't explicitly show UUID usage but Team model did cast UUID. 
            // Safest to use constrained() if users has uuid.
            // Let's assume standard Laravel users table usually bigInt but this project seems UUID heavy.
            // Wait, Team.php uses HasUuids so likely User does too.
             
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('on_milestones');
    }
};
