<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the project_id foreign keys that the Processes module migrations
 * (2024_01_03_*) could not declare — they run before the projects table
 * exists. Guarded so it is safe on databases that already have the FKs
 * (created back when the FK lived in the Processes migrations).
 */
return new class extends Migration
{
    private const TABLES = ['processes', 'process_executions'];

    public function up(): void
    {
        if (!Schema::hasTable('projects')) {
            return;
        }

        foreach (self::TABLES as $tableName) {
            if (!Schema::hasTable($tableName) || $this->hasProjectFk($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $tableName) {
            if (Schema::hasTable($tableName) && $this->hasProjectFk($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['project_id']);
                });
            }
        }
    }

    private function hasProjectFk(string $tableName): bool
    {
        return collect(Schema::getForeignKeys($tableName))
            ->contains(fn (array $fk) => $fk['columns'] === ['project_id']);
    }
};
