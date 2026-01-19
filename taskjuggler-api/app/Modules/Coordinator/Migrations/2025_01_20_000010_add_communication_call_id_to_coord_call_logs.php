<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coord_call_logs', function (Blueprint $table) {
            $table->uuid('communication_call_id')->nullable()->after('organization_id');
            
            $table->index('communication_call_id');
            
            if (Schema::hasTable('communication_calls')) {
                $table->foreign('communication_call_id')
                    ->references('id')
                    ->on('communication_calls')
                    ->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('coord_call_logs', function (Blueprint $table) {
            $table->dropForeign(['communication_call_id']);
            $table->dropColumn('communication_call_id');
        });
    }
};

