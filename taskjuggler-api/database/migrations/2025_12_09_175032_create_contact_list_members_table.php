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
        Schema::create('contact_list_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('list_id');
            // Foreign key will be added in a separate migration after contact_lists is created
            $table->string('name')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->jsonb('metadata')->default('{}');
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_list_members');
    }
};
