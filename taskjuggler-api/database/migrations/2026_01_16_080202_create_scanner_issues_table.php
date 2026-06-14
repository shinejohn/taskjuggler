<?php

declare(strict_types=1);

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
        if (Schema::hasTable('scanner_issues')) {
            return;
        }

        Schema::create('scanner_issues', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id')->index();
            $table->uuid('site_id')->index();
            $table->uuid('scan_id')->index();
            $table->string('category')->nullable();
            $table->string('severity')->nullable();
            $table->string('title')->nullable();
            $table->text('message')->nullable();
            $table->text('page_url')->nullable();
            $table->text('selector')->nullable();
            $table->text('html_context')->nullable();
            $table->json('wcag_criteria')->nullable();
            $table->text('screenshot_url')->nullable();
            $table->string('status')->default('open');
            $table->text('fix_code')->nullable();
            $table->uuid('task_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanner_issues');
    }
};
