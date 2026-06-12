<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('pages_scanned')->default(0);
            $table->integer('total_pages')->nullable();
            $table->integer('health_score')->default(0);
            $table->json('category_scores')->nullable();
            $table->integer('issue_count')->default(0);
            $table->text('error')->nullable();
            $table->timestamps();
            
            $table->index('site_id');
            $table->index('status');
            $table->index('started_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};
