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
        // Add foreign key from tasks to marketplace_vendors (only if column exists)
        if (Schema::hasTable('tasks') && Schema::hasColumn('tasks', 'marketplace_vendor_id')) {
            try {
                Schema::table('tasks', function (Blueprint $table) {
                    $table->foreign('marketplace_vendor_id')->references('id')->on('marketplace_vendors');
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore
                if (strpos($e->getMessage(), 'already exists') === false && strpos($e->getMessage(), 'duplicate') === false) {
                    throw $e;
                }
            }
        }
        
        // Add foreign key from tasks to marketplace_listings (only if column exists)
        if (Schema::hasTable('tasks') && Schema::hasColumn('tasks', 'marketplace_listing_id')) {
            try {
                Schema::table('tasks', function (Blueprint $table) {
                    $table->foreign('marketplace_listing_id')->references('id')->on('marketplace_listings');
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore
                if (strpos($e->getMessage(), 'already exists') === false && strpos($e->getMessage(), 'duplicate') === false) {
                    throw $e;
                }
            }
        }
        
        // Add foreign key from marketplace_listings to tasks (only if column exists)
        if (Schema::hasTable('marketplace_listings') && Schema::hasColumn('marketplace_listings', 'task_id')) {
            try {
                Schema::table('marketplace_listings', function (Blueprint $table) {
                    $table->foreign('task_id')->references('id')->on('tasks');
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore
                if (strpos($e->getMessage(), 'already exists') === false && strpos($e->getMessage(), 'duplicate') === false) {
                    throw $e;
                }
            }
        }
        
        // Add foreign key from ai_tool_configs to marketplace_vendors
        Schema::table('ai_tool_configs', function (Blueprint $table) {
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors')->onDelete('cascade');
        });
        
        // Add foreign key from contact_list_members to contact_lists
        Schema::table('contact_list_members', function (Blueprint $table) {
            $table->foreign('list_id')->references('id')->on('contact_lists')->onDelete('cascade');
        });
        
        // Add foreign keys from inbox_items
        Schema::table('inbox_items', function (Blueprint $table) {
            $table->foreign('routed_to_task_id')->references('id')->on('tasks');
            $table->foreign('routing_rule_id')->references('id')->on('routing_rules');
        });
        
        // Add foreign keys from marketplace_bids
        Schema::table('marketplace_bids', function (Blueprint $table) {
            $table->foreign('listing_id')->references('id')->on('marketplace_listings')->onDelete('cascade');
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors');
        });
        
        // Add foreign key from marketplace_listings
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->foreign('assigned_vendor_id')->references('id')->on('marketplace_vendors');
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
        
        Schema::table('ai_tool_configs', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
        });
        
        Schema::table('contact_list_members', function (Blueprint $table) {
            $table->dropForeign(['list_id']);
        });
        
        Schema::table('inbox_items', function (Blueprint $table) {
            $table->dropForeign(['routed_to_task_id']);
            $table->dropForeign(['routing_rule_id']);
        });
        
        Schema::table('marketplace_bids', function (Blueprint $table) {
            $table->dropForeign(['listing_id']);
            $table->dropForeign(['vendor_id']);
        });
        
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->dropForeign(['assigned_vendor_id']);
        });
    }
};
