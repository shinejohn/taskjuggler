<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Only add columns if they don't exist
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable();
            }
            if (!Schema::hasColumn('users', 'settings')) {
                $table->json('settings')->nullable();
            }
            if (!Schema::hasColumn('users', 'current_team_id')) {
                $table->uuid('current_team_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // Add foreign key only if teams table exists and column was added
        if (Schema::hasTable('teams') && Schema::hasColumn('users', 'current_team_id')) {
            Schema::table('users', function (Blueprint $table) {
                // Check if foreign key doesn't exist before adding
                $foreignKeys = Schema::getConnection()
                    ->getDoctrineSchemaManager()
                    ->listTableForeignKeys('users');
                
                $hasForeignKey = collect($foreignKeys)->contains(function ($fk) {
                    return count($fk->getLocalColumns()) === 1 && 
                           $fk->getLocalColumns()[0] === 'current_team_id';
                });
                
                if (!$hasForeignKey) {
                    $table->foreign('current_team_id')->references('id')->on('teams')->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['phone', 'avatar_url', 'settings', 'current_team_id', 'deleted_at'];
            $existingColumns = array_filter($columns, fn($col) => Schema::hasColumn('users', $col));
            
            if (!empty($existingColumns)) {
                $table->dropColumn($existingColumns);
            }
        });
    }
};

