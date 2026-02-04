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
        Schema::table('patient_consents', function (Blueprint $table) {
            $table->string('specialty')->nullable()->after('consent_type')->comment('Specialty this consent applies to (e.g., Cardiology)');
            $table->string('sharing_code', 10)->nullable()->unique()->after('specialty')->comment('Optional code for the patient to share with a new provider for quick access');
            $table->boolean('allow_global_emergency')->default(false)->after('allow_bidirectional')->comment('Allow any emergency provider to access records');
            $table->index(['patient_id', 'specialty']);
        });

        // Add sharing_code to patients table too for central lookup
        Schema::table('doctors_patients', function (Blueprint $table) {
            $table->string('universal_health_id', 20)->nullable()->unique()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('patient_consents', function (Blueprint $table) {
            $table->dropColumn(['specialty', 'sharing_code', 'allow_global_emergency']);
        });
        
        Schema::table('doctors_patients', function (Blueprint $table) {
            $table->dropColumn('universal_health_id');
        });
    }
};
