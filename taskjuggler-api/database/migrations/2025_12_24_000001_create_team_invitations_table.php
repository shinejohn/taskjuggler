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
        Schema::create('team_invitations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('invite_code', 32)->unique();
            $table->uuid('invited_by');
            $table->string('status', 20)->default('pending');
            $table->timestamp('expires_at');
            $table->timestamps();
            
            $table->index('team_id');
            $table->index('invite_code');
            $table->index('invited_by');
            
            // Foreign keys
            if (Schema::hasTable('teams')) {
                $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            }
            if (Schema::hasTable('users')) {
                $table->foreign('invited_by')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_invitations');
    }
};
