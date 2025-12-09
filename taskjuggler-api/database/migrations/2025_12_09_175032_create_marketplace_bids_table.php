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
        Schema::create('marketplace_bids', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('listing_id');
            $table->foreign('listing_id')->references('id')->on('marketplace_listings')->onDelete('cascade');
            $table->uuid('vendor_id');
            $table->foreign('vendor_id')->references('id')->on('marketplace_vendors');
            
            // Bid details
            $table->decimal('amount', 10, 2);
            $table->text('message')->nullable();
            $table->timestampTz('estimated_completion')->nullable();
            
            // Status
            $table->string('status', 20)->default('pending'); // 'pending', 'accepted', 'rejected', 'withdrawn'
            
            $table->timestampTz('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_bids');
    }
};
