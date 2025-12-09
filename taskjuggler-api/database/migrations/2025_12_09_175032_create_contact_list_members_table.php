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
            $table->foreign('list_id')->references('id')->on('contact_lists')->onDelete('cascade');
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
