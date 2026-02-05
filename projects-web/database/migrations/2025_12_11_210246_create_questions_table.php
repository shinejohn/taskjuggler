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
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->uuid('author_id');
            $table->uuid('accepted_answer_id')->nullable();
            $table->uuid('converted_task_id')->nullable();
            
            $table->string('title');
            $table->text('body');
            $table->string('status', 50)->default('open');
            $table->string('priority', 50)->default('medium');
            $table->jsonb('tags')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('vote_count')->default(0);
            
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

            $table->foreign('author_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['project_id', 'status']);
        });

        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('question_id');
            $table->uuid('author_id');
            $table->text('body');
            $table->integer('vote_count')->default(0);
            $table->boolean('is_ai_suggested')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('question_id')
                ->references('id')
                ->on('questions')
                ->onDelete('cascade');

            $table->foreign('author_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });

        // Add foreign key for accepted_answer after answers table exists
        Schema::table('questions', function (Blueprint $table) {
            $table->foreign('accepted_answer_id')
                ->references('id')
                ->on('answers')
                ->onDelete('set null');

            $table->foreign('converted_task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('set null');
        });

        Schema::create('question_votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('voteable_type');
            $table->uuid('voteable_id');
            $table->smallInteger('value');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique(['user_id', 'voteable_type', 'voteable_id']);
            $table->index(['voteable_type', 'voteable_id']);
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['accepted_answer_id']);
            $table->dropForeign(['converted_task_id']);
        });
        Schema::dropIfExists('question_votes');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('questions');
    }
};
