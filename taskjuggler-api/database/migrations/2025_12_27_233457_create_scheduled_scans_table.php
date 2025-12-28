<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheduled_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->string('frequency');
            $table->integer('day_of_week')->nullable();
            $table->integer('day_of_month')->nullable();
            $table->time('time');
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            
            $table->index('site_id');
            $table->index('enabled');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_scans');
    }
};
