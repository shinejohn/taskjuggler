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
        if (Schema::hasTable('scanner_sites')) {
            return;
        }

        Schema::create('scanner_sites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('team_id')->index();
            $table->string('name');
            $table->string('url');
            $table->string('auth_type')->default('none');
            $table->json('auth_config')->nullable();
            $table->integer('max_pages')->default(25);
            $table->integer('health_score')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanner_sites');
    }
};
