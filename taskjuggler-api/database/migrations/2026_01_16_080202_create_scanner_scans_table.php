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
        if (Schema::hasTable('scanner_scans')) {
            return;
        }

        Schema::create('scanner_scans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id')->index();
            $table->uuid('site_id')->index();
            $table->string('status')->default('pending');
            $table->integer('max_pages')->nullable();
            $table->integer('pages_scanned')->default(0);
            $table->integer('total_pages')->default(0);
            $table->integer('issue_count')->default(0);
            $table->integer('health_score')->nullable();
            $table->json('category_scores')->nullable();
            $table->text('error')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanner_scans');
    }
};
