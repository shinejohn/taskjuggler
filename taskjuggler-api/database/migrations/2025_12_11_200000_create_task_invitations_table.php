<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_invitations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->string('invite_code', 32)->unique();
            $table->string('invited_email')->nullable();
            $table->string('invited_phone')->nullable();
            $table->string('invited_name')->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'expired'])->default('pending');
            $table->enum('role', ['owner', 'watcher', 'collaborator'])->default('owner');
            $table->uuid('invited_by_user_id');
            $table->uuid('accepted_by_user_id')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('invited_by_user_id')->references('id')->on('users');
            $table->foreign('accepted_by_user_id')->references('id')->on('users');
            
            $table->index('invite_code');
            $table->index('invited_email');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_invitations');
    }
};
