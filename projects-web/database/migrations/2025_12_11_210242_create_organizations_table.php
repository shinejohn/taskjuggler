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
        Schema::create('organizations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('plan')->default('free');
            $table->integer('max_users')->default(5);
            $table->integer('max_projects')->default(3);
            $table->jsonb('features')->nullable();
            $table->jsonb('settings')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('slug');
            $table->index('plan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
