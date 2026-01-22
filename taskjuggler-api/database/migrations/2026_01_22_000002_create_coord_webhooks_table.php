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
        Schema::create('coord_webhooks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->string('url', 500);
            $table->string('secret');
            $table->json('events');
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['organization_id', 'active']);
            $table->index('active');
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coord_webhooks');
    }
};

