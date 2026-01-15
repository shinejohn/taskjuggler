<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add team_id to scanner_sites (or sites if scanner_sites doesn't exist)
        $sitesTable = Schema::hasTable('scanner_sites') ? 'scanner_sites' : 'sites';
        if (Schema::hasTable($sitesTable) && !Schema::hasColumn($sitesTable, 'team_id')) {
            Schema::table($sitesTable, function (Blueprint $table) {
                $table->uuid('team_id')->after('id')->nullable();
                $table->index('team_id');
            });
            
            // Add foreign key constraint if teams table exists
            if (Schema::hasTable('teams')) {
                Schema::table($sitesTable, function (Blueprint $table) {
                    $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
                });
            }
        }
        
        // Add team_id to scanner_scans (or scans if scanner_scans doesn't exist)
        $scansTable = Schema::hasTable('scanner_scans') ? 'scanner_scans' : 'scans';
        if (Schema::hasTable($scansTable) && !Schema::hasColumn($scansTable, 'team_id')) {
            Schema::table($scansTable, function (Blueprint $table) {
                $table->uuid('team_id')->after('id')->nullable();
                $table->index('team_id');
            });
            
            // Add foreign key constraint if teams table exists
            if (Schema::hasTable('teams')) {
                Schema::table($scansTable, function (Blueprint $table) {
                    $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
                });
            }
        }
        
        // Add team_id and task_id to scanner_issues (or issues if scanner_issues doesn't exist)
        $issuesTable = Schema::hasTable('scanner_issues') ? 'scanner_issues' : 'issues';
        if (Schema::hasTable($issuesTable)) {
            if (!Schema::hasColumn($issuesTable, 'team_id')) {
                Schema::table($issuesTable, function (Blueprint $table) {
                    $table->uuid('team_id')->after('id')->nullable();
                    $table->index('team_id');
                });
                
                // Add foreign key constraint if teams table exists
                if (Schema::hasTable('teams')) {
                    Schema::table($issuesTable, function (Blueprint $table) {
                        $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
                    });
                }
            }
            
            if (!Schema::hasColumn($issuesTable, 'task_id')) {
                Schema::table($issuesTable, function (Blueprint $table) {
                    $table->uuid('task_id')->nullable()->after('id');
                    $table->index('task_id');
                });
                
                // Add foreign key constraint if tasks table exists
                if (Schema::hasTable('tasks')) {
                    Schema::table($issuesTable, function (Blueprint $table) {
                        $table->foreign('task_id')->references('id')->on('tasks')->onDelete('set null');
                    });
                }
            }
        }
    }
    
    public function down(): void
    {
        $issuesTable = Schema::hasTable('scanner_issues') ? 'scanner_issues' : 'issues';
        if (Schema::hasTable($issuesTable)) {
            if (Schema::hasColumn($issuesTable, 'task_id')) {
                Schema::table($issuesTable, function (Blueprint $table) {
                    $table->dropForeign(['task_id']);
                    $table->dropColumn('task_id');
                });
            }
            if (Schema::hasColumn($issuesTable, 'team_id')) {
                Schema::table($issuesTable, function (Blueprint $table) {
                    $table->dropForeign(['team_id']);
                    $table->dropColumn('team_id');
                });
            }
        }
        
        $scansTable = Schema::hasTable('scanner_scans') ? 'scanner_scans' : 'scans';
        if (Schema::hasTable($scansTable) && Schema::hasColumn($scansTable, 'team_id')) {
            Schema::table($scansTable, function (Blueprint $table) {
                $table->dropForeign(['team_id']);
                $table->dropColumn('team_id');
            });
        }
        
        $sitesTable = Schema::hasTable('scanner_sites') ? 'scanner_sites' : 'sites';
        if (Schema::hasTable($sitesTable) && Schema::hasColumn($sitesTable, 'team_id')) {
            Schema::table($sitesTable, function (Blueprint $table) {
                $table->dropForeign(['team_id']);
                $table->dropColumn('team_id');
            });
        }
    }
};
