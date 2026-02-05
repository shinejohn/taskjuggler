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
        Schema::create('contact_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->timestampsTz();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->index(['user_id', 'organization_id']);
        });

        Schema::create('contact_list_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('list_id');
            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();

            $table->foreign('list_id')
                ->references('id')
                ->on('contact_lists')
                ->onDelete('cascade');

            $table->index('list_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_list_members');
        Schema::dropIfExists('contact_lists');
    }
};
