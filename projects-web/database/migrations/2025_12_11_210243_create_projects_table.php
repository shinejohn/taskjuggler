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
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('owner_id');
            $table->string('name');
            $table->string('code', 10)->nullable();
            $table->text('description')->nullable();
            $table->string('methodology', 50)->default('hybrid');
            $table->string('status', 50)->default('active');
            $table->string('priority', 50)->default('medium');
            $table->date('start_date')->nullable();
            $table->date('target_end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->decimal('budget_spent', 12, 2)->default(0);
            $table->jsonb('settings')->nullable();
            $table->jsonb('tags')->nullable();
            $table->integer('health_score')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->index(['organization_id', 'status']);
            $table->index('code');
        });

        Schema::create('project_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('user_id');
            $table->string('role', 50)->default('member');
            $table->integer('allocation_percentage')->default(100);
            $table->timestamps();

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique(['project_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('projects');
    }
};
