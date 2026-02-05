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
        Schema::create('problems', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('reporter_id');
            $table->uuid('assignee_id')->nullable();
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type', 50);
            $table->string('severity', 50);
            $table->string('status', 50)->default('open');
            
            $table->integer('impact_score')->nullable();
            $table->integer('likelihood_score')->nullable();
            
            $table->text('root_cause')->nullable();
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            
            $table->jsonb('related_task_ids')->nullable();
            $table->jsonb('tags')->nullable();
            
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

            $table->foreign('reporter_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('assignee_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['project_id', 'status', 'severity']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
