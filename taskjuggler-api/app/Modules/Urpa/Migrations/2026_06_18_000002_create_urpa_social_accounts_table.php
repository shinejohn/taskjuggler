<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('urpa_social_accounts')) {
            return;
        }

        Schema::create('urpa_social_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');

            // The Fibonacco business this account publishes on behalf of (SMB use case).
            $table->uuid('fibonacco_business_id')->nullable();

            $table->string('provider', 20);             // facebook, instagram, twitter, linkedin
            $table->string('provider_account_id', 255); // page id / ig user id / x user id / linkedin urn
            $table->string('account_name', 255)->nullable();

            // OAuth tokens + page tokens, stored encrypted.
            $table->json('credentials')->nullable();
            $table->json('scopes')->nullable();
            $table->timestamp('token_expires_at')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamp('last_read_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'provider', 'provider_account_id']);
            $table->index(['user_id', 'provider']);
            $table->index('fibonacco_business_id');

            if (Schema::hasTable('users')) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('urpa_social_accounts');
    }
};
