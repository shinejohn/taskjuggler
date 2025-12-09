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
        // Add foreign key from tasks to marketplace_vendors
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('marketplace_vendor_id')->references('id')->on('marketplace_vendors');
        });
        
        // Add foreign key from tasks to marketplace_listings
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('marketplace_listing_id')->references('id')->on('marketplace_listings');
        });
        
        // Add foreign key from marketplace_listings to tasks
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->foreign('task_id')->references('id')->on('tasks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['marketplace_vendor_id']);
            $table->dropForeign(['marketplace_listing_id']);
        });
        
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->dropForeign(['task_id']);
        });
    }
};
