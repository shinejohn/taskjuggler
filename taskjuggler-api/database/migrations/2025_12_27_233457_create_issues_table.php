<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained()->onDelete('cascade');
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->string('severity');
            $table->string('status')->default('open');
            $table->string('title');
            $table->text('message');
            $table->string('page_url');
            $table->string('selector')->nullable();
            $table->text('html_context')->nullable();
            $table->json('wcag_criteria')->nullable();
            $table->text('fix_code')->nullable();
            $table->text('fix_explanation')->nullable();
            $table->integer('fix_confidence')->nullable();
            $table->string('screenshot_url')->nullable();
            $table->timestamps();
            
            $table->index('scan_id');
            $table->index('site_id');
            $table->index('category');
            $table->index('severity');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
