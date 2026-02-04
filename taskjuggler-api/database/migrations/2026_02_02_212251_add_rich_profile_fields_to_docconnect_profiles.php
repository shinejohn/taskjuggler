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
        Schema::table('docconnect_profiles', function (Blueprint $table) {
            $table->json('practice_info')->nullable();
            $table->json('services')->nullable();
            $table->json('insurance_billing')->nullable();
            $table->json('patient_experience')->nullable();
            $table->json('emergency_info')->nullable();
            $table->json('communication')->nullable(); // Includes 4calls_config
            $table->json('brand_voice')->nullable();
            $table->json('compliance')->nullable();
            $table->string('profile_version')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('docconnect_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'practice_info',
                'services',
                'insurance_billing',
                'patient_experience',
                'emergency_info',
                'communication',
                'brand_voice',
                'compliance',
                'profile_version'
            ]);
        });
    }
};
