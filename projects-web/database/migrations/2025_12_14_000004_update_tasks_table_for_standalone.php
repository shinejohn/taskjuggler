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
        Schema::table('tasks', function (Blueprint $table) {
            // Make project_id nullable to support standalone tasks
            // Drop the foreign key constraint first
            $table->dropForeign(['project_id']);
            $table->uuid('project_id')->nullable()->change();
            
            // Add fields from taskjuggler-api
            $table->uuid('team_id')->nullable()->after('project_id');
            $table->uuid('team_member_id')->nullable()->after('team_id');
            $table->uuid('marketplace_vendor_id')->nullable()->after('team_member_id');
            $table->uuid('marketplace_listing_id')->nullable()->after('marketplace_vendor_id');
            $table->uuid('routing_rule_id')->nullable()->after('source_metadata');
            $table->uuid('source_channel_id')->nullable()->after('routing_rule_id');
            $table->string('source_channel_ref')->nullable()->after('source_channel_id');
            
            // Contact fields
            $table->string('contact_name')->nullable()->after('source_channel_ref');
            $table->string('contact_phone', 20)->nullable()->after('contact_name');
            $table->string('contact_email')->nullable()->after('contact_phone');
            
            // Location fields
            $table->string('location_address', 500)->nullable()->after('contact_email');
            $table->string('location_unit', 50)->nullable()->after('location_address');
            $table->string('location_city', 100)->nullable()->after('location_unit');
            $table->string('location_state', 50)->nullable()->after('location_city');
            $table->string('location_zip', 20)->nullable()->after('location_state');
            $table->jsonb('location_coords')->nullable()->after('location_zip');
            
            // Additional fields
            $table->jsonb('deliverables')->nullable()->after('custom_fields');
            $table->string('invite_code')->nullable()->after('deliverables');
            $table->timestamp('invite_expires_at')->nullable()->after('invite_code');
            $table->string('color_state', 20)->nullable()->after('state'); // blue, green, yellow, red
            
            // Add indexes
            $table->index('team_id');
            $table->index('routing_rule_id');
            $table->index('source_channel_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'team_id',
                'team_member_id',
                'marketplace_vendor_id',
                'marketplace_listing_id',
                'routing_rule_id',
                'source_channel_id',
                'source_channel_ref',
                'contact_name',
                'contact_phone',
                'contact_email',
                'location_address',
                'location_unit',
                'location_city',
                'location_state',
                'location_zip',
                'location_coords',
                'deliverables',
                'invite_code',
                'invite_expires_at',
                'color_state',
            ]);
            
            // Make project_id required again
            $table->uuid('project_id')->nullable(false)->change();
        });
    }
};
