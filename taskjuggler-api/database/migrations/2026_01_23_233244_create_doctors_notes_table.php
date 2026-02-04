<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors_clinical_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('encounter_id')->constrained('doctors_clinical_encounters')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->longText('raw_transcript')->nullable();
            $table->longText('generated_note')->nullable(); // Markdown formatted clinical note
            $table->string('status')->default('processing'); // processing, ready, reviewed
            $table->string('audio_url')->nullable();
            $table->json('meta_data')->nullable(); // Duration, speaker count, etc.
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors_clinical_notes');
    }
};
