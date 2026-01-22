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
        Schema::create('urpa_webhook_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('integration_id');
            $table->uuid('user_id');
            $table->string('event');
            $table->json('payload');
            $table->string('webhook_url');
            $table->integer('status_code')->nullable();
            $table->text('response_body')->nullable();
            $table->integer('attempts')->default(0);
            $table->timestamp('last_attempted_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['integration_id', 'created_at']);
            $table->index(['user_id', 'event', 'created_at']);
            $table->index(['status_code', 'attempts']);
            
            $table->foreign('integration_id')
                ->references('id')
                ->on('urpa_integrations')
                ->onDelete('cascade');
                
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('urpa_webhook_events');
    }
};

