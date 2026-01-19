<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('urpa_user_profiles', function (Blueprint $table) {
            $table->string('aws_connect_user_id')->nullable()->after('phone_number_sid');
            $table->string('communication_provider', 20)->default('twilio')->after('aws_connect_user_id'); // 'aws' or 'twilio'
        });
    }

    public function down(): void
    {
        Schema::table('urpa_user_profiles', function (Blueprint $table) {
            $table->dropColumn(['aws_connect_user_id', 'communication_provider']);
        });
    }
};

