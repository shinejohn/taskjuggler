<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coord_organizations', function (Blueprint $table) {
            $table->string('aws_connect_instance_id')->nullable()->after('phone_number');
            $table->string('communication_provider', 20)->default('twilio')->after('aws_connect_instance_id'); // 'aws' or 'twilio'
        });
    }

    public function down(): void
    {
        Schema::table('coord_organizations', function (Blueprint $table) {
            $table->dropColumn(['aws_connect_instance_id', 'communication_provider']);
        });
    }
};

