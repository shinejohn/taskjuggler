<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Role Templates (System-defined) - WHAT the AI does
        Schema::create('coord_role_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // appointment_scheduler, receptionist, dispatcher, etc.
            $table->string('display_name'); // "Appointment Scheduler", "Receptionist"
            $table->text('description'); // Full description of what this role does
            $table->string('direction'); // inbound, outbound, both
            $table->decimal('base_price', 8, 2);
            $table->string('primary_goal'); // Brief goal statement
            $table->json('capabilities'); // List of what this role can do
            $table->json('channels'); // ['voice', 'sms', 'email']
            $table->json('suggested_industries')->nullable();
            $table->json('default_prompts'); // AI prompt templates for this role
            $table->json('default_scripts'); // Call/message scripts for this role
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Persona Templates (System-defined) - HOW the AI behaves
        Schema::create('coord_persona_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // marge, sandy, marcus, emma, alex
            $table->string('display_name'); // "Marge", "Sandy", "Marcus"
            $table->text('description'); // Full personality description
            $table->string('age_range')->nullable(); // "50s", "20s-30s", "40s"
            $table->json('personality_traits'); // ['seasoned', 'no-nonsense', 'efficient']
            $table->text('communication_style'); // How they communicate
            $table->json('best_for_industries')->nullable(); // Where this persona works best
            $table->string('gender')->nullable(); // male, female, neutral
            $table->string('voice_id')->nullable(); // Default Vapi voice ID
            $table->json('personality_prompts'); // AI prompts that define personality
            $table->json('example_greetings')->nullable(); // Example greetings
            $table->json('tone_guidelines')->nullable(); // Tone and style guidelines
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Coordinator Instances (Hired by Organizations) - Role + Persona combination
        Schema::create('coord_coordinators', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('role_template_id'); // WHAT they do
            $table->uuid('persona_template_id'); // WHO they are (personality)
            $table->string('display_name')->nullable(); // Custom name (e.g., "Marge the Scheduler")
            $table->string('voice_id')->nullable(); // Vapi voice ID (can override persona default)
            $table->text('custom_greeting')->nullable(); // Custom greeting (can override defaults)
            $table->json('custom_prompts')->nullable(); // Role-specific prompt overrides
            $table->json('custom_scripts')->nullable(); // Role-specific script overrides
            $table->json('availability')->nullable(); // When this coordinator works
            $table->string('status')->default('active'); // active, paused, inactive
            $table->decimal('monthly_price', 8, 2); // Based on role_template.base_price
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('organization_id')
                ->references('id')
                ->on('coord_organizations')
                ->onDelete('cascade');
                
            $table->foreign('role_template_id')
                ->references('id')
                ->on('coord_role_templates')
                ->onDelete('restrict');
                
            $table->foreign('persona_template_id')
                ->references('id')
                ->on('coord_persona_templates')
                ->onDelete('restrict');
                
            $table->index(['organization_id', 'status']);
            $table->index(['role_template_id', 'persona_template_id']);
        });

        // Role Bundles
        Schema::create('coord_bundles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // appointment_pro, restaurant_complete, etc.
            $table->string('display_name');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->decimal('savings_percentage', 5, 2);
            $table->json('target_industries');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Bundle-Role Pivot
        Schema::create('coord_bundle_roles', function (Blueprint $table) {
            $table->uuid('bundle_id');
            $table->uuid('role_template_id');
            
            $table->foreign('bundle_id')
                ->references('id')
                ->on('coord_bundles')
                ->onDelete('cascade');
                
            $table->foreign('role_template_id')
                ->references('id')
                ->on('coord_role_templates')
                ->onDelete('cascade');
                
            $table->primary(['bundle_id', 'role_template_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coord_bundle_roles');
        Schema::dropIfExists('coord_bundles');
        Schema::dropIfExists('coord_coordinators');
        Schema::dropIfExists('coord_persona_templates');
        Schema::dropIfExists('coord_role_templates');
    }
};




