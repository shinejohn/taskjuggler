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
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('requestor_id');
            $table->uuid('owner_id')->nullable();
            $table->uuid('parent_id')->nullable();
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('state', 50)->default('pending');
            $table->string('source_channel', 50);
            $table->jsonb('source_metadata')->nullable();
            $table->string('priority', 50)->default('medium');
            
            $table->timestamp('due_date')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('estimated_hours')->nullable();
            $table->decimal('actual_hours', 8, 2)->default(0);
            
            $table->uuid('sprint_id')->nullable();
            $table->uuid('milestone_id')->nullable();
            
            $table->decimal('overdue_risk_score', 5, 2)->nullable();
            $table->jsonb('ai_suggestions')->nullable();
            $table->jsonb('extracted_entities')->nullable();
            $table->jsonb('tags')->nullable();
            $table->jsonb('custom_fields')->nullable();
            $table->integer('position')->default(0);
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade');

            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table->foreign('requestor_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('parent_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->index(['project_id', 'state']);
            $table->index(['owner_id', 'state']);
            $table->index(['requestor_id', 'state']);
            $table->index(['due_date', 'state']);
            $table->index('source_channel');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
