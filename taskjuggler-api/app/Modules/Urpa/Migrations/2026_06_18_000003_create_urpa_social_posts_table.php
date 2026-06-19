<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_social_posts')) {
            return;
        }

        Schema::create('urpa_social_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('social_account_id');
            $table->uuid('fibonacco_business_id')->nullable();

            $table->text('content');
            $table->json('media')->nullable();          // image/video URLs

            // draft, scheduled, publishing, published, failed, cancelled
            $table->string('status', 20)->default('draft');
            $table->string('source', 30)->nullable();   // manual, ai_generated, review_reply, ...

            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('provider_post_id', 255)->nullable();
            $table->text('error')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
            $table->index(['user_id', 'status']);
            $table->index('social_account_id');

            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
            if (Schema::hasTable('urpa_social_accounts')) {
                $table->foreign('social_account_id')->references('id')->on('urpa_social_accounts')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_social_posts');
    }
};
