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
        Schema::create('claim_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('actor_id');
            $table->string('code', 20)->unique();
            $table->timestamp('expires_at');
            $table->timestamp('claimed_at')->nullable();
            $table->uuid('claimed_by_user_id')->nullable();
            $table->timestamps();
            
            $table->index('code');
            $table->index('actor_id');
            $table->index('expires_at');
            
            // Foreign keys
            $table->foreign('actor_id')->references('id')->on('actors')->onDelete('cascade');
            if (Schema::hasTable('users')) {
                $table->foreign('claimed_by_user_id')->references('id')->on('users')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claim_codes');
    }
};

