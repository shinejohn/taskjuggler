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
        Schema::table('urpa_activities', function (Blueprint $table) {
            // Mode classification
            $table->enum('mode', ['practice', 'business', 'personal'])->default('personal')->after('activity_type');
            
            // HIPAA fields
            $table->boolean('is_hipaa')->default(false)->after('mode');
            
            // Contextual links
            $table->uuid('patient_id')->nullable()->after('contact_id');
            $table->uuid('encounter_id')->nullable()->after('patient_id');
            
            // Indexes for filtered queries
            $table->index(['user_id', 'mode']);
            $table->index(['is_hipaa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('urpa_activities', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'mode']);
            $table->dropIndex(['is_hipaa']);
            
            $table->dropColumn([
                'mode',
                'is_hipaa',
                'patient_id',
                'encounter_id'
            ]);
        });
    }
};
